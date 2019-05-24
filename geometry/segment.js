import Matrix from '@/algebra/matrix';
import Circle from './circle';
import Point from './point';

class Segment {
    constructor(...points) {
        this.points = points;
    }

    get startPoint() {
        return this.points[0];
    }

    get endPoint() {
        return this.points[1];
    }

    get deltaX() {
        return this.endPoint.x - this.startPoint.x;
    }

    get deltaY() {
        return this.endPoint.y - this.startPoint.y;
    }

    get magnitude() {
        return Math.sqrt((this.deltaX ** 2) + (this.deltaY ** 2));
    }

    get angle() {
        return Math.atan2(this.deltaY, this.deltaX);
    }

    get angleInDegrees() {
        return this.angle * 180 / Math.PI;
    }

    scale(amount) {
        return new Segment(
            this.startPoint.scale(amount),
            this.endPoint.scale(amount)
        );
    }

    scaleTo(size) {
        return this.scale(size / this.magnitude);
    }

    parameterize(t) {
        return new Point(
            this.points[0].x + t * this.deltaX,
            this.points[0].y + t * this.deltaY
        );
    }

    slice(t1, t2) {
        return new Segment(this.parameterize(t1), this.parameterize(t2));
    }

    translate(...args) {
        return new Segment(
            this.startPoint.translate(...args),
            this.endPoint.translate(...args),
        );
    }

    translateToOrigin() {
        return this.translate(this.startPoint.negative());
    }

    unit() {
        const mag = this.magnitude;
        return this.translateToOrigin().scale(1 / mag);
    }

    reverse() {
        return new Segment(this.endPoint, this.startPoint);
    }

    lead(point) {
        return new Segment(this.endPoint, point);
    }

    leadBy(...args) {
        const point = this.endPoint;
        return new Segment(point, point.translate(...args));
    }

    rotate(angle) {
        return new Segment(
            this.startPoint.rotate(angle),
            this.endPoint.rotate(angle)
        );
    }

    rotateAbout(angle, ...args) {
        const move = Segment.pointDelta(...args);

        return this.translate(move.negative()).rotate(angle).translate(move);
    }

    add(segment) {
        return new Segment(
            this.startPoint, this.endPoint.translate(segment.delta())
        );
    }

    subtract(segment) {
        return this.add(segment.reverse());
    }

    vector() {
        return this.translateToOrigin();
    }

    dot(segment) {
        const point1 = this.vector().endPoint;
        const point2 = segment.vector().endPoint;

        return (point1.x * point2.x) + (point1.y * point2.y);
    }

    svgPath(start) {
        let path = '';

        if (start) {
            path += `M${this.startPoint.x},${this.startPoint.y}`;
        }
        path += `L${this.endPoint.x},${this.endPoint.y}`;

        return path;
    }

    crossZ(segment) {
        const point1 = this.vector().endPoint;
        const point2 = segment.vector().endPoint;


        return (point1.x * point2.y) - (point1.y * point2.x);
    }

    reflectX() {
        return new Segment(
            this.startPoint.reflectX(), this.endPoint.reflectX()
        );
    }

    reflectY() {
        return new Segment(
            this.startPoint.reflectY(), this.endPoint.reflectY()
        );
    }

    reflectAbout(segment) {
        // Using reference segments start point and angle, translate and rotate
        // this such that the reference segment would be lined up along the
        // X axis, apply reflectX, and then reverse the first translation and
        // rotation transformations
        const angle = segment.angle;
        const delta = segment.startPoint;

        return this.translate(delta.negative()).rotate(- angle).reflectX()
                   .rotate(angle).translate(delta);
    }

    projectIntersection(fragment) {
        if (fragment instanceof Segment) {
            const matrix = new Matrix([
                [
                    this.endPoint.x - this.startPoint.x,
                    fragment.startPoint.x - fragment.endPoint.x
                ],
                [
                    this.endPoint.y - this.startPoint.y,
                    fragment.startPoint.y - fragment.endPoint.y
                ]
            ]);

            const delta = Segment.pointDelta([
                fragment.startPoint.x - this.startPoint.x,
                fragment.startPoint.y - this.startPoint.y
            ]);

            if (matrix.determinant == 0) {
                return null;
            }

            const solved = matrix.inverse().multiply(delta.toMatrix());

            return this.parameterize(solved.valueAt(0, 0));
        }

        if (fragment instanceof Circle) {
            const ixPoints = [];

            const center = fragment.centerPoint;

            const startDeltaX = this.startPoint.x - center.x;
            const startDeltaY = this.startPoint.y - center.y;
            const endDeltaX = this.endPoint.x - center.x;
            const endDeltaY = this.endPoint.y - center.y;
            const deltaX = endDeltaX - startDeltaX;
            const deltaY = endDeltaY - startDeltaY;

            // Calculate discrimant (from quadratic equations)
            const a = (deltaX ** 2) + (deltaY ** 2);
            const b = 2 * (startDeltaX * deltaX + startDeltaY * deltaY);
            const c = (startDeltaX ** 2) + (startDeltaY ** 2)
                      - (fragment.radius ** 2);

            const discr = (b ** 2) - 4 * a * c;

            if (discr >= 0) {
                [-1, 1].forEach((sign) => {
                    const soln = ( - b + sign * Math.sqrt(discr) ) / (2 * a);
                    ixPoints.push(this.parameterize(soln));
                    return true;
                });
            }

            return ixPoints;
        }
    }

    delta() {
        return Segment.pointDelta(this.translateToOrigin().endPoint);
    }

    static pointDelta(...args) {
        return Point.delta(...args);
    }
}

export default Segment;
