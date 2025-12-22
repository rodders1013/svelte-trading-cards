<script lang="ts" module>
	import { z } from 'zod';
	import { AnimationConfigSchema } from '../../styling/animations/types.js';
	import { EffectConfigSchema } from '../../styling/effects/types.js';
	import { BlendMode } from '../../styling/blend/types.js';
	import { HolographicConfigSchema } from '../../styling/HolographicWrapper.svelte';

	export const GradientBackgroundPropsSchema = z.object({
		colors: z.array(z.string()).min(2).max(4),
		opacity: z.number().min(0).max(1).default(1),
		direction: z.enum(['vertical', 'horizontal', 'diagonal']).default('vertical'),
		animation: AnimationConfigSchema.optional(),
		effect: EffectConfigSchema.optional(),
		blendMode: BlendMode.optional(),
		holographic: HolographicConfigSchema.optional()
	});

	export type GradientBackgroundProps = z.infer<typeof GradientBackgroundPropsSchema>;
</script>

<script lang="ts">
	import type { ContainerContext, CardData, UniversalModifiers } from '../../types';
	import ComponentWrapper from '../../styling/ComponentWrapper.svelte';

	let {
		colors,
		opacity = 1,
		direction = 'vertical',
		animation,
		effect,
		blendMode,
		holographic,
		container,
		data
	}: GradientBackgroundProps & {
		container: ContainerContext;
		data?: CardData;
	} = $props();

	const uid = Math.random().toString(36).substring(2, 9);
	const gradientId = `gradient-${uid}`;

	// Gradient direction coordinates
	const gradientCoords = $derived.by(() => {
		switch (direction) {
			case 'horizontal':
				return { x1: '0%', y1: '0%', x2: '100%', y2: '0%' };
			case 'diagonal':
				return { x1: '0%', y1: '0%', x2: '100%', y2: '100%' };
			default:
				return { x1: '0%', y1: '0%', x2: '0%', y2: '100%' };
		}
	});

	// Collect modifiers for unified wrapper
	const modifiers: UniversalModifiers = $derived({ effect, animation, blendMode, holographic });

	// When holographic is enabled, use 'inherit' so gradient from HolographicWrapper applies
	// For gradient backgrounds, holographic replaces the gradient entirely
	const effectiveFill = $derived(holographic ? 'inherit' : `url(#${gradientId})`);
</script>

<defs>
	{#if !holographic}
		<linearGradient id={gradientId} x1={gradientCoords.x1} y1={gradientCoords.y1} x2={gradientCoords.x2} y2={gradientCoords.y2}>
			{#each colors as color, i (i)}
				<stop offset="{(i / (colors.length - 1)) * 100}%" style="stop-color:{color}" />
			{/each}
		</linearGradient>
	{/if}
</defs>

<ComponentWrapper {container} {modifiers}>
	<rect
		x="0"
		y="0"
		width={container.width}
		height={container.height}
		rx={container.radius}
		fill={effectiveFill}
		{opacity}
	/>
</ComponentWrapper>
