export default interface RawGameData {
    teamData: RawTeamData[];
    drivers: RawDriverData[];
    raceResults: RawRaceResultsData[];
    reserveIconUrl: string;
    pointMap: Record<string, number>;
    name: string;
}
export interface RawRaceResultsData {
    map: string;
    lapCount: number;
    driverData: {
        playerId: string,
        teamId: string,

        startingPosition: number,
        numberOfPitStops: number,
        bestLapTime: number,

        time: number | "did_not_finish" | "did_not_start" | "disqualified",
        timeType: "finish" | "from_leader" | "none",
        penaltyTime: number
    }[]
}
export interface RawTeamData {
    id: string;

    name: string;
    iconUrl: string;
}
export interface RawDriverData {
    id: string;
    teamId: string | null;

    name: string;
    country: string;
    iconUrl: string;
}