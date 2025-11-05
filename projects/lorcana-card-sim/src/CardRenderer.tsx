import "./CardRenderer.scss";
import React from "react";
import LorcanaSimulator, {ActionsToName, LorcanaCardInstance, StateToActions} from "./api/LorcanaSimulator";
import {Component} from "react";
import AsyncImage from "../../../common/AsyncImage";
import {motion} from "framer-motion";

export default class CardRenderer extends Component<CardRendererProps> {

    private readonly handler: ()=>void;
    constructor(props: CardRendererProps) {
        super(props);

        this.handler = ()=>{
            this.forceUpdate();
        };
    }

    componentDidMount() {
        this.props.card.ui.add(this.handler);
    }
    componentWillUnmount() {
        this.props.card.ui.delete(this.handler);
    }

    render() {
        let actions = StateToActions[this.props.card.state];
        return <motion.div layout layoutId={"card_" + this.props.card.id} className={"card _" + this.props.card.state}>
            <div className="_buttons">
                {actions.map((action, i)=>{
                    return <button key={i} onClick={()=>{this.props.simulator.performAction(this.props.card, action)}}>{ActionsToName[action]}</button>
                })}
            </div>
            <div className="_front">
                <AsyncImage src={this.props.card.card.api.getImage(this.props.card.card.image)} alt={this.props.card.card.name + " (front)"}/>
            </div>
            <div className="_back">
                <img src="https://wiki.mushureport.com/images/thumb/d/d7/Card_Back_official.png/300px-Card_Back_official.png" alt={this.props.card.card.name + " (back)"}/>
            </div>
        </motion.div>
    }
}

interface CardRendererProps {
    simulator: LorcanaSimulator;
    card: LorcanaCardInstance
}