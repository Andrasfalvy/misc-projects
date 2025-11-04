import {PointType, SerializedPoint} from "./SerializedData";

export default class Point {
    readonly index: number;
    readonly x: number;
    readonly y: number;
    readonly type: PointType;
    pointDepth: number;
    readonly nextRaw: number[];
    readonly next: Point[];
    readonly prev: Point[];

    constructor(index: number, serialized: SerializedPoint) {
        this.index = index;
        this.x = serialized.x;
        this.y = serialized.y;
        this.type = serialized.type ?? "normal";
        this.pointDepth = Number.MAX_SAFE_INTEGER;
        this.nextRaw = serialized.next ?? [];
        this.next = [];
        this.prev = [];
    }

    autoLinkAll(points: Point[]) {
        this.next.splice(0, this.next.length);
        for (let nextId of this.nextRaw) {
            let point = points[nextId];
            if (!point) {
                throw new Error("Point " + nextId + " not found as next point for point " + this.index);
            }
            this.linkTo(point);
        }
    }
    linkTo(point: Point) {
        point.prev.push(this);
        this.next.push(point);
    }

    distanceTo(other: Point) {
        return Math.sqrt(Math.pow(other.x - this.x, 2) + Math.pow(other.y - this.y, 2));
    }

    interpolate(other: Point | null, t: number): [number, number] {
        if (other == null) {
            return [this.x, this.y];
        }
        return [
            this.x + (other.x - this.x) * t,
            this.y + (other.y - this.y) * t
        ];
    }

    isSplit() {
        return this.next.length > 1;
    }
    isMerge() {
        return this.prev.length > 1;
    }
    isEndPoint() {
        return this.next.length === 0;
    }
    isStartPoint() {
        return this.prev.length === 0;
    }

    randomNext() {
        if (this.next.length == 0) {
            return null;
        }
        return this.next[Math.floor(Math.random() * this.next.length)];
    }
    randomPrev() {
        if (this.prev.length == 0) {
            return null;
        }
        return this.prev[Math.floor(Math.random() * this.prev.length)];
    }
}