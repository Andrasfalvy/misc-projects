import {LorcanaCard, LorcanaDeck} from "./LorcanaTypes";

export default class LorcanaApi {
    private readonly apiCards: LorcanaCard[];
    private readonly extraCards: LorcanaCard[];
    private deckParseResults: DeckParseResults;
    private uiHandler: (api: LorcanaApi)=>void;
    constructor() {
        this.apiCards = [];
        this.extraCards = [];
        this.deckParseResults = {
            deck: {
                cards: []
            },
            missing: []
        };
        this.uiHandler = ()=>{};
    }

    public randomCard() {
        let all = [...this.apiCards, ...this.extraCards];
        return all[Math.floor(Math.random()*all.length)];
    }

    public async getApiCards(): Promise<LorcanaCard[]> {
        let json = await (await fetch("https://api.lorcana-api.com/bulk/cards")).json() as {Name: string, Image: string}[];
        this.apiCards.push(...json.map(e=>({
            name: e.Name,
            image: e.Image
        })));
        return this.apiCards;
    }
    public setExtraCards(cardString: string) {
        this.extraCards.splice(0, this.extraCards.length);
        let json = JSON.parse(cardString) as {Name: string, Image: string}[];
        this.extraCards.push(...json.map(e=>({
            name: e.Name,
            image: e.Image
        })));
    }

    private findCard(name: string) {
        let card = this.apiCards.find(e=>e.name.toLowerCase() == name.toLowerCase());
        if (!card) {
            card = this.extraCards.find(e=>e.name.toLowerCase() == name.toLowerCase());
        }
        return card;
    }

    public parseDeck(deckString: string): DeckParseResults {
        let results: DeckParseResults = {
            deck: {
                cards: []
            },
            missing: []
        }
        let lines = deckString.split("\n");
        for (let line of lines) {
            let spaceIndex = line.indexOf(" ");
            let amount = parseInt(line.substring(0, spaceIndex));
            let name = line.substring(spaceIndex+1);

            let card = this.findCard(name);
            if (!card) {
                results.missing.push(name);
                continue;
            }
            for (let i = 0; i < amount; i++) {
                results.deck.cards.push(card!);
            }
        }
        this.deckParseResults = results;
        this.updateUi();
        return results;
    }

    setUiHandler(handler: (api: LorcanaApi)=>void) {
        this.uiHandler = handler;
    }
    updateUi() {
        this.uiHandler(this);
    }

    getDeckParseResults() {
        return this.deckParseResults;
    }
}
interface DeckParseResults {
    deck: LorcanaDeck;
    missing: string[];
}