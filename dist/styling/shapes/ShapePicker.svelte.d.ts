import { type ShapeSource } from './types';
interface Props {
    value: ShapeSource;
    onchange: (source: ShapeSource) => void;
    showCustomOption?: boolean;
}
declare const ShapePicker: import("svelte").Component<Props, {}, "">;
type ShapePicker = ReturnType<typeof ShapePicker>;
export default ShapePicker;
