<script lang="ts" module>
	import { z } from 'zod';
	import { AnimationConfigSchema } from '$lib/styling/animations/types.js';
	import { EffectConfigSchema } from '$lib/styling/effects/types.js';
	import { BlendMode } from '$lib/styling/blend/types.js';

	export const SolidBackgroundPropsSchema = z.object({
		color: z.string().default('#000000'),
		opacity: z.number().min(0).max(1).default(1),
		animation: AnimationConfigSchema.optional(),
		effect: EffectConfigSchema.optional(),
		blendMode: BlendMode.optional()
	});

	export type SolidBackgroundProps = z.infer<typeof SolidBackgroundPropsSchema>;
</script>

<script lang="ts">
	import type { ContainerContext, CardData } from '$lib/types';
	import { AnimationWrapper } from '$lib/styling/animations/index.js';
	import { EffectWrapper } from '$lib/styling/effects/index.js';

	let {
		color = '#000000',
		opacity = 1,
		animation,
		effect,
		blendMode,
		container,
		data
	}: SolidBackgroundProps & {
		container: ContainerContext;
		data?: CardData;
	} = $props();

	// Calculate center point for animation transform-origin
	const centerX = $derived(container.width / 2);
	const centerY = $derived(container.height / 2);
</script>

<EffectWrapper {effect} {blendMode} transformOrigin="{centerX}px {centerY}px">
	<AnimationWrapper {animation} transformOrigin="{centerX}px {centerY}px">
		<rect
			x="0"
			y="0"
			width={container.width}
			height={container.height}
			rx={container.radius}
			fill={color}
			{opacity}
		/>
	</AnimationWrapper>
</EffectWrapper>
