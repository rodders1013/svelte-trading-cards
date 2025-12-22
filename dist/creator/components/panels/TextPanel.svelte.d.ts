import type { TextComponent, DataFieldOption } from '../../types';
import { type DatasetId } from '../../../presets';
type $$ComponentProps = {
    component: TextComponent;
    dataFields: DataFieldOption[];
    datasetId?: DatasetId;
    expanded: boolean;
    onUpdate: (key: keyof Omit<TextComponent, 'type' | 'id'>, value: unknown) => void;
    onRemove: () => void;
    onMoveUp: () => void;
    onMoveDown: () => void;
};
declare const TextPanel: import("svelte").Component<$$ComponentProps, {}, "expanded">;
type TextPanel = ReturnType<typeof TextPanel>;
export default TextPanel;
