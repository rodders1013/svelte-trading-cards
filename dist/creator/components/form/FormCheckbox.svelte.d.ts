type $$ComponentProps = {
    label: string;
    checked: boolean;
    onchange?: (checked: boolean) => void;
    class?: string;
};
declare const FormCheckbox: import("svelte").Component<$$ComponentProps, {}, "checked">;
type FormCheckbox = ReturnType<typeof FormCheckbox>;
export default FormCheckbox;
