var helpers;
(function (helpers) {
    function getButton(text, onclick) {
        var row = document.createElement('div');
        row.classList.add('schem-property');
        var button = document.createElement('input');
        button.setAttribute('type', 'button');
        button.innerHTML = text;
        button.classList.add('schem-properties-button');
        button.onclick = onclick;
        row.appendChild(button);
        return row;
    }
    helpers.getButton = getButton;
    function getI(text, onclick) {
        var button = document.createElement('i');
        button.setAttribute('class', text + " schem-property-inline");
        button.onclick = onclick;
        return button;
    }
    helpers.getI = getI;
})(helpers || (helpers = {}));
//# sourceMappingURL=htmlHelper.js.map