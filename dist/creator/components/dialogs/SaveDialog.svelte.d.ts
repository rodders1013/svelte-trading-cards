type $$ComponentProps = {
    open: boolean;
    templateName: string;
    isEditing?: boolean;
    onSave: (name: string) => void;
    onSaveAsNew: (name: string) => void;
};
declare const SaveDialog: import("svelte").Component<$$ComponentProps, {}, "open" | "templateName">;
type SaveDialog = ReturnType<typeof SaveDialog>;
export default SaveDialog;
