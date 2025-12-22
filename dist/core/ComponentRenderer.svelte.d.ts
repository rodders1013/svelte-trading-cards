import type { ComponentDefinition, ContainerContext, CardData } from '../types';
type $$ComponentProps = {
    definition: ComponentDefinition;
    data: CardData;
    container: ContainerContext;
};
declare const ComponentRenderer: import("svelte").Component<$$ComponentProps, {}, "">;
type ComponentRenderer = ReturnType<typeof ComponentRenderer>;
export default ComponentRenderer;
