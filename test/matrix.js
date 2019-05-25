import { expect } from 'chai';
import Matrix from '@/lib/algebra/matrix';

describe("matrix.js", () => {
    it("Matrix construction and access", () => {
        const matrix = new Matrix([
            [1,  2,  3,  4],
            [5,  6,  7,  8],
            [9, 10, 11, 12]
        ]);

        expect(matrix.valueAt(0, 0)).to.equal(1);
        expect(matrix.valueAt(0, 2)).to.equal(3);
        expect(matrix.valueAt(1, 3)).to.equal(8);
        expect(matrix.valueAt(2, 3)).to.equal(12);
    });

    it("Matrix dimension counts", () => {
        const matrix = new Matrix([
            [1,  2,  3,  4],
            [5,  6,  7,  8],
            [9, 10, 11, 12]
        ]);

        expect(matrix.rowCount).to.equal(3);
        expect(matrix.columnCount).to.equal(4);
    });

    it("Matrix add()", () => {
        const matrix1 = new Matrix([
            [1,  2,  3,  4],
            [5,  6,  7,  8],
            [9, 10, 11, 12]
        ]);

        let matrix2 = new Matrix([
            [1,  2,  3],
            [5,  6,  7],
            [9, 10, 11]
        ]);
        expect(() => matrix1.add(matrix2)).to.throw();

        matrix2 = new Matrix([
            [ 1,  2,  3,  4],
            [ 5,  6,  7,  8],
            [ 9, 10, 11, 12],
            [13, 14, 15, 16]
        ]);
        expect(() => matrix1.add(matrix2)).to.throw();

        matrix2 = new Matrix([
            [1,  2,  3,  4],
            [5,  6,  7,  8],
            [9, 10, 11, 12]
        ]);
        expect(() => matrix1.add(matrix2)).to.not.throw();

        const sum = matrix1.add(matrix2);
        expect(sum.valueAt(0, 0)).to.equal(2);
        expect(sum.valueAt(0, 3)).to.equal(8);
        expect(sum.valueAt(2, 3)).to.equal(24);
        expect(sum.valueAt(2, 0)).to.equal(18);
    });

    it("Matrix multiply()", () => {
        const matrix1 = new Matrix([
            [1,  2,  3,  4],
            [5,  6,  7,  8],
            [9, 10, 11, 12]
        ]);

        let matrix2 = new Matrix([
            [1,  2],
            [5,  6],
            [9, 10]
        ]);
        expect(() => matrix1.multiply(matrix2)).to.throw();

        matrix2 = new Matrix([
            [1],
            [2],
            [3],
            [4]
        ]);
        expect(() => matrix1.multiply(matrix2)).to.not.throw();

        const product = matrix1.multiply(matrix2);
        expect(product.valueAt(0, 0)).to.equal(30);
        expect(product.valueAt(1, 0)).to.equal(70);
        expect(product.valueAt(2, 0)).to.equal(110);
    });

    it("Matrix scale()", () => {
        const matrix = new Matrix([
            [ 2,  4,  6,  8],
            [10, 12, 14, 16]
        ]);

        let scaled = matrix.scale(0.5);

        expect(scaled.valueAt(0, 0)).to.equal(1);
        expect(scaled.valueAt(0, 1)).to.equal(2);
        expect(scaled.valueAt(0, 2)).to.equal(3);
        expect(scaled.valueAt(0, 3)).to.equal(4);
        expect(scaled.valueAt(1, 0)).to.equal(5);
        expect(scaled.valueAt(1, 1)).to.equal(6);
        expect(scaled.valueAt(1, 2)).to.equal(7);
        expect(scaled.valueAt(1, 3)).to.equal(8);
    });

    it("Matrix determinant()", () => {
        const matrix = new Matrix([
            [ 2, 4],
            [-3, 1]
        ]);

        expect(matrix.determinant).to.equal(14);
    });

    it("Matrix inverse()", () => {
        const matrix = new Matrix([
            [ 2, -1],
            [-3, 1]
        ]);

        const inverse = matrix.inverse();

        expect(inverse.valueAt(0, 0)).to.equal(-1);
        expect(inverse.valueAt(0, 1)).to.equal(-1);
        expect(inverse.valueAt(1, 0)).to.equal(-3);
        expect(inverse.valueAt(1, 1)).to.equal(-2);
    });

    it("Matrix static identity2d()", () => {
        const matrix = Matrix.identity2d();

        expect(matrix.rowCount).to.equal(2);
        expect(matrix.columnCount).to.equal(2);
        expect(matrix.valueAt(0, 0)).to.equal(1);
        expect(matrix.valueAt(1, 1)).to.equal(1);
        expect(matrix.valueAt(0, 1)).to.equal(0);
        expect(matrix.valueAt(1, 0)).to.equal(0);
    });

    it("Matrix static rotation()", () => {
        let angle = Math.PI / 4;
        const matrix = Matrix.rotation(angle);

        expect(matrix.valueAt(0, 0)).to.equal(Math.cos(angle));
        expect(matrix.valueAt(1, 1)).to.equal(Math.cos(angle));
        expect(matrix.valueAt(0, 1)).to.equal(-Math.sin(angle));
        expect(matrix.valueAt(1, 0)).to.equal(Math.sin(angle));
    });
});
