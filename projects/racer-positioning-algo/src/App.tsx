import React, {Component} from "react";
import Game from "./api/Game";
import GameRenderer from "./GameRenderer";
import BuiltinTracks from "./api/BuiltinTracks";
import "./App.scss";

export default class App extends Component<any, AppState> {

    constructor(props: any) {
        super(props);

        this.state = {
            game: new Game(BuiltinTracks[0])
        };
    }
    render() {

        return <div className="app">
            <div className="_track_list">
                {BuiltinTracks.map((e,i)=>
                    <button key={i+""} onClick={()=>{
                        let game = new Game(e);
                        this.setState({game: game});
                    }}>{e.name}</button>
                )}
            </div>
            <GameRenderer game={this.state.game}/>
        </div>;
    }
}
interface AppState {
    game: Game
}