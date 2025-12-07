// Core
export { CardCanvas, ComponentRenderer, Group, registerComponent, getComponentByName } from './core/index.js';

// Card Components
export { GradientBackground, Image, PatternBackground, SolidBackground } from './card/backgrounds/index.js';
export { Border } from './card/borders/index.js';
export { TextField, StatPanel, List } from './card/fields/index.js';
export { Icon, IconPicker } from './card/icons/index.js';
export type { IconData, IconProps } from './card/icons/index.js';
export type { StatPanelProps, StatRow, ListProps, ListStyle } from './card/fields/index.js';

// Decorations
export { Badge, Divider, ProgressBar, Ribbon, Frame, IconRating } from './card/decorations/index.js';
export type {
	BadgeProps,
	DividerProps, DividerStyle, DividerFade, DividerOrnamentPreset,
	ProgressBarProps, ProgressBarStyle, LabelPosition,
	RibbonProps, RibbonPosition, RibbonStyle,
	FrameProps, FrameStyle, FrameSize,
	IconRatingProps, RatingIconPreset, ValueFormat
} from './card/decorations/index.js';
export { RATING_ICON_PRESETS, RATING_ICON_LABELS, ORNAMENT_PRESET_ICONS, ORNAMENT_PRESET_LABELS } from './card/decorations/index.js';

// Shapes
export { ShapePicker, BUNDLED_SHAPES, SHAPE_CATEGORIES, BUILT_IN_SHAPES } from './styling/shapes/index.js';
export type { BuiltInShape, ShapeSource, ShapeData, ShapeConfig, ShapeRenderOptions } from './styling/shapes/index.js';

// Animations
export {
	AnimationWrapper,
	getAnimationOptions,
	getAnimationCSS,
	ANIMATION_PRESETS
} from './styling/animations/index.js';
export type {
	AnimationType,
	AnimationDirection,
	AnimationEasing,
	AnimationOrigin,
	PulsePattern,
	FloatStyle,
	AnimationConfig,
	AnimationPreset
} from './styling/animations/index.js';
export { AnimationConfigSchema } from './styling/animations/index.js';

// Effects
export {
	EffectWrapper,
	getEffectOptions,
	getDefaultEffectConfig,
	EFFECT_PRESETS,
	EFFECT_COLOR_PRESETS,
	LIFT_ELEVATIONS
} from './styling/effects/index.js';
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
} from './styling/effects/index.js';
export { EffectConfigSchema } from './styling/effects/index.js';

// Blend Modes
export {
	BlendMode,
	DEFAULT_BLEND_MODE,
	BLEND_MODE_OPTIONS,
	getBlendModesByCategory
} from './styling/blend/index.js';
export type { BlendModeOption } from './styling/blend/index.js';

// Types
export type {
	CardTemplate,
	ComponentDefinition,
	CardData,
	TypedCardData,
	CommonCardFields,
	ContainerContext
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
	IconRatingComponent,
	DataFieldOption
} from './creator/index.js';

// Demo data and types (for reference implementations)
export {
	datasets as demoDatasets,
	getDataFieldsForDataset,
	findUnmappedFields,
	templates as demoTemplates,
	xboxDataFields,
	playstationDataFields,
	steamDataFields,
	suggestFieldMappings
} from './demo/index.js';
export type {
	Dataset,
	XboxGame,
	PlayStationGame,
	SteamGame,
	XboxDataset,
	PlayStationDataset,
	SteamDataset,
	AnyDataset,
	AnyCard,
	FieldMapping,
	SavedTemplate
} from './demo/index.js';
