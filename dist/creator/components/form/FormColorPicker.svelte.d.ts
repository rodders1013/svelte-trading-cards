type $$ComponentProps = {
    label: string;
    value: string;
    onchange?: (value: string) => void;
    class?: string;
};
declare const FormColorPicker: import("svelte").Component<$$ComponentProps, {}, "value">;
type FormColorPicker = ReturnType<typeof FormColorPicker>;
export default FormColorPicker;
