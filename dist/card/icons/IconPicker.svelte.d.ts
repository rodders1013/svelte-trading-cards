import type { IconData } from './Icon.svelte';
interface Props {
    value?: {
        iconData?: IconData;
        iconName?: string;
    };
    onSelect: (icon: {
        iconData: IconData;
        iconName: string;
    }) => void;
}
declare const IconPicker: import("svelte").Component<Props, {}, "">;
type IconPicker = ReturnType<typeof IconPicker>;
export default IconPicker;
