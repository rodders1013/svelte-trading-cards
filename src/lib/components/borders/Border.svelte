<script lang="ts" module>
	import { z } from 'zod';
	import { AnimationConfigSchema } from '$lib/animations/types.js';
	import { EffectConfigSchema } from '$lib/effects/types.js';
	import { BlendMode } from '$lib/blend/types.js';

	const GlowEffectSchema = z.object({
		color: z.string().optional(),
		intensity: z.number().min(0).max(1).default(0.5),
		blur: z.number().default(10),
		animated: z.boolean().default(false),
		speed: z.number().default(2)
	});

	const HolographicEffectSchema = z.object({
		secondaryColor: z.string(),
		speed: z.number().default(3)
	});

	export const BorderPropsSchema = z.object({
		color: z.string().default('#ffffff'),
		width: z.number().default(8),
		opacity: z.number().min(0).max(1).default(1),
		glow: GlowEffectSchema.optional(),
		holographic: HolographicEffectSchema.optional(),
		layers: z.number().min(1).max(5).optional(),
		layerColors: z.array(z.string()).optional(),
		layerSpacing: z.number().default(4),
		animation: AnimationConfigSchema.optional(),
		effect: EffectConfigSchema.optional(),
		blendMode: BlendMode.optional()
	});

	export type BorderProps = z.infer<typeof BorderPropsSchema>;
	export type GlowEffect = z.infer<typeof GlowEffectSchema>;
	export type HolographicEffect = z.infer<typeof HolographicEffectSchema>;
</script>

<script lang="ts">
	import type { ContainerContext, CardData } from '$lib/types';
	import { AnimationWrapper } from '$lib/animations/index.js';
	import { EffectWrapper } from '$lib/effects/index.js';

	let {
		color = '#ffffff',
		width = 8,
		opacity = 1,
		glow,
		holographic,
		layers,
		layerColors,
		layerSpacing = 4,
		animation,
		effect,
		blendMode,
		container,
		data
	}: BorderProps & {
		container: ContainerContext;
		data?: CardData;
	} = $props();

	// Generate unique IDs for SVG elements
	const uid = Math.random().toString(36).substring(2, 9);
	const filterId = `glow-filter-${uid}`;
	const gradientId = `holo-gradient-${uid}`;

	// Calculate glow properties
	const glowColor = $derived(glow?.color ?? color);
	const glowIntensity = $derived(glow?.intensity ?? 0.5);
	const glowBlur = $derived(glow?.blur ?? 10);
	const glowAnimated = $derived(glow?.animated ?? false);
	const glowSpeed = $derived(glow?.speed ?? 2);

	// Calculate holographic properties
	const holoSecondary = $derived(holographic?.secondaryColor ?? color);
	const holoSpeed = $derived(holographic?.speed ?? 3);

	// Calculate layer properties
	const layerCount = $derived(layers ?? 1);
	const effectiveLayerColors = $derived(layerColors ?? Array(layerCount).fill(color));

	// Calculate border rect position (inset by half stroke width)
	const halfWidth = $derived(width / 2);

	// Get the shape from container context
	const clipShape = $derived(container.clipShape ?? 'rect');

	// Generate border path data based on shape (with inset for stroke)
	function getBorderPathData(inset: number = 0) {
		const w = container.width;
		const h = container.height;
		const offset = halfWidth + inset;
		const innerW = w - offset * 2;
		const innerH = h - offset * 2;
		const cx = w / 2;
		const cy = h / 2;

		switch (clipShape) {
			case 'circle': {
				const r = Math.min(w, h) / 2 - offset;
				return { type: 'circle' as const, cx, cy, r };
			}
			case 'ellipse': {
				const rx = w / 2 - offset;
				const ry = h / 2 - offset;
				return { type: 'ellipse' as const, cx, cy, rx, ry };
			}
			case 'hexagon': {
				const rx = w / 2 - offset;
				const ry = h / 2 - offset;
				const points = [];
				for (let i = 0; i < 6; i++) {
					const angle = (Math.PI / 3) * i - Math.PI / 2;
					const px = cx + rx * Math.cos(angle);
					const py = cy + ry * Math.sin(angle);
					points.push(`${px},${py}`);
				}
				return { type: 'polygon' as const, points: points.join(' ') };
			}
			case 'octagon': {
				const insetRatio = 0.293;
				const cornerInset = Math.min(innerW, innerH) * insetRatio;
				const points = [
					`${offset + cornerInset},${offset}`,
					`${w - offset - cornerInset},${offset}`,
					`${w - offset},${offset + cornerInset}`,
					`${w - offset},${h - offset - cornerInset}`,
					`${w - offset - cornerInset},${h - offset}`,
					`${offset + cornerInset},${h - offset}`,
					`${offset},${h - offset - cornerInset}`,
					`${offset},${offset + cornerInset}`
				];
				return { type: 'polygon' as const, points: points.join(' ') };
			}
			case 'diamond': {
				const points = [
					`${cx},${offset}`,
					`${w - offset},${cy}`,
					`${cx},${h - offset}`,
					`${offset},${cy}`
				];
				return { type: 'polygon' as const, points: points.join(' ') };
			}
			case 'shield': {
				const path = `M ${offset + innerW * 0.1},${offset}
					L ${w - offset - innerW * 0.1},${offset}
					Q ${w - offset},${offset} ${w - offset},${offset + innerH * 0.1}
					L ${w - offset},${offset + innerH * 0.5}
					Q ${w - offset},${offset + innerH * 0.7} ${cx},${h - offset}
					Q ${offset},${offset + innerH * 0.7} ${offset},${offset + innerH * 0.5}
					L ${offset},${offset + innerH * 0.1}
					Q ${offset},${offset} ${offset + innerW * 0.1},${offset} Z`;
				return { type: 'path' as const, d: path };
			}
			case 'star': {
				const outerR = Math.min(w, h) / 2 - offset;
				const innerR = outerR * 0.4;
				const points = [];
				for (let i = 0; i < 10; i++) {
					const angle = (Math.PI / 5) * i - Math.PI / 2;
					const r = i % 2 === 0 ? outerR : innerR;
					const px = cx + r * Math.cos(angle);
					const py = cy + r * Math.sin(angle);
					points.push(`${px},${py}`);
				}
				return { type: 'polygon' as const, points: points.join(' ') };
			}
			case 'polygon': {
				if (container.clipPoints && container.clipPoints.length >= 3) {
					const points = container.clipPoints.map((p) => {
						const px = offset + p.x * innerW;
						const py = offset + p.y * innerH;
						return `${px},${py}`;
					});
					return { type: 'polygon' as const, points: points.join(' ') };
				}
				return { type: 'rect' as const, x: offset, y: offset, width: innerW, height: innerH, rx: container.radius };
			}
			default:
				return { type: 'rect' as const, x: offset, y: offset, width: innerW, height: innerH, rx: container.radius };
		}
	}

	// Get border data for main border and layers
	const borderData = $derived(getBorderPathData(0));

	// Calculate center point for animation transform-origin
	const centerX = $derived(container.width / 2);
	const centerY = $derived(container.height / 2);
</script>

<defs>
	{#if glow}
		<filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
			<feGaussianBlur in="SourceGraphic" stdDeviation={glowBlur} result="blur" />
			<feComposite in="blur" in2="SourceGraphic" operator="over" />
		</filter>
	{/if}

	{#if holographic}
		<linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
			<stop offset="0%" stop-color={color}>
				<animate
					attributeName="stop-color"
					values="{color};{holoSecondary};{color}"
					dur="{holoSpeed}s"
					repeatCount="indefinite"
				/>
			</stop>
			<stop offset="50%" stop-color={holoSecondary}>
				<animate
					attributeName="stop-color"
					values="{holoSecondary};{color};{holoSecondary}"
					dur="{holoSpeed}s"
					repeatCount="indefinite"
				/>
			</stop>
			<stop offset="100%" stop-color={color}>
				<animate
					attributeName="stop-color"
					values="{color};{holoSecondary};{color}"
					dur="{holoSpeed}s"
					repeatCount="indefinite"
				/>
			</stop>
		</linearGradient>
	{/if}
</defs>

{#snippet borderShape(shapeData: ReturnType<typeof getBorderPathData>, strokeColor: string, strokeOpacity: number, extraProps?: { filter?: string; class?: string; style?: string })}
	{#if shapeData.type === 'rect'}
		<rect
			x={shapeData.x}
			y={shapeData.y}
			width={shapeData.width}
			height={shapeData.height}
			rx={shapeData.rx}
			ry={shapeData.rx}
			fill="none"
			stroke={strokeColor}
			stroke-width={width}
			opacity={strokeOpacity}
			filter={extraProps?.filter}
			class={extraProps?.class}
			style={extraProps?.style}
		/>
	{:else if shapeData.type === 'circle'}
		<circle
			cx={shapeData.cx}
			cy={shapeData.cy}
			r={shapeData.r}
			fill="none"
			stroke={strokeColor}
			stroke-width={width}
			opacity={strokeOpacity}
			filter={extraProps?.filter}
			class={extraProps?.class}
			style={extraProps?.style}
		/>
	{:else if shapeData.type === 'ellipse'}
		<ellipse
			cx={shapeData.cx}
			cy={shapeData.cy}
			rx={shapeData.rx}
			ry={shapeData.ry}
			fill="none"
			stroke={strokeColor}
			stroke-width={width}
			opacity={strokeOpacity}
			filter={extraProps?.filter}
			class={extraProps?.class}
			style={extraProps?.style}
		/>
	{:else if shapeData.type === 'polygon'}
		<polygon
			points={shapeData.points}
			fill="none"
			stroke={strokeColor}
			stroke-width={width}
			opacity={strokeOpacity}
			filter={extraProps?.filter}
			class={extraProps?.class}
			style={extraProps?.style}
		/>
	{:else if shapeData.type === 'path'}
		<path
			d={shapeData.d}
			fill="none"
			stroke={strokeColor}
			stroke-width={width}
			opacity={strokeOpacity}
			filter={extraProps?.filter}
			class={extraProps?.class}
			style={extraProps?.style}
		/>
	{/if}
{/snippet}

<EffectWrapper {effect} {blendMode} transformOrigin="{centerX}px {centerY}px">
	<AnimationWrapper {animation} transformOrigin="{centerX}px {centerY}px">
		<!-- Glow layer (rendered behind main border) -->
		{#if glow}
			{@render borderShape(
				borderData,
				glowColor,
				glowAnimated ? 1 : glowIntensity,
				{
					filter: `url(#${filterId})`,
					class: glowAnimated ? 'glow-pulse' : undefined,
					style: glowAnimated ? `--glow-intensity: ${glowIntensity}; --glow-speed: ${glowSpeed}s;` : undefined
				}
			)}
		{/if}

		<!-- Multi-layer borders (mythic effect) -->
		{#if layerCount > 1}
			{#each Array(layerCount) as _, i (i)}
				{@const layerData = getBorderPathData(i * layerSpacing)}
				{@const layerColor = effectiveLayerColors[i] ?? color}
				{@const layerOpacity = opacity * (1 - i * 0.15)}
				{@render borderShape(layerData, layerColor, layerOpacity)}
			{/each}
		{:else}
			<!-- Single border -->
			{@render borderShape(borderData, holographic ? `url(#${gradientId})` : color, opacity)}
		{/if}
	</AnimationWrapper>
</EffectWrapper>

<style>
	@keyframes glow-pulse {
		0%,
		100% {
			opacity: var(--glow-intensity, 0.5);
		}
		50% {
			opacity: calc(var(--glow-intensity, 0.5) * 0.3);
		}
	}

	.glow-pulse {
		animation: glow-pulse var(--glow-speed, 2s) ease-in-out infinite;
	}
</style>
