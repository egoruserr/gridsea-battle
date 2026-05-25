// hintSystem.js — функции подсказок

function resetHint() {
    failedAttempts = 0;
    hintUsed = false;
    const container = document.getElementById("hintContainer");
    if (container) container.innerHTML = "";
}

function showHintButton() {
    if (document.querySelector(".hint-button")) return;
    const container = document.getElementById("hintContainer");
    if (!container) return;
    const btn = document.createElement("button");
    btn.className = "hint-button";
    btn.innerHTML = "💡 Подсказка";
    btn.onclick = () => {
        if (typeof LEVELS === 'undefined') {
            showMessage("❌ Ошибка: уровни не загружены", true);
            return;
        }
        const level = LEVELS.find(l => l.id === currentLevelId);
        if (level && !document.querySelector(".hint-text")) {
            const div = document.createElement("div");
            div.className = "hint-text";
            div.innerHTML = level.hint;
            container.appendChild(div);
            hintUsed = true;
            btn.disabled = true;
        }
    };
    container.appendChild(btn);
}

function incrementFailed() {
    if (hintUsed) return;
    failedAttempts++;
    if (failedAttempts >= 3) showHintButton();
}