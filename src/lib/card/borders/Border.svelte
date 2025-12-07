<script lang="ts" module>
	import { z } from 'zod';
	import { AnimationConfigSchema } from '$lib/styling/animations/types.js';
	import { EffectConfigSchema } from '$lib/styling/effects/types.js';
	import { BlendMode } from '$lib/styling/blend/types.js';

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
	import { AnimationWrapper } from '$lib/styling/animations/index.js';
	import { EffectWrapper } from '$lib/styling/effects/index.js';
	import { getShapeRenderData } from '$lib/styling/shapes';

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

	// Check if we have a shape or just a rect
	const hasShape = $derived(!!container.shapeSource);
	const isSimpleRect = $derived(
		!container.shapeSource ||
		(container.shapeSource.type === 'builtin' && container.shapeSource.shape === 'rectangle')
	);

	// Get shape render data
	const shapeRender = $derived(
		container.shapeSource && !isSimpleRect
			? getShapeRenderData(container.shapeSource, container.width, container.height, 'stretch')
			: null
	);

	// Scale stroke width for shape's coordinate system
	const shapeStrokeWidth = $derived(
		shapeRender ? width * (shapeRender.width / container.width) : width
	);

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

{#snippet rectBorder(strokeColor: string, strokeOpacity: number, inset: number = 0, extraProps?: { filter?: string; class?: string; style?: string })}
	{@const offset = halfWidth + inset}
	{@const innerW = container.width - offset * 2}
	{@const innerH = container.height - offset * 2}
	<rect
		x={offset}
		y={offset}
		width={innerW}
		height={innerH}
		rx={container.radius}
		ry={container.radius}
		fill="none"
		stroke={strokeColor}
		stroke-width={width}
		opacity={strokeOpacity}
		filter={extraProps?.filter}
		class={extraProps?.class}
		style={extraProps?.style}
	/>
{/snippet}

{#snippet shapeBorder(strokeColor: string, strokeOpacity: number, extraProps?: { filter?: string; class?: string; style?: string })}
	{#if shapeRender}
		<g
			transform={shapeRender.transform}
			fill="none"
			stroke={strokeColor}
			stroke-width={shapeStrokeWidth}
			opacity={strokeOpacity}
			filter={extraProps?.filter}
			class={extraProps?.class}
			style={extraProps?.style}
		>
			{@html shapeRender.strippedBody}
		</g>
	{/if}
{/snippet}

<EffectWrapper {effect} {blendMode} transformOrigin="{centerX}px {centerY}px">
	<AnimationWrapper {animation} transformOrigin="{centerX}px {centerY}px">
		{#if isSimpleRect}
			<!-- Rect-based border -->
			{#if glow}
				{@render rectBorder(
					glowColor,
					glowAnimated ? 1 : glowIntensity,
					0,
					{
						filter: `url(#${filterId})`,
						class: glowAnimated ? 'glow-pulse' : undefined,
						style: glowAnimated ? `--glow-intensity: ${glowIntensity}; --glow-speed: ${glowSpeed}s;` : undefined
					}
				)}
			{/if}

			{#if layerCount > 1}
				{#each Array(layerCount) as _, i (i)}
					{@const layerColor = effectiveLayerColors[i] ?? color}
					{@const layerOpacity = opacity * (1 - i * 0.15)}
					{@render rectBorder(layerColor, layerOpacity, i * layerSpacing)}
				{/each}
			{:else}
				{@render rectBorder(holographic ? `url(#${gradientId})` : color, opacity)}
			{/if}
		{:else if shapeRender}
			<!-- Shape-based border -->
			{#if glow}
				{@render shapeBorder(
					glowColor,
					glowAnimated ? 1 : glowIntensity,
					{
						filter: `url(#${filterId})`,
						class: glowAnimated ? 'glow-pulse' : undefined,
						style: glowAnimated ? `--glow-intensity: ${glowIntensity}; --glow-speed: ${glowSpeed}s;` : undefined
					}
				)}
			{/if}

			<!-- Note: Multi-layer not supported for shape borders (would need inset calculation) -->
			{@render shapeBorder(holographic ? `url(#${gradientId})` : color, opacity)}
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
