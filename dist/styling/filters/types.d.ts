import { z } from 'zod';
/**
 * Filter configuration for CSS filter effects.
 * All values are optional and default to their neutral values.
 */
export declare const FilterConfigSchema: z.ZodObject<{
    brightness: z.ZodDefault<z.ZodNumber>;
    contrast: z.ZodDefault<z.ZodNumber>;
    saturate: z.ZodDefault<z.ZodNumber>;
    blur: z.ZodDefault<z.ZodNumber>;
    grayscale: z.ZodDefault<z.ZodNumber>;
    sepia: z.ZodDefault<z.ZodNumber>;
    hueRotate: z.ZodDefault<z.ZodNumber>;
    invert: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
export type FilterConfig = z.infer<typeof FilterConfigSchema>;
/**
 * Default filter config (all neutral values)
 */
export declare const DEFAULT_FILTER_CONFIG: FilterConfig;
/**
 * Check if a filter config has any non-default values
 */
export declare function hasActiveFilters(config: Partial<FilterConfig> | undefined): boolean;
/**
 * Generate CSS filter string from config
 */
export declare function buildFilterString(config: Partial<FilterConfig> | undefined): string;
/**
 * Image transform configuration for pan, zoom, rotation, and flip.
 * These are image-specific transforms for positioning content within container.
 */
export declare const ImageTransformConfigSchema: z.ZodObject<{
    offsetX: z.ZodDefault<z.ZodNumber>;
    offsetY: z.ZodDefault<z.ZodNumber>;
    scale: z.ZodDefault<z.ZodNumber>;
    rotation: z.ZodDefault<z.ZodNumber>;
    flipHorizontal: z.ZodDefault<z.ZodBoolean>;
    flipVertical: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
export type ImageTransformConfig = z.infer<typeof ImageTransformConfigSchema>;
/**
 * Default image transform config (neutral values)
 */
export declare const DEFAULT_IMAGE_TRANSFORM: ImageTransformConfig;
/**
 * Check if an image transform config has any non-default values
 */
export declare function hasActiveTransform(config: Partial<ImageTransformConfig> | undefined): boolean;
/**
 * Build SVG transform string from image transform config
 * Returns transform and adjusted viewBox for pan/zoom
 */
export declare function buildImageTransform(config: Partial<ImageTransformConfig> | undefined, containerWidth: number, containerHeight: number): {
    transform: string;
    viewBox: string;
};
