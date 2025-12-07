// Effect Types
export type {
	EffectType,
	EffectConfig,
	GlowEffect,
	StrokeGlowEffect,
	ShadowEffect,
	NeonEffect,
	InnerGlowEffect,
	LiftEffect,
	OutlineEffect,
	EffectPreset
} from './types.js';

export {
	EffectType as EffectTypeSchema,
	EffectConfigSchema,
	GlowEffectSchema,
	StrokeGlowEffectSchema,
	ShadowEffectSchema,
	NeonEffectSchema,
	InnerGlowEffectSchema,
	LiftEffectSchema,
	OutlineEffectSchema,
	LIFT_ELEVATIONS
} from './types.js';

// Presets and utilities
export {
	EFFECT_PRESETS,
	EFFECT_COLOR_PRESETS,
	getEffectOptions,
	getDefaultEffectConfig
} from './presets.js';

// Effect Wrapper Component
export { default as EffectWrapper } from './EffectWrapper.svelte';
