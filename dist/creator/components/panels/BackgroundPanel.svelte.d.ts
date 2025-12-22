import type { BackgroundComponent } from '../../types';
type $$ComponentProps = {
    component: BackgroundComponent;
    expanded: boolean;
    isCardBase?: boolean;
    onUpdate: (key: keyof Omit<BackgroundComponent, 'type' | 'id'>, value: unknown) => void;
    onRemove: () => void;
    onMoveUp: () => void;
    onMoveDown: () => void;
    onToggleVisibility?: () => void;
    onSwapLayer?: () => void;
};
declare const BackgroundPanel: import("svelte").Component<$$ComponentProps, {}, "expanded">;
type BackgroundPanel = ReturnType<typeof BackgroundPanel>;
export default BackgroundPanel;
