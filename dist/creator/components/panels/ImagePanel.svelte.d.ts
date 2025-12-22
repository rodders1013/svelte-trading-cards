import type { ImageComponent, DataFieldOption } from '../../types';
type $$ComponentProps = {
    component: ImageComponent;
    dataFields: DataFieldOption[];
    expanded: boolean;
    isCardBase?: boolean;
    onUpdate: (key: keyof Omit<ImageComponent, 'type' | 'id'>, value: unknown) => void;
    onRemove: () => void;
    onMoveUp: () => void;
    onMoveDown: () => void;
    onToggleVisibility?: () => void;
    onSwapLayer?: () => void;
};
declare const ImagePanel: import("svelte").Component<$$ComponentProps, {}, "expanded">;
type ImagePanel = ReturnType<typeof ImagePanel>;
export default ImagePanel;
