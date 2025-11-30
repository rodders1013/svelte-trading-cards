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
					if (comp.effect) {
						solidProps.effect = comp.effect;
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
					if (comp.effect) {
						gradientProps.effect = comp.effect;
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
					if (comp.effect) {
						patternProps.effect = comp.effect;
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
				if (comp.effect) {
					imageProps.effect = comp.effect;
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
				if (comp.effect) {
					textProps.effect = comp.effect;
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
				if (comp.effect) {
					borderProps.effect = comp.effect;
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
					if (comp.effect) {
						iconProps.effect = comp.effect;
					}
					children.push({
						id: comp.id,
						type: 'Icon',
						props: iconProps
					});
				}
			} else if (comp.type === 'badge') {
				const badgeProps: Record<string, unknown> = {
					textPreset: comp.textPreset,
					dataField: comp.dataField,
					shape: comp.shape,
					preset: comp.preset,
					backgroundColor: comp.backgroundColor,
					textColor: comp.textColor,
					borderColor: comp.borderColor,
					borderWidth: comp.borderWidth,
					size: comp.size,
					fontFamily: comp.fontFamily,
					fontWeight: comp.fontWeight,
					icon: comp.icon,
					iconColor: comp.iconColor,
					opacity: comp.opacity
				};
				if (comp.effect) {
					badgeProps.effect = comp.effect;
				}
				children.push({
					id: comp.id,
					type: 'Badge',
					props: badgeProps
				});
			} else if (comp.type === 'statpanel') {
				const statPanelProps: Record<string, unknown> = {
					rows: comp.rows,
					labelColor: comp.labelColor,
					valueColor: comp.valueColor,
					divider: comp.divider,
					dividerColor: comp.dividerColor,
					compact: comp.compact,
					fontFamily: comp.fontFamily,
					labelFontSize: comp.labelFontSize,
					valueFontSize: comp.valueFontSize,
					barHeight: comp.barHeight,
					barBackgroundColor: comp.barBackgroundColor,
					barBorderRadius: comp.barBorderRadius,
					opacity: comp.opacity
				};
				if (comp.effect) {
					statPanelProps.effect = comp.effect;
				}
				children.push({
					id: comp.id,
					type: 'StatPanel',
					props: statPanelProps
				});
			} else if (comp.type === 'divider') {
				const dividerProps: Record<string, unknown> = {
					style: comp.style,
					color: comp.color,
					secondaryColor: comp.secondaryColor,
					thickness: comp.thickness,
					fade: comp.fade,
					ornament: comp.ornament,
					ornamentSize: comp.ornamentSize,
					ornamentColor: comp.ornamentColor,
					dashLength: comp.dashLength,
					gapLength: comp.gapLength,
					opacity: comp.opacity
				};
				if (comp.effect) {
					dividerProps.effect = comp.effect;
				}
				children.push({
					id: comp.id,
					type: 'Divider',
					props: dividerProps
				});
			} else if (comp.type === 'progressbar') {
				const progressBarProps: Record<string, unknown> = {
					value: comp.value,
					max: comp.max,
					dataField: comp.dataField,
					color: comp.color,
					backgroundColor: comp.backgroundColor,
					borderColor: comp.borderColor,
					borderWidth: comp.borderWidth,
					showLabel: comp.showLabel,
					labelPosition: comp.labelPosition,
					labelColor: comp.labelColor,
					labelFontSize: comp.labelFontSize,
					labelFontFamily: comp.labelFontFamily,
					labelFormat: comp.labelFormat,
					style: comp.style,
					segments: comp.segments,
					segmentGap: comp.segmentGap,
					glowEnabled: comp.glowEnabled,
					glowColor: comp.glowColor,
					glowIntensity: comp.glowIntensity,
					opacity: comp.opacity
				};
				if (comp.effect) {
					progressBarProps.effect = comp.effect;
				}
				children.push({
					id: comp.id,
					type: 'ProgressBar',
					props: progressBarProps
				});
			} else if (comp.type === 'ribbon') {
				const ribbonProps: Record<string, unknown> = {
					textPreset: comp.textPreset,
					dataField: comp.dataField,
					position: comp.position,
					style: comp.style,
					color: comp.color,
					textColor: comp.textColor,
					shadowColor: comp.shadowColor,
					fontSize: comp.fontSize,
					fontFamily: comp.fontFamily,
					fontWeight: comp.fontWeight,
					angle: comp.angle,
					ribbonWidth: comp.ribbonWidth,
					opacity: comp.opacity
				};
				if (comp.effect) {
					ribbonProps.effect = comp.effect;
				}
				children.push({
					id: comp.id,
					type: 'Ribbon',
					props: ribbonProps
				});
			} else if (comp.type === 'frame') {
				const frameProps: Record<string, unknown> = {
					style: comp.style,
					corners: comp.corners,
					edges: comp.edges,
					color: comp.color,
					secondaryColor: comp.secondaryColor,
					size: comp.size,
					strokeWidth: comp.strokeWidth,
					opacity: comp.opacity
				};
				if (comp.effect) {
					frameProps.effect = comp.effect;
				}
				children.push({
					id: comp.id,
					type: 'Frame',
					props: frameProps
				});
			} else if (comp.type === 'stamp') {
				const stampProps: Record<string, unknown> = {
					textPreset: comp.textPreset,
					dataField: comp.dataField,
					style: comp.style,
					color: comp.color,
					textColor: comp.textColor,
					secondaryColor: comp.secondaryColor,
					icon: comp.icon,
					iconColor: comp.iconColor,
					rotation: comp.rotation,
					fontSize: comp.fontSize,
					fontFamily: comp.fontFamily,
					fontWeight: comp.fontWeight,
					borderWidth: comp.borderWidth,
					showRing: comp.showRing,
					opacity: comp.opacity
				};
				if (comp.effect) {
					stampProps.effect = comp.effect;
				}
				children.push({
					id: comp.id,
					type: 'Stamp',
					props: stampProps
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
