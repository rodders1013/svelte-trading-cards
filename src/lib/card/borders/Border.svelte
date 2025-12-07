<script lang="ts" module>
	import { z } from 'zod';
	import { AnimationConfigSchema } from '$lib/styling/animations/types.js';
	import { EffectConfigSchema } from '$lib/styling/effects/types.js';
	import { BlendMode } from '$lib/styling/blend/types.js';
	import { HolographicConfigSchema } from '$lib/styling/HolographicWrapper.svelte';

	export const BorderPropsSchema = z.object({
		color: z.string().default('#ffffff'),
		width: z.number().default(8),
		opacity: z.number().min(0).max(1).default(1),
		layers: z.number().min(1).max(5).optional(),
		layerColors: z.array(z.string()).optional(),
		layerSpacing: z.number().default(4),
		animation: AnimationConfigSchema.optional(),
		effect: EffectConfigSchema.optional(),
		blendMode: BlendMode.optional(),
		holographic: HolographicConfigSchema.optional()
	});

	export type BorderProps = z.infer<typeof BorderPropsSchema>;
</script>

<script lang="ts">
	import type { ContainerContext, CardData } from '$lib/types';
	import { AnimationWrapper } from '$lib/styling/animations/index.js';
	import { EffectWrapper } from '$lib/styling/effects/index.js';
	import HolographicWrapper from '$lib/styling/HolographicWrapper.svelte';
	import { getShapeRenderData } from '$lib/styling/shapes';

	let {
		color = '#ffffff',
		width = 8,
		opacity = 1,
		layers,
		layerColors,
		layerSpacing = 4,
		animation,
		effect,
		blendMode,
		holographic,
		container,
		data
	}: BorderProps & {
		container: ContainerContext;
		data?: CardData;
	} = $props();

	// Calculate layer properties
	const layerCount = $derived(layers ?? 1);
	const effectiveLayerColors = $derived(layerColors ?? Array(layerCount).fill(color));

	// Calculate border rect position (inset by half stroke width)
	const halfWidth = $derived(width / 2);

	// Check if we have a shape or just a rect
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

	// Check if holographic is enabled
	const hasHolographic = $derived(!!holographic);
</script>

{#snippet rectBorder(strokeColor: string, strokeOpacity: number, inset: number = 0)}
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
	/>
{/snippet}

{#snippet shapeBorder(strokeColor: string, strokeOpacity: number)}
	{#if shapeRender}
		<g
			transform={shapeRender.transform}
			fill="none"
			stroke={strokeColor}
			stroke-width={shapeStrokeWidth}
			opacity={strokeOpacity}
		>
			{@html shapeRender.strippedBody}
		</g>
	{/if}
{/snippet}

{#snippet borderContent()}
	{#if isSimpleRect}
		<!-- Rect-based border -->
		{#if layerCount > 1}
			{#each Array(layerCount) as _, i (i)}
				{@const layerColor = effectiveLayerColors[i] ?? color}
				{@const layerOpacity = opacity * (1 - i * 0.15)}
				{@render rectBorder(layerColor, layerOpacity, i * layerSpacing)}
			{/each}
		{:else}
			{@render rectBorder(color, opacity)}
		{/if}
	{:else if shapeRender}
		<!-- Shape-based border -->
		{@render shapeBorder(color, opacity)}
	{/if}
{/snippet}

<EffectWrapper {effect} {blendMode} transformOrigin="{centerX}px {centerY}px">
	<AnimationWrapper {animation} transformOrigin="{centerX}px {centerY}px">
		{#if hasHolographic && holographic}
			<HolographicWrapper
				color={holographic.color ?? color}
				secondaryColor={holographic.secondaryColor}
				tertiaryColor={holographic.tertiaryColor}
				speed={holographic.speed}
				angle={holographic.angle}
				apply="stroke"
			>
				{@render borderContent()}
			</HolographicWrapper>
		{:else}
			{@render borderContent()}
		{/if}
	</AnimationWrapper>
</EffectWrapper>
