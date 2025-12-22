import type { ContainerState } from '../../types';
type $$ComponentProps = {
    containers: ContainerState[];
    onAddEmpty: () => void;
    onAddTemplate: (template: string) => void;
    onDuplicateLayer: (layerId: string) => void;
};
declare const AddLayerPopover: import("svelte").Component<$$ComponentProps, {}, "">;
type AddLayerPopover = ReturnType<typeof AddLayerPopover>;
export default AddLayerPopover;
