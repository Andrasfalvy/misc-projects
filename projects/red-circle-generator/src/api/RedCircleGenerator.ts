import RCElement from "./RCElement";

export default class RedCircleGenerator {
    private readonly updaters: ((c: RedCircleGenerator)=>void)[];
    private readonly elementsByCreation: RCElement[];
    private readonly elementsByLastFocus: RCElement[];
    private baseImage: HTMLImageElement | null;
    private selectedElement: RCElement | null;
    constructor() {
        this.elementsByCreation = [];
        this.elementsByLastFocus = [];
        this.selectedElement = null;
        this.baseImage = null;
        this.updaters = [];
    }

    setBaseImage(image: HTMLImageElement) {
        this.baseImage = image;
    }

    createElement() {
        let el = new RCElement(this, 0, 0, 0, 0, "#000000", "circle");
        this.elementsByCreation.push(el);
        this.elementsByLastFocus.push(el);
        this.setSelectedElement(el);
        this.update();
        return el;
    }
    removeElement(element: RCElement) {
        this.elementsByCreation.splice(this.elementsByCreation.indexOf(element), 1);
        this.elementsByLastFocus.splice(this.elementsByLastFocus.indexOf(element), 1);
        if (this.selectedElement == element) {
            this.selectedElement = null;
        }
        this.update();
    }

    getSelectedElement() {
        return this.selectedElement;
    }
    setSelectedElement(element: RCElement | null) {
        this.selectedElement = element;
        if (element) {
            this.elementsByLastFocus.splice(this.elementsByLastFocus.indexOf(element), 1);
            this.elementsByLastFocus.push(element);
        }
        this.update();
    }
    getElements() {
        return this.elementsByCreation;
    }
    getBaseImage() {
        return this.baseImage;
    }
    update() {
        for (let updater of this.updaters) {
            updater(this);
        }
    }

    addUpdater(updater: (c: RedCircleGenerator)=>void) {
        this.updaters.push(updater);
    }
    removeUpdater(updater: (c: RedCircleGenerator)=>void) {
        let index = this.updaters.indexOf(updater);
        if (index == -1) return;
        this.updaters.splice(index, 1);
    }
}