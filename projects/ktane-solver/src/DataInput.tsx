import "./DataInput.scss";
import React, {Component} from "react";
import ParseError from "../../../common/ParseError";

export default class DataInput<T> extends Component<DataInputProps<T>, DataInputState> {
    private contentRef = React.createRef<HTMLTextAreaElement>();


    constructor(props: DataInputProps<T>) {
        super(props);
        this.state = {
            lastError: null,
        }
    }
    render() {
        return <div className="data_input">
            <h2>{this.props.title}</h2>
            {this.props.presets.length == 0 ? null : <div>
                <span>Presets: </span>
                <div className="_preset_list">
                    {this.props.presets.map((preset, i) => {
                        return <button key={i}
                                       onClick={() => {
                                           this.contentRef.current!.textContent = preset.text;
                                       }}>{preset.name}</button>;
                    })}
                </div>
            </div>}
            {this.state.lastError ?
                <div className="error">
                    {this.state.lastError.errorStartPos ? (this.state.lastError.errorStartPos + 1) + ":" + (this.state.lastError.errorEndPos!) + " " : null}
                    {this.state.lastError.message}
                </div> : null}
            <textarea className="_input" ref={this.contentRef} onInput={(e)=>{
                let text = e.target as HTMLTextAreaElement;

                let parsed: T;
                try {
                    parsed = this.props.parseText(text.value);
                } catch (e) {
                    if (e instanceof ParseError) {
                        this.setState({lastError: {
                            message: e.message,
                            errorStartPos: e.errorStartPos,
                            errorEndPos: e.errorEndPos
                        }});
                    } else {
                        this.setState({lastError: {
                            message: String(e)
                        }});
                    }
                    return;
                }
                this.props.onInput(parsed);
                this.setState({
                    lastError: null
                });
            }}></textarea>
        </div>;
    }
}
interface DataInputProps<T> {
    title: string;
    presets: {name: string, text: string}[]
    parseText: (text: string) => T;
    onInput: (input: T) => void;
}
interface DataInputState {
    lastError: {
        message: string;
        errorStartPos?: number;
        errorEndPos?: number;
    } | null;
}
