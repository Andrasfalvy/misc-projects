import Game from "./api/Game";
import React, {Component} from "react";
import "./GameRenderer.scss";

export default class GameRenderer extends Component<GameRendererProps> {
    private canvasDivRef = React.createRef<HTMLDivElement>();
    private canvasRef = React.createRef<HTMLCanvasElement>();
    private animFrame: number | null = null;
    private resizeHandler: () => void;

    constructor(props: GameRendererProps) {
        super(props);
        this.resizeHandler = ()=>this.onResize();
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

    render() {
        if (this.animFrame !== null) {
            cancelAnimationFrame(this.animFrame);
        }
        let renderer = ()=>{
            let canvas = this.canvasRef.current!;

            this.props.game.render(canvas.getContext("2d")!);
            this.animFrame = requestAnimationFrame(renderer);
        };
        this.animFrame = requestAnimationFrame(renderer);
        setTimeout(()=>{
            this.onResize();
        }, 0);
        window.addEventListener("resize", this.resizeHandler);
        return <div className="game">
            <div>

            </div>
            <div className="_canvas_container">
                <div ref={this.canvasDivRef} className="_canvas">
                </div>
                <canvas ref={this.canvasRef} width="1" height="1"></canvas>
            </div>
        </div>;
    }
}
interface GameRendererProps {
    game: Game;
}