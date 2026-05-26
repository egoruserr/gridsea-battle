// levels.js — 8 рабочих уровней с улучшенными формулировками

const LEVELS = [
    { 
        id: 1, 
        theory: "🔹 <code>display: grid</code> — главное свойство, которое превращает обычный блок в грид-контейнер. Все дочерние элементы начинают подчиняться правилам грид-раскладки.", 
        task: "⚓ Сделай игровое поле грид-контейнером. Добавь к селектору <code>.game-grid</code> свойство <code>display: grid</code>.", 
        initialCode: ".game-grid {\n  \n}", 
        expectedShips: [], 
        checkType: "displayGrid", 
        hint: "display: grid;" 
    },
    
    { 
        id: 2, 
        theory: "🔹 <code>grid-template-columns</code> задаёт количество и ширину колонок.<br>🔹 <code>grid-template-rows</code> — количество и высоту строк.<br>🔹 <code>1fr</code> — одна доля свободного пространства.", 
        task: "⚓ Создай сетку 6×6. Колонки должны быть шириной <code>1fr</code>, строки — высотой <code>60px</code>.", 
        initialCode: ".game-grid {\n  display: grid;\n  \n}", 
        expectedShips: [], 
        checkType: "templateStructure", 
        hint: "grid-template-columns: repeat(6, 1fr); grid-template-rows: repeat(6, 60px);" 
    },
    
    { 
        id: 3, 
        theory: "🔹 <code>grid-column</code> и <code>grid-row</code> указывают положение элемента в сетке.<br>🔹 Нумерация линий начинается с <strong>1</strong>.<br>🔹 Пример: <code>grid-column: 3 / 4</code> — элемент в третьей колонке.", 
        task: "⚓ Размести корабль в клетке <strong>C4</strong> (колонка 3, строка 4).", 
        initialCode: ".ship {\n  \n}", 
        expectedShips: ["C4"], 
        checkType: "shipsPlacement", 
        hint: "grid-column: 3 / 4; grid-row: 4 / 5;" 
    },
    
    { 
        id: 4, 
        theory: "🔹 Ключевое слово <code>span 2</code> растягивает элемент на 2 ячейки.<br>🔹 <code>grid-row: span 2</code> — элемент занимает 2 строки по вертикали.<br>🔹 <code>grid-column: 1 / 2</code> — элемент в первой колонке (A).", 
        task: "⚓ Размести <strong>вертикальный корабль</strong> (занимает 2 клетки по вертикали) в клетках <strong>A1 и A2</strong>.", 
        initialCode: ".ship {\n  \n}", 
        expectedShips: ["A1","A2"], 
        checkType: "shipsPlacement", 
        hint: "grid-column: 1 / 2; grid-row: span 2;" 
    },
    
    { 
        id: 5, 
        theory: "🔹 Ключевое слово <code>span 2</code> растягивает элемент на 2 ячейки.<br>🔹 <code>grid-column: span 2</code> — элемент занимает 2 колонки по горизонтали.<br>🔹 <code>grid-row: 3 / 4</code> — элемент в третьей строке.", 
        task: "⚓ Размести <strong>горизонтальный корабль</strong> (занимает 2 клетки по горизонтали) в клетках <strong>D3 и E3</strong>.", 
        initialCode: ".ship {\n  \n}", 
        expectedShips: ["D3","E3"], 
        checkType: "shipsPlacement", 
        hint: "grid-column: 4 / span 2; grid-row: 3 / 4;" 
    },

    { 
        id: 6, 
        theory: "🔹 <code>grid-row: span 2</code> растягивает элемент на 2 строки по вертикали.<br>🔹 <code>grid-column: 4 / 5</code> — элемент в четвёртой колонке (D).", 
        task: "⚓ Размести <strong>вертикальный корабль</strong> в клетках <strong>D3 и D4</strong>.", 
        initialCode: ".ship {\n  \n}", 
        expectedShips: ["D3","D4"], 
        checkType: "shipsPlacement", 
        hint: "grid-column: 4 / 5; grid-row: 3 / span 2;" 
    },
    
    { 
        id: 7, 
        theory: "🔹 Можно размещать несколько кораблей с разными классами.<br>🔹 Каждый класс позиционируется отдельно с помощью <code>grid-column</code> и <code>grid-row</code>.", 
        task: "⚓ Размести два корабля:<br>• <strong>Горизонтальный двухклеточный корабль</strong> в клетках <strong>B1 и C1</strong><br>• <strong>Одноклеточный корабль</strong> в клетке <strong>D4</strong>", 
        initialCode: ".ship-horizontal {\n  \n}\n.ship-single {\n  \n}", 
        expectedShips: ["B1","C1","D4"], 
        checkType: "shipsPlacement", 
        hint: ".ship-horizontal { grid-column: 2 / 4; grid-row: 1 / 2; } .ship-single { grid-column: 4 / 5; grid-row: 4 / 5; }" 
    },
    
{ 
    id: 8, 
    theory: "🔹 Можно создавать корабли разной формы, комбинируя <code>span</code> и числовые значения.<br>🔹 Главное — правильно указать начальную позицию и растяжение.", 
    task: "⚓ Размести три корабля:<br>• <strong>Одноклеточный корабль</strong> в клетке <strong>A1</strong><br>• <strong>Вертикальный корабль</strong> в клетках <strong>C3 и C4</strong><br>• <strong>Горизонтальный корабль</strong> в клетках <strong>E5 и F5</strong>", 
    initialCode: ".ship-a1 { }\n.ship-c { }\n.ship-e { }", 
    expectedShips: ["A1","C3","C4","E5","F5"], 
    checkType: "shipsPlacement", 
    hint: ".ship-a1 { grid-column: 1 / 2; grid-row: 1 / 2; } .ship-c { grid-column: 3 / 4; grid-row: 3 / 5; } .ship-e { grid-column: 5 / 7; grid-row: 5 / 6; }" 
}
];

console.log("levels.js загружен, количество уровней:", LEVELS.length);