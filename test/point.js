import { expect } from 'chai';
import Point from '@/lib/geometry/point';

describe("point.js", () => {
    it("Point has coordinates from constructor", () => {
        const point = new Point(12.5, -14);
        expect(point.x).to.equal(12.5);
        expect(point.y).to.equal(-14);
    });

    it("Point negative()", () => {
        const point = new Point(10, 10);
        const neg = point.negative();

        expect(neg.x).to.equal(-10);
        expect(neg.y).to.equal(-10);
    });

    it("Point scale()", () => {
        const point = new Point(10, 10);
        const scaled = point.scale(3);

        expect(scaled.x).to.equal(30);
        expect(scaled.y).to.equal(30);
    });

    it("Point translate()", () => {
        const point = new Point(10, 10);

        const point1 = point.translate([1, -2]);
        expect(point1.x).to.equal(11);
        expect(point1.y).to.equal(8);

        const point2 = point.translate({ x : 9, y : 1 });
        expect(point2.x).to.equal(19);
        expect(point2.y).to.equal(11);

        const point3 = point.translate(new Point(-3, -4));
        expect(point3.x).to.equal(7);
        expect(point3.y).to.equal(6);

        const point4 = point.translate(10);
        expect(point4.x).to.equal(20);
        expect(point4.y).to.equal(20);

        const point5 = point.translate(5, 0);
        expect(point5.x).to.equal(15);
        expect(point5.y).to.equal(10);

        const point6 = point.translate(5, Math.PI / 2);
        expect(point6.x).to.equal(10);
        expect(point6.y).to.equal(15);
    });

    it("Point toMatrix()", () => {
        const point = new Point(15, -3);
        const matrix = point.toMatrix();

        expect(matrix.valueAt(0, 0)).to.equal(15);
        expect(matrix.valueAt(1, 0)).to.equal(-3);
    });

    it("Point rotate()", () => {
        const point = new Point(15, -3);
        const rotated = point.rotate(Math.PI / 2);

        expect(rotated.xto6).to.equal(3);
        expect(rotated.yto6).to.equal(15);
    });

    it("Point reflectX()", () => {
        const point = new Point(1, 25);
        const reflected = point.reflectX();

        expect(reflected.x).to.equal(1);
        expect(reflected.y).to.equal(-25);
    });

    it("Point reflectY()", () => {
        const point = new Point(-80, 19);
        const reflected = point.reflectY();

        expect(reflected.x).to.equal(80);
        expect(reflected.y).to.equal(19);
    });

    it("Point static method 'origin' returns (0, 0)", () => {
        const point = Point.origin();
        expect(point.x).to.equal(0);
        expect(point.y).to.equal(0);
    });
});
