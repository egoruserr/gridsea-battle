// helpers.js — только уникальные функции, которых нет в script.js

// Создать невидимый тестовый элемент для проверки позиционирования
function createTestShip() {
    let testShip = document.getElementById("test-ship");
    if (testShip) testShip.remove();
    testShip = document.createElement("div");
    testShip.id = "test-ship";
    testShip.className = "test-ship";
    testShip.textContent = "⛵";
    
    // Важно: добавляем ВНУТРЬ .game-grid, а не в body
    const grid = document.getElementById("gameGrid");
    if (grid) {
        grid.appendChild(testShip);
    } else {
        document.body.appendChild(testShip);
    }
    return testShip;
}

function removeTestShip() {
    const testShip = document.getElementById("test-ship");
    if (testShip) testShip.remove();
}