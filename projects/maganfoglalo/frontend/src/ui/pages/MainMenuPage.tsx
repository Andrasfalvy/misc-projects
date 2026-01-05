import React, {Component} from "react";
import "./MainMenuPage.scss";
import MaganFoglaloApi from "../../api/MaganFoglaloClient";

export default class MainMenuPage extends Component<MainMenuProps> {
    constructor(props: MainMenuProps) {
        super(props);
    }

    render() {
        return <div className="page-main-menu">
        </div>;
    }
}
interface MainMenuProps {
    api: MaganFoglaloApi;
}