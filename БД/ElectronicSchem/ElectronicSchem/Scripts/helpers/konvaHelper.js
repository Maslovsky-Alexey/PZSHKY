var helpers;
(function (helpers) {
    function getComponentToKonvaElementAsync(component, sizeCell, callback) {
        var group = new Konva.Group();
        setProperties(group, sizeCell, component);
        var konvaImage = createKonvaImage(component, sizeCell);
        group.add(konvaImage);
        var outputs = addOutputsToGroup(group, component, sizeCell);
        var image = new Image();
        image.onload = function () { return imageLoaded(group, outputs, konvaImage, image, callback); };
        image.src = component.url;
    }
    helpers.getComponentToKonvaElementAsync = getComponentToKonvaElementAsync;
    function setProperties(group, sizeCell, component) {
        group.width(component.width * sizeCell);
        group.height(component.height * sizeCell);
        group.x((component.positionx == null ? 2 : component.positionx) * sizeCell);
        group.y((component.positiony == null ? 2 : component.positiony) * sizeCell);
        group.offsetX(group.width() / component.width);
        group.offsetY(group.height() / component.height);
        group.rotate(component.rotation - group.rotation());
        group.draggable(true);
    }
    function addOutputsToGroup(group, component, sizeCell) {
        var outputs = new Array();
        component.inputs.forEach(function (item, index, array) {
            var rect = getRect(item.x * sizeCell - 2, item.y * sizeCell - 2, 4, 4, 'black');
            rect.fill(item.color);
            group.add(rect);
            outputs.push(rect);
        });
        return outputs;
    }
    function createKonvaImage(component, sizeCell) {
        return new Konva.Image({
            x: 0,
            y: 0,
            image: null,
            width: component.width * sizeCell,
            height: component.height * sizeCell
        });
    }
    function imageLoaded(group, outputs, konvaImage, imageObj, callback) {
        konvaImage.image(imageObj);
        var result = new KonvaComponentGroup();
        result.image = konvaImage;
        result.outputs = outputs;
        result.group = group;
        callback(result);
    }
    function getLinePoints(line) {
        if (!line)
            return null;
        return [
            new schem.Point(line.getAttr('points')[0], line.getAttr('points')[1]),
            new schem.Point(line.getAttr('points')[2], line.getAttr('points')[3])
        ];
    }
    helpers.getLinePoints = getLinePoints;
    function getRect(left, top, w, h, color) {
        return new Konva.Rect({
            x: left,
            y: top,
            width: w,
            height: h,
            stroke: color,
            strokeWidth: 0.4
        });
    }
    helpers.getRect = getRect;
    function getLine(x1, y1, x2, y2, color) {
        return new Konva.Line({
            x: 0,
            y: 0,
            points: [x1, y1, x2, y2],
            stroke: color,
            tension: 1
        });
    }
    helpers.getLine = getLine;
    var KonvaComponentGroup = (function () {
        function KonvaComponentGroup() {
            this.outputs = new Array();
        }
        return KonvaComponentGroup;
    }());
    helpers.KonvaComponentGroup = KonvaComponentGroup;
})(helpers || (helpers = {}));
//rect.on('mouseenter', () => {
//    rect.fill('white');
//    rect.draw();
//});
//rect.on('mouseleave', () => {
//    rect.fill('black');
//    rect.draw();
//}); 
//# sourceMappingURL=konvaHelper.js.map