import React, {Component} from "react";
import "./CanvasRenderer.scss";

export default class CanvasRenderer extends Component<CanvasRendererProps> {
    private readonly canvasDivRef = React.createRef<HTMLDivElement>();
    private readonly canvasRef = React.createRef<HTMLCanvasElement>();
    private readonly resizeHandler: () => void;
    private animFrame: number | null = null;

    private ctx: RenderContext | null;

    constructor(props: CanvasRendererProps) {
        super(props);
        this.resizeHandler = ()=>this.onResize();
        this.ctx = null;
    }

    private onResize() {
        let canvas = this.canvasRef.current!;
        canvas.width = 0;
        canvas.height = 0;
        
        let div = this.canvasDivRef.current!;
        window.getComputedStyle(div).getPropertyValue('width'); // force style recalculation

        canvas.width = div.clientWidth;
        canvas.height = div.clientHeight;
    }

    componentDidMount() {
        window.addEventListener("resize", this.resizeHandler);
        this.onResize();

        let renderer = ()=>{
            let canvas = this.canvasRef.current!;
            if (this.ctx == null) {
                this.ctx = {
                    ctx: canvas.getContext(this.props.type ?? "2d")!,
                    pointers: new Map()
                }
            }
            (this.props.renderFunc as unknown as (ctx: RenderContext)=>void)(this.ctx);
            this.animFrame = requestAnimationFrame(renderer);
        };
        this.animFrame = requestAnimationFrame(renderer);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.resizeHandler);

        if (this.animFrame !== null) cancelAnimationFrame(this.animFrame);
        this.animFrame = null;
    }

    render() {
        return <div className="canvas-renderer">
            <div ref={this.canvasDivRef} className="_canvas">
            </div>
            <canvas ref={this.canvasRef} width="1" height="1"
                    onPointerDown={e=>{
                        if (!this.ctx) return;
                        this.ctx.pointers.set(e.pointerId, e);
                    }} onPointerUp={e=>{
                        if (!this.ctx) return;
                        this.ctx.pointers.delete(e.pointerId);
                    }} onPointerMove={e=>{
                        if (!this.ctx) return;
                        this.ctx.pointers.set(e.pointerId, e);
            }}></canvas>
        </div>;
    }
}
type CanvasRendererProps = {
    type?: "2d",
    options?: CanvasRenderingContext2DSettings,
    renderFunc: (ctx: RenderContext<CanvasRenderingContext2D>)=>void
} | {
    type: "bitmaprenderer",
    options?: ImageBitmapRenderingContextSettings,
    renderFunc: (ctx: RenderContext<ImageBitmapRenderingContext>)=>void
} | {
    type: "webgl",
    options?: WebGLContextAttributes,
    renderFunc: (ctx: RenderContext<WebGLRenderingContext>)=>void
} | {
    type: "webgl2",
    options?: WebGLContextAttributes,
    renderFunc: (ctx: RenderContext<WebGL2RenderingContext>)=>void;
}
type CanvasContext = CanvasRenderingContext2D | ImageBitmapRenderingContext | WebGLRenderingContext | WebGL2RenderingContext;
export interface RenderContext<T extends CanvasContext=CanvasContext> {
    pointers: Map<number, React.PointerEvent>;
    ctx: T;
}