import { type BlendMode } from '../../../styling/blend';
interface Props {
    blendMode: BlendMode | undefined;
    onUpdate: (blendMode: BlendMode | undefined) => void;
}
declare const BlendControls: import("svelte").Component<Props, {}, "">;
type BlendControls = ReturnType<typeof BlendControls>;
export default BlendControls;
