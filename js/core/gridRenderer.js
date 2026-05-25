// gridRenderer.js

function colToLetter(col) {
    return String.fromCharCode(65 + col);
}

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
        cell.classList.remove("ship", "ship-1x1", "ship-2x1-h", "ship-1x2-v", "explosion");
        cell.style.backgroundImage = "";
    });
}