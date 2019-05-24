import { expect } from 'chai';
import Circle from '@/geometry/circle';
import Point from '@/geometry/point';

describe('circle.js', () => {
    it('Circle translate', () => {
        const circle = new Circle(Point.origin(), 10);
        const moved = circle.translate([5, 17]);

        expect(moved.centerPoint.x).to.equal(5);
        expect(moved.centerPoint.y).to.equal(17);
        expect(moved.radius).to.equal(10);
    });
});
