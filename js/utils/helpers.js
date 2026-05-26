// helpers.js — базовые утилиты

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