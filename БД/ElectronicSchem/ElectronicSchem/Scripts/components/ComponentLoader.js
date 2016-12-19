var Components;
(function (Components) {
    function loadComponents() {
        var components;
        $.ajax({
            type: "POST",
            url: "/Schem/GetComponents",
            success: function (data) {
                var array = JSON.parse(data).components.component;
                components = new Array();
                for (var i = 0; i < array.length; i++)
                    components.push(new Components.Component().fromJsonObject(array[i]));
            },
            async: false
        });
        return components;
    }
    Components.loadComponents = loadComponents;
})(Components || (Components = {}));
//# sourceMappingURL=ComponentLoader.js.map