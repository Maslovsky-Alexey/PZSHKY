module schem.wiresUpdater {
    var animation: Konva.Animation;

    var isDrawWire: boolean = false;

    var pointStart: Point;
    var pointEnd: Point;

    var cursorPosition: Point;

    var line: Konva.Line;

    export function updateWire(stage: Konva.Stage, layer: Konva.Layer, sizeCell: number, calback: (pointStart: Point, pointEnd: Point, line: Konva.Line) => void): void {
        if (isDrawWire == false)
            startDrawWire(stage, layer, sizeCell, calback);
    }

    export function isDrawingMode(): boolean{
        return isDrawWire;
    }

    function startDrawWire(stage: Konva.Stage, layer: Konva.Layer, sizeCell: number, calback: (pointStart: Point, pointEnd: Point, line: Konva.Line) => void): void {
        isDrawWire = true;
        pointStart= alignPoint(getCursorPosition(stage), sizeCell);

        animation = getAnimation(stage, layer, sizeCell).start();

        stage.off('contentClick');
        stage.on('contentClick', () => {
            stop(stage, layer, sizeCell);
            calback(pointStart, pointEnd, line);
            line = null;
        });       
    }

    function stop(stage: Konva.Stage, layer: Konva.Layer, sizeCell: number) {
        stage.off('contentClick');  
        animation.stop();
        isDrawWire = false;
        animation = null;
    }

    function getAnimation(stage: Konva.Stage, layer: Konva.Layer, sizeCell: number): Konva.Animation {
        return new Konva.Animation(() => {
            pointEnd = alignPoint(getEndPoint(stage), sizeCell);

            redrawLine(layer, pointEnd);
        }, layer);
    }

    function redrawLine(layer: Konva.Layer, endPoint: Point): void {
        if (line)
            line.remove();

        line = helpers.getLine(pointStart.x, pointStart.y, endPoint.x, endPoint.y, 'black');

        layer.add(line);
    }

    function getEndPoint(stage: Konva.Stage): Point {
        var cursorPosition = getCursorPosition(stage);

        return cursorPosition.getClosestPoint(
            new Point(pointStart.x, cursorPosition.y),
            new Point(cursorPosition.x, pointStart.y)
        );
    }

    export function alignPoint(point: Point, sizeCell: number): Point {
        return point.getClosestPoint(
            getAllignedPointToLeftTop(point, sizeCell),
            new schem.Point(getAllignedPointToLeftTop(point, sizeCell).x + sizeCell, getAllignedPointToLeftTop(point, sizeCell).y),
            new schem.Point(getAllignedPointToLeftTop(point, sizeCell).x, getAllignedPointToLeftTop(point, sizeCell).y + sizeCell),
            new schem.Point(getAllignedPointToLeftTop(point, sizeCell).x + sizeCell, getAllignedPointToLeftTop(point, sizeCell).y + sizeCell)
        );
    }

    function getAllignedPointToLeftTop(point: schem.Point, sizeCell: number): schem.Point {
        return new schem.Point(point.x - point.x % sizeCell, point.y - point.y % sizeCell);
    }

    function getCursorPosition(stage: Konva.Stage): Point {
        resetCursorPosition(stage);
        return cursorPosition;
    }

    function resetCursorPosition(stage: Konva.Stage): void {
        if (stage.getPointerPosition())
            cursorPosition = new Point(stage.getPointerPosition().x, stage.getPointerPosition().y);
    }
}