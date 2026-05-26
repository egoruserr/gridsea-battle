// levelManager.js — управление уровнями

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
    clearGridVisuals();
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
        clearGridVisuals();
        showMessage("🔄 Уровень сброшен");
        resetHint();
    }
}

async function checkLevel() {
    if (typeof LEVELS === 'undefined') {
        showMessage("❌ Ошибка: данные уровней не загружены", true);
        return;
    }
    const level = LEVELS.find(l => l.id === currentLevelId);
    if (!level) return;
    
    const css = document.getElementById("cssEditor").value;
    console.log("CSS для проверки:", css);
    
    const result = await validateCSS(css, level.expectedShips, level.checkType, level.explosionZone);
    
    console.log("Уровень", currentLevelId);
    console.log("Ожидалось:", level.expectedShips);
    console.log("Получено:", result.actualShips);
    
    if (result.success) {
        if (!completedLevels.includes(currentLevelId)) {
            completedLevels.push(currentLevelId);
        }
        renderShips(result.actualShips);
        showMessage(`✅ Уровень ${currentLevelId} пройден!`);
        updateLevelButtons();
        resetHint();
    } else {
        showMessage(`❌ Ожидалось: ${level.expectedShips.join(", ")}, получено: ${result.actualShips.join(", ")}`, true);
        incrementFailed();
    }
}