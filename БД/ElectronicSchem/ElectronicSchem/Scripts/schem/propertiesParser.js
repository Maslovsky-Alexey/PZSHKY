var schem;
(function (schem) {
    function propertyModelToHtmlElement(property, isEditMode) {
        for (var i = 0; i < propertiesPatterns.length; i++)
            if (propertiesPatterns[i].type == property.type)
                return propertiesPatterns[i].toHtmlElement(property, propertiesPatterns[i].controlType, propertiesPatterns[i].attributes, propertiesPatterns[i].bind, isEditMode);
        return null;
    }
    schem.propertyModelToHtmlElement = propertyModelToHtmlElement;
    var propertiesPatterns = [
        { type: 'int', controlType: 'input', attributes: [{ name: 'type', value: 'text' }], toHtmlElement: inputPropertyToHtmlElement, bind: bindValue },
        { type: 'float', controlType: 'input', attributes: [{ name: 'type', value: 'text' }], toHtmlElement: inputPropertyToHtmlElement, bind: bindValue },
        { type: 'string', controlType: 'input', attributes: [{ name: 'type', value: 'text' }], toHtmlElement: inputPropertyToHtmlElement, bind: bindValue },
        { type: 'bool', controlType: 'input', attributes: [{ name: 'type', value: 'checkbox' }], toHtmlElement: inputPropertyToHtmlElement, bind: bindChecked },
        { type: 'enum', controlType: 'select', attributes: [], toHtmlElement: enumPropertyToHtmlElement, bind: bindEnumValue },
    ];
    function inputPropertyToHtmlElement(property, controlType, attributes, bind, isEdit) {
        var row = defaultPropertyToHtmlElement(property);
        if (!isEdit)
            attributes.push(new AttributeValue('disabled', 'true'));
        bind(row.appendChild(createElement(controlType, '', attributes)), property);
        return row;
    }
    function enumPropertyToHtmlElement(property, controlType, attributes, bind, isEdit) {
        var row = defaultPropertyToHtmlElement(property);
        if (!isEdit)
            attributes.push(new AttributeValue('disabled', 'true'));
        var input = row.appendChild(createElement(controlType, '', null));
        var disabledAttr = [];
        if (!isEdit)
            disabledAttr = [new AttributeValue('disabled', 'true')];
        property.items.forEach(function (item, index, array) { return input.appendChild(createElement('option', item.value, disabledAttr)); });
        bind(input, property);
        return row;
    }
    function bindValue(element, property) {
        element.setAttribute('value', property.value == null ? property.defaultValue : property.value);
        onBlur(element, property);
        onKeyPress(element, property);
        onKeyUp(element, property);
    }
    function onKeyUp(element, property) {
        $(element).on('keyup', function (e) {
            if (property.type != 'string')
                checkMaxMinValue(event, property);
        });
    }
    function onKeyPress(element, property) {
        if (property.type == 'int')
            onKeyPpessInt(element, property);
        if (property.type == 'float')
            onKeyPpessFloat(element, property);
        if (property.type == 'string')
            onKeyPpessString(element, property);
    }
    function onKeyPpessString(element, property) {
        $(element).on('keypress', function (e) {
            var value = $(e.target).val();
            if (value.length == property.maxLength)
                return false;
        });
    }
    function onKeyPpessFloat(element, property) {
        $(element).on('keypress', function (e) {
            var value = $(event.target).val();
            if (value.indexOf('.') > -1 && e.charCode == 46)
                return false;
            return (e.charCode >= 48 && e.charCode <= 57) || (value.length > 0 && e.charCode == 46);
        });
    }
    function onKeyPpessInt(element, property) {
        $(element).on('keypress', function (e) {
            var value = $(event.target).val();
            return (e.keyCode >= 48 && e.keyCode <= 57) || checkMinus(value, e.keyCode);
        });
    }
    function onBlur(element, property) {
        $(element).on('blur', function (e) {
            if (property.type != 'string') {
                checkMaxMinValue(event, property);
                checkNullValue(event, property);
            }
            property.value = $(event.target).val();
        });
    }
    function checkNullValue(e, property) {
        var value = $(e.target).val();
        if (parseInt(value).toString() === 'NaN')
            $(e.target).val(property.defaultValue);
    }
    function checkMaxMinValue(e, property) {
        var value = $(e.target).val();
        if (parseInt(value) > property.maxValue)
            $(event.target).val(property.maxValue);
        if (parseInt(value) < property.minValue)
            $(e.target).val(property.minValue);
    }
    function checkMinus(text, charCode) {
        return (charCode == 45 && text.length == 0);
    }
    function bindChecked(element, property) {
        $(element).prop('checked', property.value == null ? property.defaultValue : property.value);
        $(element).on('click', function (e) {
            property.value = $(event.target).prop('checked');
        });
    }
    function bindEnumValue(element, property) {
        for (var i = 0; i < element.childNodes.length; i++)
            $(element.childNodes[i]).prop('selected', element.childNodes[i].textContent == (property.value == null ? property.defaultValue : property.value));
        $(element).on('change', function (e) {
            property.value = $(event.target).val();
        });
    }
    function defaultPropertyToHtmlElement(property) {
        var row = document.createElement('div');
        row.classList.add('schem-property');
        row.textContent = property.key;
        return row;
    }
    function createElement(tag, textContent, attributes) {
        var element = document.createElement(tag);
        element.textContent = textContent;
        if (attributes)
            attributes.forEach(function (item, index, array) { return element.setAttribute(item.name, item.value); });
        return element;
    }
    var PropertyPattern = (function () {
        function PropertyPattern() {
            this.attributes = new Array();
        }
        return PropertyPattern;
    }());
    var AttributeValue = (function () {
        function AttributeValue(name, value) {
            this.name = name;
            this.value = value;
        }
        return AttributeValue;
    }());
})(schem || (schem = {}));
//# sourceMappingURL=propertiesParser.js.map