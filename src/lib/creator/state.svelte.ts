import { CARD_WIDTH, CARD_HEIGHT } from '$lib/types';
import type { CardTemplate, ComponentDefinition } from '$lib/types';
import type { IconData } from '$lib/components/icons';
import type {
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
	StampComponent,
	ClipShape,
	ResizeHandle
} from './types';

// Component ID counter
let componentIdCounter = 0;

export function generateComponentId(type: string): string {
	return `${type}-${++componentIdCounter}`;
}

// Generate unique container ID
export function generateId(): string {
	return `container-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Create initial card background layer
export function createInitialCardBackground(): ContainerState {
	return {
		id: 'card-base',
		name: 'Card Base',
		visible: true,
		locked: false,
		x: 0,
		y: 0,
		width: 750,
		height: 1050,
		clipShape: 'rect',
		radius: 26,
		clipContent: false,
		components: [
			{
				type: 'background',
				id: generateComponentId('background'),
				visible: true,
				fillType: 'gradient',
				solidColor: '#1e293b',
				gradientColors: ['#1e293b', '#0f172a'],
				gradientDirection: 'vertical',
				fillOpacity: 1,
				patternType: 'none',
				patternColor: '#ffffff',
				patternOpacity: 0.3
			},
			{
				type: 'border',
				id: generateComponentId('border'),
				visible: true,
				color: '#3b82f6',
				width: 8,
				opacity: 1,
				glow: { enabled: false, color: '#3b82f6', intensity: 0.5, blur: 10, animated: false, speed: 2 },
				holographic: { enabled: false, secondaryColor: '#ec4899', speed: 3 },
				layers: 1,
				layerColors: [],
				layerSpacing: 4
			}
		]
	};
}

// Helper to get component by type from a container
export function getComponentByType<T extends ComponentItem['type']>(
	container: ContainerState,
	type: T
): Extract<ComponentItem, { type: T }> | undefined {
	return container.components.find((c): c is Extract<ComponentItem, { type: T }> => c.type === type);
}

// Helper to check if component type exists
export function hasComponentType(container: ContainerState, type: ComponentItem['type']): boolean {
	return container.components.some((c) => c.type === type);
}

// Get component icon for display
export function getComponentIcon(type: string): string {
	switch (type) {
		case 'text':
			return 'T';
		case 'image':
			return 'img';
		case 'background':
			return 'bg';
		case 'border':
			return 'bdr';
		case 'icon':
			return 'ico';
		case 'badge':
			return 'bdg';
		case 'statpanel':
			return 'stat';
		case 'divider':
			return 'div';
		case 'progressbar':
			return 'bar';
		case 'ribbon':
			return 'rib';
		case 'frame':
			return 'frm';
		case 'stamp':
			return 'stp';
		default:
			return '?';
	}
}

// Get cursor style for resize handles
export function getResizeCursor(handle: ResizeHandle): string {
	const cursors: Record<ResizeHandle, string> = {
		nw: 'nwse-resize',
		n: 'ns-resize',
		ne: 'nesw-resize',
		e: 'ew-resize',
		se: 'nwse-resize',
		s: 'ns-resize',
		sw: 'nesw-resize',
		w: 'ew-resize'
	};
	return cursors[handle];
}

// =============================================================================
// COMPONENT BUILD CONFIGURATION
// =============================================================================

type PropMapping = string | { from: string; to: string };

interface ComponentBuildConfig {
	renderType: string;
	props: PropMapping[];
	/** Return false to skip rendering this component */
	guard?: (comp: ComponentItem) => boolean;
}

/**
 * Configuration for building template props from component state.
 * Maps component types to their render type and prop mappings.
 */
const componentBuildConfig: Partial<Record<ComponentItem['type'], ComponentBuildConfig>> = {
	image: {
		renderType: 'Image',
		props: ['dataField', 'opacity', 'preserveAspectRatio']
	},
	text: {
		renderType: 'TextField',
		props: ['dataField', 'maxFontSize', 'minFontSize', 'fontWeight', 'fontFamily', { from: 'fill', to: 'color' }, 'alignment', 'verticalAlign']
	},
	icon: {
		renderType: 'Icon',
		props: ['iconData', 'iconName', 'color', 'size', 'opacity', 'rotation', 'flipHorizontal', 'flipVertical'],
		guard: (comp) => !!(comp as IconComponent).iconData?.body
	},
	badge: {
		renderType: 'Badge',
		props: ['textPreset', 'dataField', 'shape', 'preset', 'backgroundColor', 'textColor', 'borderColor', 'borderWidth', 'size', 'fontFamily', 'fontWeight', 'icon', 'iconColor', 'opacity']
	},
	statpanel: {
		renderType: 'StatPanel',
		props: ['rows', 'labelColor', 'valueColor', 'divider', 'dividerColor', 'compact', 'fontFamily', 'labelFontSize', 'valueFontSize', 'barHeight', 'barBackgroundColor', 'barBorderRadius', 'opacity']
	},
	divider: {
		renderType: 'Divider',
		props: ['style', 'color', 'secondaryColor', 'thickness', 'fade', 'ornament', 'ornamentSize', 'ornamentColor', 'dashLength', 'gapLength', 'opacity']
	},
	progressbar: {
		renderType: 'ProgressBar',
		props: ['value', 'max', 'dataField', 'color', 'backgroundColor', 'borderColor', 'borderWidth', 'showLabel', 'labelPosition', 'labelColor', 'labelFontSize', 'labelFontFamily', 'labelFormat', 'style', 'segments', 'segmentGap', 'glowEnabled', 'glowColor', 'glowIntensity', 'opacity']
	},
	ribbon: {
		renderType: 'Ribbon',
		props: ['textPreset', 'dataField', 'position', 'style', 'color', 'textColor', 'shadowColor', 'fontSize', 'fontFamily', 'fontWeight', 'angle', 'ribbonWidth', 'opacity']
	},
	frame: {
		renderType: 'Frame',
		props: ['style', 'corners', 'edges', 'color', 'secondaryColor', 'size', 'strokeWidth', 'opacity']
	},
	stamp: {
		renderType: 'Stamp',
		props: ['textPreset', 'dataField', 'style', 'color', 'textColor', 'secondaryColor', 'icon', 'iconColor', 'rotation', 'fontSize', 'fontFamily', 'fontWeight', 'borderWidth', 'showRing', 'opacity']
	}
};

/**
 * Builds props object from component using config-driven mapping.
 */
function buildPropsFromConfig(
	comp: ComponentItem,
	propMappings: PropMapping[]
): Record<string, unknown> {
	const props: Record<string, unknown> = {};
	const compRecord = comp as unknown as Record<string, unknown>;
	for (const mapping of propMappings) {
		if (typeof mapping === 'string') {
			props[mapping] = compRecord[mapping];
		} else {
			props[mapping.to] = compRecord[mapping.from];
		}
	}
	if (comp.effect) {
		props.effect = comp.effect;
	}
	return props;
}

/**
 * Builds background component children (special case: can produce multiple children).
 */
function buildBackgroundChildren(comp: BackgroundComponent): ComponentDefinition[] {
	const children: ComponentDefinition[] = [];

	if (comp.fillType === 'solid') {
		const props: Record<string, unknown> = {
			color: comp.solidColor,
			opacity: comp.fillOpacity
		};
		if (comp.effect) props.effect = comp.effect;
		children.push({ id: `${comp.id}-fill`, type: 'SolidBackground', props });
	} else if (comp.fillType === 'gradient') {
		const props: Record<string, unknown> = {
			colors: comp.gradientColors,
			direction: comp.gradientDirection,
			opacity: comp.fillOpacity
		};
		if (comp.effect) props.effect = comp.effect;
		children.push({ id: `${comp.id}-fill`, type: 'GradientBackground', props });
	}

	if (comp.patternType && comp.patternType !== 'none') {
		const props: Record<string, unknown> = {
			pattern: comp.patternType,
			color: comp.patternColor,
			opacity: comp.patternOpacity
		};
		if (comp.effect) props.effect = comp.effect;
		children.push({ id: `${comp.id}-pattern`, type: 'PatternBackground', props });
	}

	return children;
}

/**
 * Builds border component props (special case: conditional nested objects).
 */
function buildBorderProps(comp: BorderComponent): Record<string, unknown> {
	const props: Record<string, unknown> = {
		color: comp.color,
		width: comp.width,
		opacity: comp.opacity
	};

	if (comp.glow?.enabled) {
		props.glow = {
			color: comp.glow.color,
			intensity: comp.glow.intensity,
			blur: comp.glow.blur,
			animated: comp.glow.animated,
			speed: comp.glow.speed
		};
	}

	if (comp.holographic?.enabled) {
		props.holographic = {
			secondaryColor: comp.holographic.secondaryColor,
			speed: comp.holographic.speed
		};
	}

	if (comp.layers && comp.layers > 1) {
		props.layers = comp.layers;
		if (comp.layerColors?.length) {
			props.layerColors = comp.layerColors;
		}
		props.layerSpacing = comp.layerSpacing;
	}

	if (comp.effect) props.effect = comp.effect;
	return props;
}

// =============================================================================
// BUILD TEMPLATE
// =============================================================================

// Build CardTemplate from container state
export function buildTemplate(templateName: string, containers: ContainerState[]): CardTemplate {
	const components: ComponentDefinition[] = [];

	for (const container of containers) {
		if (!container.visible) continue;

		const children: ComponentDefinition[] = [];

		for (const comp of container.components) {
			if (!comp.visible) continue;

			// Special case: background produces multiple children
			if (comp.type === 'background') {
				children.push(...buildBackgroundChildren(comp));
				continue;
			}

			// Special case: border has conditional nested objects
			if (comp.type === 'border') {
				children.push({
					id: comp.id,
					type: 'Border',
					props: buildBorderProps(comp)
				});
				continue;
			}

			// Config-driven building for standard components
			const config = componentBuildConfig[comp.type];
			if (config) {
				// Check guard condition if present
				if (config.guard && !config.guard(comp)) continue;

				children.push({
					id: comp.id,
					type: config.renderType,
					props: buildPropsFromConfig(comp, config.props)
				});
			}
		}

		const groupProps: Record<string, unknown> = {
			x: container.x,
			y: container.y,
			width: container.width,
			height: container.height,
			radius: container.clipShape === 'rect' ? container.radius : 0,
			clipShape: container.clipShape,
			clipContent: container.clipContent
		};

		// Animation is now at the zone/group level
		if (container.animation && container.animation.type !== 'none') {
			groupProps.animation = container.animation;
		}

		components.push({
			id: container.id,
			type: 'Group',
			props: groupProps,
			children
		});
	}

	return { name: templateName, components };
}

// Build preview data (field names or actual data)
export function buildPreviewData(
	previewMode: 'fields' | 'data',
	currentCard: Record<string, unknown>,
	dataFields?: Array<{ value: string; label: string; type?: string }>
): Record<string, unknown> {
	if (previewMode === 'data') {
		return currentCard;
	}

	// Generate preview data dynamically from dataFields
	if (dataFields) {
		const preview: Record<string, unknown> = {};
		for (const field of dataFields) {
			if (field.type === 'image') {
				preview[field.value] = `https://placehold.co/400x300/1e293b/64748b?text=${encodeURIComponent(field.label)}`;
			} else {
				preview[field.value] = field.label;
			}
		}
		return preview;
	}

	// Fallback for backwards compatibility
	return {
		title: 'Title',
		subtitle: 'Subtitle',
		description: 'Description',
		imageUrl: 'https://placehold.co/400x300/1e293b/64748b?text=Image',
		category: 'Category',
		rarity: 'Rarity',
		date: 'Date'
	};
}

// Default component factories
export function createTextComponent(): TextComponent {
	return {
		type: 'text',
		id: generateComponentId('text'),
		visible: true,
		dataField: '',
		maxFontSize: 48,
		minFontSize: 12,
		fontWeight: 'normal',
		fontFamily: 'Arial, sans-serif',
		fill: '#ffffff',
		alignment: 'center',
		verticalAlign: 'center'
	};
}

export function createImageComponent(): ImageComponent {
	return {
		type: 'image',
		id: generateComponentId('image'),
		visible: true,
		dataField: '',
		opacity: 1,
		preserveAspectRatio: 'xMidYMid slice'
	};
}

export function createBackgroundComponent(): BackgroundComponent {
	return {
		type: 'background',
		id: generateComponentId('background'),
		visible: true,
		fillType: 'gradient',
		solidColor: '#1e293b',
		gradientColors: ['#1e293b', '#0f172a'],
		gradientDirection: 'vertical',
		fillOpacity: 1,
		patternType: 'none',
		patternColor: '#ffffff',
		patternOpacity: 0.3
	};
}

export function createBorderComponent(): BorderComponent {
	return {
		type: 'border',
		id: generateComponentId('border'),
		visible: true,
		color: '#3b82f6',
		width: 2,
		opacity: 1,
		glow: { enabled: false, color: '#3b82f6', intensity: 0.5, blur: 10, animated: false, speed: 2 },
		holographic: { enabled: false, secondaryColor: '#ec4899', speed: 3 },
		layers: 1,
		layerColors: [],
		layerSpacing: 4
	};
}

export function createIconComponent(): IconComponent {
	return {
		type: 'icon',
		id: generateComponentId('icon'),
		visible: true,
		iconData: undefined,
		iconName: undefined,
		color: '#ffffff',
		size: undefined,
		opacity: 1,
		rotation: 0,
		flipHorizontal: false,
		flipVertical: false
	};
}

export function createBadgeComponent(): BadgeComponent {
	return {
		type: 'badge',
		id: generateComponentId('badge'),
		visible: true,
		textPreset: 'RARE',
		dataField: undefined,
		shape: 'pill',
		preset: 'custom',
		backgroundColor: '#3b82f6',
		textColor: '#ffffff',
		borderColor: undefined,
		borderWidth: 0,
		size: 'md',
		fontFamily: 'Arial, sans-serif',
		fontWeight: 'bold',
		icon: undefined,
		iconColor: undefined,
		opacity: 1
	};
}

export function createStatPanelComponent(): StatPanelComponent {
	return {
		type: 'statpanel',
		id: generateComponentId('statpanel'),
		visible: true,
		rows: [
			{ labelPreset: 'ATTACK', dataField: 'title', showBar: true, barColor: '#ef4444', barMax: 100 },
			{ labelPreset: 'DEFENSE', dataField: 'subtitle', showBar: true, barColor: '#3b82f6', barMax: 100 },
			{ labelPreset: 'SPEED', dataField: 'category', showBar: true, barColor: '#22c55e', barMax: 100 }
		],
		labelColor: '#9ca3af',
		valueColor: '#ffffff',
		divider: true,
		dividerColor: '#374151',
		compact: false,
		fontFamily: 'Arial, sans-serif',
		labelFontSize: 12,
		valueFontSize: 14,
		barHeight: 6,
		barBackgroundColor: '#1f2937',
		barBorderRadius: 3,
		opacity: 1
	};
}

export function createDividerComponent(): DividerComponent {
	return {
		type: 'divider',
		id: generateComponentId('divider'),
		visible: true,
		style: 'solid',
		color: '#ffffff',
		secondaryColor: undefined,
		thickness: 2,
		fade: 'both',
		ornament: 'none',
		ornamentSize: 12,
		ornamentColor: undefined,
		dashLength: 8,
		gapLength: 4,
		opacity: 1
	};
}

export function createProgressBarComponent(): ProgressBarComponent {
	return {
		type: 'progressbar',
		id: generateComponentId('progressbar'),
		visible: true,
		value: 75,
		max: 100,
		dataField: undefined,
		color: '#22c55e',
		backgroundColor: '#374151',
		borderColor: undefined,
		borderWidth: 0,
		showLabel: true,
		labelPosition: 'right',
		labelColor: '#ffffff',
		labelFontSize: 12,
		labelFontFamily: 'Arial, sans-serif',
		labelFormat: 'value',
		style: 'rounded',
		segments: 0,
		segmentGap: 2,
		glowEnabled: false,
		glowColor: undefined,
		glowIntensity: 0.5,
		opacity: 1
	};
}

export function createRibbonComponent(): RibbonComponent {
	return {
		type: 'ribbon',
		id: generateComponentId('ribbon'),
		visible: true,
		textPreset: 'LIMITED',
		dataField: undefined,
		position: 'top-right',
		style: 'folded',
		color: '#ef4444',
		textColor: '#ffffff',
		shadowColor: '#b91c1c',
		fontSize: 12,
		fontFamily: 'Arial, sans-serif',
		fontWeight: 'bold',
		angle: 45,
		ribbonWidth: undefined,
		opacity: 1
	};
}

export function createFrameComponent(): FrameComponent {
	return {
		type: 'frame',
		id: generateComponentId('frame'),
		visible: true,
		style: 'ornate',
		corners: true,
		edges: false,
		color: '#fbbf24',
		secondaryColor: undefined,
		size: 'md',
		strokeWidth: 2,
		opacity: 1
	};
}

export function createStampComponent(): StampComponent {
	return {
		type: 'stamp',
		id: generateComponentId('stamp'),
		visible: true,
		textPreset: '#001',
		dataField: undefined,
		style: 'wax-seal',
		color: '#dc2626',
		textColor: '#ffffff',
		secondaryColor: undefined,
		icon: undefined,
		iconColor: undefined,
		rotation: -15,
		fontSize: 10,
		fontFamily: 'Arial, sans-serif',
		fontWeight: 'bold',
		borderWidth: 3,
		showRing: true,
		opacity: 0.9
	};
}

export function createContainer(containerNumber: number): ContainerState {
	return {
		id: generateId(),
		name: `Layer ${containerNumber}`,
		visible: true,
		locked: false,
		x: 50,
		y: 50 + (containerNumber - 1) * 120,
		width: 300,
		height: 100,
		clipShape: 'rect',
		radius: 8,
		clipContent: true,
		components: []
	};
}

// Grid size for snap-to-grid
export const GRID_SIZE = 25;
