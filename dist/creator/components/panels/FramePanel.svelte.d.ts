import type { FrameComponent } from '../../types';
type $$ComponentProps = {
    component: FrameComponent;
    expanded: boolean;
    onUpdate: (key: keyof Omit<FrameComponent, 'type' | 'id'>, value: unknown) => void;
    onRemove: () => void;
    onMoveUp: () => void;
    onMoveDown: () => void;
};
declare const FramePanel: import("svelte").Component<$$ComponentProps, {}, "expanded">;
type FramePanel = ReturnType<typeof FramePanel>;
export default FramePanel;
