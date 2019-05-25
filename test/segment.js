import { expect } from 'chai';
import Circle from '@/lib/geometry/circle';
import Point from '@/lib/geometry/point';
import Segment from '@/lib/geometry/segment';

describe('segment.js', () => {
    it('Segment magnitude', () => {
        const point1 = Point.origin();
        const point2 = new Point(5, 12);

        const segment = new Segment(point1, point2);

        expect(segment.magnitude).to.equal(13);
    });

    it('Segment angle', () => {
        const point1 = Point.origin();

        let point2 = new Point(10, 0);
        let segment = new Segment(point1, point2);

        expect(segment.angle).to.equal(0);
        expect(segment.angleInDegrees).to.equal(0);

        point2 = new Point(-10, 10);
        segment = new Segment(point1, point2);

        expect(segment.angle).to.equal(3 * Math.PI / 4);
        expect(segment.angleInDegrees).to.equal(135);
    });

    it('Segment parameterize()', () => {
        const point1 = Point.origin();
        const point2 = new Point(2, 12);
        const segment = new Segment(point1, point2);

        const quarterPt = segment.parameterize(0.25);

        expect(quarterPt.xto6).to.equal(0.5);
        expect(quarterPt.yto6).to.equal(3);
    });

    it('Segment scale()', () => {
        const point1 = new Point(18, -7);
        const point2 = new Point(2, 12);
        const segment = new Segment(point1, point2);

        const scaled = segment.scale(0.5);

        expect(scaled.startPoint.xto6).to.equal(9);
        expect(scaled.startPoint.yto6).to.equal(-3.5);
        expect(scaled.endPoint.xto6).to.equal(1);
        expect(scaled.endPoint.yto6).to.equal(6);
    });

    it('Segment scaleTo()', () => {
        const point1 = new Point(18, -7);
        const point2 = new Point(2, 12);
        const segment = new Segment(point1, point2);

        const scaled = segment.scaleTo(3);

        expect(scaled.magnitude).to.equal(3);
        expect(scaled.startPoint.xto6).to.equal(2.173958);
        expect(scaled.startPoint.yto6).to.equal(-0.845428);
        expect(scaled.endPoint.xto6).to.equal(0.241551);
        expect(scaled.endPoint.yto6).to.equal(1.449305);
    });

    it('Segment slice()', () => {
        const point1 = Point.origin();
        const point2 = new Point(2, 12);
        const segment = new Segment(point1, point2);

        const slice = segment.slice(0.25, 0.75);

        expect(slice.startPoint.xto6).to.equal(0.5);
        expect(slice.startPoint.yto6).to.equal(3);
        expect(slice.endPoint.xto6).to.equal(1.5);
        expect(slice.endPoint.yto6).to.equal(9);
    });

    it('Segment translate()', () => {
        const point1 = Point.origin();
        const point2 = new Point(2, 12);
        const segment = new Segment(point1, point2);

        const segment1 = segment.translate([5, 5]);
        expect(segment1.startPoint.xto6).to.equal(5);
        expect(segment1.startPoint.yto6).to.equal(5);
        expect(segment1.endPoint.xto6).to.equal(7);
        expect(segment1.endPoint.yto6).to.equal(17);

        const segment2 = segment.translate({ x : 10, y : -10 });
        expect(segment2.startPoint.xto6).to.equal(10);
        expect(segment2.startPoint.yto6).to.equal(-10);
        expect(segment2.endPoint.xto6).to.equal(12);
        expect(segment2.endPoint.yto6).to.equal(2);

        const segment3 = segment.translate(-8);
        expect(segment3.startPoint.xto6).to.equal(-8);
        expect(segment3.startPoint.yto6).to.equal(-8);
        expect(segment3.endPoint.xto6).to.equal(-6);
        expect(segment3.endPoint.yto6).to.equal(4);

        const segment4 = segment.translate(1, 0);
        expect(segment4.startPoint.xto6).to.equal(1);
        expect(segment4.startPoint.yto6).to.equal(0);
        expect(segment4.endPoint.xto6).to.equal(3);
        expect(segment4.endPoint.yto6).to.equal(12);

        const segment5 = segment.translate(1, -Math.PI / 2);
        expect(segment5.startPoint.xto6).to.equal(0);
        expect(segment5.startPoint.yto6).to.equal(-1);
        expect(segment5.endPoint.xto6).to.equal(2);
        expect(segment5.endPoint.yto6).to.equal(11);

        const segment6 = segment.translate(1, Math.PI);
        expect(segment6.startPoint.xto6).to.equal(-1);
        expect(segment6.startPoint.yto6).to.equal(0);
        expect(segment6.endPoint.xto6).to.equal(1);
        expect(segment6.endPoint.yto6).to.equal(12);
    });

    it('Segment translateToOrigin()', () => {
        const point1 = new Point(-10, 65);
        const point2 = new Point(2, 12);
        const segment = new Segment(point1, point2);

        const trans = segment.translateToOrigin();
        expect(trans.startPoint.xto6).to.equal(0);
        expect(trans.startPoint.yto6).to.equal(0);
        expect(trans.endPoint.xto6).to.equal(12);
        expect(trans.endPoint.yto6).to.equal(-53);
    });

    it('Segment unit()', () => {
        const point1 = Point.origin();
        const point2 = new Point(3, 4);
        const segment = new Segment(point1, point2);

        const unit = segment.unit();
        expect(unit.magnitude).to.equal(1);
        expect(unit.endPoint.xto6).to.equal(0.6);
        expect(unit.endPoint.yto6).to.equal(0.8);
    });

    it('Segment reverse()', () => {
        const point1 = new Point(-67, 112);
        const point2 = new Point(34, -10);
        const segment = new Segment(point1, point2);

        const reversed = segment.reverse();

        expect(reversed.startPoint.xto6).to.equal(segment.endPoint.xto6);
        expect(reversed.startPoint.yto6).to.equal(segment.endPoint.yto6);
        expect(reversed.endPoint.xto6).to.equal(segment.startPoint.xto6);
        expect(reversed.endPoint.yto6).to.equal(segment.startPoint.yto6);
    });

    it('Segment lead()', () => {
        const point1 = new Point(-67, 112);
        const point2 = new Point(34, -10);
        const segment = new Segment(point1, point2);

        const segment1 = segment.lead(new Point(0, -10));

        expect(segment1.startPoint.xto6).to.equal(segment.endPoint.xto6);
        expect(segment1.startPoint.yto6).to.equal(segment.endPoint.yto6);
        expect(segment1.endPoint.xto6).to.equal(0);
        expect(segment1.endPoint.yto6).to.equal(-10);
    });

    it('Segment leadBy()', () => {
        const point1 = new Point(8, -16);
        const point2 = new Point(3, 3);
        const segment = new Segment(point1, point2);

        const segment1 = segment.leadBy([5, 5]);
        expect(segment1.startPoint.xto6).to.equal(3);
        expect(segment1.startPoint.yto6).to.equal(3);
        expect(segment1.endPoint.xto6).to.equal(8);
        expect(segment1.endPoint.yto6).to.equal(8);

        const segment2 = segment.leadBy({ x : 10, y : -10 });
        expect(segment2.startPoint.xto6).to.equal(3);
        expect(segment2.startPoint.yto6).to.equal(3);
        expect(segment2.endPoint.xto6).to.equal(13);
        expect(segment2.endPoint.yto6).to.equal(-7);

        const segment3 = segment.leadBy(-8);
        expect(segment3.startPoint.xto6).to.equal(3);
        expect(segment3.startPoint.yto6).to.equal(3);
        expect(segment3.endPoint.xto6).to.equal(-5);
        expect(segment3.endPoint.yto6).to.equal(-5);

        const segment4 = segment.leadBy(1, 0);
        expect(segment4.startPoint.xto6).to.equal(3);
        expect(segment4.startPoint.yto6).to.equal(3);
        expect(segment4.endPoint.xto6).to.equal(4);
        expect(segment4.endPoint.yto6).to.equal(3);

        const segment5 = segment.leadBy(1, -Math.PI / 2);
        expect(segment5.startPoint.xto6).to.equal(3);
        expect(segment5.startPoint.yto6).to.equal(3);
        expect(segment5.endPoint.xto6).to.equal(3);
        expect(segment5.endPoint.yto6).to.equal(2);

        const segment6 = segment.leadBy(1, Math.PI);
        expect(segment6.startPoint.xto6).to.equal(3);
        expect(segment6.startPoint.yto6).to.equal(3);
        expect(segment6.endPoint.xto6).to.equal(2);
        expect(segment6.endPoint.yto6).to.equal(3);
    });

    it('Segment rotate()', () => {
        const point1 = new Point(13, -9);
        const point2 = new Point(-1, 22);
        const segment = new Segment(point1, point2);

        let angle = Math.PI;
        let rotated = segment.rotate(angle);
        expect(rotated.startPoint.xto6).to.equal(-13);
        expect(rotated.startPoint.yto6).to.equal(9);
        expect(rotated.endPoint.xto6).to.equal(1);
        expect(rotated.endPoint.yto6).to.equal(-22);

        angle = Math.PI / 4;
        rotated = segment.rotate(angle);
        expect(rotated.startPoint.xto6).to.equal(
            parseFloat((13 * Math.cos(angle) + 9 * Math.sin(angle)).toFixed(6))
        );
        expect(rotated.startPoint.yto6).to.equal(
            parseFloat((13 * Math.sin(angle) - 9 * Math.cos(angle)).toFixed(6))
        );
        expect(rotated.endPoint.xto6).to.equal(
            parseFloat((-1 * Math.cos(angle) - 22 * Math.sin(angle)).toFixed(6))
        );
        expect(rotated.endPoint.yto6).to.equal(
            parseFloat((-1 * Math.cos(angle) + 22 * Math.sin(angle)).toFixed(6))
        );
    });

    it('Segment rotateAbout()', () => {
        const point1 = new Point(0, 0);
        const point2 = new Point(1, 1);
        const segment = new Segment(point1, point2);

        let angle = Math.PI / 4;
        let rotated = segment.rotateAbout(angle, [0, 0]);
        expect(rotated.startPoint.xto6).to.equal(0);
        expect(rotated.startPoint.yto6).to.equal(0);
        expect(rotated.endPoint.xto6).to.equal(0);
        expect(rotated.endPoint.yto6).to.equal(parseFloat(Math.sqrt(2).toFixed(6)));

        rotated = segment.rotateAbout(angle, [1, 1]);
        expect(rotated.startPoint.xto6).to.equal(1);
        expect(rotated.startPoint.yto6).to.equal(parseFloat((1 - Math.sqrt(2)).toFixed(6)));
        expect(rotated.endPoint.xto6).to.equal(1);
        expect(rotated.endPoint.yto6).to.equal(1);
    });

    it('Segment add()', () => {
        const point1 = new Point(12, -3);
        const point2 = new Point(2, 2);
        const segment1 = new Segment(point1, point2);

        const point3 = new Point(1, 1);
        const point4 = new Point(5, 10);
        const segment2 = new Segment(point3, point4);

        const segment3 = segment1.add(segment2);
        expect(segment3.startPoint.x).to.equal(12);
        expect(segment3.startPoint.y).to.equal(-3);
        expect(segment3.endPoint.x).to.equal(6);
        expect(segment3.endPoint.y).to.equal(11);
    });

    it('Segment subtract()', () => {
        const point1 = new Point(12, -3);
        const point2 = new Point(2, 2);
        const segment1 = new Segment(point1, point2);

        const point3 = new Point(1, 1);
        const point4 = new Point(5, 10);
        const segment2 = new Segment(point3, point4);

        const segment3 = segment1.subtract(segment2);
        expect(segment3.startPoint.x).to.equal(12);
        expect(segment3.startPoint.y).to.equal(-3);
        expect(segment3.endPoint.x).to.equal(-2);
        expect(segment3.endPoint.y).to.equal(-7);
    });

    it('Segment dot()', () => {
        const point1 = new Point(2, 17);
        const point2 = new Point(12, -32);
        const segment1 = new Segment(point1, point2);

        const point3 = new Point(-6, 3);
        const point4 = new Point(19, 5);
        const segment2 = new Segment(point3, point4);

        expect(segment1.dot(segment2)).to.equal(152);
    });

    it('Segment crossZ()', () => {
        const point1 = new Point(2, 17);
        const point2 = new Point(12, -32);
        const segment1 = new Segment(point1, point2);

        const point3 = new Point(-6, 3);
        const point4 = new Point(19, 5);
        const segment2 = new Segment(point3, point4);

        expect(segment1.crossZ(segment2)).to.equal(1245);
    });

    it('Segment reflectX()', () => {
        const point1 = new Point(19, -62);
        const point2 = new Point(90, 1);
        const segment = new Segment(point1, point2);

        const reflected = segment.reflectX();

        expect(reflected.startPoint.x).to.equal(19);
        expect(reflected.startPoint.y).to.equal(62);
        expect(reflected.endPoint.x).to.equal(90);
        expect(reflected.endPoint.y).to.equal(-1);
    });

    it('Segment reflectY()', () => {
        const point1 = new Point(-84, -141);
        const point2 = new Point(17, -56);
        const segment = new Segment(point1, point2);

        const reflected = segment.reflectY();

        expect(reflected.startPoint.x).to.equal(84);
        expect(reflected.startPoint.y).to.equal(-141);
        expect(reflected.endPoint.x).to.equal(-17);
        expect(reflected.endPoint.y).to.equal(-56);
    });

    it('Segment reflectAbout()', () => {
        const point1 = new Point(1, 0);
        const point2 = new Point(2, 0);
        const segment = new Segment(point1, point2);

        const axis = new Segment(new Point(0, 0), new Point(1, 1));

        const reflected = segment.reflectAbout(axis);

        expect(reflected.startPoint.xto6).to.equal(0);
        expect(reflected.startPoint.yto6).to.equal(1);
        expect(reflected.endPoint.xto6).to.equal(0);
        expect(reflected.endPoint.yto6).to.equal(2);
    });

    it('Segment projectIntersection() with segment', () => {
        const segment1 = new Segment(new Point(-2, 0), new Point(-1, 1));
        const segment2 = new Segment(new Point(4, 0), new Point(2, 1));

        let projected = segment1.projectIntersection(segment2);
        expect(projected.xto6).to.equal(0);
        expect(projected.yto6).to.equal(2);

        projected = segment2.projectIntersection(segment1);
        expect(projected.xto6).to.equal(0);
        expect(projected.yto6).to.equal(2);
    });

    it('Segment projectIntersection() with circle', () => {
        const segment = new Segment(new Point(1, 3), new Point(2, 2));
        const circle = new Circle(Point.origin(), 4);

        let projected = segment.projectIntersection(circle);
        expect(projected).to.have.lengthOf(2);

        const test1 =  projected.some((point) => {
            return ((point.x == 0) && (point.y == 4));
        });
        const test2 =  projected.some((point) => {
            return ((point.x == 4) && (point.y == 0));
        });

        expect(test1).to.equal(true);
        expect(test2).to.equal(true);
    });

    it('Segment delta()', () => {
        const point1 = new Point(2, 4);
        const point2 = new Point(6, 9);
        const segment = new Segment(point1, point2);

        const delta = segment.delta();
        expect(delta.x).to.equal(4);
        expect(delta.y).to.equal(5);
    });
});
