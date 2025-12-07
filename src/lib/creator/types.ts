import type { AnimationConfig } from '$lib/styling/animations';
import type { EffectConfig } from '$lib/styling/effects';
import type { BlendMode } from '$lib/styling/blend';
import type { IconData } from '$lib/card/icons';
import type { StatRow, ListStyle, TextPreset } from '$lib/card/fields';
import type { DividerStyle, DividerFade, DividerOrnament } from '$lib/card/decorations';
import type { ProgressBarStyle, LabelPosition } from '$lib/card/decorations';
import type { RibbonPosition, RibbonStyle, RibbonTextPreset } from '$lib/card/decorations';
import type { FrameStyle, FrameSize } from '$lib/card/decorations';
import type { RatingIconPreset, ValueFormat } from '$lib/card/decorations';
import type { ShapeSource } from '$lib/styling/shapes';
import type { FilterConfig, ImageTransformConfig } from '$lib/styling/filters';

// Component type definitions for the visual creator

export interface TextComponent {
	type: 'text';
	id: string;
	visible: boolean;
	textPreset?: TextPreset;
	dataField?: string;
	maxFontSize: number;
	minFontSize: number;
	fontWeight: string;
	fontStyle: 'normal' | 'italic';
	textDecoration: 'none' | 'underline' | 'line-through';
	textTransform: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
	fontFamily: string;
	fill: string;
	opacity: number;
	alignment: 'left' | 'center' | 'right';
	verticalAlign: 'top' | 'center' | 'bottom';
	padding: number;
	effect?: EffectConfig;
	blendMode?: BlendMode;
}

export interface ImageComponent {
	type: 'image';
	id: string;
	visible: boolean;
	dataField: string;
	opacity: number;
	preserveAspectRatio: string;
	/** Shape to clip the image to (e.g., circle, star) */
	shapeSource?: ShapeSource;
	/** CSS filter adjustments (brightness, contrast, etc.) */
	filter?: FilterConfig;
	/** Image transform (pan, zoom, rotation, flip) */
	transform?: ImageTransformConfig;
	effect?: EffectConfig;
	blendMode?: BlendMode;
}

export interface BackgroundComponent {
	type: 'background';
	id: string;
	visible: boolean;
	fillType: 'none' | 'solid' | 'gradient';
	solidColor?: string;
	gradientColors?: string[];
	gradientDirection?: 'vertical' | 'horizontal' | 'diagonal';
	fillOpacity?: number;
	patternType: 'none' | 'dots' | 'grid' | 'diagonal' | 'hexagons' | 'triangles' | 'squares' | 'diamonds' | 'chevrons' | 'waves' | 'circles' | 'crosses' | 'zigzag' | 'checkered' | 'stripes-h' | 'stripes-v' | 'confetti' | 'stars' | 'icon' | 'icons';
	patternColor?: string;
	patternOpacity?: number;
	patternSize?: number;
	patternSpacing?: number;
	patternRotation?: number;
	patternStrokeWidth?: number;
	// Icon pattern props
	patternIcon?: IconData;
	patternIconName?: string;
	patternIconRotation?: number;
	patternIconScale?: number;
	// Multi-icon pattern props
	patternIcons?: Array<{ iconData: IconData; iconName?: string; rotation?: number }>;
	patternRowOffset?: number;
	effect?: EffectConfig;
	blendMode?: BlendMode;
}

export interface BorderComponent {
	type: 'border';
	id: string;
	visible: boolean;
	color: string;
	width: number;
	opacity: number;
	glow?: {
		enabled: boolean;
		color: string;
		intensity: number;
		blur: number;
		animated: boolean;
		speed: number;
	};
	holographic?: {
		enabled: boolean;
		secondaryColor: string;
		speed: number;
	};
	layers?: number;
	layerColors?: string[];
	layerSpacing?: number;
	effect?: EffectConfig;
	blendMode?: BlendMode;
}

export interface IconComponent {
	type: 'icon';
	id: string;
	visible: boolean;
	iconData?: IconData;
	iconName?: string;
	color: string;
	size?: number;
	opacity: number;
	rotation: number;
	flipHorizontal: boolean;
	flipVertical: boolean;
	effect?: EffectConfig;
	blendMode?: BlendMode;
}

export interface BadgeComponent {
	type: 'badge';
	id: string;
	visible: boolean;
	/** Shape for the badge - uses icon-based shape system */
	shapeSource: ShapeSource;
	backgroundColor: string;
	borderColor?: string;
	borderWidth: number;
	/** Content icon (displayed inside the badge) */
	icon?: IconData;
	iconColor?: string;
	opacity: number;
	effect?: EffectConfig;
	blendMode?: BlendMode;
}

export interface StatPanelComponent {
	type: 'statpanel';
	id: string;
	visible: boolean;
	rows: StatRow[];
	labelColor: string;
	valueColor: string;
	divider: boolean;
	dividerColor: string;
	compact: boolean;
	fontFamily: string;
	labelFontSize: number;
	valueFontSize: number;
	barHeight: number;
	barBackgroundColor: string;
	barBorderRadius: number;
	opacity: number;
	effect?: EffectConfig;
	blendMode?: BlendMode;
}

export interface DividerComponent {
	type: 'divider';
	id: string;
	visible: boolean;
	style: DividerStyle;
	color: string;
	secondaryColor?: string;
	thickness: number;
	fade: DividerFade;
	ornament: DividerOrnament;
	ornamentSize: number;
	ornamentColor?: string;
	dashLength: number;
	gapLength: number;
	opacity: number;
	effect?: EffectConfig;
	blendMode?: BlendMode;
}

export interface ProgressBarComponent {
	type: 'progressbar';
	id: string;
	visible: boolean;
	value: number;
	max: number;
	dataField?: string;
	color: string;
	backgroundColor: string;
	borderColor?: string;
	borderWidth: number;
	showLabel: boolean;
	labelPosition: LabelPosition;
	labelColor: string;
	labelFontSize: number;
	labelFontFamily: string;
	labelFormat: 'value' | 'percent' | 'fraction';
	style: ProgressBarStyle;
	segments: number;
	segmentGap: number;
	opacity: number;
	effect?: EffectConfig;
	blendMode?: BlendMode;
}

export interface RibbonComponent {
	type: 'ribbon';
	id: string;
	visible: boolean;
	textPreset: RibbonTextPreset;
	dataField?: string;
	position: RibbonPosition;
	style: RibbonStyle;
	color: string;
	textColor: string;
	shadowColor: string;
	fontSize: number;
	fontFamily: string;
	fontWeight: string;
	angle: number;
	ribbonWidth?: number;
	opacity: number;
	effect?: EffectConfig;
	blendMode?: BlendMode;
}

export interface FrameComponent {
	type: 'frame';
	id: string;
	visible: boolean;
	style: FrameStyle;
	corners: boolean;
	edges: boolean;
	color: string;
	secondaryColor?: string;
	size: FrameSize;
	strokeWidth: number;
	opacity: number;
	effect?: EffectConfig;
	blendMode?: BlendMode;
}

export interface ListComponent {
	type: 'list';
	id: string;
	visible: boolean;
	dataField: string;
	delimiter: string;
	style: ListStyle;
	fontSize: number;
	fontFamily: string;
	fontWeight: string;
	color: string;
	lineHeight: number;
	bulletColor?: string;
	bulletSize?: number;
	numberPadding: number;
	alignment: 'left' | 'center' | 'right';
	verticalAlign: 'top' | 'center' | 'bottom';
	itemSpacing: number;
	indent: number;
	maxItems?: number;
	overflowText: string;
	overflowColor?: string;
	opacity: number;
	effect?: EffectConfig;
	blendMode?: BlendMode;
}

export interface IconRatingComponent {
	type: 'iconrating';
	id: string;
	visible: boolean;
	dataField?: string;
	value: number;
	max: number;
	min: number;
	sourceMax?: number;
	iconPreset: RatingIconPreset;
	customIcon?: IconData;
	customIconName?: string;
	filledColor: string;
	emptyColor: string;
	useEmptyOpacity: boolean;
	emptyOpacity: number;
	size: number;
	gap: number;
	allowHalf: boolean;
	showValue: boolean;
	valuePosition: 'left' | 'right';
	valueFormat: ValueFormat;
	valueFontSize: number;
	valueFontFamily: string;
	valueColor: string;
	valueGap: number;
	opacity: number;
	effect?: EffectConfig;
	blendMode?: BlendMode;
}

export type ComponentItem =
	| TextComponent
	| ImageComponent
	| BackgroundComponent
	| BorderComponent
	| IconComponent
	| BadgeComponent
	| StatPanelComponent
	| DividerComponent
	| ProgressBarComponent
	| RibbonComponent
	| FrameComponent
	| ListComponent
	| IconRatingComponent;

export interface ContainerState {
	id: string;
	name: string;
	visible: boolean;
	locked: boolean;
	x: number;
	y: number;
	width: number;
	height: number;
	/** Shape for clipping - uses icon-based shape system. Undefined = rect */
	shapeSource?: ShapeSource;
	radius: number;
	clipContent: boolean;
	animation?: AnimationConfig;
	blendMode?: BlendMode;
	components: ComponentItem[];
	/** If true, this is the Card Base layer - cannot be deleted/moved and extends to bleed during export */
	isCardBase?: boolean;
}

export type ResizeHandle = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w';

/**
 * Describes a data field that can be bound to card components.
 * Used by the creator UI to populate field selection dropdowns.
 */
export interface DataFieldOption {
	/** The field key used to access data (e.g., 'gameName', 'coverArt') */
	value: string;
	/** Human-readable label for the field */
	label: string;
	/** Field type hint for UI rendering */
	type?: 'text' | 'number' | 'image' | 'date' | 'array';
}

// Font family options - re-export from fonts module for backwards compatibility
// Use getAllFontsForDataset(datasetId) for dataset-aware fonts
export { fontFamilies, getAllFontsForDataset, type FontDropdownOption } from '$lib/fonts';
