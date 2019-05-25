/*

Supported Elements
-------------------------------------------------------------------

{
  type : 'move',
  x    : <FLOAT>,
  y    : <FLOAT>
},
{
  type : 'line',
  x    : <FLOAT>,
  y    : <FLOAT>
},
{
  type          : 'arc',
  x             : <FLOAT>,
  y             : <FLOAT>,
  xAxisRotation : <FLOAT>,
  radius        : <FLOAT> || [<FLOAT>, <FLOAT>] || { x : <FLOAT>, y : <FLOAT>},
  largeArc      : <BOOL>,
  sweepFlag     : <BOOL>
}

*/

export default class Path {
    constructor(elements) {
        this.updateElements(elements || []);
    }

    updateElements(elements) {
        // elements is an array of elements as described under "Supported
        // Elements" at the top of this package
        this.elements = elements;

        let last = null;
        this.elements.forEach((elem) => {
            let fig = null;
            if (last) {
                switch (elem.type) {
                    case 'line':
                        fig = new Segment(
                            [last.x, last.y], [elem.x, elem.y]
                        );
                        break;
                    case 'arc':
                        fig = new Arc(
                            last.x, last.y, elem.x, elem.y,
                            elem.radius, elem.xAxisRotation,
                            elem.largeArc, elem.sweepFlag
                        );
                        break;
                }
            }

            elem.figure = fig;

            last = elem;
        });
    }

    moveTo(pt) {
        let elems = (this.elements || []).slice();
        elems.push({
            type : 'move',
            x    : pt.x,
            y    : pt.y
        });

        this.updateElements(elems);
        return this;
    }

    lineTo(pt) {
        let elems = (this.elements || []).slice();
        elems.push({
            type : 'line',
            x    : pt.x,
            y    : pt.y
        });

        this.updateElements(elems);
        return this;
    }

    arcTo(pt, radius, rotX, large, sweep) {
        let elems = (this.elements || []).slice();
        elems.push({
            type          : 'arc',
            x             : pt.x,
            y             : pt.y,
            radius        : radius,
            xAxisRotation : rotX,
            largeArc      : large,
            sweepFlag     : sweep
        });

        this.updateElements(elems);
        return this;
    }

    plotParametric(t) {
        if (t < 0 || t > 1) {
            throw Error("Parameterized position is a function of t, " +
                        "where 0 < t < 1");
        }

        if (! this.elements.length) {
            throw Error("Incomplete path");
        }

        // First determine which element of the path is indicated by t
        const length = t * this.length();

        let elem       = this.elements[0];
        let curElemLen = this.elementLength(elem);
        let total      = curElemLen;
        let elemLength = 0;
        let elemScale  = 0;
        for (let i = 1; i < this.elements.length; i++) {
            if (total >= length) {
                break;
            }

            elem = this.elements[i];

            curElemLen = this.elementLength(elem);
            total += curElemLen;
        }

        elemLength = length - (total - curElemLen);
        elemScale  = elemLength / curElemLen;

        return {
            length          : length,
            element         : elem,
            elementLength   : elemLength,
            elementScale    : elemScale,
            pathLength      : this.length(),
            position        : this.elementPosition(elem, elemScale)
        };
    }

    plotSubPath(t1, t2) {
        if (! this.elements.length) {
            throw Error("Incomplete path");
        }

        let rev = false;
        if (t2 < t1) {
            rev = true;
            let tTemp = t1;
            t1 = t2;
            t2 = tTemp;
        }

        const iWraps = Math.ceil(t2);

        const length   = this.length();
        const length1  = t1 * length;
        const length2  = t2 * length;

        let total    = 0;
        let subElems = [];
        let done     = false;

        for (let j = 0; j < iWraps; j++) {
            for (let i = 0; i < this.elements.length; i++) {
                const elem       = this.elements[i];
                const elemLength = this.elementLength(elem);
                const newTotal   = total + elemLength;

                const startIn    = (length1 >= total && length1 <= newTotal);
                const endIn      = (length2 >= total && length2 <= newTotal);
                const whole      = (total > length1 && newTotal < length2)
                const startEndIn = startIn && endIn

                const elemT1 = (length1 - total) / elemLength;
                const elemT2 = (length2 - total) / elemLength;

                if (startIn) {
                    if (subElems.length == 0) {
                        const posn = this.elementPosition(elem, elemT1);
                        subElems.push({
                            type : 'move',
                            x    : posn[0],
                            y    : posn[1]
                        });
                    }

                    subElems.push(
                        this.subElement(elem, elemT1, endIn ? elemT2 : 1)
                    );
                } else if (endIn) {
                    subElems.push(this.subElement(elem, 0, elemT2));
                    done = true;
                } else if (whole) {
                    subElems.push(elem);
                }

                total = newTotal;

                if (done) {
                    break;
                }
            }
        }

        let newPath = null;
        if (subElems.length > 1) {
            newPath = new (this.constructor)(subElems);
        }

        return { path : newPath };
    }

    subElement(elem, t1, t2) {
        switch (elem.type) {
            case 'move':
                return elem;
            case 'line':
                const segment = elem.figure.partial(t1, t2);
                return {
                    type : 'line',
                    x    : segment.dstVertex[0],
                    y    : segment.dstVertex[1]
                };
            case 'arc':
                const arc = elem.figure.partial(t1, t2);
                return {
                    type          : 'arc',
                    x             : arc.endVertex[0],
                    y             : arc.endVertex[1],
                    xAxisRotation : arc.xAxisRotation,
                    radius        : arc.radius,
                    largeArc      : arc.largeArc,
                    sweepFlag     : arc.sweepFlag
                };
        }
    }

    length() {
        let length = 0;
        this.elements.forEach((elem) => {
            length += this.elementLength(elem);
        });

        return length;
    }

    elementPosition(elem, param) {
        switch (elem.type) {
            case 'move':
                return [elem.x, elem.y];
            case 'line':
                return elem.figure.getPosition(param);
            case 'arc':
                return elem.figure.getPosition(param);
        }
    }

    elementLength(elem) {
        switch (elem.type) {
            case 'move':
                return 0;
                break;
            case 'line':
                return elem.figure.magnitude();
                break;
            case 'arc':
                return elem.figure.length();
                break;
        }
    }

    scale(scale, isNew) {
        const elems = (this.elements || []).map((elem) =>  {
            let newElem = Object.assign({}, elem);;
            newElem.x = scale * elem.x;
            newElem.y = scale * elem.y;
            if (newElem.type == 'arc') {
                newElem.radius = scale * elem.radius;
            }

            return newElem;
        });

        if (isNew) {
            return new (this.constructor)(elems);
        }

        this.updateElements(elems);
        return this;
    }

    translate(deltaX, deltaY, isNew) {
        const elems = (this.elements || []).map((elem) =>  {
            let newElem = Object.assign({}, elem);;
            newElem.x += deltaX;
            newElem.y += deltaY;

            return newElem;
        });

        if (isNew) {
            return new (this.constructor)(elems);
        }

        this.updateElements(elems);
        return this;
    }

    rotate(angle, centerX, centerY, isNew) {
        centerX = centerX || 0;
        centerY = centerY || 0;

        const cos    = Math.cos(angle);
        const sin    = Math.sin(angle);
        const rotate = new Matrix([[cos, - sin], [sin, cos]]);

        const elems = (this.elements || []).map((elem) =>  {
            let newElem = Object.assign({}, elem);;

            const x = elem.x - centerX;
            const y = elem.y - centerY;

            const point = rotate.multiply(new Matrix([[x], [y]]));

            newElem.x = point.elements[0][0] + centerX;
            newElem.y = point.elements[1][0] + centerY;

            return newElem;
        });

        if (isNew) {
            return new (this.constructor)(elems);
        }

        this.updateElements(elems);
        return this;
    }

    rotateDeg(angle, centerX, centerY, isNew) {
        return this.rotate(angle * Math.PI / 180, centerX, centerY, isNew);
    }

    containsPoint(point) {
        // Unimplemented
    }

    isOpen() {
        if (this.elements.length > 2) {
            const start = this.elements[0];
            const end   = this.elements[this.elements.length - 1];

            if ((start.x == end.x) && (start.y == end.y)) {
                return false;
            }
        }

        return true;
    }

    lastElement() {
        if (this.elements.length) {
            return this.elements[iLen - 1];
        }

        return null;
    }

    lead(vertex) {
        return this.lineTo(vertex[0], vertex[1]);
    }

    leadBy(deltaX, deltaY) {
        let newElem = null;
        const elem = this.lastElement();
        if (elem) {
            newElem = {
                type : 'line',
                x    : elem.x + deltaX,
                y    : elem.y + deltaY
            }
        } else {
            newElem = {
                type : 'line',
                x    : deltaX,
                y    : deltaY
            }
        }

        this.elements.push(newElem);
    }

    leadByPolar(angle, length) {
        return this.leadBy(
            length * Math.cos(angle), length * Math.sin(angle)
        );
    }

    leadByPolarDeg(angle, length) {
        return this.leadByPolar(angle * Math.PI / 180, length);
    }

    svgPath(closed) {
        const parts = [];
        this.elements.forEach((elem, i) => {
            switch (elem.type) {
                case 'move':
                    parts.push('M', elem.x.toFixed(4), elem.y.toFixed(4));
                    break;
                case 'line':
                    parts.push(elem.figure.svgPath());
                    break;
                case 'arc':
                    parts.push(elem.figure.svgPath());
                    break;
            }
        });

        if (! closed && this.isOpen()) {
            parts.push(
                'L',
                this.elements[0].x.toFixed(4),
                this.elements[0].y.toFixed(4)
            );
        }

        return parts.join(' ');
    }
}
