// Animation Types
export type {
	AnimationType,
	AnimationDirection,
	AnimationEasing,
	AnimationOrigin,
	PulsePattern,
	FloatStyle,
	AnimationConfig,
	AnimationPreset
} from './types.js';

export {
	AnimationType as AnimationTypeSchema,
	AnimationDirection as AnimationDirectionSchema,
	AnimationEasing as AnimationEasingSchema,
	AnimationOrigin as AnimationOriginSchema,
	PulsePattern as PulsePatternSchema,
	FloatStyle as FloatStyleSchema,
	AnimationConfigSchema
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
