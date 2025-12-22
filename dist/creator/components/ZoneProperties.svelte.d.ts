import type { ContainerState } from '../types';
type $$ComponentProps = {
    container: ContainerState;
    expanded: boolean;
    onUpdate: <K extends keyof ContainerState>(key: K, value: ContainerState[K]) => void;
    onDuplicate: () => void;
    onDelete: () => void;
    onTogglePanel: () => void;
};
declare const ZoneProperties: import("svelte").Component<$$ComponentProps, {}, "expanded">;
type ZoneProperties = ReturnType<typeof ZoneProperties>;
export default ZoneProperties;
