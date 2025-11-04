import Point from "./Point";
import Track from "./Track";
import Utils from "../../../../common/Utils";

export default class Car {
    public static leaderboardDeltaUpdateUnit = 0.001;
    private track: Track;
    private style: string;
    index: number;

    private pointFrom: Point;
    private pointTo: Point | null;
    private delta: number;

    posX: number;
    posY: number;

    distanceDone: number;
    distanceLastIndex: number;
    distancePercentageStats: [number,number][];
    laps: number;

    leaderboardPercentage: number;
    leaderboardLastDelta: number;
    leaderboardLastFrom: Point;
    leaderboardTime: number;

    leaderboardPastEntries: LeaderboardTimeEntry[];

    constructor(track: Track, startPoint: Point, style: string, index: number, offset: number) {
        this.track = track;
        this.style = style;
        this.index = index;

        this.pointFrom = startPoint;
        this.pointTo = startPoint.randomNext();
        this.delta = -offset;

        this.posX = startPoint.x;
        this.posY = startPoint.y;

        this.distanceDone = 0;
        this.distanceLastIndex = -2;
        this.distancePercentageStats = [];

        this.leaderboardPercentage = 0;
        this.leaderboardLastDelta = 0;
        this.leaderboardLastFrom = startPoint;
        this.leaderboardTime = 0;
        this.laps = 0;
        this.leaderboardPastEntries = new Array(100);
    }
    getStyle() {
        return this.style;
    }
    private updatePos() {
        let pos = this.pointFrom.interpolate(this.pointTo, this.delta);
        this.posX = pos[0];
        this.posY = pos[1];
        this.updateLeaderboard();
    }
    private updateLeaderboard() {
        let deltaDiff = this.delta - this.leaderboardLastDelta;
        if (this.leaderboardLastFrom !== this.pointFrom) {
            deltaDiff += 1;
        }
        if (deltaDiff < Car.leaderboardDeltaUpdateUnit) return;
        this.leaderboardPercentage = this.track.interpolatePercentages(this.pointFrom, this.pointTo, this.delta);
        this.leaderboardTime = Date.now();

        this.leaderboardLastDelta = this.delta;
        this.leaderboardLastFrom = this.pointFrom;

        this.leaderboardPastEntries.splice(this.leaderboardPastEntries.length-1, 1);
        this.leaderboardPastEntries.splice(0,0,{
            percentage: this.leaderboardPercentage,
            time: this.leaderboardTime,
        });
    }
    private updateDistanceStats(advance: number) {
        if (this.delta < 0) return;

        let result = this.distanceDone + advance;

        let resultPercentage = this.track.interpolatePercentages(this.pointFrom, this.pointTo, this.delta);

        let startIndex = this.distanceLastIndex;
        let endIndex = Utils.binarySearch2(this.distancePercentageStats, result, (e) => e[0], (a, b) => a - b);


        if (endIndex > -1) {
            // Already found, overwrite
            this.distancePercentageStats[endIndex][1] = resultPercentage;
            this.distanceLastIndex = endIndex;
        } else if (startIndex < (-endIndex-1)) {
            // Clear entries between last and current, and add this entry
            this.distancePercentageStats.splice(startIndex+1, (-endIndex-1)-startIndex, [result, resultPercentage]);
            this.distanceLastIndex = startIndex+1;
        } else {
            // Loop around, clear rest from end and start again
            this.distancePercentageStats.splice(startIndex+1, this.distancePercentageStats.length-(startIndex+1));
            this.distancePercentageStats.splice(0, (-endIndex-1),
                [result, resultPercentage]);
            this.distanceLastIndex = 0;
        }
        this.distanceDone = result;
    }
    update(speed: number) {
        while (speed > 0 && this.pointTo !== null) {
            let pointDistance = this.pointFrom.distanceTo(this.pointTo);
            let currentAdvance = pointDistance * this.delta;

            if (currentAdvance < 0 && currentAdvance + speed > 0) {
                // TODO accurate measurements?
            }

            currentAdvance += speed;
            if (currentAdvance > pointDistance) {
                // Reached next point
                let currentDistance = currentAdvance - pointDistance;
                this.delta = 1;
                this.updateDistanceStats(currentDistance);

                speed -= currentDistance;
                this.delta = 0;

                if (this.track.cyclical && (this.pointTo == this.track.start)) {
                    this.distanceDone = 0;
                    this.laps++;
                }
                this.pointFrom = this.pointTo;
                this.pointTo = this.pointTo.randomNext();
                this.updateLeaderboard();
            } else {
                this.updateDistanceStats(speed);
                this.delta = currentAdvance / pointDistance;
                break;
            }
        }

        this.updatePos();
    }
}

export interface LeaderboardTimeEntry {
    percentage: number,
    time: number
}