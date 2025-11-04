export type SerializedPoint = {
    x: number;
    y: number;
    next?: number[];
    type?: PointType;
}
export type SerializedTrack = {
    name: string,
    start?: number,
    points: SerializedPoint[];
}
export type PointType = "hidden" | "flag" | "normal";