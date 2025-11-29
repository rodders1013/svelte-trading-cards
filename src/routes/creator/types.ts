import type { AnimationConfig } from '$lib/animations';
import type { EffectConfig } from '$lib/effects';
import type { IconData } from '$lib/components/icons';

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
	animation?: AnimationConfig;
	effect?: EffectConfig;
}

export interface ImageComponent {
	type: 'image';
	id: string;
	visible: boolean;
	dataField: string;
	opacity: number;
	preserveAspectRatio: string;
	animation?: AnimationConfig;
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
	animation?: AnimationConfig;
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
	animation?: AnimationConfig;
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
	animation?: AnimationConfig;
	effect?: EffectConfig;
}

export type ComponentItem =
	| TextComponent
	| ImageComponent
	| BackgroundComponent
	| BorderComponent
	| IconComponent;

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
	components: ComponentItem[];
}

export type ResizeHandle = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w';

// Data field options for binding
export const dataFields = [
	{ value: 'title', label: 'Title' },
	{ value: 'subtitle', label: 'Subtitle' },
	{ value: 'description', label: 'Description' },
	{ value: 'imageUrl', label: 'Image URL' },
	{ value: 'category', label: 'Category' },
	{ value: 'rarity', label: 'Rarity' },
	{ value: 'date', label: 'Date' }
];

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
