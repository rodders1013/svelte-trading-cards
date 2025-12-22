type Option = {
    value: string;
    label: string;
} | string;
type $$ComponentProps = {
    label: string;
    value: string;
    options: Option[];
    onchange?: (value: string) => void;
    class?: string;
    placeholder?: string;
};
declare const FormSelect: import("svelte").Component<$$ComponentProps, {}, "value">;
type FormSelect = ReturnType<typeof FormSelect>;
export default FormSelect;
