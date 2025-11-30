import type { AnimationConfig } from '$lib/animations';
import type { EffectConfig } from '$lib/effects';
import type { IconData } from '$lib/components/icons';
import type { StatRow } from '$lib/components/fields';
import type { BadgeShape, BadgePreset, BadgeSize, BadgeTextPreset } from '$lib/components/decorations';
import type { DividerStyle, DividerFade, DividerOrnament } from '$lib/components/decorations';
import type { ProgressBarStyle, LabelPosition } from '$lib/components/decorations';
import type { RibbonPosition, RibbonStyle, RibbonTextPreset } from '$lib/components/decorations';
import type { FrameStyle, FrameSize } from '$lib/components/decorations';
import type { StampStyle, StampTextPreset } from '$lib/components/decorations';

// Component type definitions for the visual creator

export interface TextComponent {
	type: 'text';
	id: string;
	visible: boolean;
	dataField: string;
	maxFontSize: number;
	minFontSize: number;
	fontWeight: string;
	fontFamily: string;
	fill: string;
	alignment: 'left' | 'center' | 'right';
	verticalAlign: 'top' | 'center' | 'bottom';
	effect?: EffectConfig;
}

export interface ImageComponent {
	type: 'image';
	id: string;
	visible: boolean;
	dataField: string;
	opacity: number;
	preserveAspectRatio: string;
	effect?: EffectConfig;
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
	patternType: 'none' | 'dots' | 'grid' | 'diagonal' | 'hexagons';
	patternColor?: string;
	patternOpacity?: number;
	effect?: EffectConfig;
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
}

export interface BadgeComponent {
	type: 'badge';
	id: string;
	visible: boolean;
	textPreset: BadgeTextPreset;
	dataField?: string;
	shape: BadgeShape;
	preset: BadgePreset;
	backgroundColor: string;
	textColor: string;
	borderColor?: string;
	borderWidth: number;
	size: BadgeSize;
	fontFamily: string;
	fontWeight: string;
	icon?: IconData;
	iconColor?: string;
	opacity: number;
	effect?: EffectConfig;
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
	glowEnabled: boolean;
	glowColor?: string;
	glowIntensity: number;
	opacity: number;
	effect?: EffectConfig;
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
}

export interface StampComponent {
	type: 'stamp';
	id: string;
	visible: boolean;
	textPreset: StampTextPreset;
	dataField?: string;
	style: StampStyle;
	color: string;
	textColor: string;
	secondaryColor?: string;
	icon?: IconData;
	iconColor?: string;
	rotation: number;
	fontSize: number;
	fontFamily: string;
	fontWeight: string;
	borderWidth: number;
	showRing: boolean;
	opacity: number;
	effect?: EffectConfig;
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
	| StampComponent;

export type ClipShape =
	| 'rect'
	| 'circle'
	| 'ellipse'
	| 'hexagon'
	| 'octagon'
	| 'diamond'
	| 'shield'
	| 'star';

export interface ContainerState {
	id: string;
	name: string;
	visible: boolean;
	locked: boolean;
	x: number;
	y: number;
	width: number;
	height: number;
	clipShape: ClipShape;
	radius: number;
	clipContent: boolean;
	animation?: AnimationConfig;
	components: ComponentItem[];
}

export type ResizeHandle = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w';

// DataFieldOption type for prop typing
export type { DataFieldOption } from '$lib/demo';

// Font family options
export const fontFamilies = [
	{ value: 'Arial, sans-serif', label: 'Arial' },
	{ value: 'Georgia, serif', label: 'Georgia' },
	{ value: 'Times New Roman, serif', label: 'Times New Roman' },
	{ value: 'Courier New, monospace', label: 'Courier New' },
	{ value: 'Verdana, sans-serif', label: 'Verdana' },
	{ value: 'Impact, sans-serif', label: 'Impact' },
	{ value: 'Comic Sans MS, cursive', label: 'Comic Sans' }
];
