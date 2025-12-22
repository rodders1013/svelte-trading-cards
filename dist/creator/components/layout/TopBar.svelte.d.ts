import { type Rarity } from '../../../display';
interface DatasetInfo {
    id: string;
    name: string;
}
interface CardInfo {
    index: number;
    name: string;
}
type $$ComponentProps = {
    templateName: string;
    hasDraft?: boolean;
    lastSaved?: Date | null;
    previewMode: 'fields' | 'data';
    datasets?: DatasetInfo[];
    selectedDataset?: string;
    selectedCardIndex?: number;
    cards?: CardInfo[];
    displayRarity?: Rarity;
    displayCustomGradient?: string;
    showPreviewEffects?: boolean;
    onDatasetChange?: (datasetId: string) => void;
    onSaveTemplate: () => void;
    onLoadTemplate: (event: Event) => void;
    onExport?: () => void;
};
declare const TopBar: import("svelte").Component<$$ComponentProps, {}, "templateName" | "previewMode" | "selectedDataset" | "selectedCardIndex" | "displayRarity" | "displayCustomGradient" | "showPreviewEffects">;
type TopBar = ReturnType<typeof TopBar>;
export default TopBar;
