module helpers {
    export function getButton(text: string, onclick: () => void): Element {
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

    export function getI(text: string, onclick: () => void): Element {
        var button = document.createElement('i');
        button.setAttribute('class', text + " schem-property-inline");

        button.onclick = onclick;

        return button;
    }
}