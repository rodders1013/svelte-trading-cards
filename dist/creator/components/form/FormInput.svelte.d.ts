type $$ComponentProps = {
    label: string;
    value: string | number;
    type?: 'text' | 'number' | 'email' | 'password' | 'url';
    min?: number;
    max?: number;
    step?: number;
    placeholder?: string;
    onchange?: (value: string | number) => void;
    class?: string;
};
declare const FormInput: import("svelte").Component<$$ComponentProps, {}, "value">;
type FormInput = ReturnType<typeof FormInput>;
export default FormInput;
