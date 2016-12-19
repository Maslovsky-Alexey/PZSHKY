interface IDictionary {
    add(key: string, value: any): void;
    remove(key: string): void;
    containsKey(key: string): boolean;
    keys(): string[];
    values(): any[];
}

class Dictionary {

    _keys: string[] = new Array<string>();
    _values: any[] = new Array<any>();

    constructor() {
    }

    add(key: string, value: any): void {
        this[key] = value;
        this._keys.push(key);
        this._values.push(value);
    }

    remove(key: string): void {
        var index = this._keys.indexOf(key, 0);
        this._keys.splice(index, 1);
        this._values.splice(index, 1);

        delete this[key];
    }

    getKeys(): string[] {
        return this._keys;
    }

    getValues(): any[] {
        return this._values;
    }

    containsKey(key: string) {
        if (typeof this[key] === "undefined") 
            return false;

        return true;
    }

    length(): number {
        return this._keys.length;
    }
}