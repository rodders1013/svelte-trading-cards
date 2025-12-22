import type { CardTemplate, CardData } from '../types';
export interface CardCanvasProps {
    template: CardTemplate;
    data: CardData;
    width?: number;
    height?: number;
    /** Bindable reference to the SVG element for downloads */
    svgElement?: SVGSVGElement | null;
}
declare const CardCanvas: import("svelte").Component<CardCanvasProps, {}, "svgElement">;
type CardCanvas = ReturnType<typeof CardCanvas>;
export default CardCanvas;
