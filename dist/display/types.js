import { z } from 'zod';
/**
 * Rarity levels for card display effects
 * Each rarity level has predefined glare/shadow settings
 */
export const RaritySchema = z.enum([
    'common',
    'uncommon',
    'rare',
    'epic',
    'legendary',
    'mythic'
]);
/**
 * Display settings stored in CardTemplate
 * Controls how the card appears when rendered with the Card component
 */
export const DisplaySettingsSchema = z.object({
    /** Rarity level - determines glare intensity, mask, and shadow */
    rarity: RaritySchema.optional(),
    /** Custom CSS gradient for the glare effect (--hover-tilt-custom-gradient) */
    customGradient: z.string().optional()
});
