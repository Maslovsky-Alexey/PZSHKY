var Components;
(function (Components) {
    var Component = (function () {
        function Component() {
            this.name = '';
            this.positionx = 0;
            this.positiony = 0;
            this.properties = new Array();
            this.inputs = new Array();
        }
        Component.prototype.fromJsonObject = function (jsonObject) {
            var res = new Component();
            res.name = getValueOrDefault(jsonObject.name, 'noname');
            res.positionx = getValueOrDefault(jsonObject.positionX, 0);
            res.positiony = getValueOrDefault(jsonObject.positionY, 0);
            res.url = getValueOrDefault(jsonObject.url, '');
            res.width = getValueOrDefault(jsonObject.width, 1);
            res.height = getValueOrDefault(jsonObject.height, 1);
            res.rotation = getValueOrDefault(jsonObject.rotation, 0);
            doIfNotNull(jsonObject.inputs, function (inputs) { return res.inputs = getArrayFromJsonObject(inputs.element, new Input()); });
            doIfNotNull(jsonObject.properties, function (properties) { return res.properties = getArrayFromJsonObject(properties.property, new Property()); });
            return res;
        };
        return Component;
    }());
    Components.Component = Component;
    ;
    var Input = (function () {
        function Input() {
        }
        Input.prototype.fromJsonObject = function (jsonObject) {
            var res = new Input();
            res.color = getValueOrDefault(jsonObject.color, 'green');
            res.x = getValueOrDefault(jsonObject.x, 0);
            res.y = getValueOrDefault(jsonObject.y, 0);
            return res;
        };
        return Input;
    }());
    Components.Input = Input;
    var Property = (function () {
        function Property() {
        }
        Property.prototype.fromJsonObject = function (jsonObject) {
            var res = new Property();
            res.defaultValue = getValueOrDefault(jsonObject.defaultValue, '');
            res.key = getValueOrDefault(jsonObject.key, 'noname varible');
            res.maxLength = getValueOrDefault(jsonObject.maxLength, 255);
            res.maxValue = getValueOrDefault(jsonObject.maxValue, 1000000000000);
            res.minLength = getValueOrDefault(jsonObject.minLength, 0);
            res.minValue = getValueOrDefault(jsonObject.minValue, -1000000000000);
            res.type = getValueOrDefault(jsonObject.type, 'int');
            res.value = res.defaultValue;
            doIfNotNull(jsonObject.item, function (items) { return res.items = getArrayFromJsonObject(items, new PropertyItem()); });
            return res;
        };
        return Property;
    }());
    Components.Property = Property;
    var PropertyItem = (function () {
        function PropertyItem() {
        }
        PropertyItem.prototype.fromJsonObject = function (jsonObject) {
            var res = new PropertyItem();
            res.value = getValueOrDefault(jsonObject.value, 'noname item');
            return res;
        };
        return PropertyItem;
    }());
    Components.PropertyItem = PropertyItem;
    function getArrayFromJsonObject(jsonObject, obj) {
        var res = new Array();
        doIfNotNull(jsonObject, function (array) {
            array.forEach(function (value, index, array) { return res.push(obj.fromJsonObject(value)); });
        });
        return res;
    }
    Components.getArrayFromJsonObject = getArrayFromJsonObject;
    function getValueOrDefault(value, defaultValue) {
        return value == null ? defaultValue : value;
    }
    function doIfNotNull(value, action) {
        if (value != null)
            action(value);
    }
})(Components || (Components = {}));
//# sourceMappingURL=ComponentsModel.js.map