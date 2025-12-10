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

export type Rarity = z.infer<typeof RaritySchema>;

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
	// Rarity override (reads from template.display.rarity by default)
	rarity?: Rarity;

	// Disable all interactive effects
	disabled?: boolean;

	// Event handlers
	onclick?: (event: MouseEvent) => void;
	onkeydown?: (event: KeyboardEvent) => void;

	// Layout
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
