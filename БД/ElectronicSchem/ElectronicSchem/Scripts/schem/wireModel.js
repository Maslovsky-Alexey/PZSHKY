var schem;
(function (schem) {
    var WireModel = (function () {
        function WireModel(point1, point2) {
            this.x1 = point1.x;
            this.y1 = point1.y;
            this.x2 = point2.x;
            this.y2 = point2.y;
        }
        return WireModel;
    }());
    schem.WireModel = WireModel;
    var Point = (function () {
        function Point(x, y) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            this.x = x;
            this.y = y;
        }
        Point.prototype.getClosestPoint = function () {
            var _this = this;
            var points = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                points[_i - 0] = arguments[_i];
            }
            var distances = new Array();
            points.forEach(function (item, index, array) { return distances.push(_this.getDistanceToPoint(item)); });
            return points[distances.indexOf(Math.min.apply(null, distances))];
        };
        Point.prototype.getDistanceToPoint = function (point) {
            return Math.sqrt(Math.pow(this.x - point.x, 2) + Math.pow(this.y - point.y, 2));
        };
        Point.prototype.getIntPoint = function () {
            return new Point(Math.round(this.x), Math.round(this.y));
        };
        return Point;
    }());
    schem.Point = Point;
})(schem || (schem = {}));
//# sourceMappingURL=wireModel.js.map