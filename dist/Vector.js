export class Vector {
    constructor(x, y, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    sub(b) {
        return new Vector(this.x - b.x, this.y - b.y);
    }
    angleMadeByThisVectorWithXAxisInRadians() {
        return Math.atan2(this.y, this.x);
    }
    static rotateVector(oV, angle) {
        let s = Math.sin(angle);
        let c = Math.cos(angle);
        return new Vector(oV.x * c - oV.y * s, oV.x * s + oV.y * c);
    }
    static distance(a, b) {
        return Math.hypot((a.x - b.x), (a.y - b.y), (a.z - b.z));
    }
    static areEqual(a, b) {
        return (a.x === b.x) && (a.y === b.y);
    }
    static angleBetween(a, b) {
        //angle made wrt +x axis
        return Math.atan2(a.y - b.y, a.x - b.x);
    }
}
