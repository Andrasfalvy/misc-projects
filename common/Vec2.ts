export default class Vec2 {
    private readonly x: number;
    private readonly y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    add(scalar: number): Vec2;
    add(other: Vec2): Vec2;
    add(x: number, y: number): Vec2;
    add(param1: number | Vec2, param2?: number): Vec2 {
        if (param1 instanceof Vec2) {
            return new Vec2(this.x + param1.x, this.y + param1.y);
        } else if (param2 !== undefined) {
            return new Vec2(this.x + param1, this.y + param2);
        } else {
            return new Vec2(this.x + param1, this.y + param1);
        }
    }

    sub(scalar: number): Vec2;
    sub(other: Vec2): Vec2;
    sub(x: number, y: number): Vec2;
    sub(param1: number | Vec2, param2?: number): Vec2 {
        if (param1 instanceof Vec2) {
            return new Vec2(this.x - param1.x, this.y - param1.y);
        } else if (param2 !== undefined) {
            return new Vec2(this.x - param1, this.y - param2);
        } else {
            return new Vec2(this.x - param1, this.y - param1);
        }
    }

    mul(scalar: number): Vec2;
    mul(other: Vec2): Vec2;
    mul(x: number, y: number): Vec2;
    mul(param1: number | Vec2, param2?: number): Vec2 {
        if (param1 instanceof Vec2) {
            return new Vec2(this.x * param1.x, this.y * param1.y);
        } else if (param2 !== undefined) {
            return new Vec2(this.x * param1, this.y * param2);
        } else {
            return new Vec2(this.x * param1, this.y * param1);
        }
    }

    div(scalar: number): Vec2;
    div(other: Vec2): Vec2;
    div(x: number, y: number): Vec2;
    div(param1: number | Vec2, param2?: number): Vec2 {
        if (param1 instanceof Vec2) {
            return new Vec2(this.x / param1.x, this.y / param1.y);
        } else if (param2 !== undefined) {
            return new Vec2(this.x / param1, this.y / param2);
        } else {
            return new Vec2(this.x / param1, this.y / param1);
        }
    }

    getX(): number { return this.x; }
    getY(): number { return this.y; }
    getLength(): number { return Math.sqrt(this.x * this.x + this.y * this.y); }

    interpolate(other: Vec2, percentage: number): Vec2 {
        return this.add(other.sub(this).mul(percentage));
    }
}