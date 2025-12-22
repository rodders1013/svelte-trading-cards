import type { IconData } from '../../../card/icons';
import type { IconComponent } from '../../types';
type $$ComponentProps = {
    component: IconComponent;
    expanded: boolean;
    onUpdate: (key: keyof Omit<IconComponent, 'type' | 'id'>, value: unknown) => void;
    onUpdateIcon: (icon: {
        iconData: IconData;
        iconName: string;
    }) => void;
    onRemove: () => void;
    onMoveUp: () => void;
    onMoveDown: () => void;
};
declare const IconPanel: import("svelte").Component<$$ComponentProps, {}, "expanded">;
type IconPanel = ReturnType<typeof IconPanel>;
export default IconPanel;
