import type { BorderComponent } from '../../types';
type $$ComponentProps = {
    component: BorderComponent;
    expanded: boolean;
    isCardBase?: boolean;
    onUpdate: (key: keyof Omit<BorderComponent, 'type' | 'id'>, value: unknown) => void;
    onRemove: () => void;
    onMoveUp: () => void;
    onMoveDown: () => void;
    onToggleVisibility?: () => void;
};
declare const BorderPanel: import("svelte").Component<$$ComponentProps, {}, "expanded">;
type BorderPanel = ReturnType<typeof BorderPanel>;
export default BorderPanel;
