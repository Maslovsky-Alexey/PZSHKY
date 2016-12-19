var schem;
(function (schem) {
    var wiresUpdater;
    (function (wiresUpdater) {
        var animation;
        var isDrawWire = false;
        var pointStart;
        var pointEnd;
        var cursorPosition;
        var line;
        function updateWire(stage, layer, sizeCell, calback) {
            if (isDrawWire == false)
                startDrawWire(stage, layer, sizeCell, calback);
        }
        wiresUpdater.updateWire = updateWire;
        function isDrawingMode() {
            return isDrawWire;
        }
        wiresUpdater.isDrawingMode = isDrawingMode;
        function startDrawWire(stage, layer, sizeCell, calback) {
            isDrawWire = true;
            pointStart = alignPoint(getCursorPosition(stage), sizeCell);
            animation = getAnimation(stage, layer, sizeCell).start();
            stage.off('contentClick');
            stage.on('contentClick', function () {
                stop(stage, layer, sizeCell);
                calback(pointStart, pointEnd, line);
                line = null;
            });
        }
        function stop(stage, layer, sizeCell) {
            stage.off('contentClick');
            animation.stop();
            isDrawWire = false;
            animation = null;
        }
        function getAnimation(stage, layer, sizeCell) {
            return new Konva.Animation(function () {
                pointEnd = alignPoint(getEndPoint(stage), sizeCell);
                redrawLine(layer, pointEnd);
            }, layer);
        }
        function redrawLine(layer, endPoint) {
            if (line)
                line.remove();
            line = helpers.getLine(pointStart.x, pointStart.y, endPoint.x, endPoint.y, 'black');
            layer.add(line);
        }
        function getEndPoint(stage) {
            var cursorPosition = getCursorPosition(stage);
            return cursorPosition.getClosestPoint(new schem.Point(pointStart.x, cursorPosition.y), new schem.Point(cursorPosition.x, pointStart.y));
        }
        function alignPoint(point, sizeCell) {
            return point.getClosestPoint(getAllignedPointToLeftTop(point, sizeCell), new schem.Point(getAllignedPointToLeftTop(point, sizeCell).x + sizeCell, getAllignedPointToLeftTop(point, sizeCell).y), new schem.Point(getAllignedPointToLeftTop(point, sizeCell).x, getAllignedPointToLeftTop(point, sizeCell).y + sizeCell), new schem.Point(getAllignedPointToLeftTop(point, sizeCell).x + sizeCell, getAllignedPointToLeftTop(point, sizeCell).y + sizeCell));
        }
        wiresUpdater.alignPoint = alignPoint;
        function getAllignedPointToLeftTop(point, sizeCell) {
            return new schem.Point(point.x - point.x % sizeCell, point.y - point.y % sizeCell);
        }
        function getCursorPosition(stage) {
            resetCursorPosition(stage);
            return cursorPosition;
        }
        function resetCursorPosition(stage) {
            if (stage.getPointerPosition())
                cursorPosition = new schem.Point(stage.getPointerPosition().x, stage.getPointerPosition().y);
        }
    })(wiresUpdater = schem.wiresUpdater || (schem.wiresUpdater = {}));
})(schem || (schem = {}));
//# sourceMappingURL=wiresUpdater.js.map