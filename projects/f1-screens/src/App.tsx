import React from "react";
import {Component} from "react";
import CanvasRenderer from "../../../common/components/CanvasRenderer";
import F1Renderer from "./api/F1Renderer";
import "./App.scss";

export default class App extends Component<AppProps> {
    private keyDownHandler: (e: KeyboardEvent)=>void;
    constructor(props: AppProps) {
        super(props);

        this.keyDownHandler = (e)=>{
            const keys = "0123456789";
            for (let key of keys) {
                if (e.key == key) {
                    this.props.app.getMode().setValue(parseInt(key));
                    break;
                }
            }
        };
    }
    componentDidMount() {
        addEventListener("keydown", this.keyDownHandler);
    }
    componentWillUnmount() {
        removeEventListener("keydown", this.keyDownHandler);
    }

    render() {
        return <div className="app">
            <div style={{fontFamily: "Formula1"}}>
                szilya
            </div>
            <CanvasRenderer type={"webgl2"} options={{
                antialias: true,
                alpha: true,
                preserveDrawingBuffer: true,
                depth: false
            }} renderFunc={(ctx)=>{
                this.props.app.render(ctx);
            }}/>
        </div>;
    }
}
interface AppProps {
    app: F1Renderer
}