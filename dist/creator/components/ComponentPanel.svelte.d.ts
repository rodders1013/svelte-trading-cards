import type { Snippet } from 'svelte';
interface Props {
    title: string;
    badge?: {
        text: string;
        color: string;
    };
    expanded?: boolean;
    /** Whether this component is visible (for visibility toggle) */
    visible?: boolean;
    /** Show visibility toggle instead of remove button (for Card Base) */
    showVisibilityToggle?: boolean;
    /** Allow removing this component (default true) */
    canRemove?: boolean;
    /** Allow reordering this component (default true) */
    canMove?: boolean;
    /** Callback to swap layer order (for Card Base image/background) */
    onSwapLayer?: () => void;
    onRemove: () => void;
    onMoveUp: () => void;
    onMoveDown: () => void;
    onToggleVisibility?: () => void;
    children: Snippet;
}
declare const ComponentPanel: import("svelte").Component<Props, {}, "expanded">;
type ComponentPanel = ReturnType<typeof ComponentPanel>;
export default ComponentPanel;
