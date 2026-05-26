// validator.js — функции проверки CSS

function letterToCol(letter) {
    return letter.charCodeAt(0) - 64;
}

function checkDisplayGrid(css) {
    const clean = css.replace(/\/\*[\s\S]*?\*\//g, '');
    return /display\s*:\s*grid/i.test(clean);
}

function checkTemplateStructure(css) {
    const clean = css.replace(/\/\*[\s\S]*?\*\//g, '');
    return /grid-template-columns/i.test(clean) && /grid-template-rows/i.test(clean);
}

function checkGap(css) {
    const clean = css.replace(/\/\*[\s\S]*?\*\//g, '');
    return /gap\s*:\s*\d+px/.test(clean);
}

function checkExplosionZone(zone) {
    if (!zone || zone.length === 0) return true;
    for (let coord of zone) {
        const cell = document.querySelector(`.grid-cell[data-coord="${coord}"]`);
        if (cell) {
            const hasExplosion = cell.classList.contains("explosion");
            const bg = window.getComputedStyle(cell).backgroundImage;
            if (!hasExplosion && (!bg || !bg.includes("explosion"))) {
                return false;
            }
        }
    }
    return true;
}

async function validateCSS(css, expectedShips, checkType, explosionZone, currentLevelIdCallback) {
    applyCSS(css);
    
    // Функция для преобразования номера колонки в букву
    function colToLetter(col) {
        return String.fromCharCode(65 + col - 1);
    }
    
    // Находим все уникальные классы кораблей в CSS
    const shipClasses = new Set();
    const classMatches = css.match(/\.(ship(?:-[a-zA-Z0-9_-]+)?)\s*\{/g);
    if (classMatches) {
        classMatches.forEach(match => {
            const className = match.match(/\.(ship(?:-[a-zA-Z0-9_-]+)?)/)[1];
            shipClasses.add(className);
        });
    }
    
    if (shipClasses.size === 0 && css.includes(".ship")) {
        shipClasses.add("ship");
    }
    
    // Проверка для уровней без кораблей (1 и 2)
    if (shipClasses.size === 0) {
        if (checkType === "displayGrid") {
            return { success: checkDisplayGrid(css), actualShips: [] };
        }
        else if (checkType === "templateStructure") {
            return { success: checkTemplateStructure(css), actualShips: [] };
        }
        else if (checkType === "gapCheck") {
            return { success: checkGap(css), actualShips: [] };
        }
        return { success: false, actualShips: [] };
    }
    
    const grid = document.getElementById("gameGrid");
    const allActualShips = [];
    
    // Для каждого класса корабля создаём тестовый элемент
    for (const className of shipClasses) {
        const testShip = document.createElement("div");
        testShip.className = className;
        testShip.textContent = "⛵";
        testShip.style.position = "absolute";
        testShip.style.width = "0";
        testShip.style.height = "0";
        testShip.style.overflow = "hidden";
        testShip.style.opacity = "0";
        testShip.style.pointerEvents = "none";
        
        grid.appendChild(testShip);
        await new Promise(resolve => setTimeout(resolve, 50));
        
        const style = window.getComputedStyle(testShip);
        let gridColumn = style.gridColumn;
        let gridRow = style.gridRow;
        
        testShip.remove();
        
        let colStart = null, colEnd = null, rowStart = null, rowEnd = null;
        
        // Парсинг строк (grid-row)
        if (gridRow.includes("span")) {
            const spanMatch = gridRow.match(/span\s*(\d+)/);
            if (spanMatch) {
                const span = parseInt(spanMatch[1]);
                const startMatch = gridRow.match(/^(\d+)\s*\/\s*span/);
                if (startMatch) {
                    rowStart = parseInt(startMatch[1]);
                } else {
                    if (gridColumn.includes("1 / 2") || gridColumn === "1 / 2") {
                        rowStart = 1;
                    } else {
                        const colAreaMatch = gridColumn.match(/^([A-F])(\d+)$/);
                        if (colAreaMatch) {
                            rowStart = parseInt(colAreaMatch[2]);
                        } else {
                            rowStart = 1;
                        }
                    }
                }
                if (rowStart !== null) {
                    rowEnd = rowStart + span;
                }
            }
        } else {
            const rowMatch = gridRow.match(/(\d+)\s*\/\s*(\d+)/);
            if (rowMatch) {
                rowStart = parseInt(rowMatch[1]);
                rowEnd = parseInt(rowMatch[2]);
            }
        }
        
        // Парсинг колонок (grid-column)
        if (gridColumn.includes("span")) {
            const spanMatch = gridColumn.match(/span\s*(\d+)/);
            if (spanMatch) {
                const span = parseInt(spanMatch[1]);
                const startMatch = gridColumn.match(/^(\d+)\s*\/\s*span/);
                if (startMatch) {
                    colStart = parseInt(startMatch[1]);
                } else {
                    const areaColMatch = gridColumn.match(/^([A-F])(\d*)$/);
                    if (areaColMatch) {
                        colStart = letterToCol(areaColMatch[1]);
                    } else {
                        colStart = 1;
                    }
                }
                if (colStart !== null) {
                    colEnd = colStart + span;
                }
            }
        } else {
            const colMatch = gridColumn.match(/(\d+)\s*\/\s*(\d+)/);
            if (colMatch) {
                colStart = parseInt(colMatch[1]);
                colEnd = parseInt(colMatch[2]);
            }
            const areaMatch = gridColumn.match(/^([A-F])(\d+)$/);
            if (areaMatch && colStart === null) {
                colStart = letterToCol(areaMatch[1]);
                colEnd = colStart + 1;
                if (rowStart === null) {
                    rowStart = parseInt(areaMatch[2]);
                    rowEnd = rowStart + 1;
                }
            }
        }
        
        if (colStart === null && rowStart !== null) {
            colStart = 1;
            colEnd = 2;
        }
        
        if (colStart === null || rowStart === null) {
            continue;
        }
        
        for (let r = rowStart; r < rowEnd; r++) {
            for (let c = colStart; c < colEnd; c++) {
                if (r >= 1 && r <= 6 && c >= 1 && c <= 6) {
                    allActualShips.push(`${colToLetter(c)}${r}`);
                }
            }
        }
    }
    
    const actual = [...new Set(allActualShips)].sort();
    
    if (checkType === "explosionLevel") {
        const shipsOk = JSON.stringify(actual) === JSON.stringify(expectedShips);
        const explosionOk = checkExplosionZone(explosionZone);
        return { success: shipsOk && explosionOk, actualShips: actual };
    }
    
    return { success: JSON.stringify(actual) === JSON.stringify(expectedShips), actualShips: actual };
}