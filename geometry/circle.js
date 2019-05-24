import Point from './point';

class Circle {
    constructor(...args) {
        if (args.length == 3) {
            this.center = new Point(args[0], args[1]);
            this.r = args[2];
        } else if (args.length == 2) {
            this.center = args[0];
            this.r = args[1];
        }
    }

    get radius() {
        return this.r;
    }

    get centerPoint() {
        return this.center;
    }

    translate(...args) {
        const delta = Circle.pointDelta(...args);

        return new Circle(this.centerPoint.translate(delta), this.radius);
    }

    static pointDelta(...args) {
        return Point.delta(...args);
    }
}

export default Circle;
