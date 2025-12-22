import type { StatPanelComponent, DataFieldOption } from '../../types';
import { type DatasetId } from '../../../presets';
type $$ComponentProps = {
    component: StatPanelComponent;
    dataFields: DataFieldOption[];
    datasetId?: DatasetId;
    expanded: boolean;
    onUpdate: (key: keyof Omit<StatPanelComponent, 'type' | 'id'>, value: unknown) => void;
    onRemove: () => void;
    onMoveUp: () => void;
    onMoveDown: () => void;
};
declare const StatPanelPanel: import("svelte").Component<$$ComponentProps, {}, "expanded">;
type StatPanelPanel = ReturnType<typeof StatPanelPanel>;
export default StatPanelPanel;
