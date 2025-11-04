import {Component} from "react";

export default class CanvasRenderer extends Component {
    private canvasRef = React.createRef<HTMLCanvasElement>();
    private ctx: CanvasRenderingContext2D;
    
}