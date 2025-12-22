interface Props {
    show: boolean;
    draftAge: string;
    onRestore: () => void;
    onDiscard: () => void;
}
declare const RestoreDraftDialog: import("svelte").Component<Props, {}, "show">;
type RestoreDraftDialog = ReturnType<typeof RestoreDraftDialog>;
export default RestoreDraftDialog;
