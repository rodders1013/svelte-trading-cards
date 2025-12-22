import type { IconRatingComponent, DataFieldOption } from '../../types';
import type { FontDropdownOption } from '../../../fonts';
type $$ComponentProps = {
    component: IconRatingComponent;
    dataFields: DataFieldOption[];
    fonts: FontDropdownOption[];
    previewData?: Record<string, unknown>;
    expanded: boolean;
    onUpdate: (key: keyof Omit<IconRatingComponent, 'type' | 'id'>, value: unknown) => void;
    onRemove: () => void;
    onMoveUp: () => void;
    onMoveDown: () => void;
};
declare const IconRatingPanel: import("svelte").Component<$$ComponentProps, {}, "expanded">;
type IconRatingPanel = ReturnType<typeof IconRatingPanel>;
export default IconRatingPanel;
