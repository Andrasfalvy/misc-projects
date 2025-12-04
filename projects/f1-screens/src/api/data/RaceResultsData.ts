import {RawRaceResultsData} from "./RawGameData";
import GameData from "./GameData";
import DriverData from "./DriverData";
import TeamData from "./TeamData";

export default class RaceResultsData {
    private readonly gameData: GameData;
    private readonly index: number;
    private readonly data: RawRaceResultsData;
    private readonly driverMap: Map<DriverData, RaceDriverData>;

    constructor(gameData: GameData, index: number, raw: RawRaceResultsData) {
        this.gameData = gameData;
        this.index = index;
        this.data = raw;
        this.driverMap = new Map();

        let sorted = raw.driverData.sort((a, b)=>{
            if (typeof a.time === "string" && typeof b.time === "string") {
                // did_not_finish first,
                // disqualified second
                return a.time.localeCompare(b.time);
            }
            if (typeof a.time === "number" && typeof b.time === "string") return -1;
            if (typeof a.time === "string" && typeof b.time === "number") return 1;

            // Finish time first
            if (a.timeType == "finish") return -1;
            if (b.timeType == "finish") return 1;

            // Only relative time numbers now
            let timeA = (a.time as number) + a.penaltyTime;
            let timeB = (a.time as number) + a.penaltyTime;
            return timeA - timeB;
        });

        let overallBestLapTime = Number.MAX_SAFE_INTEGER;
        for (let driverData of sorted) {
            if (driverData.bestLapTime < overallBestLapTime) overallBestLapTime = driverData.bestLapTime;
        }

        for (let i = 0; i < sorted.length; i++){
            let driverData = sorted[i];
            let driver = this.gameData.getDriver(driverData.playerId);
            if (driver == null) throw new Error(`Race ${JSON.stringify(this.data.map)} has missing driver: ${JSON.stringify(driverData.playerId)}`);

            let pos = i+1;
            if (this.driverMap.has(driver)) throw new Error(`Race ${JSON.stringify(this.data.map)} has duplicate driver: ${JSON.stringify(driverData.playerId)}`);
            this.driverMap.set(driver!, {
                driver: driver,
                team: driver.getTeam(),

                startingPosition: driverData.startingPosition,
                finishingPosition: pos,
                points: gameData.getPointForPosition(pos),

                numberOfPitStops: driverData.numberOfPitStops,
                bestLapTime: driverData.bestLapTime,
                isBestLapTimeOverall: driverData.bestLapTime === overallBestLapTime,

                time: driverData.time,
                timeType: driverData.timeType,
                penaltyTime: driverData.penaltyTime
            });
        }
    }

    getRaceIndex() {
        return this.index;
    }

    getMap() {
        return this.data.map;
    }
    getLapCount() {
        return this.data.lapCount;
    }

    getDriverData(driver: DriverData) {
        return this.driverMap.get(driver);
    }

    getAllDriverData() {
        return [...this.driverMap.values()].sort((a,b)=>a.finishingPosition-b.finishingPosition);
    }
}
export interface RaceDriverData {
    driver: DriverData,
    team: TeamData | null,

    startingPosition: number,
    finishingPosition: number
    points: number,

    numberOfPitStops: number,
    bestLapTime: number,
    isBestLapTimeOverall: boolean,

    time: number | "did_not_finish" | "did_not_start" | "disqualified",
    timeType: "finish" | "from_leader" | "none",
    penaltyTime: number,
}