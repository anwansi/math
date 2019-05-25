import Matrix from '../algebra/matrix';

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    get xto6() {
        // Mostly for testing floating point values
        return parseFloat(this.x.toFixed(6));
    }

    get yto6() {
        // Mostly for testing floating point values
        return parseFloat(this.y.toFixed(6));
    }

    copy() {
        return new Point(this.x, this.y);
    }

    negative() {
        return new Point(-this.x, -this.y);
    }

    scale(amount) {
        return new Point(this.x * amount, this.y * amount);
    }

    translate(...args) {
        const delta = Point.delta(...args);

        return new Point(this.x + delta.x, this.y + delta.y);
    }

    toMatrix() {
        return new Matrix([[this.x], [this.y]]);
    }

    rotate(angle) {
        const rotation = Matrix.rotation(angle);
        const coords = rotation.multiply(this.toMatrix());
        return new Point(coords.valueAt(0, 0), coords.valueAt(1, 0));
    }

    reflectX() {
        return new Point(this.x, - this.y);
    }

    reflectY() {
        return new Point(- this.x, this.y);
    }

    angleTo(point) {
        const x1 = this.x;
        const y1 = this.y;
        const x2 = point.x;
        const y2 = point.y;

        const dotProd = x1 * x2 + y1 * y2;
        const magProd = Math.sqrt(
            ((x1 ** 2) + (y1 ** 2)) * ((x2 ** 2) + (y2 ** 2))
        );

        let angle = Math.acos(dotProd / magProd);
        if ((x1 * y2) - (y1 * x2) < 0) {
            angle *= -1;
        }

        return angle;
    }

    static origin() {
        return new Point(0, 0);
    }

    static delta(...args) {
        let deltaX = 0;
        let deltaY = 0;

        if (args.length === 1) {
            if (Array.isArray(args[0])) {
                [deltaX, deltaY] = [...args[0]];
            } else if (typeof args[0] === "object") {
                // Assume object literal or Point object
                deltaX = args[0].x;
                deltaY = args[0].y;
            } else {
                const argNum = parseFloat(args[0]);
                if (!Number.isNaN(argNum)) {
                    deltaX = argNum;
                    deltaY = argNum;
                }
            }
        } else if (args.length) {
            const distance = parseFloat(args[0]);
            const angle = parseFloat(args[1]);

            if (!Number.isNaN(distance) && !Number.isNaN(angle)) {
                deltaX = distance * Math.cos(angle);
                deltaY = distance * Math.sin(angle);
            }
        }

        return new Point(deltaX, deltaY);
    }
}

export default Point;
