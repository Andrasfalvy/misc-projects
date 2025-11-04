export type LorcanaDeck = {
    cards: LorcanaCard[];
}
export interface LorcanaCard {
    cost: number | null;
    name: string;
    image: string;
}