<script lang="ts" module>
	import { z } from 'zod';
	import { AnimationConfigSchema } from '$lib/styling/animations/types.js';
	import { EffectConfigSchema } from '$lib/styling/effects/types.js';
	import { BlendMode } from '$lib/styling/blend/types.js';
	import { HolographicConfigSchema } from '$lib/styling/HolographicWrapper.svelte';

	export const SolidBackgroundPropsSchema = z.object({
		color: z.string().default('#000000'),
		opacity: z.number().min(0).max(1).default(1),
		animation: AnimationConfigSchema.optional(),
		effect: EffectConfigSchema.optional(),
		blendMode: BlendMode.optional(),
		holographic: HolographicConfigSchema.optional()
	});

	export type SolidBackgroundProps = z.infer<typeof SolidBackgroundPropsSchema>;
</script>

<script lang="ts">
	import type { ContainerContext, CardData, UniversalModifiers } from '$lib/types';
	import ComponentWrapper from '$lib/styling/ComponentWrapper.svelte';

	let {
		color = '#000000',
		opacity = 1,
		animation,
		effect,
		blendMode,
		holographic,
		container,
		data
	}: SolidBackgroundProps & {
		container: ContainerContext;
		data?: CardData;
	} = $props();

	// Collect modifiers for unified wrapper
	const modifiers: UniversalModifiers = $derived({ effect, animation, blendMode, holographic });

	// When holographic is enabled, use 'inherit' so gradient from HolographicWrapper applies
	const effectiveFill = $derived(holographic ? 'inherit' : color);
</script>

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
