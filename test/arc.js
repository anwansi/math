import { expect } from 'chai';
import Arc from '@/geometry/arc';
import Point from '@/geometry/point';

describe('arc.js', () => {
    console.log("TESTING");
    it('Arc length', () => {
        const arc = new Arc(
            new Point(10, 0), new Point(10, 24), 12, 0, true, true
        );

        expect(arc.length).to.equal(Math.PI * 12);
    });

    it('Arc parameterize()', () => {
        const arc = new Arc(
            new Point(10, 0), new Point(10, 24), 12, 0, true, true
        );

        const p1 = arc.parameterize(0);
        expect(p1.x).to.equal(10);
        expect(p1.y).to.equal(0);

        const p2 = arc.parameterize(0.5);
        expect(p2.x).to.equal(22);
        expect(p2.y).to.equal(12);

        const p3 = arc.parameterize(1);
        expect(p3.x).to.equal(10);
        expect(p3.y).to.equal(24);
    });
});
