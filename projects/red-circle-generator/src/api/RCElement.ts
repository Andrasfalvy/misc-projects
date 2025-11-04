import {type} from "node:os";
import RedCircleGenerator from "./RedCircleGenerator";

export default class RCElement {
    private readonly parent: RedCircleGenerator;
    private x: number;
    private y: number;
    private width: number;
    private height: number;
    private color: string;
    private type: "circle" | "rect";

    constructor(parent: RedCircleGenerator, x: number, y: number, width: number, height: number, color: string, type: "circle" | "rect") {
        this.parent = parent;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.type = type;
    }

    getX() {
        return this.x;
    }
    getY() {
        return this.y;
    }
    getWidth() {
        return this.width;
    }
    getHeight() {
        return this.height;
    }
    getColor() {
        return this.color;
    }
    getType() {
        return this.type;
    }
    setX(x: number) {
        this.x = x;
        this.parent.update();
    }
    setY(y: number) {
        this.y = y;
        this.parent.update();
    }
    setWidth(width: number) {
        this.width = width;
        this.parent.update();
    }
    setHeight(height: number) {
        this.height = height;
        this.parent.update();
    }
    setColor(color: string) {
        this.color = color;
        this.parent.update();
    }
    setType(type: "circle" | "rect") {
        this.type = type;
        this.parent.update();
    }
}