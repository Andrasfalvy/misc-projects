import {LorcanaCard, LorcanaDeck} from "./LorcanaTypes";
import ImageCache from "../../../../common/ImageCache";

export default class LorcanaApi {
    private readonly apiCards: LorcanaCard[];
    private readonly imageCache: ImageCache;
    private extraCardsResults: ExtraCardsResults;
    private deckParseResults: DeckParseResults;
    private uiHandler: Set<(api: LorcanaApi)=>void>;
    constructor() {
        this.apiCards = [];
        this.imageCache = new ImageCache();
        this.extraCardsResults = {
            string: "[]",
            cards: [],
            error: null
        };
        this.deckParseResults = {
            string: "",
            deck: {
                cards: []
            },
            missing: []
        };
        this.uiHandler = new Set();
    }

    public async getImage(url: string): Promise<string> {
        return this.imageCache.getImage(url);
    }

    public randomCard() {
        let all = [...this.apiCards, ...this.extraCardsResults.cards];
        return all[Math.floor(Math.random()*all.length)];
    }

    public async getApiCards(): Promise<LorcanaCard[]> {
        let json = await (await fetch("https://api.lorcana-api.com/bulk/cards")).json() as {Name: string, Image: string, Cost: number}[];
        this.apiCards.push(...json.map(e=>({
            api: this,
            name: e.Name,
            image: e.Image,
            cost: e.Cost
        })));
        return this.apiCards;
    }
    public setExtraCards(cardString: string): ExtraCardsResults {
        let results: ExtraCardsResults = {
            string: cardString,
            cards: [],
            error: null
        };
        try {
            let json = JSON.parse(cardString) as {Name: string, Image: string, Cost?: number}[];
            results.cards.push(...json.map(e=>({
                api: this,
                cost: e.Cost ?? null,
                name: e.Name,
                image: e.Image
            })));
        } catch (e) {
            results.error = "Invalid JSON: " + e;
        }
        this.extraCardsResults = results;
        this.parseDeck(this.deckParseResults.string);
        this.updateUi();
        return results;
    }

    private findCard(name: string) {
        let card = this.apiCards.find(e=>e.name.toLowerCase() == name.toLowerCase());
        if (!card) {
            card = this.extraCardsResults.cards.find(e=>e.name.toLowerCase() == name.toLowerCase());
        }
        return card;
    }

    public parseDeck(deckString: string): DeckParseResults {
        let results: DeckParseResults = {
            string: deckString,
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

    addUiHandler(handler: (api: LorcanaApi)=>void) {
        this.uiHandler.add(handler);
    }
    removeUiHandler(handler: (api: LorcanaApi)=>void) {
        this.uiHandler.delete(handler);
    }
    updateUi() {
        for (let handler of this.uiHandler) {
            handler(this);
        }
    }

    getDeckParseResults() {
        return this.deckParseResults;
    }
    getExtraCardsResults() {
        return this.extraCardsResults;
    }
}
interface ExtraCardsResults {
    string: string;
    cards: LorcanaCard[];
    error: string | null;
}
interface DeckParseResults {
    string: string;
    deck: LorcanaDeck;
    missing: string[];
}