import "./SimulatorRenderer.scss";
import React from "react";
import LorcanaSimulator from "./api/LorcanaSimulator";
import {Component} from "react";
import CardRenderer from "./CardRenderer";

export default class SimulatorRenderer extends Component<SimulatorRendererProps, any> {

    private readonly handler: ()=>void;
    constructor(props: SimulatorRendererProps) {
        super(props);

        this.handler = ()=>{
            this.forceUpdate();
        };
    }

    componentDidMount() {
        this.props.simulator.ui.add(this.handler);
    }
    componentWillUnmount() {
        this.props.simulator.ui.delete(this.handler);
    }

    render() {
        let sim = this.props.simulator;
        let hasAlterCards = sim.getCardsByState("alter_marked").length > 0;
        let remainingCards = sim.cardsInDeckCount();
        return <div className="simulator">
            <h1>Simulator</h1>
            <div className="_cards _played">
                {sim.getCardsByState(["played", "quest"]).map((card, i)=><CardRenderer card={card} simulator={sim} key={i}/>)}
            </div>
            <div className="_cards _center">
                <div className="_cards _inkwell">
                    {sim.getCardsByState(["inked", "inked_used"]).map((card, i)=><CardRenderer card={card} simulator={sim} key={i}/>)}
                </div>
                <div className="_discard">
                    {sim.getCardsByState("discard").map((card, i)=><CardRenderer card={card} simulator={sim} key={i}/>)}
                </div>
            </div>
            <div className="_cards _hand">
                {sim.getCardsByState(["hand","alter_marked"]).map((card, i)=><CardRenderer card={card} simulator={sim} key={i}/>)}
            </div>
            <div className="_buttons">
                <button className={"_alter " + (sim.hasAltered() || !hasAlterCards ? "_greyed" : "_usable")} onClick={()=>{sim.alter()}}>{sim.hasAltered() ? "Already altered" : hasAlterCards ? "Alter" : "Mark cards to Alter"}</button>
                <button className="_reset" onClick={()=>{sim.reset()}}>Reset</button>
                <button className={"_draw " + (remainingCards <= 0 ? "_greyed" : "_usable")} onClick={()=>{sim.draw()}}>Draw ({remainingCards + (remainingCards == 1 ? " card" : " cards")} in deck)</button>
                <button className="_nextTurn" onClick={()=>{sim.nextTurn()}}>Next Turn</button>
            </div>

        </div>
    }
}

interface SimulatorRendererProps {
    simulator: LorcanaSimulator
}