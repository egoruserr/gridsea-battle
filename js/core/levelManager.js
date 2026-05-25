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
    
    if (levelDisplay) levelDisplay.innerText = `${id} / 5`;
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
        nextBtn.disabled = currentLevelId >= 5 || currentLevelId >= maxUnlocked + 1;
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
    const oldShips = document.querySelectorAll(".visual-ship");
    oldShips.forEach(ship => ship.remove());
    
    if (!shipCoordinates || shipCoordinates.length === 0) return;
    
    const coords = [...shipCoordinates].sort();
    const grid = document.getElementById("gameGrid");
    
    const gridRect = grid.getBoundingClientRect();
    const cells = document.querySelectorAll(".grid-cell");
    if (cells.length === 0) return;
    
    // Получаем позицию первой ячейки относительно грида
    const firstCell = cells[0];
    const firstCellRect = firstCell.getBoundingClientRect();
    const cellWidth = firstCellRect.width;
    const cellHeight = firstCellRect.height;
    
    // Вычисляем смещение (padding грида)
    const gridPaddingLeft = firstCellRect.left - gridRect.left;
    const gridPaddingTop = firstCellRect.top - gridRect.top;
    
    // Расстояние между ячейками (gap)
    const secondCell = cells[1];
    const secondCellRect = secondCell.getBoundingClientRect();
    const gap = secondCellRect.left - firstCellRect.left - cellWidth;
    
    if (coords.length === 2) {
        const first = coords[0];
        const second = coords[1];
        const row1 = parseInt(first[1]);
        const row2 = parseInt(second[1]);
        const col1 = first.charCodeAt(0) - 65;
        const col2 = second.charCodeAt(0) - 65;
        
        const shipElement = document.createElement("div");
        shipElement.className = "visual-ship";
        
        let left, top, width, height;
        
        // Вертикальный корабль (A1-A2) — одна колонка, две строки
        if (col1 === col2 && row2 === row1 + 1) {
            left = gridPaddingLeft + col1 * (cellWidth + gap);
            top = gridPaddingTop + (row1 - 1) * (cellHeight + gap);
            width = cellWidth;
            height = cellHeight * 2 + gap;
            
            shipElement.style.position = "absolute";
            shipElement.style.left = `${left}px`;
            shipElement.style.top = `${top}px`;
            shipElement.style.width = `${width}px`;
            shipElement.style.height = `${height}px`;
            
            const img = document.createElement("img");
            img.src = "images/ship-2x1-v.png";
            img.style.width = "100%";
            img.style.height = "100%";
            img.style.objectFit = "contain";
            shipElement.appendChild(img);
        }
        // Горизонтальный корабль (D3-E3) — одна строка, две колонки
        else if (row1 === row2 && col2 === col1 + 1) {
            left = gridPaddingLeft + col1 * (cellWidth + gap);
            top = gridPaddingTop + (row1 - 1) * (cellHeight + gap);
            width = cellWidth * 2 + gap;
            height = cellHeight;
            
            shipElement.style.position = "absolute";
            shipElement.style.left = `${left}px`;
            shipElement.style.top = `${top}px`;
            shipElement.style.width = `${width}px`;
            shipElement.style.height = `${height}px`;
            
            const img = document.createElement("img");
            img.src = "images/ship-2x1-h.png";
            img.style.width = "100%";
            img.style.height = "100%";
            img.style.objectFit = "contain";
            shipElement.appendChild(img);
        }
        
        shipElement.style.display = "flex";
        shipElement.style.alignItems = "center";
        shipElement.style.justifyContent = "center";
        shipElement.style.borderRadius = "12px";
        shipElement.style.zIndex = "10";
        shipElement.style.pointerEvents = "none";
        
        grid.style.position = "relative";
        grid.appendChild(shipElement);
    } 
    else if (coords.length === 1) {
        const cell = document.querySelector(`.grid-cell[data-coord="${coords[0]}"]`);
        if (cell) {
            const img = document.createElement("img");
            img.className = "ship-img";
            img.src = "images/ship-1x1.png";
            img.style.width = "100%";
            img.style.height = "100%";
            img.style.objectFit = "contain";
            img.style.pointerEvents = "none";
            cell.appendChild(img);
        }
    }
}// ГЛАВНАЯ ФУНКЦИЯ ПРОВЕРКИ
// ГЛАВНАЯ ФУНКЦИЯ ПРОВЕРКИ
function checkLevel() {
    if (typeof LEVELS === 'undefined') {
        showMessage("❌ Ошибка: данные уровней не загружены", true);
        return;
    }
    const level = LEVELS.find(l => l.id === currentLevelId);
    if (!level) return;
    
    const css = document.getElementById("cssEditor").value;
    console.log("CSS для проверки:", css);
    
    applyCSS(css);
    
    const testShip = document.createElement("div");
    testShip.className = "ship";
    testShip.textContent = "⛵";
    testShip.style.position = "absolute";
    testShip.style.width = "0";
    testShip.style.height = "0";
    testShip.style.overflow = "hidden";
    testShip.style.opacity = "0";
    testShip.style.pointerEvents = "none";
    
    const grid = document.getElementById("gameGrid");
    grid.appendChild(testShip);
    
    setTimeout(() => {
        try {
            const style = window.getComputedStyle(testShip);
            let gridColumn = style.gridColumn;
            let gridRow = style.gridRow;
            
            console.log("gridColumn:", gridColumn);
            console.log("gridRow:", gridRow);
            
            testShip.remove();
            
            let actual = [];
            
            // Получаем сетку для определения количества колонок/строк
            const gridStyle = window.getComputedStyle(grid);
            const gridTemplateColumns = gridStyle.gridTemplateColumns;
            const columnsCount = gridTemplateColumns.split(" ").length;
            
            // Функция для преобразования номера колонки в букву
            function colToLetter(col) {
                return String.fromCharCode(65 + col - 1);
            }
            
            // Парсим gridColumn и gridRow (с поддержкой span)
            let colStart = null, colEnd = null, rowStart = null, rowEnd = null;
            
            // Парсим строки
            if (gridRow.includes("span")) {
                // Формат: grid-row: span 2
                const spanMatch = gridRow.match(/span\s*(\d+)/);
                if (spanMatch) {
                    const span = parseInt(spanMatch[1]);
                    // Для span нужно определить начальную позицию
                    // По умолчанию с 1, но может быть и другой
                    const rowMatch = gridRow.match(/^(\d+)\s*\/\s*span/);
                    if (rowMatch) {
                        rowStart = parseInt(rowMatch[1]);
                    } else {
                        rowStart = 1;
                    }
                    rowEnd = rowStart + span;
                }
            } else {
                const rowMatch = gridRow.match(/(\d+)\s*\/\s*(\d+)/);
                if (rowMatch) {
                    rowStart = parseInt(rowMatch[1]);
                    rowEnd = parseInt(rowMatch[2]);
                }
            }
            
            // Парсим колонки
            if (gridColumn.includes("span")) {
                const spanMatch = gridColumn.match(/span\s*(\d+)/);
                if (spanMatch) {
                    const span = parseInt(spanMatch[1]);
                    const colMatch = gridColumn.match(/^(\d+)\s*\/\s*span/);
                    if (colMatch) {
                        colStart = parseInt(colMatch[1]);
                    } else {
                        colStart = 1;
                    }
                    colEnd = colStart + span;
                }
            } else {
                const colMatch = gridColumn.match(/(\d+)\s*\/\s*(\d+)/);
                if (colMatch) {
                    colStart = parseInt(colMatch[1]);
                    colEnd = parseInt(colMatch[2]);
                }
            }
            
            // Если не удалось распарсить, возвращаем пустой массив
            if (colStart === null || rowStart === null) {
                console.log("Не удалось распарсить позицию");
                actual = [];
            } else {
                // Собираем все клетки в диапазоне
                for (let r = rowStart; r < rowEnd; r++) {
                    for (let c = colStart; c < colEnd; c++) {
                        if (r >= 1 && r <= 6 && c >= 1 && c <= 6) {
                            actual.push(`${colToLetter(c)}${r}`);
                        }
                    }
                }
                actual.sort();
            }
            
            console.log("Уровень", currentLevelId);
            console.log("Ожидалось:", level.expectedShips);
            console.log("Получено:", actual);
            
            // Проверка
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
            }
            else {
                if (JSON.stringify(actual) === JSON.stringify(level.expectedShips)) {
                    if (!completedLevels.includes(currentLevelId)) {
                        completedLevels.push(currentLevelId);
                    }
                    renderShips(actual);
                    showMessage(`✅ Уровень ${currentLevelId} пройден!`);
                    updateLevelButtons();
                    resetHint();
                } else {
                    showMessage(`❌ Ожидалось: ${level.expectedShips.join(", ")}, получено: ${actual.join(", ")}`, true);
                    incrementFailed();
                }
            }
        } catch(e) {
            console.error("Ошибка при проверке:", e);
            showMessage("❌ Ошибка при проверке. Смотри консоль.", true);
            testShip.remove();
        }
    }, 200);
}