import { z } from 'zod';
/**
 * Blend Mode Types
 *
 * CSS mix-blend-mode values for compositing layers.
 * Applied via style attribute on SVG groups.
 */
export declare const BlendMode: z.ZodEnum<{
    normal: "normal";
    multiply: "multiply";
    screen: "screen";
    overlay: "overlay";
    darken: "darken";
    lighten: "lighten";
    "color-dodge": "color-dodge";
    "color-burn": "color-burn";
    "soft-light": "soft-light";
    "hard-light": "hard-light";
    difference: "difference";
    exclusion: "exclusion";
}>;
export type BlendMode = z.infer<typeof BlendMode>;
export declare const DEFAULT_BLEND_MODE: BlendMode;
export interface BlendModeOption {
    value: BlendMode;
    label: string;
    description: string;
    category: 'basic' | 'darken' | 'lighten' | 'contrast' | 'inversion';
}
export declare const BLEND_MODE_OPTIONS: BlendModeOption[];
export declare function getBlendModesByCategory(): Record<string, BlendModeOption[]>;
