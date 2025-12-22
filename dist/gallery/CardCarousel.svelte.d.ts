export type { CardCarouselProps } from './types.js';
import type { Snippet } from 'svelte';
type $$ComponentProps = {
    class?: string;
    gap?: number;
    snap?: boolean;
    snapAlign?: 'start' | 'center' | 'end';
    showNavigation?: boolean;
    scrollAmount?: number;
    'aria-label'?: string;
    scrollLeft?: number;
    children: Snippet;
    navigationPrev?: Snippet;
    navigationNext?: Snippet;
};
declare const CardCarousel: import("svelte").Component<$$ComponentProps, {}, "scrollLeft">;
type CardCarousel = ReturnType<typeof CardCarousel>;
export default CardCarousel;
