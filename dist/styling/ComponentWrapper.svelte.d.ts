import type { Snippet } from 'svelte';
import type { UniversalModifiers } from '../types/modifiers';
import type { ContainerContext } from '../types';
type $$ComponentProps = {
    container: ContainerContext;
    modifiers?: UniversalModifiers;
    children: Snippet;
};
declare const ComponentWrapper: import("svelte").Component<$$ComponentProps, {}, "">;
type ComponentWrapper = ReturnType<typeof ComponentWrapper>;
export default ComponentWrapper;
