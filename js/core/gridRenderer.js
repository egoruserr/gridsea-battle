// gridRenderer.js — отрисовка сетки и кораблей

function buildGrid() {
    const container = document.getElementById("gameGrid");
    if (!container) return;
    container.innerHTML = "";
    for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 6; col++) {
            const cell = document.createElement("div");
            cell.className = "grid-cell";
            cell.setAttribute("data-coord", `${colToLetter(col)}${row + 1}`);
            container.appendChild(cell);
        }
    }
}

function clearGridVisuals() {
    const cells = document.querySelectorAll(".grid-cell");
    cells.forEach(cell => {
        cell.classList.remove("ship", "explosion");
        cell.style.backgroundImage = "";
        const img = cell.querySelector(".ship-img");
        if (img) img.remove();
        const exp = cell.querySelector(".explosion-img");
        if (exp) exp.remove();
    });
    
    const visualShips = document.querySelectorAll(".visual-ship");
    visualShips.forEach(ship => ship.remove());
}

function renderShips(shipCoordinates) {
    // Удаляем старые визуальные корабли
    const oldShips = document.querySelectorAll(".visual-ship");
    oldShips.forEach(ship => ship.remove());
    
    const cells = document.querySelectorAll(".grid-cell");
    cells.forEach(cell => {
        const img = cell.querySelector(".ship-img");
        if (img) img.remove();
    });
    
    if (!shipCoordinates || shipCoordinates.length === 0) return;
    
    // Группируем клетки по кораблям
    const used = new Set();
    const ships = [];
    
    for (let coord of shipCoordinates) {
        if (used.has(coord)) continue;
        
        const col = coord.charCodeAt(0) - 65;
        const row = parseInt(coord[1]);
        
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
    
    ships.forEach(shipCoords => {
        if (shipCoords.length === 0) return;
        
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
        shipElement.style.zIndex = "1";
        shipElement.style.pointerEvents = "none";
        
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
}