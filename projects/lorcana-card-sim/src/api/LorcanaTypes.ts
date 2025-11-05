import LorcanaApi from "./LorcanaApi";

export type LorcanaDeck = {
    cards: LorcanaCard[];
}
export interface LorcanaCard {
    api: LorcanaApi;
    cost: number | null;
    name: string;
    image: string;
}