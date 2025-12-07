<script lang="ts" module>
	import { z } from 'zod';
	import { AnimationConfigSchema } from '$lib/styling/animations/types.js';
	import { EffectConfigSchema } from '$lib/styling/effects/types.js';
	import { BlendMode } from '$lib/styling/blend/types.js';
	import { IconDataSchema } from '$lib/card/icons/Icon.svelte';
	import { BuiltInShapeSchema, type ShapeSource } from '$lib/styling/shapes/types.js';

	// Shape source schema for Badge
	export const BadgeShapeSourceSchema = z.discriminatedUnion('type', [
		z.object({ type: z.literal('builtin'), shape: BuiltInShapeSchema }),
		z.object({
			type: z.literal('custom'),
			iconData: IconDataSchema,
			iconName: z.string().optional()
		})
	]);

	export const BadgePropsSchema = z.object({
		// Shape - uses icon-based shape system
		shapeSource: BadgeShapeSourceSchema.default({ type: 'builtin', shape: 'circle' }),
		backgroundColor: z.string().default('#3b82f6'),
		borderColor: z.string().optional(),
		borderWidth: z.number().default(0),
		// Content icon (displayed inside the badge)
		icon: IconDataSchema.optional(),
		iconColor: z.string().optional(),
		opacity: z.number().min(0).max(1).default(1),
		animation: AnimationConfigSchema.optional(),
		effect: EffectConfigSchema.optional(),
		blendMode: BlendMode.optional()
	});

	export type BadgeProps = z.infer<typeof BadgePropsSchema>;
</script>

<script lang="ts">
	import type { ContainerContext, CardData, UniversalModifiers } from '$lib/types';
	import ComponentWrapper from '$lib/styling/ComponentWrapper.svelte';
	import { sanitizeSvgBody } from '$lib/card/icons/Icon.svelte';
	import { getShapeRenderData } from '$lib/styling/shapes/shapeUtils.js';

	let {
		shapeSource = { type: 'builtin', shape: 'circle' } as ShapeSource,
		backgroundColor = '#3b82f6',
		borderColor,
		borderWidth = 0,
		icon,
		iconColor,
		opacity = 1,
		animation,
		effect,
		blendMode,
		container,
		data
	}: BadgeProps & {
		container: ContainerContext;
		data?: CardData;
	} = $props();

	// Calculate dimensions based on container
	const width = $derived(container.width);
	const height = $derived(container.height);
	const cx = $derived(width / 2);
	const cy = $derived(height / 2);

	// Generate unique ID for mask
	const maskId = $derived(`badge-mask-${Math.random().toString(36).slice(2, 9)}`);

	// Get shape render data from the new shape system
	const shapeRender = $derived(getShapeRenderData(shapeSource, width, height, 'contain'));

	// Content icon - size based on container (40% of smallest dimension)
	const hasIcon = $derived(icon?.body);
	const iconSize = $derived(Math.min(width, height) * 0.4);

	// Sanitize content icon body
	const sanitizedIconBody = $derived(icon?.body ? sanitizeSvgBody(icon.body) : '');

	// Collect modifiers for unified wrapper
	const modifiers: UniversalModifiers = $derived({ effect, animation, blendMode });
</script>

<ComponentWrapper {container} {modifiers}>
	<g opacity={opacity}>
		{#if shapeRender}
			<!-- Define mask for the shape -->
			<defs>
				<mask id={maskId}>
					<g transform={shapeRender.transform} fill="white">
						{@html shapeRender.strippedBody}
					</g>
				</mask>
			</defs>

			<!-- Background fill using mask -->
			<rect
				x="0"
				y="0"
				width={width}
				height={height}
				fill={backgroundColor}
				mask="url(#{maskId})"
			/>

			<!-- Border stroke (rendered directly on shape path) -->
			{#if borderColor && borderWidth > 0}
				<g
					transform={shapeRender.transform}
					fill="none"
					stroke={borderColor}
					stroke-width={borderWidth * (shapeRender.width / width)}
				>
					{@html shapeRender.strippedBody}
				</g>
			{/if}

			<!-- Content icon (if provided) - centered in the badge -->
			{#if hasIcon && icon}
				<svg
					x={cx - iconSize / 2}
					y={cy - iconSize / 2}
					width={iconSize}
					height={iconSize}
					viewBox="0 0 {icon.width ?? 24} {icon.height ?? 24}"
					fill="none"
				>
					<g fill={iconColor ?? '#ffffff'} style="color: {iconColor ?? '#ffffff'}">
						{@html sanitizedIconBody}
					</g>
				</svg>
			{/if}
		{/if}
	</g>
</ComponentWrapper>
