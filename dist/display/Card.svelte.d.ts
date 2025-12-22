import type { CardTemplate, CardData } from '../types';
import type { CardProps, FlippableCardProps } from './types.js';
export interface Props extends CardProps, FlippableCardProps {
    /** Card template defining the visual layout */
    template: CardTemplate;
    /** Card data to populate the template */
    data?: CardData;
    /** Back template for flip support (optional) */
    backTemplate?: CardTemplate;
    /** Back data for flip support (optional, defaults to main data) */
    backData?: CardData;
}
declare const Card: import("svelte").Component<Props, {}, "flipped">;
type Card = ReturnType<typeof Card>;
export default Card;
