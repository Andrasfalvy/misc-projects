import {GLProgramDefinition, GLRenderer} from "@mrgazdag/gl-lite";
import GameData from "../data/GameData";
import F1Renderer, {ComponentContext} from "../F1Renderer";
import ChangeableProperty from "../ChangeableProperty";

export default abstract class AbstractComponent {
    private initialized: boolean;
    constructor() {
        this.initialized = false;
    }
    performRender(renderer: GLRenderer, context: ComponentContext) {
        if (!this.shouldRender(context)) {
            if (this.initialized) {
                this.performDispose();
            }
            return;
        }
        if (!this.initialized) {
            this.init(renderer, context);
            this.initialized = true;
        }
        this.render(renderer, context);
    }
    performDispose() {
        this.dispose();
        this.initialized = false;
    }

    protected createRect<T extends {}>(renderer: GLRenderer, context: ComponentContext, attributes: GLProgramDefinition<T> & Required<Pick<GLProgramDefinition<T>,"vert"|"frag"|"uniforms">>) {
        let rectBuffers = context.renderer.getRectBuffers();
        return renderer.program<T>({
            attributes: {
                CornerPosition: {
                    buffer: rectBuffers.position,
                    size: 2,
                },
            },
            elements: rectBuffers.index,
            count: rectBuffers.count,
            missingHandler: "warning",
            blend: {
                enabled: true,
                equation: "add",
                srcFactor: ["srcAlpha", "one"],
                dstFactor: "oneMinusSrcAlpha",
            },
            ...attributes
        });
    }

    abstract shouldRender(context: ComponentContext): boolean;
    abstract init(renderer: GLRenderer, context: ComponentContext): void;
    abstract render(renderer: GLRenderer, context: ComponentContext): void;
    abstract dispose(): void;
}