import type { DataFieldOption } from '../../types.js';
type $$ComponentProps = {
    show: boolean;
    unmappedFields: string[];
    sourceDataset: string;
    targetDataset: string;
    targetDataFields: DataFieldOption[];
    onApply: (mapping: Record<string, string>) => void;
    onSkip: () => void;
};
declare const FieldRemapDialog: import("svelte").Component<$$ComponentProps, {}, "show">;
type FieldRemapDialog = ReturnType<typeof FieldRemapDialog>;
export default FieldRemapDialog;
