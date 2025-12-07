<script lang="ts" module>
	import { z } from 'zod';
	import { AnimationConfigSchema } from '$lib/animations';
	import { BlendMode } from '$lib/blend/types.js';
	import { BuiltInShapeSchema } from '$lib/shapes';

	// Shape source schema for Group clipping
	const ShapeSourceSchema = z.discriminatedUnion('type', [
		z.object({ type: z.literal('builtin'), shape: BuiltInShapeSchema }),
		z.object({
			type: z.literal('custom'),
			iconData: z.object({
				body: z.string(),
				width: z.number().default(24),
				height: z.number().default(24),
				left: z.number().optional(),
				top: z.number().optional()
			}),
			iconName: z.string().optional()
		})
	]);

	export const GroupPropsSchema = z.object({
		x: z.number().default(0),
		y: z.number().default(0),
		width: z.number(),
		height: z.number(),
		radius: z.number().default(0),
		clipContent: z.boolean().default(true),
		shapeSource: ShapeSourceSchema.optional(),
		animation: AnimationConfigSchema.optional(),
		blendMode: BlendMode.optional()
	});

	export type GroupProps = z.infer<typeof GroupPropsSchema>;
</script>

<script lang="ts">
	import type { ComponentDefinition, ContainerContext, CardData } from '$lib/types';
	import type { ShapeSource } from '$lib/shapes';
	import ComponentRenderer from './ComponentRenderer.svelte';
	import AnimationWrapper from '$lib/animations/AnimationWrapper.svelte';
	import { getShapeRenderData } from '$lib/shapes';

	let {
		x = 0,
		y = 0,
		width,
		height,
		radius = 0,
		clipContent = true,
		shapeSource,
		animation,
		blendMode,
		children,
		data,
		container: _container
	}: GroupProps & {
		children?: ComponentDefinition[];
		data: CardData;
		container: ContainerContext;
	} = $props();

	// Check if animation should be applied
	const hasAnimation = $derived(animation && animation.type !== 'none');

	// Check if blend mode should be applied
	const hasBlend = $derived(blendMode !== undefined && blendMode !== 'normal');
	const blendStyle = $derived(hasBlend ? `mix-blend-mode: ${blendMode}` : '');

	const uid = Math.random().toString(36).substring(2, 9);
	const clipId = `group-clip-${uid}`;
	const maskId = `group-mask-${uid}`;

	// Determine if we're using a simple rect (native clipPath) or shape (mask)
	const isSimpleRect = $derived(!shapeSource || (shapeSource.type === 'builtin' && shapeSource.shape === 'rectangle'));

	// Get shape render data for non-rect shapes
	const shapeRender = $derived(
		shapeSource && !isSimpleRect
			? getShapeRenderData(shapeSource as ShapeSource, width, height, 'stretch')
			: null
	);

	// Determine if we need clipping
	const needsClip = $derived(clipContent && (radius > 0 || shapeSource));
	const useNativeClip = $derived(needsClip && isSimpleRect);
	const useMask = $derived(needsClip && !isSimpleRect && shapeRender);

	// Create container context for children
	const childContainer: ContainerContext = $derived({
		width,
		height,
		radius: isSimpleRect ? radius : 0,
		shapeSource: shapeSource as ShapeSource | undefined
	});
</script>

{#snippet clipDefs()}
	{#if useNativeClip}
		<defs>
			<clipPath id={clipId}>
				<rect x="0" y="0" {width} {height} rx={radius} ry={radius} />
			</clipPath>
		</defs>
	{:else if useMask && shapeRender}
		<defs>
			<mask id={maskId}>
				<g transform={shapeRender.transform} fill="white">
					{@html shapeRender.strippedBody}
				</g>
			</mask>
		</defs>
	{/if}
{/snippet}

{#snippet groupContent()}
	{@render clipDefs()}
	<g
		clip-path={useNativeClip ? `url(#${clipId})` : undefined}
		mask={useMask ? `url(#${maskId})` : undefined}
	>
		{#if children}
			{#each children as child (child.id)}
				<ComponentRenderer definition={child} {data} container={childContainer} />
			{/each}
		{/if}
	</g>
{/snippet}

{#snippet positionedContent()}
	{#if hasAnimation && animation}
		<AnimationWrapper {animation} transformOrigin="{width / 2}px {height / 2}px">
			<g transform="translate({x}, {y})">
				{@render groupContent()}
			</g>
		</AnimationWrapper>
	{:else}
		<g transform="translate({x}, {y})">
			{@render groupContent()}
		</g>
	{/if}
{/snippet}

<!-- Outer wrapper for blend mode (wraps everything including animations) -->
{#if hasBlend}
	<g style={blendStyle}>
		{@render positionedContent()}
	</g>
{:else}
	{@render positionedContent()}
{/if}
