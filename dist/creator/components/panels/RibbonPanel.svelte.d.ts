import type { RibbonComponent, DataFieldOption } from '../../types';
import { type DatasetId } from '../../../presets';
type $$ComponentProps = {
    component: RibbonComponent;
    dataFields: DataFieldOption[];
    datasetId?: DatasetId;
    expanded: boolean;
    onUpdate: (key: keyof Omit<RibbonComponent, 'type' | 'id'>, value: unknown) => void;
    onRemove: () => void;
    onMoveUp: () => void;
    onMoveDown: () => void;
};
declare const RibbonPanel: import("svelte").Component<$$ComponentProps, {}, "expanded">;
type RibbonPanel = ReturnType<typeof RibbonPanel>;
export default RibbonPanel;
