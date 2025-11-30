// Core
export { CardCanvas, ComponentRenderer, Group, registerComponent, getComponentByName } from './core/index.js';

// Components
export { GradientBackground, Image, PatternBackground, SolidBackground } from './components/backgrounds/index.js';
export { Border } from './components/borders/index.js';
export { TextField, StatPanel } from './components/fields/index.js';
export { Icon, IconPicker } from './components/icons/index.js';
export type { IconData, IconProps } from './components/icons/index.js';
export type { StatPanelProps, StatRow } from './components/fields/index.js';

// Decorations
export { Badge, Divider, ProgressBar, Ribbon, Frame, Stamp } from './components/decorations/index.js';
export type {
	BadgeProps, BadgeShape, BadgePreset, BadgeSize,
	DividerProps, DividerStyle, DividerFade, DividerOrnament,
	ProgressBarProps, ProgressBarStyle, LabelPosition,
	RibbonProps, RibbonPosition, RibbonStyle,
	FrameProps, FrameStyle, FrameSize,
	StampProps, StampStyle
} from './components/decorations/index.js';
export { BADGE_PRESETS } from './components/decorations/index.js';

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

// Effects
export {
	EffectWrapper,
	getEffectOptions,
	getDefaultEffectConfig,
	EFFECT_PRESETS,
	EFFECT_COLOR_PRESETS,
	LIFT_ELEVATIONS
} from './effects/index.js';
export type {
	EffectType,
	EffectConfig,
	GlowEffect,
	ShadowEffect,
	NeonEffect,
	InnerGlowEffect,
	LiftEffect,
	OutlineEffect,
	EffectPreset
} from './effects/index.js';
export { EffectConfigSchema } from './effects/index.js';

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

// Creator
export { CardCreator } from './creator/index.js';
export type {
	ContainerState,
	ComponentItem,
	TextComponent,
	ImageComponent,
	BackgroundComponent,
	BorderComponent,
	IconComponent,
	BadgeComponent,
	StatPanelComponent,
	DividerComponent,
	ProgressBarComponent,
	RibbonComponent,
	FrameComponent,
	StampComponent
} from './creator/index.js';
