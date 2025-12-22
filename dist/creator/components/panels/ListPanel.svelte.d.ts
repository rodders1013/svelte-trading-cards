import type { ListComponent, DataFieldOption } from '../../types';
import { type DatasetId } from '../../../presets';
type $$ComponentProps = {
    component: ListComponent;
    dataFields: DataFieldOption[];
    datasetId?: DatasetId;
    expanded: boolean;
    onUpdate: (key: keyof Omit<ListComponent, 'type' | 'id'>, value: unknown) => void;
    onRemove: () => void;
    onMoveUp: () => void;
    onMoveDown: () => void;
};
declare const ListPanel: import("svelte").Component<$$ComponentProps, {}, "expanded">;
type ListPanel = ReturnType<typeof ListPanel>;
export default ListPanel;
