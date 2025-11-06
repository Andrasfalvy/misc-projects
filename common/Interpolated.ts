export default class Interpolated<T> {
    private value: T;
    private target: {
        value: T,
        startTime: number
    } | null;
    private options: Required<InterpolatedConstructorOptions<T>>;

    constructor(startValue: T, options: InterpolatedConstructorOptions<T>) {
        this.options = {
            duration: options.duration ?? 1000,
            interpolate: options.interpolate,
            easing: options.easing ?? (t=>t)
        };
        this.value = startValue;
        this.value = startValue;
        this.target = null;
    }

    set(value: T) {
        if (this.target !== null) {
            this.value = this.get();
        }
        this.target = {
            value: value,
            startTime: Interpolated.time
        }
    }

    get(): T {
        if (this.target === null) {
            return this.value;
        }
        let time = Interpolated.getTime();
        let progress = (time - this.target.startTime) / this.options.duration;
        if (progress >= 1) {
            this.value = this.target.value;
            this.target = null;
            return this.value;
        }
        return this.options.interpolate(this.value, this.target.value, progress);
    }

    private static time: number = 0;
    static setTime(time: number) {
        this.time = time;
    }
    static getTime() {
        return this.time;
    }

    static number(startValue: number, options?: InterpolatedOptions<number>) {
        return new Interpolated(startValue, {
            interpolate: (a, b, delta)=>a + (b - a) * delta, ...options
        });
    }
}
interface InterpolatedConstructorOptions<T> extends InterpolatedOptions<T> {
    interpolate: (a: T, b: T, delta: number) => T;
}
interface InterpolatedOptions<T> {
    duration?: number;
    easing?: (t: number) => number;
}