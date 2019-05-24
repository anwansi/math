class Matrix {
    constructor(elements) {
        this.elements = elements || [];
    }

    get rowCount() {
        return this.elements.length;
    }

    get columnCount() {
        return this.elements[0].length;
    }

    get determinant() {
        if ((this.rowCount == 2) && (this.columnCount == 2)) {
            return (this.valueAt(0, 0) * this.valueAt(1, 1))
                 - (this.valueAt(0, 1) * this.valueAt(1, 0));
        }

        throw Error("Determinant not yet implemented for this size matrix")
    }

    valueAt(row, col) {
        return this.elements[row][col];
    }

    add(matrix) {
        const rowCt = this.rowCount;
        const colCt = this.columnCount;
        const mRowCt = matrix.rowCount;
        const mColCt = matrix.columnCount;

        if ((rowCt != mRowCt) || (colCt != mColCt)) {
            throw Error(
                `Can't add ${rowCt}x${colCt} matrix to ` +
                `${mRowCt}x${mColCt} matrix`
            );
        }

        const elements = [];
        for (let r = 0; r < rowCt; r++) {
            elements[r] = [];
            for (let c = 0; c < colCt; c++) {
                elements[r][c] = this.valueAt(r, c) + matrix.valueAt(r, c);
            }
        }

        return new Matrix(elements);
    }

    scale(amount) {
        const elements = [];

        const rowCt = this.rowCount;
        const colCt = this.columnCount;

        for (let r = 0; r < rowCt; r++) {
            elements[r] = [];
            for (let c = 0; c < colCt; c++) {
                elements[r][c] = this.valueAt(r, c) * amount;
            }
        }

        return new Matrix(elements);
    }

    multiply(matrix) {
        const rowCt = this.rowCount;
        const colCt = this.columnCount;
        const mRowCt = matrix.rowCount;
        const mColCt = matrix.columnCount;

        if (colCt != mRowCt) {
            throw Error(
                `Can't multiply ${rowCt}x${colCt} matrix by ` +
                `${mRowCt}x${mColCt} matrix`
            );
        }

        const elements = [];

        for (let r = 0; r < rowCt; r++) {
            elements[r] = [];
            for (let c = 0; c < mColCt; c++) {
                let value = 0;
                for (let i = 0; i < colCt; i++) {
                    value += this.valueAt(r, i) * matrix.valueAt(i, c);
                }
                elements[r][c] = value;
            }
        }

        return new Matrix(elements);
    }

    inverse() {
        try {
            const determ = this.determinant;
            if (determ == 0) {
                throw Error("Can't invert this matrix");
            }

            const adjoint = new Matrix([
                [   this.valueAt(1, 1), - this.valueAt(0, 1) ],
                [ - this.valueAt(1, 0),   this.valueAt(0, 0) ]
            ]);

            return adjoint.scale(1 / determ);
        } catch(e) {
            throw e;
        }
    }

    static identity2d() {
        return new Matrix([[1, 0], [0, 1]]);
    }

    static rotation(angle) {
        const cosAng = Math.cos(angle);
        const sinAng = Math.sin(angle);
        return new Matrix([[cosAng, -sinAng], [sinAng, cosAng]]);
    }
}

export default Matrix;
