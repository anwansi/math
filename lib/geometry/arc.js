import Matrix from '../algebra/matrix';
import Point from './point';

class Arc {
    constructor(startPoint, endPoint, radius, xRotation, large, sweep) {
        this.points = [startPoint, endPoint];
        this.r = radius;
        this.xrot = xRotation;
        this.large = large;
        this.sweep = sweep;

        this.posnCalc = null;
    }

    get startPoint() {
        return this.points[0];
    }

    get endPoint() {
        return this.points[1];
    }

    get radius() {
        return this.r;
    }

    get normalizeRadius() {
        let normalized = [];
        if (Array.isArray(this.radius)) {
            normalized = this.radius.slice();
        } else if (typeof this.radius == 'object') {
            normalized = [this.radius.x, this.radius.y];
        } else {
            normalized = [this.radius, this.radius];
        }

        return normalized;
    }

    get length() {
        const radii = this.normalizeRadius;

        if (radii[0] == radii[1]) {
            const radius = radii[0];
            const chord = Math.sqrt(
                ((this.endPoint.x - this.startPoint.x) ** 2) +
                ((this.endPoint.y - this.startPoint.y) ** 2)
            );

            if (chord >= 0.999 * 2 * radius) {
                return Math.PI * radius;
            }
            const alpha = (chord ** 2) / (radius ** 2)
            const angle = Math.acos(1 - alpha / 2);
            const circ  = 2 * Math.PI * radius;

            let part  = (1 - angle / 2 / Math.PI);
            if (this.large) {
                part = Math.max(part, 1 - part);
            } else {
                part = Math.min(part, 1 - part);
            }
            return circ * part;
        }
    }

    parameterize(t) {
        // Given start/end points, large arc flag, sweep flag, x-axis rotation,
        // x-radius, and y-radius, compute parameterized position along arc

        // Implementation guided by
        // https://www.w3.org/TR/SVG/implnote.html#ArcConversionEndpointToCenter
        const x1  = this.startPoint.x,
              y1  = this.startPoint.y,
              x2  = this.endPoint.x,
              y2  = this.endPoint.y;

        if (x1 == x2 && y1 == y2) {
            return new Point(x1, y1);
        }

        if (t == 0) {
            return new Point(x1, y1);
        }

        if (t == 1) {
            return new Point(x2, y2);
        }

        const radii = this.normalizeRadius;
        if (radii[0] == 0 || radii[1] == 0) {
            return new Point(t * (x2 - x1), t * (y2 - y1));
        }

        const posnVars = this.positionVars();

        const startAngle = posnVars.startAngle;
        const sweepAngle = posnVars.sweepAngle;
        const rx         = posnVars.xRadius;
        const ry         = posnVars.yRadius;
        const axisRot    = posnVars.xRotMatrix;
        const ctrPt      = posnVars.centerPoint;

        const angle = startAngle + sweepAngle * t;

        const posA = new Matrix([
            [rx * Math.cos(angle)],
            [ry * Math.sin(angle)]
        ]);
        const posFinal = axisRot.multiply(posA).add(ctrPt);
        return new Point( posFinal.valueAt(0, 0), posFinal.valueAt(1, 0) );
    }

    positionVars() {
        if (! this.posnCalc) {
            this.posnCalc = this.calcPosnVars();
        }

        return this.posnCalc;
    }

    calcPosnVars() {
        const degToRads = Math.PI / 180;

        const radii = this.normalizeRadius;

        const x1  = this.startPoint.x,
              y1  = this.startPoint.y,
              x2  = this.endPoint.x,
              y2  = this.endPoint.y,
              rot = (this.xrot || 0) * degToRads,
              lrg = !! this.large,
              swp = !! this.sweep;

        let rx  = Math.abs(radii[0]),
            ry  = Math.abs(radii[1]);

        const midPt = new Matrix([
            [(x1 + x2) / 2],
            [(y1 + y2) / 2]
        ]);

        const deltaX = x2 - x1;
        const deltaY = y2 - y1;

        const axisRot1 = new Matrix([
            [Math.cos(rot), Math.sin(rot)],
            [- Math.sin(rot), Math.cos(rot)]
        ]);
        const axisRot2 = new Matrix([
            [Math.cos(rot), - Math.sin(rot)],
            [Math.sin(rot), Math.cos(rot)]
        ]);

        // Compute midpoint
        const midVec = new Matrix([
            [-deltaX / 2],
            [-deltaY / 2]
        ]);
        const ptPrm  = axisRot1.multiply(midVec);
        const ptPrmX = ptPrm.valueAt(0, 0);
        const ptPrmY = ptPrm.valueAt(1, 0);
        const ptPrmX2 = Math.pow(ptPrmX, 2);
        const ptPrmY2 = Math.pow(ptPrmY, 2);

        const check = ptPrmX2 / Math.pow(rx, 2) + ptPrmY2 / Math.pow(ry, 2);
        if (check > 1) {
            const checkRoot = Math.sqrt(check);
            rx = rx * checkRoot;
            ry = ry * checkRoot;
        }

        // Compute center prime
        const rx2 = Math.pow(rx, 2);
        const ry2 = Math.pow(ry, 2);

        const flags  = (swp == lrg);

        let ctrPrm = new Matrix([
            [rx * ptPrmY / ry],
            [-ry * ptPrmX / rx]
        ]);
        let mag = Math.max(
            (rx2 * ry2 - rx2 * ptPrmX2 - ry2 * ptPrmY2) /
            (rx2 * ptPrmY2 + ry2 * ptPrmX2),
            0
        );

        let scale = Math.sqrt(mag);
        if (flags) {
            scale *= -1;
        }

        ctrPrm = ctrPrm.scale(scale);

        const ctrPrmX = ctrPrm.valueAt(0, 0);
        const ctrPrmY = ctrPrm.valueAt(1, 0);


        // Compute center
        const ctrPt = axisRot2.multiply(ctrPrm).add(midPt);

        // Compute angles
        const startAngle = (new Point(1, 0)).angleTo(
            new Point((ptPrmX - ctrPrmX) / rx, (ptPrmY - ctrPrmY) / ry)
        );
        const sweepAngle = (
            new Point( (ptPrmX - ctrPrmX) / rx,   (ptPrmY - ctrPrmY) / ry )
        ).angleTo(
            new Point( (- ptPrmX - ctrPrmX) / rx, (- ptPrmY - ctrPrmY) / ry )
        );

        if (swp) {
            if (sweepAngle < 0) {
                sweepAngle += (2 * Math.PI);
            }
        } else {
            if (sweepAngle > 0) {
                sweepAngle -= (2 * Math.PI);
            }
        }

        return {
            startAngle  : startAngle,
            sweepAngle  : sweepAngle,
            xRadius     : rx,
            yRadius     : ry,
            xRotMatrix  : axisRot2,
            centerPoint : ctrPt
        }
    }

    svgPath(start) {
        const radii = this.normalizeRadius;
        const path = '';

        if (start) {
            path += `M ${this.startPoint.x} ${this.startPoint.y} `;
        }

        path += `A ${radii[0]} ${radii[1]} ${this.xrot} ` +
                `${this.large ? '1' : '0'} ${this.sweep ? '1' : '0'} ` +
                `${this.endPoint.x} ${this.endPoint.y} `;

        return path;
    }
}

export default Arc;
