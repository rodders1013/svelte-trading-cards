<script lang="ts" module>
	import { z } from 'zod';
	import { AnimationConfigSchema } from '$lib/styling/animations/types.js';
	import { EffectConfigSchema } from '$lib/styling/effects/types.js';
	import { BlendMode } from '$lib/styling/blend/types.js';
	import { HolographicConfigSchema } from '$lib/styling/HolographicWrapper.svelte';

	// Text preset options - predefined labels (moved from Badge)
	export const TextPresetSchema = z.enum([
		// Rarity labels
		'COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY', 'MYTHIC',
		// Status labels
		'NEW', 'HOT', 'SOLD', 'LIMITED', 'PROMO', 'EXCLUSIVE', 'VERIFIED',
		// Edition labels
		'1ST EDITION', 'SPECIAL', 'COLLECTOR', 'PREMIUM', 'ULTRA',
		// Empty (use data field instead)
		'none'
	]);
	export type TextPreset = z.infer<typeof TextPresetSchema>;

	export const TextFieldPropsSchema = z.object({
		// Text from preset OR data field (dataField takes priority)
		textPreset: TextPresetSchema.optional(),
		dataField: z.string().optional(),
		maxFontSize: z.number().default(48),
		minFontSize: z.number().default(12),
		fontFamily: z.string().default('Arial, sans-serif'),
		fontWeight: z.string().default('normal'),
		fontStyle: z.enum(['normal', 'italic']).optional(),
		textDecoration: z.enum(['none', 'underline', 'line-through']).optional(),
		textTransform: z.enum(['none', 'uppercase', 'lowercase', 'capitalize']).optional(),
		color: z.string().default('#ffffff'),
		opacity: z.number().min(0).max(1).optional(),
		alignment: z.enum(['left', 'center', 'right']).default('left'),
		verticalAlign: z.enum(['top', 'center', 'bottom']).default('center'),
		/** Additional padding (e.g., for border width). Added to auto-calculated radius padding. */
		padding: z.number().optional(),
		lineHeight: z.number().optional(),
		animation: AnimationConfigSchema.optional(),
		effect: EffectConfigSchema.optional(),
		blendMode: BlendMode.optional(),
		holographic: HolographicConfigSchema.optional()
	});

	export type TextFieldProps = z.infer<typeof TextFieldPropsSchema>;
</script>

<script lang="ts">
	import FitText from '$lib/utils/FitText.svelte';
	import { resolveTextContent } from '$lib/utils/data.js';
	import type { ContainerContext, CardData, UniversalModifiers } from '$lib/types';
	import ComponentWrapper from '$lib/styling/ComponentWrapper.svelte';

	let {
		textPreset = 'none',
		dataField,
		maxFontSize = 48,
		minFontSize = 12,
		fontFamily = 'Arial, sans-serif',
		fontWeight = 'normal',
		fontStyle = 'normal',
		textDecoration = 'none',
		textTransform = 'none',
		color = '#ffffff',
		opacity = 1,
		alignment = 'left',
		verticalAlign = 'center',
		padding = 0,
		animation,
		effect,
		blendMode,
		holographic,
		container,
		data
	}: TextFieldProps & {
		container: ContainerContext;
		data?: CardData;
	} = $props();

	// Text from data field (priority) or preset - uses shared utility
	const resolvedText = $derived(resolveTextContent(dataField, data, textPreset, 'none', ''));

	// Calculate inset from container radius (to avoid rounded corners) plus user padding
	// For rounded corners, safe inset ≈ radius * 0.3 keeps text out of corner curves
	const radiusInset = $derived((container.radius ?? 0) * 0.3);
	const totalInset = $derived(radiusInset + padding);

	// Collect modifiers for unified wrapper
	const modifiers: UniversalModifiers = $derived({ effect, animation, blendMode, holographic });

	// When holographic is enabled, use 'inherit' so gradient from HolographicWrapper applies
	const effectiveFill = $derived(holographic ? 'inherit' : color);
</script>

<ComponentWrapper {container} {modifiers}>
	<FitText
		text={resolvedText}
		x={0}
		y={0}
		width={container.width}
		height={container.height}
		minSize={minFontSize}
		maxSize={maxFontSize}
		inset={totalInset}
		{fontFamily}
		{fontWeight}
		{fontStyle}
		{textDecoration}
		{textTransform}
		horizontalAlign={alignment}
		{verticalAlign}
		fill={effectiveFill}
		{opacity}
	/>
</ComponentWrapper>
