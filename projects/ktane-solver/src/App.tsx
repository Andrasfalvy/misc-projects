import "./App.scss";
import React, {Component} from "react";
import DataInput from "./DataInput";
import Reader from "../../../common/Reader";

export default class App extends Component<any, AppState> {
    private static readonly MORSE_LONG = "▬";
    private static readonly MORSE_SHORT = "•";

    constructor(props: any) {
        super(props);
        this.state = {
            morseValues: [],
            morseInput: []
        };
    }

    private morseToText(value: boolean) {
        return value ? App.MORSE_LONG : App.MORSE_SHORT;
    }
    private input(value: boolean | null) {
        if (value == null) {
            this.setState({
                ...this.state,
                morseInput: []
            });
        } else {
            this.setState({
                ...this.state,
                morseInput: [...this.state.morseInput, value]
            });
        }
    }
    render() {
        return <div>
            <DataInput title={"Words"} presets={[]} parseText={e=>{
                let reader = new Reader(e);
                let results: MorseValue[] = [];
                while (!reader.isEOF()) {
                    let word = reader.readUntil(e=>/\s/.test(e));
                    reader.skipWhitespace();
                    let frequency = reader.readUntil(e=>/\s/.test(e));
                    reader.skipWhitespace();
                    results.push({
                        word: word,
                        frequency: parseInt(frequency),
                        wordMorseMapped: [],
                        wordMorseMappedLong: [],
                        matchStart: null
                    });
                }
                return results;
            }} onInput={results=>{
                this.setState({
                    ...this.state,
                    morseValues: results
                })
            }}/>
            <h2>Possibilities</h2>
            <p>Possible values: <span id="possible_count"></span>/<span id="possible_max"></span></p>
            <div className="possibles">
            </div>
            <h2>Inputs</h2>
            <div className="inputs">
                {this.state.morseInput.map(input=>{
                    return <div>
                        <b>{input ? "Long" : "Short"}</b>
                        <p>{this.morseToText(input)}</p>
                    </div>;
                })}
            </div>
            <button onClick={()=>this.input(false)}>Short •</button>
            <button onClick={()=>this.input(true)}>Long —</button>
            <button onClick={()=>this.input(null)}>Clear</button>
        </div>;
    }
}
interface AppState {
    morseValues: MorseValue[];
    morseInput: boolean[];
}
interface MorseValue {
    word: string,
    frequency: number,
    wordMorseMapped: boolean[],
    wordMorseMappedLong: boolean[],
    matchStart: number | null
}