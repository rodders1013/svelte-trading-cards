// Core
export { CardCanvas, ComponentRenderer, Group, registerComponent, getComponentByName } from './core/index.js';

// Components
export { GradientBackground, Image, PatternBackground, SolidBackground } from './components/backgrounds/index.js';
export { Border } from './components/borders/index.js';
export { TextField, StatPanel, List } from './components/fields/index.js';
export { Icon, IconPicker } from './components/icons/index.js';
export type { IconData, IconProps } from './components/icons/index.js';
export type { StatPanelProps, StatRow, ListProps, ListStyle } from './components/fields/index.js';

// Decorations
export { Badge, Divider, ProgressBar, Ribbon, Frame, IconRating } from './components/decorations/index.js';
export type {
	BadgeProps, BadgeShape, BadgePreset, BadgeSize,
	DividerProps, DividerStyle, DividerFade, DividerOrnament,
	ProgressBarProps, ProgressBarStyle, LabelPosition,
	RibbonProps, RibbonPosition, RibbonStyle,
	FrameProps, FrameStyle, FrameSize,
	IconRatingProps, RatingIconPreset, ValueFormat
} from './components/decorations/index.js';
export { BADGE_PRESETS, RATING_ICON_PRESETS, RATING_ICON_LABELS } from './components/decorations/index.js';

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
	serializeSVG,
	sanitizeFilename
} from './export/index.js';
export type { DownloadOptions } from './export/index.js';

// Utilities
export { FitText } from './utils/index.js';

// Presets (Dataset-based label system)
export {
	// Helper functions
	getLabelsForDataset,
	getLabelsByCategory,
	getCategoryDisplayName,
	isValidLabel,
	getAvailableDatasets,
	// Constants
	DEFAULT_DATASET,
	SHARED_LABELS,
	RARITY_LABELS,
	STATUS_LABELS,
	EDITION_LABELS,
	GENERAL_LABELS,
	DATASET_LABELS,
	PLAYSTATION_LABELS,
	XBOX_LABELS,
	STEAM_LABELS
} from './presets/index.js';
export type {
	DatasetId,
	AnyLabel,
	LabelCategory,
	RarityLabel,
	StatusLabel,
	EditionLabel,
	GeneralLabel,
	PlayStationLabel,
	XboxLabel,
	SteamLabel,
	SharedLabel
} from './presets/index.js';

// Fonts (Web-safe + Dataset brand fonts)
export {
	// Helper functions
	getAllFontsForDataset,
	getFontsByGroupForDataset,
	getFontCategoryDisplayName,
	getWebSafeFonts,
	getFontsByCategory,
	getBrandFontsForDataset,
	getBrandFontOptions,
	// Constants
	WEB_SAFE_FONTS,
	FONT_CATEGORY_NAMES,
	FONT_GROUP_LABELS,
	BRAND_FONTS,
	// Legacy
	fontFamilies
} from './fonts/index.js';
export type {
	FontOption,
	FontCategory,
	FontDropdownOption,
	BrandFont
} from './fonts/index.js';

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
	ListComponent,
	IconRatingComponent
} from './creator/index.js';
