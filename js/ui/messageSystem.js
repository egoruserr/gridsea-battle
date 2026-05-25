// messageSystem.js

function showMessage(text, isError = false) {
    const box = document.getElementById("messageBox");
    if (!box) return;
    box.innerHTML = text;
    box.style.borderLeftColor = isError ? "#c17a4c" : "#8b9a6e";
}