module helpers {
    export function clone(obj: any): any {
        if (null == obj || "object" != typeof obj)
            return obj;

        if (obj instanceof Array)
            return checkArray(obj);
      
        if (obj instanceof Object)
            return checkObject(obj);
    }

    function checkArray(obj: any): any{
        var copy = [];

        for (var i = 0, len = obj.length; i < len; i++)
            copy[i] = clone(obj[i]);

        return copy;
    }

    function checkObject(obj: any): any {
        var copy = {};

        for (var attr in obj)
            if (obj.hasOwnProperty(attr))
                copy[attr] = clone(obj[attr]);

        return copy;
    }

}