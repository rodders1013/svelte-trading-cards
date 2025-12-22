import { z } from 'zod';
export declare const HolographicConfigSchema: z.ZodObject<{
    color: z.ZodDefault<z.ZodString>;
    secondaryColor: z.ZodDefault<z.ZodString>;
    tertiaryColor: z.ZodOptional<z.ZodString>;
    speed: z.ZodDefault<z.ZodNumber>;
    angle: z.ZodDefault<z.ZodNumber>;
    apply: z.ZodDefault<z.ZodEnum<{
        fill: "fill";
        stroke: "stroke";
        both: "both";
    }>>;
}, z.core.$strip>;
export type HolographicConfig = z.infer<typeof HolographicConfigSchema>;
import type { Snippet } from 'svelte';
type $$ComponentProps = Partial<HolographicConfig> & {
    children: Snippet;
};
declare const HolographicWrapper: import("svelte").Component<$$ComponentProps, {}, "">;
type HolographicWrapper = ReturnType<typeof HolographicWrapper>;
export default HolographicWrapper;
