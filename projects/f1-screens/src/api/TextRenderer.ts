import {GLRenderer, GLTexture, GLTextureParams} from "@mrgazdag/gl-lite";

interface FontData {
    family: string,
    size: string,
    weight?: string
}
export default class TextRenderer {
    private static canvas: HTMLCanvasElement;
    private static ctx: CanvasRenderingContext2D;
    private static init() {
        this.canvas = document.createElement("canvas");
        this.canvas.width = 1;
        this.canvas.height = 1;
        this.ctx = this.canvas.getContext("2d", {
            willReadFrequently: true,
        })!;
    }
    private static combineFont(font: FontData): string {
        return [font.weight, font.size, font.family].filter(e=>e != null).join(" ");
    }
    private static renderImpl(font: FontData, str: string, options?: Partial<Omit<GLTextureParams, "data"|"width"|"height"|"format">>): Partial<GLTextureParams> {
        if (this.canvas == null) this.init();

        let combined = this.combineFont(font);

        this.ctx.font = combined;
        let measured = this.ctx.measureText(str);

        console.log(str, measured);
        this.canvas.width = measured.width + 10;
        this.canvas.height = measured.fontBoundingBoxAscent + measured.fontBoundingBoxDescent + 10;

        this.ctx.font = combined;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = "white";
        this.ctx.textBaseline = "middle";
        this.ctx.fillText(str, 5, 5 + this.canvas.height/2);
        let data = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        return {
            data: data,
            width: this.canvas.width,
            height: this.canvas.height,
            format: "rgba",
            flipY: true,

            ...options
        };
    }
    public static render(renderer: GLRenderer, texture: GLTexture | undefined, font: FontData, str: string, options?: Partial<Omit<GLTextureParams, "data"|"width"|"height"|"format">>): GLTexture {
        let params = this.renderImpl(font,str,options);
        if (texture != null) {
            texture.update(params)
            return texture;
        } else {
            return renderer.texture(params);
        }
    }
}