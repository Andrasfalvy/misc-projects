import Car from "./Car";
import Game from "./Game";
import Utils from "../../../../common/Utils";

export default class Leaderboard {
    public static animSpeed = 200;
    readonly game: Game;
    readonly scoring: LeaderboardEntry[];

    constructor(game: Game) {
        this.game = game;
        this.scoring = game.cars.map((e,i)=>({
            car: e,
            position: i,
            Pnow: e.laps + e.leaderboardPercentage,
            gapToAheadSec: null,

            startPosition: i,
            startTime: -1,
            targetPosition: 0,
        }));
    }

    public update() {
        let now = Date.now();
        this.scoring.sort((a,b)=>{
            let result = b.car.laps - a.car.laps;
            if (result == 0) {
                result = b.car.leaderboardPercentage - a.car.leaderboardPercentage;
            }
            return result;
        });

        for (let i = 0; i < this.scoring.length; i++) {
            let entry = this.scoring[i];

            if (entry.targetPosition !== i) {
                // Update target
                entry.startPosition = entry.position;
                entry.targetPosition = i;
                entry.startTime = now;
            }

            if (entry.startTime > -1) {
                let delta = (now - entry.startTime) / Leaderboard.animSpeed;
                if (delta < 1) {
                    entry.position = Utils.interpolate(entry.startPosition, entry.targetPosition, delta);
                } else {
                    entry.position = entry.targetPosition;
                    entry.startTime = -1;
                }
            }
        }
    }
}
export interface LeaderboardEntry {
    car: Car,
    position: number,
    Pnow: number;
    gapToAheadSec: number | null;

    startPosition: number,
    startTime: number,
    targetPosition: number,
}