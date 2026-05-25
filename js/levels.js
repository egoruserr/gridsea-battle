// levels.js — 5 рабочих уровней

const LEVELS = [
    { id: 1, theory: "Свойство display: grid превращает элемент в грид-контейнер.", task: "Сделай игровое поле грид-контейнером. Добавь к селектору .game-grid свойство display: grid.", initialCode: ".game-grid {\n  \n}", expectedShips: [], checkType: "displayGrid", hint: "display: grid;" },
    
    { id: 2, theory: "grid-template-columns задаёт колонки, grid-template-rows — строки.", task: "Создай сетку 6×6. Колонки: 1fr, строки: 60px.", initialCode: ".game-grid {\n  display: grid;\n  \n}", expectedShips: [], checkType: "templateStructure", hint: "grid-template-columns: repeat(6, 1fr); grid-template-rows: repeat(6, 60px);" },
    
    { id: 3, theory: "grid-column и grid-row указывают позицию.", task: "Размести корабль в клетке C4.", initialCode: ".ship {\n  \n}", expectedShips: ["C4"], checkType: "shipsPlacement", hint: "grid-column: 3 / 4; grid-row: 4 / 5;" },
    
{ id: 4, theory: "span 2 растягивает элемент по вертикали.", task: "Размести вертикальный корабль в A1–A2.", initialCode: ".ship {\n  \n}", expectedShips: ["A1","A2"], checkType: "shipsPlacement", hint: "grid-column: 1 / 2; grid-row: span 2;" },

{ id: 5, theory: "span 2 растягивает элемент по горизонтали.", task: "Размести горизонтальный корабль в D3–E3.", initialCode: ".ship {\n  \n}", expectedShips: ["D3","E3"], checkType: "shipsPlacement", hint: "grid-column: span 2; grid-row: 3 / 4;" }];

console.log("levels.js загружен, количество уровней:", LEVELS.length);