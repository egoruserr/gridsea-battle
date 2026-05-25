// validator.js — функции проверки

function colToLetter(col) {
    return String.fromCharCode(65 + col);
}

function applyCSS(cssText) {
    let style = document.getElementById("dynamic-css");
    if (style) style.remove();
    if (cssText && cssText.trim() !== "") {
        style = document.createElement("style");
        style.id = "dynamic-css";
        style.textContent = cssText;
        document.head.appendChild(style);
    }
}

function getActualShipsFromCSS() {
    const shipElement = document.querySelector(".ship");
    if (!shipElement) return [];
    
    const style = window.getComputedStyle(shipElement);
    const gridColumn = style.gridColumn;
    const gridRow = style.gridRow;
    
    const colMatch = gridColumn.match(/(\d+)\s*\/\s*(\d+)/);
    const rowMatch = gridRow.match(/(\d+)\s*\/\s*(\d+)/);
    
    if (!colMatch || !rowMatch) return [];
    
    const ships = [];
    const colStart = parseInt(colMatch[1]);
    const colEnd = parseInt(colMatch[2]);
    const rowStart = parseInt(rowMatch[1]);
    const rowEnd = parseInt(rowMatch[2]);
    
    for (let r = rowStart; r < rowEnd; r++) {
        for (let c = colStart; c < colEnd; c++) {
            if (r >= 1 && r <= 6 && c >= 1 && c <= 6) {
                ships.push(`${colToLetter(c - 1)}${r}`);
            }
        }
    }
    return ships.sort();
}

function checkDisplayGrid(css) {
    const clean = css.replace(/\/\*[\s\S]*?\*\//g, '');
    return /display\s*:\s*grid/i.test(clean);
}

function checkTemplateStructure(css) {
    const clean = css.replace(/\/\*[\s\S]*?\*\//g, '');
    return /grid-template-columns/i.test(clean) && /grid-template-rows/i.test(clean);
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