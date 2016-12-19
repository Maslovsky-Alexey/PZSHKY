module Components {
    export class Component implements IJsonObjecParser{
        public name: string;

        public positionx: number;
        public positiony: number;

        public url: string;

        public width: number;
        public height: number;

        public rotation: number;

        public properties: Array<Property>;
        public inputs: Array<Input>;

        public constructor() {
            this.name = '';
            this.positionx = 0;
            this.positiony = 0;

            this.properties = new Array<Property>();
            this.inputs = new Array<Input>();
        }

        public fromJsonObject(jsonObject: any): Component {
            var res = new Component();

            res.name = getValueOrDefault(jsonObject.name, 'noname');
            res.positionx = getValueOrDefault(jsonObject.positionX, 0);
            res.positiony = getValueOrDefault(jsonObject.positionY, 0);

            res.url = getValueOrDefault(jsonObject.url, '');
            res.width = getValueOrDefault(jsonObject.width, 1);
            res.height = getValueOrDefault(jsonObject.height, 1);
            res.rotation = getValueOrDefault(jsonObject.rotation, 0);

            doIfNotNull(jsonObject.inputs, (inputs: any) => res.inputs = getArrayFromJsonObject<Input>(inputs.element, new Input()));
            doIfNotNull(jsonObject.properties, (properties: any) => res.properties = getArrayFromJsonObject<Property>(properties.property, new Property()));
            
            return res;
        }
    };

    export class Input implements IJsonObjecParser{
        public x: number;
        public y: number;

        public color: string;

        public fromJsonObject(jsonObject: any): Input {
            var res = new Input();

            res.color = getValueOrDefault(jsonObject.color, 'green');
            res.x = getValueOrDefault(jsonObject.x, 0);
            res.y = getValueOrDefault(jsonObject.y, 0);

            return res;
        }
    }

    export class Property implements IJsonObjecParser{
        public type: string;

        public key: string;
        public value: any;

        public defaultValue: string;
        public maxValue: number;
        public minValue: number;
        public maxLength: number;
        public minLength: number;

        public items: Array<PropertyItem>;

        public fromJsonObject(jsonObject: any): Property {
            var res = new Property();

            res.defaultValue = getValueOrDefault(jsonObject.defaultValue, '');
            res.key = getValueOrDefault(jsonObject.key, 'noname varible');
            res.maxLength = getValueOrDefault(jsonObject.maxLength, 255);
            res.maxValue = getValueOrDefault(jsonObject.maxValue, 1000000000000);
            res.minLength = getValueOrDefault(jsonObject.minLength, 0);
            res.minValue = getValueOrDefault(jsonObject.minValue, -1000000000000);
            res.type = getValueOrDefault(jsonObject.type, 'int');
            res.value = res.defaultValue;

            doIfNotNull(jsonObject.item, (items: any) => res.items = getArrayFromJsonObject<PropertyItem>(items, new PropertyItem()));
            return res;
        }
    }

    export class PropertyItem implements IJsonObjecParser{
        public value: string;

        public fromJsonObject(jsonObject: any): PropertyItem {
            var res = new PropertyItem();

            res.value = getValueOrDefault(jsonObject.value, 'noname item');
            
            return res;
        }
    }


    export function getArrayFromJsonObject<T extends IJsonObjecParser>(jsonObject: any, obj: T): Array<T> {
        var res = new Array<T>();

        doIfNotNull(jsonObject, (array: any) => {
            array.forEach((value, index, array) => res.push(obj.fromJsonObject(value)))
        });


        return res;
    }

    export interface IJsonObjecParser {
         fromJsonObject(jsonObject: any): any;
    }

   function getValueOrDefault(value: any, defaultValue: any): any {
       return value == null ? defaultValue : value;
    }

   function doIfNotNull(value: any, action: (value: any) => void): void {
       if (value != null)
           action(value);
   }
}
