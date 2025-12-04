import Timer from "./Timer";
import Vec2 from "./Vec2";

export default class Interpolated<T> {
    private value: T;
    private target: {
        value: T,
        startTime: number
    } | null;
    private options: Required<InterpolatedConstructorOptions<T>>;

    constructor(startValue: T, options: InterpolatedConstructorOptions<T>) {
        this.options = {
            timer: options.timer ?? Timer.UNIX,
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
            startTime: this.options.timer.getElapsedTime()
        }
    }

    get(): T {
        if (this.target === null) {
            return this.value;
        }
        let time = this.options.timer.getElapsedTime();
        let progress = (time - this.target.startTime) / this.options.duration;
        if (progress >= 1) {
            this.value = this.target.value;
            this.target = null;
            return this.value;
        }
        return this.options.interpolate(this.value, this.target.value, progress);
    }

    static number(startValue: number, options?: InterpolatedOptions<number>) {
        return new Interpolated(startValue, {
            interpolate: (a, b, delta)=>a + (b - a) * delta, ...options
        });
    }
    static vec2(startValue: Vec2, options?: InterpolatedOptions<Vec2>): Interpolated<Vec2>;
    static vec2(startX: number, startY: number, options?: InterpolatedOptions<Vec2>): Interpolated<Vec2>;
    static vec2(param1: Vec2 | number, param2?: InterpolatedOptions<Vec2> | number, param3?: InterpolatedOptions<Vec2>): Interpolated<Vec2> {
        if (param1 instanceof Vec2) {
            return new Interpolated<Vec2>(param1, {
                interpolate: (a, b, delta)=>{
                    return a.interpolate(b, delta);
                }, ...(param2 as InterpolatedOptions<Vec2>)
            });
        } else {
            return new Interpolated<Vec2>(new Vec2(param1, param2 as number), {
                interpolate: (a, b, delta)=>{
                    return a.interpolate(b, delta);
                }, ...(param3 as InterpolatedOptions<Vec2>)
            });
        }
    }
}
interface InterpolatedConstructorOptions<T> extends InterpolatedOptions<T> {
    interpolate: (a: T, b: T, delta: number) => T;
}
interface InterpolatedOptions<T> {
    timer?: Timer;
    duration?: number;
    easing?: (t: number) => number;
}