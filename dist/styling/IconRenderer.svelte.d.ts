import { z } from 'zod';
/**
 * Transform configuration for icons.
 * Controls scale, position offset, rotation, and flip.
 */
export declare const IconTransformConfigSchema: z.ZodObject<{
    scale: z.ZodDefault<z.ZodNumber>;
    offsetX: z.ZodDefault<z.ZodNumber>;
    offsetY: z.ZodDefault<z.ZodNumber>;
    rotation: z.ZodDefault<z.ZodNumber>;
    flipHorizontal: z.ZodDefault<z.ZodBoolean>;
    flipVertical: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
export type IconTransformConfig = z.infer<typeof IconTransformConfigSchema>;
/**
 * Default transform config
 */
export declare const DEFAULT_ICON_TRANSFORM: IconTransformConfig;
/**
 * Sanitizes SVG body content to prevent XSS attacks.
 */
export declare function sanitizeSvgBody(body: string): string;
/**
 * Strip fill attributes from SVG body to allow inheritance
 */
export declare function stripFillAttributes(body: string): string;
import { type HolographicConfig } from './HolographicWrapper.svelte';
interface Props {
    /** SVG body content (the inner paths/shapes) */
    body: string;
    /** Native icon width (e.g., 24) */
    width?: number;
    /** Native icon height (e.g., 24) */
    height?: number;
    /** Container width to render into */
    containerWidth: number;
    /** Container height to render into */
    containerHeight: number;
    /** How to fit icon in container */
    scaleMode?: 'contain' | 'cover' | 'stretch';
    /** Transform for scale, offset, rotation, flip */
    transform?: Partial<IconTransformConfig>;
    /** Fill color */
    fill?: string;
    /** Stroke color */
    stroke?: string;
    /** Stroke width */
    strokeWidth?: number;
    /** Holographic effect config */
    holographic?: HolographicConfig;
    /** Opacity */
    opacity?: number;
}
declare const IconRenderer: import("svelte").Component<Props, {}, "">;
type IconRenderer = ReturnType<typeof IconRenderer>;
export default IconRenderer;
