import Point from "./Point";
import {SerializedTrack} from "./SerializedData";
import Utils from "../../../../common/Utils";

export default class Track {
    readonly name: string;
    readonly points: Point[];
    readonly cyclical: boolean;
    readonly start: Point;
    readonly end: Point;
    readonly percentages: Map<Point, number>;
    readonly shortestLength: number;
    readonly longestLength: number;
    constructor(serialized: SerializedTrack) {
        this.name = serialized.name;
        this.points = serialized.points.map((p,i) => new Point(i, p));

        // Link points together
        for (let point of this.points) {
            point.autoLinkAll(this.points);
        }

        // Find start point
        if (serialized.start !== undefined) {
            this.start = this.points[serialized.start];
            if (this.start === undefined) {
                throw new Error("Explicitly declared start point " + serialized.start + " found");
            }
        } else {
            let startPoints = this.points.filter(p => p.isStartPoint());
            if (startPoints.length > 1) {
                throw new Error("More than one start point found");
            } else if (startPoints.length === 0) {
                // Find first "flag" point
                let startPoint = this.points.find(p => p.type == "flag");
                if (startPoint !== undefined) {
                    this.start = startPoint;
                } else {
                    // Fall back to first point
                    this.start = this.points[0];
                }
            } else {
                this.start = startPoints[0];
            }
        }

        // Find cyclical
        this.cyclical = !this.points.some(p => p.isStartPoint());
        if (this.cyclical) {
            let p = this.points.filter(p => p.isEndPoint());
            if (p.length > 0) {
                throw new Error("Cyclical track contains loose endpoints: " + p.map(e=>e.index).join(", "));
            }
        } else {
            if (!this.points.some(e=>e.isEndPoint())) {
                throw new Error("Non-cyclical track contains no endpoint: " + this.points.find(e=>e.isEndPoint())!.index);
            }
        }

        // Find end point
        if (this.cyclical) {
            this.end = this.start;
        } else {
            let endPoints = this.points.filter(e=>e.isEndPoint());
            if (endPoints.length > 1) {
                let pseudoEnd = new Point(this.points.length, {
                    x: 0,
                    y: 0,
                    type: "hidden"
                });
                for (let endPoint of endPoints) {
                    endPoint.linkTo(pseudoEnd);
                }
                this.end = pseudoEnd;
            } else {
                this.end = endPoints[0];
            }
        }

        // Find length
        try {
            let lengths = this.calculateLengths(this.start, this.end);
            this.shortestLength = lengths.min;
            this.longestLength = lengths.max;
        } catch (e) {
            console.error(e);
            this.shortestLength = 1;
            this.longestLength = 1;
        }

        // Find areas
        try {
            this.percentages = this.calculatePercentages(this.start, this.end);
        } catch (e) {
            console.error(e);
            this.percentages = new Map();
        }
    }
    private calculatePercentages(start: Point, end: Point): Map<Point, number> {
        const expectMap = new Map<Point, number>();

        const expect = (start: boolean, p: Point): number => {
            if (expectMap.has(p)) {
                return expectMap.get(p)!;
            }
            if (p === end && !start) {
                expectMap.set(p, 0);
                return 0;
            }
            let max = 0;
            //let count = 0;
            for (const q of p.next) {
                let distance = p.distanceTo(q);
                if (p.type == "hidden" || q.type == "hidden") {
                    distance = 0;
                }
                max = Math.max(max, distance + expect(false, q));
                //count++;
            }
            //const average = max / count;
            expectMap.set(p, max);
            return max;
        };

        const total = expect(true, start);

        if (total === 0) {
            throw new Error("Track has a length of zero");
        }

        const result = new Map<Point, number>();
        for (const [point, dist] of expectMap) {
            result.set(point, (total - dist) / total);
        }
        return result;
    }

    private calculateLengths(start: Point, end: Point) {
        const expectMap = new Map<Point, MinAndMax>();

        const expect = (start: boolean, p: Point): MinAndMax => {
            if (!expectMap.has(p)) {
                if (!start && p === end) {
                    expectMap.set(p, { min: 0, max: 0 });
                } else {
                    let max = -Infinity;
                    let min = Infinity;
                    for (const q of p.next) {
                        const d = p.distanceTo(q);
                        const exp = expect(false, q);
                        min = Math.min(min, (d + exp.min));
                        max = Math.max(max, (d + exp.max));
                    }
                    expectMap.set(p, { min, max });
                }
            }
            return expectMap.get(p)!;
        };

        return expect(true, start);
    }

    public interpolatePercentages(from: Point, to: Point | null, delta: number) {
        if (to == null) {
            return 1;
        }
        let p1 = this.percentages.get(from)!;
        let p2 = this.percentages.get(to)!;

        if (this.end == to
            || (this.end.type == "hidden" && this.end.prev.includes(to))) {
            p2 = 1;
        }
        return Utils.interpolate(p1, p2, delta);
    }
}
type MinAndMax = {
    min: number;
    max: number;
};