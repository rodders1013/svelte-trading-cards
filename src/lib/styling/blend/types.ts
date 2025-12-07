import { z } from 'zod';

/**
 * Blend Mode Types
 *
 * CSS mix-blend-mode values for compositing layers.
 * Applied via style attribute on SVG groups.
 */

// Available blend modes (subset of CSS mix-blend-mode that work well in SVG)
export const BlendMode = z.enum([
	'normal',      // No blending (default)
	'multiply',    // Darkens - great for shadows, textures
	'screen',      // Lightens - great for light effects, glows
	'overlay',     // Contrast boost - combines multiply & screen
	'darken',      // Shows darker of two layers
	'lighten',     // Shows lighter of two layers
	'color-dodge', // Brightens base by blend color
	'color-burn',  // Darkens base by blend color
	'soft-light',  // Subtle overlay effect
	'hard-light',  // Intense overlay effect
	'difference',  // Subtractive blending - creates inversions
	'exclusion'    // Similar to difference but lower contrast
]);

export type BlendMode = z.infer<typeof BlendMode>;

// Default blend mode
export const DEFAULT_BLEND_MODE: BlendMode = 'normal';

// Blend mode options for UI dropdowns
export interface BlendModeOption {
	value: BlendMode;
	label: string;
	description: string;
	category: 'basic' | 'darken' | 'lighten' | 'contrast' | 'inversion';
}

export const BLEND_MODE_OPTIONS: BlendModeOption[] = [
	// Basic
	{ value: 'normal', label: 'Normal', description: 'No blending effect', category: 'basic' },

	// Darken modes
	{ value: 'multiply', label: 'Multiply', description: 'Darkens layers together - great for textures', category: 'darken' },
	{ value: 'darken', label: 'Darken', description: 'Keeps the darker pixels', category: 'darken' },
	{ value: 'color-burn', label: 'Color Burn', description: 'Intense darkening effect', category: 'darken' },

	// Lighten modes
	{ value: 'screen', label: 'Screen', description: 'Lightens layers together - great for glows', category: 'lighten' },
	{ value: 'lighten', label: 'Lighten', description: 'Keeps the lighter pixels', category: 'lighten' },
	{ value: 'color-dodge', label: 'Color Dodge', description: 'Intense brightening effect', category: 'lighten' },

	// Contrast modes
	{ value: 'overlay', label: 'Overlay', description: 'Boosts contrast - multiply + screen combined', category: 'contrast' },
	{ value: 'soft-light', label: 'Soft Light', description: 'Subtle contrast adjustment', category: 'contrast' },
	{ value: 'hard-light', label: 'Hard Light', description: 'Intense contrast effect', category: 'contrast' },

	// Inversion modes
	{ value: 'difference', label: 'Difference', description: 'Creates color inversions', category: 'inversion' },
	{ value: 'exclusion', label: 'Exclusion', description: 'Softer inversion effect', category: 'inversion' }
];

// Get options grouped by category (for UI with sections)
export function getBlendModesByCategory(): Record<string, BlendModeOption[]> {
	return {
		basic: BLEND_MODE_OPTIONS.filter(o => o.category === 'basic'),
		darken: BLEND_MODE_OPTIONS.filter(o => o.category === 'darken'),
		lighten: BLEND_MODE_OPTIONS.filter(o => o.category === 'lighten'),
		contrast: BLEND_MODE_OPTIONS.filter(o => o.category === 'contrast'),
		inversion: BLEND_MODE_OPTIONS.filter(o => o.category === 'inversion')
	};
}
