import type { EffectType, EffectPreset } from './types.js';
/**
 * Effect Presets
 *
 * Definitions and UI options for all available effects.
 */
export declare const EFFECT_PRESETS: Record<Exclude<EffectType, 'none'>, EffectPreset>;
/**
 * Get effect options for UI dropdown
 */
export declare function getEffectOptions(): {
    value: EffectType;
    label: string;
    description: string;
}[];
/**
 * Get default configuration for an effect type
 */
export declare function getDefaultEffectConfig(type: EffectType): {
    type: "glow";
    color: string;
    blur: number;
    intensity: number;
    animated: boolean;
    animationDuration: number;
    offsetX?: undefined;
    offsetY?: undefined;
    spread?: undefined;
    elevation?: undefined;
    width?: undefined;
} | {
    type: "strokeGlow";
    color: undefined;
    blur: number;
    intensity: number;
    animated: boolean;
    animationDuration: number;
    offsetX?: undefined;
    offsetY?: undefined;
    spread?: undefined;
    elevation?: undefined;
    width?: undefined;
} | {
    type: "shadow";
    color: string;
    blur: number;
    offsetX: number;
    offsetY: number;
    animated: boolean;
    animationDuration: number;
    intensity?: undefined;
    spread?: undefined;
    elevation?: undefined;
    width?: undefined;
} | {
    type: "neon";
    color: string;
    intensity: number;
    spread: number;
    animated: boolean;
    animationDuration: number;
    blur?: undefined;
    offsetX?: undefined;
    offsetY?: undefined;
    elevation?: undefined;
    width?: undefined;
} | {
    type: "innerGlow";
    color: string;
    blur: number;
    intensity: number;
    animated: boolean;
    animationDuration: number;
    offsetX?: undefined;
    offsetY?: undefined;
    spread?: undefined;
    elevation?: undefined;
    width?: undefined;
} | {
    type: "lift";
    elevation: "md";
    animated: boolean;
    animationDuration: number;
    color?: undefined;
    blur?: undefined;
    intensity?: undefined;
    offsetX?: undefined;
    offsetY?: undefined;
    spread?: undefined;
    width?: undefined;
} | {
    type: "outline";
    color: string;
    width: number;
    animated: boolean;
    animationDuration: number;
    blur?: undefined;
    intensity?: undefined;
    offsetX?: undefined;
    offsetY?: undefined;
    spread?: undefined;
    elevation?: undefined;
} | undefined;
/**
 * Curated color presets for effects
 */
export declare const EFFECT_COLOR_PRESETS: {
    glow: {
        label: string;
        value: string;
    }[];
    neon: {
        label: string;
        value: string;
    }[];
    shadow: {
        label: string;
        value: string;
    }[];
};
