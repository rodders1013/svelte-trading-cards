<script lang="ts" module>
	import { z } from 'zod';
	import { AnimationConfigSchema } from '$lib/animations/types.js';
	import { EffectConfigSchema } from '$lib/effects/types.js';

	export const TextFieldPropsSchema = z.object({
		text: z.string().optional(),
		dataField: z.string().optional(),
		maxFontSize: z.number().default(48),
		minFontSize: z.number().default(12),
		fontFamily: z.string().default('Arial, sans-serif'),
		fontWeight: z.string().default('normal'),
		color: z.string().default('#ffffff'),
		alignment: z.enum(['left', 'center', 'right']).default('left'),
		verticalAlign: z.enum(['top', 'center', 'bottom']).default('center'),
		lineHeight: z.number().optional(),
		animation: AnimationConfigSchema.optional(),
		effect: EffectConfigSchema.optional()
	});

	export type TextFieldProps = z.infer<typeof TextFieldPropsSchema>;
</script>

<script lang="ts">
	import FitText from '$lib/utils/FitText.svelte';
	import type { ContainerContext, CardData } from '$lib/types';
	import { AnimationWrapper } from '$lib/animations/index.js';
	import { EffectWrapper } from '$lib/effects/index.js';

	let {
		text,
		dataField,
		maxFontSize = 48,
		minFontSize = 12,
		fontFamily = 'Arial, sans-serif',
		fontWeight = 'normal',
		color = '#ffffff',
		alignment = 'left',
		verticalAlign = 'center',
		animation,
		effect,
		container,
		data
	}: TextFieldProps & {
		container: ContainerContext;
		data?: CardData;
	} = $props();

	const resolvedText = $derived(
		text || (dataField && data ? String(data[dataField] ?? '') : '')
	);

	// Calculate center point for animation transform-origin
	const centerX = $derived(container.width / 2);
	const centerY = $derived(container.height / 2);
</script>

<EffectWrapper {effect} transformOrigin="{centerX}px {centerY}px">
	<AnimationWrapper {animation} transformOrigin="{centerX}px {centerY}px">
		<FitText
			text={resolvedText}
			x={0}
			y={0}
			width={container.width}
			height={container.height}
			minSize={minFontSize}
			maxSize={maxFontSize}
			{fontFamily}
			{fontWeight}
			horizontalAlign={alignment}
			{verticalAlign}
			fill={color}
		/>
	</AnimationWrapper>
</EffectWrapper>
