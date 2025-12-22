type FontOption = {
    value: string;
    label: string;
};
type $$ComponentProps = {
    label: string;
    value: string;
    options: FontOption[];
    onchange?: (value: string) => void;
    class?: string;
};
declare const FormFontSelect: import("svelte").Component<$$ComponentProps, {}, "value">;
type FormFontSelect = ReturnType<typeof FormFontSelect>;
export default FormFontSelect;
