<script lang="ts" module>
	import { z } from 'zod';
	import { AnimationConfigSchema } from '$lib/animations/types.js';
	import { EffectConfigSchema } from '$lib/effects/types.js';

	export const GradientBackgroundPropsSchema = z.object({
		colors: z.array(z.string()).min(2).max(4),
		opacity: z.number().min(0).max(1).default(1),
		direction: z.enum(['vertical', 'horizontal', 'diagonal']).default('vertical'),
		animation: AnimationConfigSchema.optional(),
		effect: EffectConfigSchema.optional()
	});

	export type GradientBackgroundProps = z.infer<typeof GradientBackgroundPropsSchema>;
</script>

<script lang="ts">
	import type { ContainerContext, CardData } from '$lib/types';
	import { AnimationWrapper } from '$lib/animations/index.js';
	import { EffectWrapper } from '$lib/effects/index.js';

	let {
		colors,
		opacity = 1,
		direction = 'vertical',
		animation,
		effect,
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

	// Calculate center point for animation transform-origin
	const centerX = $derived(container.width / 2);
	const centerY = $derived(container.height / 2);
</script>

<defs>
	<linearGradient id={gradientId} x1={gradientCoords.x1} y1={gradientCoords.y1} x2={gradientCoords.x2} y2={gradientCoords.y2}>
		{#each colors as color, i (i)}
			<stop offset="{(i / (colors.length - 1)) * 100}%" style="stop-color:{color}" />
		{/each}
	</linearGradient>
</defs>

<EffectWrapper {effect} transformOrigin="{centerX}px {centerY}px">
	<AnimationWrapper {animation} transformOrigin="{centerX}px {centerY}px">
		<rect
			x="0"
			y="0"
			width={container.width}
			height={container.height}
			rx={container.radius}
			fill="url(#{gradientId})"
			{opacity}
		/>
	</AnimationWrapper>
</EffectWrapper>
