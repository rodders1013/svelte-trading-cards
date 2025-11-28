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

// Build CardTemplate from container state
export function buildTemplate(templateName: string, containers: ContainerState[]): CardTemplate {
	const components: ComponentDefinition[] = [];

	for (const container of containers) {
		if (!container.visible) continue;

		const children: ComponentDefinition[] = [];

		for (const comp of container.components) {
			if (!comp.visible) continue;

			if (comp.type === 'background') {
				if (comp.fillType === 'solid') {
					const solidProps: Record<string, unknown> = {
						color: comp.solidColor,
						opacity: comp.fillOpacity
					};
					if (comp.animation && comp.animation.type !== 'none') {
						solidProps.animation = comp.animation;
					}
					children.push({
						id: `${comp.id}-fill`,
						type: 'SolidBackground',
						props: solidProps
					});
				} else if (comp.fillType === 'gradient') {
					const gradientProps: Record<string, unknown> = {
						colors: comp.gradientColors,
						direction: comp.gradientDirection,
						opacity: comp.fillOpacity
					};
					if (comp.animation && comp.animation.type !== 'none') {
						gradientProps.animation = comp.animation;
					}
					children.push({
						id: `${comp.id}-fill`,
						type: 'GradientBackground',
						props: gradientProps
					});
				}

				if (comp.patternType && comp.patternType !== 'none') {
					const patternProps: Record<string, unknown> = {
						pattern: comp.patternType,
						color: comp.patternColor,
						opacity: comp.patternOpacity
					};
					if (comp.animation && comp.animation.type !== 'none') {
						patternProps.animation = comp.animation;
					}
					children.push({
						id: `${comp.id}-pattern`,
						type: 'PatternBackground',
						props: patternProps
					});
				}
			} else if (comp.type === 'image') {
				const imageProps: Record<string, unknown> = {
					dataField: comp.dataField,
					opacity: comp.opacity,
					preserveAspectRatio: comp.preserveAspectRatio
				};
				if (comp.animation && comp.animation.type !== 'none') {
					imageProps.animation = comp.animation;
				}
				children.push({
					id: comp.id,
					type: 'Image',
					props: imageProps
				});
			} else if (comp.type === 'text') {
				const textProps: Record<string, unknown> = {
					dataField: comp.dataField,
					maxFontSize: comp.maxFontSize,
					minFontSize: comp.minFontSize,
					fontWeight: comp.fontWeight,
					fontFamily: comp.fontFamily,
					color: comp.fill,
					alignment: comp.alignment,
					verticalAlign: comp.verticalAlign
				};
				if (comp.animation && comp.animation.type !== 'none') {
					textProps.animation = comp.animation;
				}
				children.push({
					id: comp.id,
					type: 'TextField',
					props: textProps
				});
			} else if (comp.type === 'border') {
				const borderProps: Record<string, unknown> = {
					color: comp.color,
					width: comp.width,
					opacity: comp.opacity
				};
				if (comp.glow?.enabled) {
					borderProps.glow = {
						color: comp.glow.color,
						intensity: comp.glow.intensity,
						blur: comp.glow.blur,
						animated: comp.glow.animated,
						speed: comp.glow.speed
					};
				}
				if (comp.holographic?.enabled) {
					borderProps.holographic = {
						secondaryColor: comp.holographic.secondaryColor,
						speed: comp.holographic.speed
					};
				}
				if (comp.layers && comp.layers > 1) {
					borderProps.layers = comp.layers;
					if (comp.layerColors?.length) {
						borderProps.layerColors = comp.layerColors;
					}
					borderProps.layerSpacing = comp.layerSpacing;
				}
				if (comp.animation && comp.animation.type !== 'none') {
					borderProps.animation = comp.animation;
				}
				children.push({
					id: comp.id,
					type: 'Border',
					props: borderProps
				});
			} else if (comp.type === 'icon') {
				if (comp.iconData?.body) {
					const iconProps: Record<string, unknown> = {
						iconData: comp.iconData,
						iconName: comp.iconName,
						color: comp.color,
						size: comp.size,
						opacity: comp.opacity,
						rotation: comp.rotation,
						flipHorizontal: comp.flipHorizontal,
						flipVertical: comp.flipVertical
					};
					if (comp.animation && comp.animation.type !== 'none') {
						iconProps.animation = comp.animation;
					}
					children.push({
						id: comp.id,
						type: 'Icon',
						props: iconProps
					});
				}
			}
		}

		components.push({
			id: container.id,
			type: 'Group',
			props: {
				x: container.x,
				y: container.y,
				width: container.width,
				height: container.height,
				radius: container.clipShape === 'rect' ? container.radius : 0,
				clipShape: container.clipShape,
				clipContent: container.clipContent
			},
			children
		});
	}

	return { name: templateName, components };
}

// Build preview data (field names or actual data)
export function buildPreviewData(
	previewMode: 'fields' | 'data',
	currentCard: Record<string, unknown>
): Record<string, unknown> {
	if (previewMode === 'data') {
		return currentCard;
	}
	return {
		title: '{{title}}',
		subtitle: '{{subtitle}}',
		description: '{{description}}',
		imageUrl: 'https://placehold.co/400x300/1e293b/64748b?text={{imageUrl}}',
		category: '{{category}}',
		rarity: '{{rarity}}',
		date: '{{date}}'
	};
}

// Default component factories
export function createTextComponent(): TextComponent {
	return {
		type: 'text',
		id: generateComponentId('text'),
		visible: true,
		dataField: 'title',
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
		dataField: 'imageUrl',
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
		flipVertical: false,
		animation: undefined
	};
}

export function createContainer(containerNumber: number): ContainerState {
	return {
		id: generateId(),
		name: `Zone ${containerNumber}`,
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
