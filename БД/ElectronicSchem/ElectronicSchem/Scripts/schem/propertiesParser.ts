module schem {
    export function propertyModelToHtmlElement(property: Components.Property, isEditMode: boolean): Element {
        for (var i = 0; i < propertiesPatterns.length; i++)
            if (propertiesPatterns[i].type == property.type)
                return propertiesPatterns[i].toHtmlElement(property, propertiesPatterns[i].controlType, propertiesPatterns[i].attributes,
                    propertiesPatterns[i].bind, isEditMode);

        
        return null;
    }

    var propertiesPatterns: Array<PropertyPattern> = [
        { type: 'int', controlType: 'input', attributes: [{ name: 'type', value: 'text' }], toHtmlElement: inputPropertyToHtmlElement, bind: bindValue },
        { type: 'float', controlType: 'input', attributes: [{ name: 'type', value: 'text' }], toHtmlElement: inputPropertyToHtmlElement, bind: bindValue },
        { type: 'string', controlType: 'input', attributes: [{ name: 'type', value: 'text' }], toHtmlElement: inputPropertyToHtmlElement, bind: bindValue },
        { type: 'bool', controlType: 'input', attributes: [{ name: 'type', value: 'checkbox' }], toHtmlElement: inputPropertyToHtmlElement, bind: bindChecked },
        { type: 'enum', controlType: 'select', attributes: [], toHtmlElement: enumPropertyToHtmlElement, bind: bindEnumValue },
    ];

    function inputPropertyToHtmlElement(property: Components.Property, controlType: string, attributes: Array<AttributeValue>,
        bind: (element: Element, property: Components.Property) => void, isEdit: boolean): Element {

        var row = defaultPropertyToHtmlElement(property);

        if (!isEdit)
            attributes.push(new AttributeValue('disabled', 'true'));

        bind(<Element>row.appendChild(createElement(controlType, '', attributes)), property);


        return row;
    }

    function enumPropertyToHtmlElement(property: Components.Property, controlType: string, attributes: Array<AttributeValue>,
        bind: (element: Element, property: Components.Property) => void, isEdit: boolean): Element {

        var row = defaultPropertyToHtmlElement(property);

        if (!isEdit)
            attributes.push(new AttributeValue('disabled', 'true'));

        var input = <Element>row.appendChild(createElement(controlType, '', null));

        var disabledAttr = [];
        if (!isEdit)
            disabledAttr = [new AttributeValue('disabled', 'true')];

        property.items.forEach(
            (item, index, array) => input.appendChild(createElement('option', item.value, disabledAttr))
        );

        bind(input, property);
             
        return row;
    }

    function bindValue(element: Element, property: Components.Property): void {
        element.setAttribute('value', property.value == null ? property.defaultValue : property.value);

        onBlur(element, property);
        onKeyPress(element, property);
        onKeyUp(element, property);
    }

    function onKeyUp(element: Element, property: Components.Property) {
        $(element).on('keyup', (e) => {
            if (property.type != 'string')
                checkMaxMinValue(event, property);
        });
    }

    function onKeyPress(element: Element, property: Components.Property) {
        if (property.type == 'int')
            onKeyPpessInt(element, property);

        if (property.type == 'float')
            onKeyPpessFloat(element, property);

        if (property.type == 'string')
            onKeyPpessString(element, property);
    }


    function onKeyPpessString(element: Element, property: Components.Property) {
        $(element).on('keypress', (e) => {
            var value = <string>$(e.target).val();

            if (value.length == property.maxLength)
                return false;
        });
    }

    function onKeyPpessFloat(element: Element, property: Components.Property) {
        $(element).on('keypress', (e) => {
            var value = <string>$(event.target).val();

            if (value.indexOf('.') > -1 && e.charCode == 46)
                return false;

            return (e.charCode >= 48 && e.charCode <= 57) || (value.length > 0 && e.charCode == 46);
        });
    }

    function onKeyPpessInt(element: Element, property: Components.Property) {
        $(element).on('keypress', (e) => {
            var value = <string>$(event.target).val();

            return (e.keyCode >= 48 && e.keyCode <= 57) || checkMinus(value, e.keyCode);
        });
    }

    function onBlur(element: Element, property: Components.Property) {
        $(element).on('blur', (e) => {
            if (property.type != 'string') {
                checkMaxMinValue(event, property);
                checkNullValue(event, property);
            }

            property.value = $(event.target).val();
        });
    }
    
    function checkNullValue(e: Event, property: Components.Property) {
        var value = <string>$(e.target).val();

        if (parseInt(value).toString() === 'NaN')
            $(e.target).val(property.defaultValue);
    }

    function checkMaxMinValue(e: Event, property: Components.Property) {
        var value = <string>$(e.target).val();

        if (parseInt(value) > property.maxValue)
            $(event.target).val(property.maxValue);

        if (parseInt(value) < property.minValue)
            $(e.target).val(property.minValue);
    }

    function checkMinus(text: string, charCode: number): boolean {
        return (charCode == 45 && text.length == 0);
    }

    function bindChecked(element: Element, property: Components.Property): void {
        $(element).prop('checked', property.value == null ? property.defaultValue : property.value);

        $(element).on('click', (e) => {
            property.value = $(event.target).prop('checked');
        });
    }

    function bindEnumValue(element: Element, property: Components.Property): void {
        for (var i = 0; i < element.childNodes.length; i++)
            $(<Element>element.childNodes[i]).prop('selected',
                element.childNodes[i].textContent == (property.value == null ? property.defaultValue : property.value));     

        $(element).on('change', (e) => {
            property.value = $(event.target).val();
        });
    }

    function defaultPropertyToHtmlElement(property: Components.Property): Element{
        var row = document.createElement('div');
        row.classList.add('schem-property');
        row.textContent = property.key;
        
        return row;
    }

    function createElement(tag: string, textContent: string, attributes: AttributeValue[]): Element {
        var element = document.createElement(tag);

        element.textContent = textContent;

        if (attributes)
            attributes.forEach((item, index, array) => element.setAttribute(item.name, item.value));

        return element;
    }

    class PropertyPattern {
        public type: string;
        public controlType: string;
        public attributes: Array<AttributeValue> = new Array<AttributeValue>();

        public toHtmlElement: (property: Components.Property, controlType: string, attributes: Array<AttributeValue>,
            bind: (element: Element, property: Components.Property) => void, isEdit: boolean) => Element;

        public bind: (element: Element, property: Components.Property) => void;
    }

   class AttributeValue {
        public name: string;
        public value: string;

        public constructor(name: string, value: string) {
            this.name = name;
            this.value = value;
        }
    }
}