// Core
export { CardCanvas, ComponentRenderer, Group, registerComponent, getComponentByName } from './core/index.js';

// Components
export { GradientBackground, Image, PatternBackground } from './components/backgrounds/index.js';
export { Border } from './components/borders/index.js';
export { TextField } from './components/fields/index.js';
export { Icon, IconPicker } from './components/icons/index.js';
export type { IconData, IconProps } from './components/icons/index.js';

// Animations
export {
	AnimationWrapper,
	getAnimationOptions,
	getAnimationCSS,
	ANIMATION_PRESETS,
	SPEED_DURATIONS
} from './animations/index.js';
export type {
	AnimationType,
	AnimationSpeed,
	AnimationDirection,
	AnimationEasing,
	AnimationConfig,
	AnimationPreset
} from './animations/index.js';
export { AnimationConfigSchema } from './animations/index.js';

// Types
export type {
	CardTemplate,
	ComponentDefinition,
	CardData,
	TypedCardData,
	CommonCardFields,
	ContainerContext,
	ClipShape,
	ClipPoint
} from './types/index.js';
export { CardTemplateSchema, ComponentDefinitionSchema, CARD_WIDTH, CARD_HEIGHT, CARD_RADIUS } from './types/index.js';

// Export utilities (client-side)
export {
	downloadSVG,
	downloadPNGClient,
	svgToDataURL,
	svgToBlob,
	svgToPNGClient,
	serializeSVG
} from './export/index.js';
export type { DownloadOptions } from './export/index.js';

// Utilities
export { FitText } from './utils/index.js';
