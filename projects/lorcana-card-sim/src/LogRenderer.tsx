import {Component} from "react";
import LorcanaSimulator from "./api/LorcanaSimulator";
import {LorcanaCard} from "./api/LorcanaTypes";
import React from "react";
import "./LogRenderer.scss";

export default class LogRenderer extends Component<LogRendererProps> {

    constructor(props: LogRendererProps) {
        super(props);
    }

    private remapCards(cards: LorcanaCard[]): RemappedCard[] {
        let results: Map<LorcanaCard,number>= new Map();
        for (let card of cards) {
            let count = results.get(card) ?? 0;
            results.set(card, count + 1);
        }
        return results
            .entries()
            .map(e=>({card: e[0].name, count: e[1]}))
            .toArray()
            .sort((a,b)=>a.card.localeCompare(b.card));
    }

    render() {
        let logs = this.props.simulator.getLog();
        return <div className="log-renderer">
            <h2>Game Log</h2>
            {logs.map((log,i)=>{
                if (log.type == "start-game") {
                    return <div key={i}>
                        Started new game with hand:
                        <ul>
                            {this.remapCards(log.hand).map((card,i)=>{
                                return <li key={i}>{card.count}× {card.card}</li>
                            })}
                        </ul>
                    </div>;
                } else if (log.type == "start-turn") {
                    return <>
                        <hr/>
                        <div>Started turn <b>{log.turn}</b> with <b>{log.inkCount}</b> ink.</div>
                    </>;
                } else if (log.type == "discard") {
                    if (log.cards.length == 1) {
                        return <div key={i}>Discarded <b>{log.cards[0].name}</b></div>
                    }
                    return <div key={i}>
                        Discarded:
                        <ul>
                            {this.remapCards(log.cards).map((card,i)=>{
                                return <li key={i}>{card.count}× {card.card}</li>
                            })}
                        </ul>
                    </div>;
                } else if (log.type == "ink") {
                    if (log.cards.length == 1) {
                        return <div key={i}>Inked <b>{log.cards[0].name}</b>, now has <b>{log.inkLeft}</b> ink left.</div>
                    }
                    return <div key={i}>
                        Inked:
                        <ul>
                            {this.remapCards(log.cards).map((card,i)=>{
                                return <li key={i}>{card.count}× {card.card}</li>
                            })}
                        </ul>
                        Now has <b>{log.inkLeft}</b> ink left.
                    </div>;
                } else if (log.type == "draw") {
                    if (log.cards.length == 1) {
                        return <div key={i}>Drew <b>{log.cards[0].name}</b>.</div>
                    }
                    return <div key={i}>
                        Drew:
                        <ul>
                            {this.remapCards(log.cards).map((card,i)=>{
                                return <li key={i}>{card.count}× {card.card}</li>
                            })}
                        </ul>
                    </div>;
                } else if (log.type == "play") {
                    return <div key={i}>Played <b>{log.card.name}</b> for {log.card.cost == null ? <i>an unknown amount of </i> : <b>{log.card.cost}</b>} ink (<b>{log.inkLeft}</b> left).</div>
                } else if (log.type == "alter") {
                    if (log.altered.length == 1) {
                        return <div key={i}>Altered <b>{log.altered[0].name}</b>, received <b>{log.received[0].name}</b></div>
                    }
                    return <div key={i}>
                        Altered with {log.altered.length} card{log.altered.length == 1 ? "" : "s"}:
                        <ul>
                            {this.remapCards(log.altered).map((card,i)=>{
                                return <li key={i}>{card.count}× {card.card}</li>
                            })}
                        </ul>
                        Received:
                        <ul>
                            {this.remapCards(log.received).map((card,i)=>{
                                return <li key={i}>{card.count}× {card.card}</li>
                            })}
                        </ul>
                    </div>;
                } else if (log.type == "quest") {
                    if (log.cards.length == 1) {
                        return <div key={i}>Quested with <b>{log.cards[0].name}</b></div>
                    }
                    return <div key={i}>
                        Quested with:
                        <ul>
                            {this.remapCards(log.cards).map((card,i)=>{
                                return <li key={i}>{card.count}× {card.card}</li>
                            })}
                        </ul>
                    </div>
                } else if (log.type == "quest-end") {
                    if (log.cards.length == 1) {
                        return <div key={i}>Ended Quest with <b>{log.cards[0].name}</b></div>
                    }
                    return <div key={i}>
                        Ended Quest with:
                        <ul>
                            {this.remapCards(log.cards).map((card,i)=>{
                                return <li key={i}>{card.count}× {card.card}</li>
                            })}
                        </ul>
                    </div>
                }
            })}
        </div>;
    }
}
interface LogRendererProps {
    simulator: LorcanaSimulator;
}
interface RemappedCard {
    card: string,
    count: number
}