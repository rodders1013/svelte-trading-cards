import type { BorderModifier } from '../types/modifiers';
import type { ShapeSource } from './shapes';
type $$ComponentProps = {
    border: BorderModifier;
    shape?: ShapeSource;
    width: number;
    height: number;
    radius?: number;
};
declare const BorderRenderer: import("svelte").Component<$$ComponentProps, {}, "">;
type BorderRenderer = ReturnType<typeof BorderRenderer>;
export default BorderRenderer;
