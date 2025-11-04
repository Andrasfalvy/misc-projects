import {LorcanaCard} from "./LorcanaTypes";

type LogStartGame = {
    type: "start-game",
    seed: number,
    hand: LorcanaCard[]
}
type LogStartTurn = {
    type: "start-turn";
    turn: number;
    inkCount: number;
}
type LogAlter = {
    type: "alter",
    altered: LorcanaCard[],
    received: LorcanaCard[]
}
type LogDrawCard = {
    type: "draw",
    cards: LorcanaCard[]
}
type LogDiscardCard = {
    type: "discard"
    cards: LorcanaCard[]
}
type LogPlayCard = {
    type: "play",
    card: LorcanaCard,
    inkLeft: number
}
type LogInkCard = {
    type: "ink",
    cards: LorcanaCard[],
    inkLeft: number
}
type LogQuestCard = {
    type: "quest",
    cards: LorcanaCard[]
}
type LogEndQuestCard = {
    type: "quest-end",
    cards: LorcanaCard[]
}

type ToMap<T extends {type: string}> = {[K in T["type"]]: T};
export type LorcanaLogEntries =
    & ToMap<LogStartGame>
    & ToMap<LogStartTurn>
    & ToMap<LogAlter>
    & ToMap<LogDrawCard>
    & ToMap<LogDiscardCard>
    & ToMap<LogPlayCard>
    & ToMap<LogInkCard>
    & ToMap<LogQuestCard>
    & ToMap<LogEndQuestCard>;

export type LorcanaLogEntry = LorcanaLogEntries[keyof LorcanaLogEntries];