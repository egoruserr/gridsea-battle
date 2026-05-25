// levelManager.js — управление уровнями

function clearAllVisuals() {
    // Удаляем визуальные элементы кораблей
    const visualShips = document.querySelectorAll(".visual-ship");
    visualShips.forEach(ship => ship.remove());
    
    const cells = document.querySelectorAll(".grid-cell");
    cells.forEach(cell => {
        cell.classList.remove("ship", "explosion");
        cell.style.backgroundImage = "";
        const img = cell.querySelector(".ship-img");
        if (img) img.remove();
        const exp = cell.querySelector(".explosion-img");
        if (exp) exp.remove();
    });
}

function loadLevel(id) {
    if (typeof LEVELS === 'undefined') {
        console.error("LEVELS не загружен!");
        showMessage("❌ Ошибка: данные уровней не загружены", true);
        return;
    }
    const level = LEVELS.find(l => l.id === id);
    if (!level) return;
    
    currentLevelId = id;
    const levelDisplay = document.getElementById("levelDisplay");
    const theoryText = document.getElementById("theoryText");
    const taskText = document.getElementById("taskText");
    const cssEditor = document.getElementById("cssEditor");
    
    if (levelDisplay) levelDisplay.innerText = `${id} / 8`;
    if (theoryText) theoryText.innerHTML = level.theory;
    if (taskText) taskText.innerHTML = level.task;
    if (cssEditor) cssEditor.value = level.initialCode;
    
    applyCSS(level.initialCode);
    clearAllVisuals();
    showMessage(`📌 Уровень ${id}. Выполни задание.`);
    updateLevelButtons();
    resetHint();
}

function updateLevelButtons() {
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    if (prevBtn) prevBtn.disabled = currentLevelId <= 1;
    if (nextBtn) {
        const maxUnlocked = Math.max(1, ...completedLevels, 1);
        nextBtn.disabled = currentLevelId >= 8 || currentLevelId >= maxUnlocked + 1;
    }
}

function resetCurrentLevel() {
    const level = LEVELS.find(l => l.id === currentLevelId);
    if (level) {
        const editor = document.getElementById("cssEditor");
        if (editor) editor.value = level.initialCode;
        applyCSS(level.initialCode);
        clearAllVisuals();
        showMessage("🔄 Уровень сброшен");
        resetHint();
    }
}

function renderShips(shipCoordinates) {
    // Удаляем старые визуальные корабли
    const oldShips = document.querySelectorAll(".visual-ship");
    oldShips.forEach(ship => ship.remove());
    
    // Удаляем старые картинки в клетках
    const cells = document.querySelectorAll(".grid-cell");
    cells.forEach(cell => {
        const img = cell.querySelector(".ship-img");
        if (img) img.remove();
    });
    
    if (!shipCoordinates || shipCoordinates.length === 0) return;
    
    // Группируем клетки по кораблям (соседние клетки)
    const used = new Set();
    const ships = [];
    
    for (let coord of shipCoordinates) {
        if (used.has(coord)) continue;
        
        const col = coord.charCodeAt(0) - 65;
        const row = parseInt(coord[1]);
        
        // Ищем соседние клетки для определения размера корабля
        let horizontalCoords = [coord];
        for (let i = 1; i <= 2; i++) {
            const nextCol = col + i;
            if (nextCol >= 6) break;
            const nextCoord = `${String.fromCharCode(65 + nextCol)}${row}`;
            if (shipCoordinates.includes(nextCoord)) {
                horizontalCoords.push(nextCoord);
            } else break;
        }
        
        let verticalCoords = [coord];
        for (let i = 1; i <= 2; i++) {
            const nextRow = row + i;
            if (nextRow > 6) break;
            const nextCoord = `${String.fromCharCode(65 + col)}${nextRow}`;
            if (shipCoordinates.includes(nextCoord)) {
                verticalCoords.push(nextCoord);
            } else break;
        }
        
        let shipCoords = horizontalCoords.length > 1 ? horizontalCoords : 
                        (verticalCoords.length > 1 ? verticalCoords : [coord]);
        
        shipCoords.forEach(c => used.add(c));
        ships.push(shipCoords);
    }
    
    const grid = document.getElementById("gameGrid");
    const cellsList = document.querySelectorAll(".grid-cell");
    if (cellsList.length === 0) return;
    
    const firstCell = cellsList[0];
    const cellRect = firstCell.getBoundingClientRect();
    const gridRect = grid.getBoundingClientRect();
    const cellWidth = cellRect.width;
    const cellHeight = cellRect.height;
    const gap = 6;
    
    const paddingLeft = cellRect.left - gridRect.left;
    const paddingTop = cellRect.top - gridRect.top;
    
    // Создаём элемент для каждого корабля
    ships.forEach(shipCoords => {
        if (shipCoords.length === 0) return;
        
        // Находим границы корабля
        let minCol = 99, maxCol = -1, minRow = 99, maxRow = -1;
        shipCoords.forEach(coord => {
            const col = coord.charCodeAt(0) - 65;
            const row = parseInt(coord[1]);
            minCol = Math.min(minCol, col);
            maxCol = Math.max(maxCol, col);
            minRow = Math.min(minRow, row);
            maxRow = Math.max(maxRow, row);
        });
        
        const width = (maxCol - minCol + 1) * cellWidth + (maxCol - minCol) * gap;
        const height = (maxRow - minRow + 1) * cellHeight + (maxRow - minRow) * gap;
        
        const shipElement = document.createElement("div");
        shipElement.className = "visual-ship";
        shipElement.style.position = "absolute";
        shipElement.style.left = `${paddingLeft + minCol * (cellWidth + gap)}px`;
        shipElement.style.top = `${paddingTop + (minRow - 1) * (cellHeight + gap)}px`;
        shipElement.style.width = `${width}px`;
        shipElement.style.height = `${height}px`;
        shipElement.style.display = "flex";
        shipElement.style.alignItems = "center";
        shipElement.style.justifyContent = "center";
        shipElement.style.borderRadius = "12px";
        shipElement.style.zIndex = "10";
        shipElement.style.pointerEvents = "none";
        
        // Добавляем картинку
        const img = document.createElement("img");
        if (shipCoords.length === 1) {
            img.src = "images/ship-1x1.png";
        } else if (maxCol > minCol) {
            img.src = "images/ship-2x1-h.png";
        } else {
            img.src = "images/ship-2x1-v.png";
        }
        img.style.width = "100%";
        img.style.height = "100%";
        img.style.objectFit = "contain";
        shipElement.appendChild(img);
        
        grid.style.position = "relative";
        grid.appendChild(shipElement);
    });
}// ГЛАВНАЯ ФУНКЦИЯ ПРОВЕРКИ
async function checkLevel() {
    if (typeof LEVELS === 'undefined') {
        showMessage("❌ Ошибка: данные уровней не загружены", true);
        return;
    }
    const level = LEVELS.find(l => l.id === currentLevelId);
    if (!level) return;
    
    const css = document.getElementById("cssEditor").value;
    console.log("CSS для проверки:", css);
    
    applyCSS(css);
    
    // Функция для преобразования номера колонки в букву
    function colToLetter(col) {
        return String.fromCharCode(65 + col - 1);
    }
    
    // Функция для преобразования буквы в номер колонки
    function letterToCol(letter) {
        return letter.charCodeAt(0) - 64;
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
    
    console.log("Найденные классы кораблей:", [...shipClasses]);
    
    // Проверка для уровней без кораблей (1 и 2)
    if (shipClasses.size === 0) {
        if (level.checkType === "displayGrid") {
            if (checkDisplayGrid(css)) {
                if (!completedLevels.includes(currentLevelId)) {
                    completedLevels.push(currentLevelId);
                }
                showMessage(`✅ Уровень ${currentLevelId} пройден!`);
                updateLevelButtons();
                resetHint();
            } else {
                showMessage("❌ Не найден display: grid", true);
                incrementFailed();
            }
            return;
        }
        else if (level.checkType === "templateStructure") {
            if (checkTemplateStructure(css)) {
                if (!completedLevels.includes(currentLevelId)) {
                    completedLevels.push(currentLevelId);
                }
                showMessage(`✅ Уровень ${currentLevelId} пройден!`);
                updateLevelButtons();
                resetHint();
            } else {
                showMessage("❌ Не хватает grid-template-columns или grid-template-rows", true);
                incrementFailed();
            }
            return;
        }
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
        
        console.log(`Класс ${className}:`, "gridColumn:", gridColumn, "gridRow:", gridRow);
        
        testShip.remove();
        
        let colStart = null, colEnd = null, rowStart = null, rowEnd = null;
        
        // ========== ПАРСИНГ СТРОК (grid-row) ==========
        if (gridRow.includes("span")) {
            const spanMatch = gridRow.match(/span\s*(\d+)/);
            if (spanMatch) {
                const span = parseInt(spanMatch[1]);
                const startMatch = gridRow.match(/^(\d+)\s*\/\s*span/);
                if (startMatch) {
                    rowStart = parseInt(startMatch[1]);
                } else {
                    // Если нет числового начала, определяем из контекста
                    // Для вертикального корабля в A1–A2: grid-column: 1 / 2
                    if (gridColumn.includes("1 / 2") || gridColumn === "1 / 2") {
                        rowStart = 1;
                    } else {
                        // Пытаемся определить из grid-column (если там есть буква)
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
        
        // ========== ПАРСИНГ КОЛОНОК (grid-column) ==========
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
            // Проверка на формат "A1" из grid-area
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
        
        // Если колонки не определены, но есть rowStart, пробуем определить из контекста
        if (colStart === null && rowStart !== null) {
            // Для вертикального корабля
            colStart = 1;
            colEnd = 2;
        }
        
        // Если всё ещё не определили колонки/строки — пропускаем
        if (colStart === null || rowStart === null) {
            console.log(`Не удалось распарсить позицию для ${className}`);
            continue;
        }
        
        // Собираем все клетки в диапазоне
        for (let r = rowStart; r < rowEnd; r++) {
            for (let c = colStart; c < colEnd; c++) {
                if (r >= 1 && r <= 6 && c >= 1 && c <= 6) {
                    allActualShips.push(`${colToLetter(c)}${r}`);
                }
            }
        }
    }
    
    const actual = [...new Set(allActualShips)].sort();
    const expected = level.expectedShips;
    
    console.log("Уровень", currentLevelId);
    console.log("Ожидалось:", expected);
    console.log("Получено:", actual);
    
    // Проверка для explosionLevel
    if (level.checkType === "explosionLevel") {
        const shipsOk = JSON.stringify(actual) === JSON.stringify(expected);
        const explosionOk = checkExplosionZone(level.explosionZone);
        
        if (shipsOk && explosionOk) {
            if (!completedLevels.includes(currentLevelId)) {
                completedLevels.push(currentLevelId);
            }
            renderShips(actual);
            showMessage(`✅ Уровень ${currentLevelId} пройден!`);
            updateLevelButtons();
            resetHint();
        } else if (!shipsOk) {
            showMessage(`❌ Корабли: ожидалось ${expected.join(", ")}, получено ${actual.join(", ")}`, true);
            incrementFailed();
        } else {
            showMessage(`❌ Взрывы не покрывают зону: ${level.explosionZone.join(", ")}`, true);
            incrementFailed();
        }
        return;
    }
    
    // Обычная проверка размещения
    if (JSON.stringify(actual) === JSON.stringify(expected)) {
        if (!completedLevels.includes(currentLevelId)) {
            completedLevels.push(currentLevelId);
        }
        renderShips(actual);
        showMessage(`✅ Уровень ${currentLevelId} пройден!`);
        updateLevelButtons();
        resetHint();
    } else {
        showMessage(`❌ Ожидалось: ${expected.join(", ")}, получено: ${actual.join(", ")}`, true);
        incrementFailed();
    }
}