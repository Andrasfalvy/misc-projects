import React, {Component} from "react";
import "./Spinner.scss";

export default class Spinner extends Component {
    render() {
        return <div className="spinner">
            <svg width={24} height={24}>
                <path d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z"/>
            </svg>
        </div>;
    }
}