import type { CardTemplate } from '../types';
import type { ContainerState, DataFieldOption } from './types.js';
interface Dataset {
    id: string;
    name: string;
    dataFields: DataFieldOption[];
    cards: Record<string, unknown>[];
}
interface Props {
    /** Available datasets for preview */
    datasets: Record<string, Dataset>;
    /** Initial dataset to use */
    initialDataset?: string;
    /** Initial template to load (editor state) */
    initialTemplate?: ContainerState[];
    /** Initial template name */
    initialTemplateName?: string;
    /** Callback when template is saved */
    onSave?: (data: {
        template: CardTemplate;
        editorState: ContainerState[];
        name: string;
    }) => void;
    /** Callback when template changes */
    onChange?: (data: {
        template: CardTemplate;
        editorState: ContainerState[];
    }) => void;
    /** Custom load template handler - if provided, called instead of file picker */
    onLoadTemplate?: () => Promise<{
        name: string;
        editorState: ContainerState[];
    } | null>;
    /** Show help button */
    showHelpButton?: boolean;
    /** CSS class for the container */
    class?: string;
}
declare const CardCreator: import("svelte").Component<Props, {}, "">;
type CardCreator = ReturnType<typeof CardCreator>;
export default CardCreator;
