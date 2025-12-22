import { z } from 'zod';
/**
 * Rarity levels for card display effects
 * Each rarity level has predefined glare/shadow settings
 */
export declare const RaritySchema: z.ZodEnum<{
    common: "common";
    uncommon: "uncommon";
    rare: "rare";
    epic: "epic";
    legendary: "legendary";
    mythic: "mythic";
}>;
export type Rarity = z.infer<typeof RaritySchema>;
/**
 * Display settings stored in CardTemplate
 * Controls how the card appears when rendered with the Card component
 */
export declare const DisplaySettingsSchema: z.ZodObject<{
    rarity: z.ZodOptional<z.ZodEnum<{
        common: "common";
        uncommon: "uncommon";
        rare: "rare";
        epic: "epic";
        legendary: "legendary";
        mythic: "mythic";
    }>>;
    customGradient: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type DisplaySettings = z.infer<typeof DisplaySettingsSchema>;
/**
 * Configuration for a single rarity preset
 * Used internally to map rarity levels to hover-tilt settings
 */
export interface RarityPreset {
    /** Glare intensity (0 = off, 1 = full) */
    glareIntensity: number;
    /** Mask name or path */
    glareMask?: string;
    /** Whether shadow is enabled */
    shadow: boolean;
    /** Shadow blur amount */
    shadowBlur?: number;
    /** Blend mode for glare overlay */
    blendMode?: string;
}
/**
 * Props for the Card component
 */
export interface CardProps {
    rarity?: Rarity;
    disabled?: boolean;
    onclick?: (event: MouseEvent) => void;
    onkeydown?: (event: KeyboardEvent) => void;
    width?: number;
    height?: number;
    class?: string;
}
/**
 * Props for FlippableCard component
 */
export interface FlippableCardProps {
    /** Whether the card is flipped to show the back */
    flipped?: boolean;
    /** Flip the card when clicked */
    flipOnClick?: boolean;
    /** Flip the card when hovered */
    flipOnHover?: boolean;
    /** Duration of flip animation in ms */
    flipDuration?: number;
}
