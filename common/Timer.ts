export default class Timer {
    protected startTime: number;
    protected currentTime: number;

    constructor() {
        this.startTime = 0;
        this.currentTime = 0;
    }

    setCurrentTime(time: number) {
        this.currentTime = time;
    }
    getElapsedTime() {
        return this.currentTime - this.startTime;
    }
    reset(startTime?: number) {
        if (startTime !== undefined) {
            this.startTime = startTime;
        }
        this.currentTime = this.startTime;
    }

    static UNIX = new class extends Timer {
        getElapsedTime() {
            return Date.now();
        }
    }();
}
