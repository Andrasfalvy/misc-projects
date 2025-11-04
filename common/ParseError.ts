export default class ParseError extends Error {
    public readonly errorStartPos: number;
    public readonly errorEndPos: number;

    constructor(message: string, errorStartPos: number, errorEndPos: number) {
        super(message);
        this.errorStartPos = errorStartPos;
        this.errorEndPos = errorEndPos;
    }
}