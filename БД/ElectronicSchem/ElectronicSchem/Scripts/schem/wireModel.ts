module schem {
    export class WireModel{

        public x1: number;
        public y1: number;

        public x2: number;
        public y2: number;

        public constructor(point1: Point, point2: Point) {
            this.x1 = point1.x;
            this.y1 = point1.y;

            this.x2 = point2.x;
            this.y2 = point2.y;
        }
    }

    export class Point {
        public x: number;
        public y: number;

        public constructor(x: number = 0, y: number = 0) {
            this.x = x;
            this.y = y;
        }

        public getClosestPoint(...points: Array<Point>): Point {
            var distances = new Array<number>();

            points.forEach((item, index, array) => distances.push(this.getDistanceToPoint(item)));

            return points[distances.indexOf(Math.min.apply(null, distances))];
        }

        private getDistanceToPoint(point: Point): number {
            return Math.sqrt(Math.pow(this.x - point.x, 2) + Math.pow(this.y - point.y, 2));
        }

        public getIntPoint(): Point {
            return new Point(Math.round(this.x), Math.round(this.y)); 
        }
    }
}