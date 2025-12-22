import { z } from 'zod';
export declare const FilterWrapperPropsSchema: z.ZodObject<{
    filter: z.ZodOptional<z.ZodObject<{
        brightness: z.ZodDefault<z.ZodNumber>;
        contrast: z.ZodDefault<z.ZodNumber>;
        saturate: z.ZodDefault<z.ZodNumber>;
        blur: z.ZodDefault<z.ZodNumber>;
        grayscale: z.ZodDefault<z.ZodNumber>;
        sepia: z.ZodDefault<z.ZodNumber>;
        hueRotate: z.ZodDefault<z.ZodNumber>;
        invert: z.ZodDefault<z.ZodNumber>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type FilterWrapperProps = z.infer<typeof FilterWrapperPropsSchema>;
import type { Snippet } from 'svelte';
type $$ComponentProps = FilterWrapperProps & {
    children: Snippet;
};
declare const FilterWrapper: import("svelte").Component<$$ComponentProps, {}, "">;
type FilterWrapper = ReturnType<typeof FilterWrapper>;
export default FilterWrapper;
