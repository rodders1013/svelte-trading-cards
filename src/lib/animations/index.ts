// Animation Types
export type {
	AnimationType,
	AnimationSpeed,
	AnimationDirection,
	AnimationEasing,
	AnimationConfig,
	AnimationPreset
} from './types.js';

export {
	AnimationType as AnimationTypeSchema,
	AnimationSpeed as AnimationSpeedSchema,
	AnimationDirection as AnimationDirectionSchema,
	AnimationEasing as AnimationEasingSchema,
	AnimationConfigSchema,
	SPEED_DURATIONS
} from './types.js';

// Presets and utilities
export {
	ANIMATION_PRESETS,
	getAllKeyframes,
	getKeyframes,
	getAnimationName,
	getDefaultEasing,
	supportsDirection,
	getAnimationOptions
} from './presets.js';

// CSS styles for SVG injection
export {
	ANIMATION_KEYFRAMES,
	ANIMATION_CLASSES,
	getAnimationCSS,
	getAnimationStyleVars
} from './styles.js';

// Animation Wrapper Component
export { default as AnimationWrapper } from './AnimationWrapper.svelte';
