module helpers {
    export function getComponentToKonvaElementAsync(component: Components.Component, sizeCell: number, callback: (result: KonvaComponentGroup) => void): void {
        var group = new Konva.Group();
        setProperties(group, sizeCell, component);


        var konvaImage = createKonvaImage(component, sizeCell);

        group.add(konvaImage);
        var outputs = addOutputsToGroup(group, component, sizeCell);

        var image = new Image();
        image.onload = () => imageLoaded(group, outputs, konvaImage, image, callback);

        image.src = component.url;
    }

    function setProperties(group: Konva.Group, sizeCell: number, component: Components.Component): void {
        group.width(component.width * sizeCell);
        group.height(component.height * sizeCell);

        group.x((component.positionx == null ? 2 : component.positionx) * sizeCell);
        group.y((component.positiony == null ? 2 : component.positiony) * sizeCell);

        group.offsetX(group.width() / component.width);
        group.offsetY(group.height() / component.height);

        group.rotate(component.rotation - group.rotation());

        group.draggable(true);
    }

    function addOutputsToGroup(group: Konva.Group, component: Components.Component, sizeCell: number): Array<Konva.Rect> {
        var outputs = new Array<Konva.Rect>();

        component.inputs.forEach((item, index, array) => {
            var rect = getRect(item.x * sizeCell - 2, item.y * sizeCell - 2, 4, 4, 'black');
            rect.fill(item.color);

            group.add(rect);
            outputs.push(rect);
        });

        return outputs;
    }

    function createKonvaImage(component: Components.Component, sizeCell: number): Konva.Image {
        return new Konva.Image({
            x: 0,
            y: 0,
            image: null,
            width: component.width * sizeCell,
            height: component.height * sizeCell
        });
    }

    function imageLoaded(group: Konva.Group, outputs: Array<Konva.Rect>, konvaImage: Konva.Image, imageObj: any, callback: (result: KonvaComponentGroup) => void) {
        konvaImage.image(imageObj);

        var result = new KonvaComponentGroup();
        result.image = konvaImage;

        result.outputs = outputs;
        result.group = group;

        callback(result);
    }

    export function getLinePoints(line: Konva.Line): Array<schem.Point> {
        if (!line)
            return null;

        return [
            new schem.Point(line.getAttr('points')[0], line.getAttr('points')[1]),
            new schem.Point(line.getAttr('points')[2], line.getAttr('points')[3])
        ];
    }

    export function getRect(left, top, w, h: number, color: string): Konva.Rect {
        return new Konva.Rect({
            x: left,
            y: top,
            width: w,
            height: h,
            stroke: color,
            strokeWidth: 0.4
        });
    }

    export function getLine(x1, y1, x2, y2: number, color: string): Konva.Line {
        return new Konva.Line({
            x: 0,
            y: 0,
            points: [x1, y1, x2, y2],
            stroke: color,
            tension: 1
        });
    }

    export class KonvaComponentGroup {
        public image: Konva.Image;
        public outputs: Konva.Rect[];
        public group: Konva.Group;

        public constructor() {
            this.outputs = new Array<Konva.Rect>();
        }
    }
}


//rect.on('mouseenter', () => {
//    rect.fill('white');
//    rect.draw();
//});

//rect.on('mouseleave', () => {
//    rect.fill('black');
//    rect.draw();
//});