import React, {Component} from "react";
import "./App.scss";
import MaganFoglaloClient from "../api/MaganFoglaloClient";
import LobbyPage from "./pages/LobbyPage";
import MainMenuPage from "./pages/MainMenuPage";

export default class App extends Component<AppProps> {

    constructor(props: any) {
        super(props);
    }
    render() {
        let lobby = this.props.api.getLobby();
        if (lobby != null) return <LobbyPage lobby={lobby}/>;
        return <MainMenuPage api={this.props.api}/>;
    }
}
interface AppProps {
    api: MaganFoglaloClient
}