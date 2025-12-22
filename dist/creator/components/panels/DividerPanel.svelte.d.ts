import type { DividerComponent } from '../../types';
type $$ComponentProps = {
    component: DividerComponent;
    expanded: boolean;
    onUpdate: (key: keyof Omit<DividerComponent, 'type' | 'id'>, value: unknown) => void;
    onRemove: () => void;
    onMoveUp: () => void;
    onMoveDown: () => void;
};
declare const DividerPanel: import("svelte").Component<$$ComponentProps, {}, "expanded">;
type DividerPanel = ReturnType<typeof DividerPanel>;
export default DividerPanel;
