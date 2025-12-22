type $$ComponentProps = {
    label: string;
    checked: boolean;
    onchange?: (checked: boolean) => void;
    class?: string;
};
declare const FormSwitch: import("svelte").Component<$$ComponentProps, {}, "checked">;
type FormSwitch = ReturnType<typeof FormSwitch>;
export default FormSwitch;
