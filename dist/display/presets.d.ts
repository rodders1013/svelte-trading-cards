import type { Rarity, RarityPreset } from './types.js';
/**
 * Rarity presets that map rarity levels to hover-tilt display settings
 *
 * Note: Tilt and scale are FIXED for all cards (not configurable per-rarity)
 * Only glare, shadow, and mask vary by rarity level
 */
export declare const RARITY_PRESETS: Record<Rarity, RarityPreset>;
/**
 * Fixed tilt settings (same for all cards)
 * These are NOT configurable per-rarity or in the UI
 */
export declare const FIXED_TILT_SETTINGS: {
    readonly tiltFactor: 0.5;
    readonly scaleFactor: 1.02;
    readonly springOptions: {
        readonly stiffness: 0.15;
        readonly damping: 0.5;
    };
};
/**
 * Available glare mask names and their descriptions
 */
export declare const GLARE_MASKS: {
    readonly foil: "Metallic foil pattern";
    readonly holo: "Holographic rainbow pattern";
    readonly sparkle: "Sparkle/stars pattern";
    readonly prism: "Prismatic refraction pattern";
    readonly rainbow: "Full rainbow spectrum";
};
export type GlareMaskName = keyof typeof GLARE_MASKS;
/**
 * Get the display settings for a rarity level
 */
export declare function getRarityPreset(rarity: Rarity): RarityPreset;
/**
 * Get rarity options for dropdown UI
 */
export declare function getRarityOptions(): Array<{
    value: Rarity;
    label: string;
    description: string;
}>;
