type $$ComponentProps = {
    label: string;
    value: number;
    min?: number;
    max?: number;
    step?: number;
    /** When true, slider uses 0-100 range but value is 0-1 internally */
    percent?: boolean;
    suffix?: string;
    onchange?: (value: number) => void;
    class?: string;
};
declare const FormSlider: import("svelte").Component<$$ComponentProps, {}, "value">;
type FormSlider = ReturnType<typeof FormSlider>;
export default FormSlider;
