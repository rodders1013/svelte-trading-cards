/**
 * Rarity presets that map rarity levels to hover-tilt display settings
 *
 * Note: Tilt and scale are FIXED for all cards (not configurable per-rarity)
 * Only glare, shadow, and mask vary by rarity level
 */
export const RARITY_PRESETS = {
    common: {
        glareIntensity: 0,
        shadow: false
    },
    uncommon: {
        glareIntensity: 0,
        shadow: true,
        shadowBlur: 10
    },
    rare: {
        glareIntensity: 0.3,
        shadow: true,
        shadowBlur: 15,
        blendMode: 'overlay'
    },
    epic: {
        glareIntensity: 0.5,
        glareMask: 'foil',
        shadow: true,
        shadowBlur: 20,
        blendMode: 'overlay'
    },
    legendary: {
        glareIntensity: 0.7,
        glareMask: 'holo',
        shadow: true,
        shadowBlur: 25,
        blendMode: 'overlay'
    },
    mythic: {
        glareIntensity: 1.0,
        glareMask: 'rainbow',
        shadow: true,
        shadowBlur: 30,
        blendMode: 'color-dodge'
    }
};
/**
 * Fixed tilt settings (same for all cards)
 * These are NOT configurable per-rarity or in the UI
 */
export const FIXED_TILT_SETTINGS = {
    tiltFactor: 0.5,
    scaleFactor: 1.02,
    springOptions: {
        stiffness: 0.15,
        damping: 0.5
    }
};
/**
 * Available glare mask names and their descriptions
 */
export const GLARE_MASKS = {
    foil: 'Metallic foil pattern',
    holo: 'Holographic rainbow pattern',
    sparkle: 'Sparkle/stars pattern',
    prism: 'Prismatic refraction pattern',
    rainbow: 'Full rainbow spectrum'
};
/**
 * Get the display settings for a rarity level
 */
export function getRarityPreset(rarity) {
    return RARITY_PRESETS[rarity];
}
/**
 * Get rarity options for dropdown UI
 */
export function getRarityOptions() {
    return [
        { value: 'common', label: 'Common', description: 'No special effects' },
        { value: 'uncommon', label: 'Uncommon', description: 'Subtle shadow' },
        { value: 'rare', label: 'Rare', description: 'Light glare + shadow' },
        { value: 'epic', label: 'Epic', description: 'Foil glare + shadow' },
        { value: 'legendary', label: 'Legendary', description: 'Holographic glare + shadow' },
        { value: 'mythic', label: 'Mythic', description: 'Rainbow glare + intense shadow' }
    ];
}
