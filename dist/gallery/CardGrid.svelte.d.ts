export type { CardGridProps } from './types.js';
import type { Snippet } from 'svelte';
type $$ComponentProps = {
    class?: string;
    minCardWidth?: number;
    gap?: number;
    columns?: string;
    'aria-label'?: string;
    children: Snippet;
};
declare const CardGrid: import("svelte").Component<$$ComponentProps, {}, "">;
type CardGrid = ReturnType<typeof CardGrid>;
export default CardGrid;
