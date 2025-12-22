type $$ComponentProps = {
    show: boolean;
    onExport: (options: {
        format: 'svg' | 'png';
        bleedMm: number;
        scale: number;
    }) => void;
};
declare const ExportDialog: import("svelte").Component<$$ComponentProps, {}, "show">;
type ExportDialog = ReturnType<typeof ExportDialog>;
export default ExportDialog;
