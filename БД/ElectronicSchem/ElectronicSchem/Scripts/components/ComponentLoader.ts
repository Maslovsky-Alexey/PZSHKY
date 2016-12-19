module Components {

    export function loadComponents(): Array<Component> {
        var components: Array<Component>;

        $.ajax({
            type: "POST",
            url: "/Schem/GetComponents",
            success: function (data) {
                var array = JSON.parse(data).components.component;
                components = new Array<Component>();

                for (var i = 0; i < array.length; i++)
                    components.push(new Component().fromJsonObject(array[i]));                               
            },
            async: false
        });

        return components;
    }


}