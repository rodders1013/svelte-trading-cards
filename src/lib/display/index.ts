// Main display component
export { default as Card } from './Card.svelte';

// Types
export type {
	Rarity,
	DisplaySettings,
	RarityPreset,
	CardProps,
	FlippableCardProps
} from './types.js';

export { RaritySchema, DisplaySettingsSchema } from './types.js';

// Presets and utilities
export {
	RARITY_PRESETS,
	FIXED_TILT_SETTINGS,
	GLARE_MASKS,
	getRarityPreset,
	getRarityOptions
} from './presets.js';

export type { GlareMaskName } from './presets.js';
