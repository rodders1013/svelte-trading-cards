<script lang="ts" module>
	import { z } from 'zod';
	import { AnimationConfigSchema } from '../../styling/animations/types.js';
	import { EffectConfigSchema } from '../../styling/effects/types.js';
	import { BlendMode } from '../../styling/blend/types.js';
	import { HolographicConfigSchema } from '../../styling/HolographicWrapper.svelte';
	import { IconDataSchema } from '../icons/Icon.svelte';

	export const PatternTypeSchema = z.enum([
		// Existing patterns
		'dots',
		'grid',
		'diagonal',
		'hexagons',

		// New geometric patterns
		'triangles',
		'squares',
		'diamonds',
		'chevrons',
		'waves',
		'circles',
		'crosses',
		'zigzag',
		'checkered',
		'stripes-h',
		'stripes-v',
		'confetti',
		'stars',

		// Icon-based patterns
		'icon',
		'icons'
	]);

	export type PatternType = z.infer<typeof PatternTypeSchema>;

	// Icon item for multi-icon patterns
	export const PatternIconItemSchema = z.object({
		iconData: IconDataSchema,
		iconName: z.string().optional(),
		rotation: z.number().default(0)
	});

	export type PatternIconItem = z.infer<typeof PatternIconItemSchema>;

	export const PatternBackgroundPropsSchema = z.object({
		pattern: PatternTypeSchema.default('dots'),

		// Standard pattern options
		color: z.string().default('#ffffff'),
		opacity: z.number().min(0).max(1).default(0.1),
		size: z.number().min(4).max(200).default(32),
		spacing: z.number().min(0).max(100).default(0),
		rotation: z.number().default(0),
		strokeWidth: z.number().min(0.5).max(10).default(1),

		// Single icon pattern options (when pattern === 'icon')
		icon: IconDataSchema.optional(),
		iconName: z.string().optional(),
		iconRotation: z.number().default(0),
		iconScale: z.number().min(0.1).max(3).default(1),

		// Multi-icon pattern options (when pattern === 'icons')
		icons: z.array(PatternIconItemSchema).optional(),
		rowOffset: z.number().default(0), // Offset alternating rows (stagger/brick effect)

		// Animation, effects, blending, and holographic
		animation: AnimationConfigSchema.optional(),
		effect: EffectConfigSchema.optional(),
		blendMode: BlendMode.optional(),
		holographic: HolographicConfigSchema.optional()
	});

	export type PatternBackgroundProps = z.infer<typeof PatternBackgroundPropsSchema>;

	// Pattern labels for UI
	export const PATTERN_LABELS: Record<PatternType, string> = {
		dots: 'Dots',
		grid: 'Grid',
		diagonal: 'Diagonal Lines',
		hexagons: 'Hexagons',
		triangles: 'Triangles',
		squares: 'Squares',
		diamonds: 'Diamonds',
		chevrons: 'Chevrons',
		waves: 'Waves',
		circles: 'Circles',
		crosses: 'Crosses',
		zigzag: 'Zigzag',
		checkered: 'Checkered',
		'stripes-h': 'Horizontal Stripes',
		'stripes-v': 'Vertical Stripes',
		confetti: 'Confetti',
		stars: 'Stars',
		icon: 'Custom Icon',
		icons: 'Multiple Icons'
	};

	// Pattern presets with recommended settings
	export const PATTERN_PRESETS: Record<PatternType, { size: number; spacing: number; strokeWidth: number }> = {
		dots: { size: 16, spacing: 0, strokeWidth: 1 },
		grid: { size: 30, spacing: 0, strokeWidth: 1 },
		diagonal: { size: 10, spacing: 0, strokeWidth: 1 },
		hexagons: { size: 20, spacing: 0, strokeWidth: 1 },
		triangles: { size: 24, spacing: 0, strokeWidth: 1 },
		squares: { size: 20, spacing: 4, strokeWidth: 1 },
		diamonds: { size: 20, spacing: 0, strokeWidth: 1 },
		chevrons: { size: 16, spacing: 0, strokeWidth: 2 },
		waves: { size: 40, spacing: 0, strokeWidth: 1.5 },
		circles: { size: 24, spacing: 8, strokeWidth: 1 },
		crosses: { size: 16, spacing: 8, strokeWidth: 2 },
		zigzag: { size: 20, spacing: 0, strokeWidth: 2 },
		checkered: { size: 20, spacing: 0, strokeWidth: 1 },
		'stripes-h': { size: 10, spacing: 0, strokeWidth: 1 },
		'stripes-v': { size: 10, spacing: 0, strokeWidth: 1 },
		confetti: { size: 8, spacing: 16, strokeWidth: 1 },
		stars: { size: 16, spacing: 20, strokeWidth: 1 },
		icon: { size: 24, spacing: 12, strokeWidth: 1 },
		icons: { size: 24, spacing: 8, strokeWidth: 1 }
	};
</script>

<script lang="ts">
	import type { ContainerContext, CardData, UniversalModifiers } from '../../types';
	import ComponentWrapper from '../../styling/ComponentWrapper.svelte';
	import { sanitizeSvgBody } from '../icons/Icon.svelte';

	let {
		pattern = 'dots',
		color = '#ffffff',
		opacity = 0.1,
		size = 32,
		spacing = 0,
		rotation = 0,
		strokeWidth = 1,
		icon,
		iconName,
		iconRotation = 0,
		iconScale = 1,
		icons,
		rowOffset = 0,
		animation,
		effect,
		blendMode,
		holographic,
		container,
		data
	}: PatternBackgroundProps & {
		container: ContainerContext;
		data?: CardData;
	} = $props();

	const uid = Math.random().toString(36).substring(2, 9);
	const patternId = `pattern-${uid}`;
	const clipId = `pattern-clip-${uid}`;

	// Only clip if container has radius
	const needsClip = $derived(container.radius > 0);

	// Collect modifiers for unified wrapper
	const modifiers: UniversalModifiers = $derived({ effect, animation, blendMode, holographic });

	// Calculate effective cell size (size + spacing)
	const cellSize = $derived(size + spacing);

	// For multi-icon patterns, calculate the total width
	const multiIconWidth = $derived.by(() => {
		if (pattern === 'icons' && icons && icons.length > 0) {
			return icons.length * cellSize;
		}
		return cellSize;
	});

	// Sanitize icon bodies for safe rendering
	const sanitizedIconBody = $derived(icon?.body ? sanitizeSvgBody(icon.body) : '');
	const sanitizedIcons = $derived.by(() => {
		if (!icons) return [];
		return icons.map((item) => ({
			...item,
			sanitizedBody: item.iconData?.body ? sanitizeSvgBody(item.iconData.body) : ''
		}));
	});
</script>

<defs>
	{#if needsClip}
		<clipPath id={clipId}>
			<rect
				x="0"
				y="0"
				width={container.width}
				height={container.height}
				rx={container.radius}
			/>
		</clipPath>
	{/if}

	<!-- EXISTING PATTERNS -->
	{#if pattern === 'dots'}
		<pattern id={patternId} width={cellSize} height={cellSize} patternUnits="userSpaceOnUse" patternTransform="rotate({rotation})">
			<circle cx={cellSize / 2} cy={cellSize / 2} r={size / 4} fill={color} />
		</pattern>

	{:else if pattern === 'grid'}
		<pattern id={patternId} width={cellSize} height={cellSize} patternUnits="userSpaceOnUse" patternTransform="rotate({rotation})">
			<path d="M {cellSize} 0 L 0 0 0 {cellSize}" fill="none" stroke={color} stroke-width={strokeWidth} />
		</pattern>

	{:else if pattern === 'diagonal'}
		<pattern id={patternId} width={cellSize} height={cellSize} patternUnits="userSpaceOnUse" patternTransform="rotate({rotation})">
			<path
				d="M 0 {cellSize} L {cellSize} 0 M {-cellSize / 4} {cellSize / 4} L {cellSize / 4} {-cellSize / 4} M {cellSize * 3 / 4} {cellSize + cellSize / 4} L {cellSize + cellSize / 4} {cellSize * 3 / 4}"
				stroke={color}
				stroke-width={strokeWidth}
				fill="none"
			/>
		</pattern>

	{:else if pattern === 'hexagons'}
		{@const h = size}
		{@const w = size * 1.1547}
		<pattern id={patternId} width={w + spacing} height={(h * 1.5) + spacing} patternUnits="userSpaceOnUse" patternTransform="rotate({rotation})">
			<polygon
				points="{w / 2},{0} {w},{h / 4} {w},{h * 3 / 4} {w / 2},{h} {0},{h * 3 / 4} {0},{h / 4}"
				fill="none"
				stroke={color}
				stroke-width={strokeWidth}
				transform="translate(0, {h / 4})"
			/>
			<polygon
				points="{w / 2},{0} {w},{h / 4} {w},{h * 3 / 4} {w / 2},{h} {0},{h * 3 / 4} {0},{h / 4}"
				fill="none"
				stroke={color}
				stroke-width={strokeWidth}
				transform="translate({w / 2}, {h})"
			/>
		</pattern>

	<!-- NEW GEOMETRIC PATTERNS -->
	{:else if pattern === 'triangles'}
		{@const h = size * 0.866}
		<pattern id={patternId} width={cellSize} height={h + spacing} patternUnits="userSpaceOnUse" patternTransform="rotate({rotation})">
			<polygon
				points="{size / 2},0 {size},{h} 0,{h}"
				fill="none"
				stroke={color}
				stroke-width={strokeWidth}
			/>
		</pattern>

	{:else if pattern === 'squares'}
		<pattern id={patternId} width={cellSize} height={cellSize} patternUnits="userSpaceOnUse" patternTransform="rotate({rotation})">
			<rect
				x={spacing / 2}
				y={spacing / 2}
				width={size}
				height={size}
				fill={color}
			/>
		</pattern>

	{:else if pattern === 'diamonds'}
		<pattern id={patternId} width={cellSize} height={cellSize} patternUnits="userSpaceOnUse" patternTransform="rotate({rotation})">
			<polygon
				points="{cellSize / 2},0 {cellSize},{cellSize / 2} {cellSize / 2},{cellSize} 0,{cellSize / 2}"
				fill="none"
				stroke={color}
				stroke-width={strokeWidth}
			/>
		</pattern>

	{:else if pattern === 'chevrons'}
		<pattern id={patternId} width={cellSize} height={cellSize / 2} patternUnits="userSpaceOnUse" patternTransform="rotate({rotation})">
			<polyline
				points="0,{cellSize / 2} {cellSize / 2},0 {cellSize},{cellSize / 2}"
				fill="none"
				stroke={color}
				stroke-width={strokeWidth}
			/>
		</pattern>

	{:else if pattern === 'waves'}
		<pattern id={patternId} width={cellSize} height={cellSize / 2} patternUnits="userSpaceOnUse" patternTransform="rotate({rotation})">
			<path
				d="M0,{cellSize / 4} Q{cellSize / 4},0 {cellSize / 2},{cellSize / 4} T{cellSize},{cellSize / 4}"
				fill="none"
				stroke={color}
				stroke-width={strokeWidth}
			/>
		</pattern>

	{:else if pattern === 'circles'}
		<pattern id={patternId} width={cellSize} height={cellSize} patternUnits="userSpaceOnUse" patternTransform="rotate({rotation})">
			<circle
				cx={cellSize / 2}
				cy={cellSize / 2}
				r={size / 2 - strokeWidth}
				fill="none"
				stroke={color}
				stroke-width={strokeWidth}
			/>
		</pattern>

	{:else if pattern === 'crosses'}
		<pattern id={patternId} width={cellSize} height={cellSize} patternUnits="userSpaceOnUse" patternTransform="rotate({rotation})">
			<path
				d="M{cellSize / 2},{spacing / 2} V{cellSize - spacing / 2} M{spacing / 2},{cellSize / 2} H{cellSize - spacing / 2}"
				fill="none"
				stroke={color}
				stroke-width={strokeWidth}
			/>
		</pattern>

	{:else if pattern === 'zigzag'}
		<pattern id={patternId} width={cellSize} height={cellSize} patternUnits="userSpaceOnUse" patternTransform="rotate({rotation})">
			<polyline
				points="0,{cellSize / 2} {cellSize / 4},0 {cellSize / 2},{cellSize / 2} {cellSize * 3 / 4},0 {cellSize},{cellSize / 2}"
				fill="none"
				stroke={color}
				stroke-width={strokeWidth}
			/>
			<polyline
				points="0,{cellSize} {cellSize / 4},{cellSize / 2} {cellSize / 2},{cellSize} {cellSize * 3 / 4},{cellSize / 2} {cellSize},{cellSize}"
				fill="none"
				stroke={color}
				stroke-width={strokeWidth}
			/>
		</pattern>

	{:else if pattern === 'checkered'}
		<pattern id={patternId} width={cellSize * 2} height={cellSize * 2} patternUnits="userSpaceOnUse" patternTransform="rotate({rotation})">
			<rect x="0" y="0" width={cellSize} height={cellSize} fill={color} />
			<rect x={cellSize} y={cellSize} width={cellSize} height={cellSize} fill={color} />
		</pattern>

	{:else if pattern === 'stripes-h'}
		<pattern id={patternId} width={10} height={cellSize * 2} patternUnits="userSpaceOnUse" patternTransform="rotate({rotation})">
			<rect x="0" y="0" width="10" height={cellSize} fill={color} />
		</pattern>

	{:else if pattern === 'stripes-v'}
		<pattern id={patternId} width={cellSize * 2} height={10} patternUnits="userSpaceOnUse" patternTransform="rotate({rotation})">
			<rect x="0" y="0" width={cellSize} height="10" fill={color} />
		</pattern>

	{:else if pattern === 'confetti'}
		{@const seed = uid}
		<pattern id={patternId} width={cellSize * 3} height={cellSize * 3} patternUnits="userSpaceOnUse" patternTransform="rotate({rotation})">
			<!-- Randomized small shapes -->
			<rect x={cellSize * 0.2} y={cellSize * 0.3} width={size / 3} height={size / 3} fill={color} transform="rotate(15, {cellSize * 0.2}, {cellSize * 0.3})" />
			<rect x={cellSize * 1.5} y={cellSize * 0.8} width={size / 3} height={size / 3} fill={color} transform="rotate(-20, {cellSize * 1.5}, {cellSize * 0.8})" />
			<rect x={cellSize * 2.3} y={cellSize * 0.2} width={size / 3} height={size / 3} fill={color} transform="rotate(45, {cellSize * 2.3}, {cellSize * 0.2})" />
			<rect x={cellSize * 0.5} y={cellSize * 1.8} width={size / 3} height={size / 3} fill={color} transform="rotate(-10, {cellSize * 0.5}, {cellSize * 1.8})" />
			<rect x={cellSize * 1.8} y={cellSize * 2.2} width={size / 3} height={size / 3} fill={color} transform="rotate(30, {cellSize * 1.8}, {cellSize * 2.2})" />
			<rect x={cellSize * 2.5} y={cellSize * 1.5} width={size / 3} height={size / 3} fill={color} transform="rotate(-35, {cellSize * 2.5}, {cellSize * 1.5})" />
		</pattern>

	{:else if pattern === 'stars'}
		{@const starSize = size}
		{@const innerRadius = starSize * 0.38}
		{@const outerRadius = starSize * 0.5}
		{@const cx = cellSize / 2}
		{@const cy = cellSize / 2}
		<pattern id={patternId} width={cellSize} height={cellSize} patternUnits="userSpaceOnUse" patternTransform="rotate({rotation})">
			<polygon
				points={Array.from({ length: 10 }, (_, i) => {
					const angle = (i * 36 - 90) * Math.PI / 180;
					const r = i % 2 === 0 ? outerRadius : innerRadius;
					return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
				}).join(' ')}
				fill={color}
			/>
		</pattern>

	<!-- ICON PATTERN (single icon) -->
	{:else if pattern === 'icon' && icon}
		<pattern id={patternId} width={cellSize} height={cellSize} patternUnits="userSpaceOnUse" patternTransform="rotate({rotation})">
			<g transform="translate({spacing / 2}, {spacing / 2})">
				<svg
					width={size * iconScale}
					height={size * iconScale}
					viewBox="0 0 {icon.width ?? 24} {icon.height ?? 24}"
					fill={color}
					style="color: {color}"
				>
					<g transform="rotate({iconRotation}, {(icon.width ?? 24) / 2}, {(icon.height ?? 24) / 2})">
						{@html sanitizedIconBody}
					</g>
				</svg>
			</g>
		</pattern>

	<!-- MULTI-ICON PATTERN -->
	{:else if pattern === 'icons' && icons && icons.length > 0}
		{@const patternHeight = rowOffset !== 0 ? cellSize * 2 : cellSize}
		{@const absOffset = Math.abs(rowOffset)}
		<pattern id={patternId} width={multiIconWidth} height={patternHeight} patternUnits="userSpaceOnUse" patternTransform="rotate({rotation})">
			<!-- First row -->
			{#each sanitizedIcons as iconItem, index}
				{@const iconData = iconItem.iconData}
				{#if iconData}
					<g transform="translate({index * cellSize + spacing / 2}, {spacing / 2})">
						<svg
							width={size * iconScale}
							height={size * iconScale}
							viewBox="0 0 {iconData.width ?? 24} {iconData.height ?? 24}"
							fill={color}
							style="color: {color}"
						>
							<g transform="rotate({iconItem.rotation}, {(iconData.width ?? 24) / 2}, {(iconData.height ?? 24) / 2})">
								{@html iconItem.sanitizedBody}
							</g>
						</svg>
					</g>
				{/if}
			{/each}
			<!-- Second row (offset) - only if rowOffset is set -->
			{#if rowOffset !== 0}
				<!-- Render icons at negative positions to fill gap when offset is positive -->
				{#if rowOffset > 0}
					{#each sanitizedIcons as iconItem, index}
						{@const iconData = iconItem.iconData}
						{@const xPos = index * cellSize + spacing / 2 + rowOffset - multiIconWidth}
						{#if iconData && xPos + cellSize > 0}
							<g transform="translate({xPos}, {cellSize + spacing / 2})">
								<svg
									width={size * iconScale}
									height={size * iconScale}
									viewBox="0 0 {iconData.width ?? 24} {iconData.height ?? 24}"
									fill={color}
									style="color: {color}"
								>
									<g transform="rotate({iconItem.rotation}, {(iconData.width ?? 24) / 2}, {(iconData.height ?? 24) / 2})">
										{@html iconItem.sanitizedBody}
									</g>
								</svg>
							</g>
						{/if}
					{/each}
				{/if}
				<!-- Main offset row -->
				{#each sanitizedIcons as iconItem, index}
					{@const iconData = iconItem.iconData}
					{@const xPos = index * cellSize + spacing / 2 + rowOffset}
					{#if iconData && xPos < multiIconWidth}
						<g transform="translate({xPos}, {cellSize + spacing / 2})">
							<svg
								width={size * iconScale}
								height={size * iconScale}
								viewBox="0 0 {iconData.width ?? 24} {iconData.height ?? 24}"
								fill={color}
								style="color: {color}"
							>
								<g transform="rotate({iconItem.rotation}, {(iconData.width ?? 24) / 2}, {(iconData.height ?? 24) / 2})">
									{@html iconItem.sanitizedBody}
								</g>
							</svg>
						</g>
					{/if}
				{/each}
				<!-- Render icons past right edge when offset is negative -->
				{#if rowOffset < 0}
					{#each sanitizedIcons as iconItem, index}
						{@const iconData = iconItem.iconData}
						{@const xPos = index * cellSize + spacing / 2 + rowOffset + multiIconWidth}
						{#if iconData && xPos < multiIconWidth}
							<g transform="translate({xPos}, {cellSize + spacing / 2})">
								<svg
									width={size * iconScale}
									height={size * iconScale}
									viewBox="0 0 {iconData.width ?? 24} {iconData.height ?? 24}"
									fill={color}
									style="color: {color}"
								>
									<g transform="rotate({iconItem.rotation}, {(iconData.width ?? 24) / 2}, {(iconData.height ?? 24) / 2})">
										{@html iconItem.sanitizedBody}
									</g>
								</svg>
							</g>
						{/if}
					{/each}
				{/if}
			{/if}
		</pattern>
	{/if}
</defs>

<ComponentWrapper {container} {modifiers}>
	<rect
		x="0"
		y="0"
		width={container.width}
		height={container.height}
		fill="url(#{patternId})"
		{opacity}
		clip-path={needsClip ? `url(#${clipId})` : undefined}
	/>
</ComponentWrapper>
