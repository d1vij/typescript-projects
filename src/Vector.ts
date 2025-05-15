export class Vector {
    x: number
    y: number
    z: number
    constructor(x: number, y: number, z: number = 0) {
        this.x = x;
        this.y = y
        this.z = z
    }

    public sub(b:Vector) {
        return new Vector(this.x - b.x, this.y - b.y)
    }
    public angleMadeByThisVectorWithXAxisInRadians() {
        return Math.atan2(this.y,this.x)
    }
    static rotateVector(oV: Vector, angle:number): Vector {
        let s = Math.sin(angle);
        let c = Math.cos(angle);
        return new Vector(oV.x * c - oV.y * s, oV.x * s + oV.y * c)
    }


    static distance(a: Vector, b: Vector) {
        return Math.hypot((a.x - b.x), (a.y - b.y), (a.z - b.z))
    }

    static areEqual(a: Vector, b: Vector) {
        return (a.x === b.x) && (a.y === b.y);
    }
    static angleBetween(a: Vector, b:Vector) {
        //angle made wrt +x axis
        return Math.atan2(a.y - b.y, a.x - b.x);
    }


}