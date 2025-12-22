import type { ProgressBarComponent, DataFieldOption } from '../../types';
type $$ComponentProps = {
    component: ProgressBarComponent;
    dataFields: DataFieldOption[];
    expanded: boolean;
    onUpdate: (key: keyof Omit<ProgressBarComponent, 'type' | 'id'>, value: unknown) => void;
    onRemove: () => void;
    onMoveUp: () => void;
    onMoveDown: () => void;
};
declare const ProgressBarPanel: import("svelte").Component<$$ComponentProps, {}, "expanded">;
type ProgressBarPanel = ReturnType<typeof ProgressBarPanel>;
export default ProgressBarPanel;
