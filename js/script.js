// script.js — только инициализация и глобальные переменные

// Глобальные переменные (доступны всем модулям)
let currentLevelId = 1;
let completedLevels = [1,2,3,4,5,6,7];
let failedAttempts = 0;
let hintUsed = false;

// ========== ИНИЦИАЛИЗАЦИЯ ==========
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM загружен, инициализация...");
    
    // Проверяем, что все модули загружены
    if (typeof buildGrid === 'undefined') {
        console.error("Ошибка: gridRenderer.js не загружен!");
        return;
    }
    if (typeof loadLevel === 'undefined') {
        console.error("Ошибка: levelManager.js не загружен!");
        return;
    }
    if (typeof LEVELS === 'undefined') {
        console.error("Ошибка: levels.js не загружен!");
        return;
    }
    
    // Строим сетку
    buildGrid();
    
    // Загружаем первый уровень
    loadLevel(1);
    
    // Навешиваем обработчики
    const checkBtn = document.getElementById("checkBtn");
    const resetBtn = document.getElementById("resetBtn");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    
    if (checkBtn) checkBtn.onclick = () => {
        if (typeof checkLevel === 'function') {
            checkLevel();
        } else {
            console.error("checkLevel не определён");
        }
    };
    
    if (resetBtn) {
        resetBtn.onclick = () => {
            if (typeof resetCurrentLevel === 'function') {
                resetCurrentLevel();
            } else {
                console.error("resetCurrentLevel не определён");
            }
        };
    }
    
    if (prevBtn) {
        prevBtn.onclick = () => {
            if (currentLevelId > 1 && typeof loadLevel === 'function') {
                loadLevel(currentLevelId - 1);
            }
        };
    }
    
    if (nextBtn) {
        nextBtn.onclick = () => {
            if (currentLevelId < 8 && typeof loadLevel === 'function') {
                const maxUnlocked = Math.max(1, ...completedLevels, 1);
                if (currentLevelId + 1 <= maxUnlocked + 1) {
                    loadLevel(currentLevelId + 1);
                } else {
                    showMessage("🔒 Сначала пройди текущий уровень!", true);
                }
            }
        };
    }
});