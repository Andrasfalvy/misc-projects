import React from "react";
import "./App.scss";
import CardRenderer from "./CardRenderer";
import LorcanaApi from "./api/LorcanaApi";
import {Component} from "react";
import LorcanaSimulator from "./api/LorcanaSimulator";
import SimulatorRenderer from "./SimulatorRenderer";

export default class App extends Component<AppProps, AppState> {

    constructor(props: AppProps) {
        super(props);
        this.state = {
            sim: new LorcanaSimulator(props.api.getDeckParseResults().deck)
        };
    }

    render() {
        return <div>
            <SimulatorRenderer simulator={this.state.sim}/>
        </div>;
    }
}
interface AppProps {
    api: LorcanaApi;
}
interface AppState {
    sim: LorcanaSimulator;
}
interface MorseValue {
    word: string,
    frequency: number,
    wordMorseMapped: boolean[],
    wordMorseMappedLong: boolean[],
    matchStart: number | null
}