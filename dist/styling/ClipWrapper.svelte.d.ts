import type { Snippet } from 'svelte';
import type { ShapeSource } from './shapes';
type $$ComponentProps = {
    shape?: ShapeSource;
    width: number;
    height: number;
    children: Snippet;
};
declare const ClipWrapper: import("svelte").Component<$$ComponentProps, {}, "">;
type ClipWrapper = ReturnType<typeof ClipWrapper>;
export default ClipWrapper;
