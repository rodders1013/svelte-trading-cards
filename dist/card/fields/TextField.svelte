<script lang="ts" module>
	import { z } from 'zod';
	import { AnimationConfigSchema } from '../../styling/animations/types.js';
	import { EffectConfigSchema } from '../../styling/effects/types.js';
	import { BlendMode } from '../../styling/blend/types.js';
	import { HolographicConfigSchema } from '../../styling/HolographicWrapper.svelte';

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

	/**
	 * Text bounds configuration for constraining text within a safe zone.
	 * Useful when layer has a clip shape - insets define where text can render.
	 * Values are percentages (0-50) of the container dimensions.
	 */
	export const TextBoundsConfigSchema = z.object({
		/** Inset from left edge as percentage of container width */
		insetLeft: z.number().min(0).max(50).default(0),
		/** Inset from right edge as percentage of container width */
		insetRight: z.number().min(0).max(50).default(0),
		/** Inset from top edge as percentage of container height */
		insetTop: z.number().min(0).max(50).default(0),
		/** Inset from bottom edge as percentage of container height */
		insetBottom: z.number().min(0).max(50).default(0),
		/** Show visual guide for the safe text area (editor only) */
		showGuide: z.boolean().default(false)
	});

	export type TextBoundsConfig = z.infer<typeof TextBoundsConfigSchema>;

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
		/** Text bounds - constrain text to a safe zone within the container */
		bounds: TextBoundsConfigSchema.optional(),
		animation: AnimationConfigSchema.optional(),
		effect: EffectConfigSchema.optional(),
		blendMode: BlendMode.optional(),
		holographic: HolographicConfigSchema.optional()
	});

	export type TextFieldProps = z.infer<typeof TextFieldPropsSchema>;
</script>

<script lang="ts">
	import FitText from '../../utils/FitText.svelte';
	import { resolveTextContent } from '../../utils/data.js';
	import type { ContainerContext, CardData, UniversalModifiers } from '../../types';
	import ComponentWrapper from '../../styling/ComponentWrapper.svelte';

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
		bounds,
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

	// Calculate effective text area from bounds (percentage-based insets)
	const boundsInsets = $derived({
		left: (bounds?.insetLeft ?? 0) / 100 * container.width,
		right: (bounds?.insetRight ?? 0) / 100 * container.width,
		top: (bounds?.insetTop ?? 0) / 100 * container.height,
		bottom: (bounds?.insetBottom ?? 0) / 100 * container.height
	});

	// Effective dimensions for text fitting (container minus bounds insets)
	const effectiveWidth = $derived(container.width - boundsInsets.left - boundsInsets.right);
	const effectiveHeight = $derived(container.height - boundsInsets.top - boundsInsets.bottom);

	// Position offset for the text area
	const textAreaX = $derived(boundsInsets.left);
	const textAreaY = $derived(boundsInsets.top);

	// Check if bounds are active (any inset > 0)
	const hasBounds = $derived(
		(bounds?.insetLeft ?? 0) > 0 ||
		(bounds?.insetRight ?? 0) > 0 ||
		(bounds?.insetTop ?? 0) > 0 ||
		(bounds?.insetBottom ?? 0) > 0
	);

	// Collect modifiers for unified wrapper
	const modifiers: UniversalModifiers = $derived({ effect, animation, blendMode, holographic });

	// When holographic is enabled, use 'inherit' so gradient from HolographicWrapper applies
	const effectiveFill = $derived(holographic ? 'inherit' : color);
</script>

<ComponentWrapper {container} {modifiers}>
	<!-- Visual guide for safe text area (editor only) -->
	{#if bounds?.showGuide && hasBounds}
		<rect
			x={textAreaX}
			y={textAreaY}
			width={effectiveWidth}
			height={effectiveHeight}
			fill="none"
			stroke="#00aaff"
			stroke-width="1"
			stroke-dasharray="4 2"
			opacity="0.7"
		/>
		<!-- Corner markers for better visibility -->
		<g stroke="#00aaff" stroke-width="1.5" opacity="0.8">
			<!-- Top-left corner -->
			<line x1={textAreaX} y1={textAreaY} x2={textAreaX + 8} y2={textAreaY} />
			<line x1={textAreaX} y1={textAreaY} x2={textAreaX} y2={textAreaY + 8} />
			<!-- Top-right corner -->
			<line x1={textAreaX + effectiveWidth} y1={textAreaY} x2={textAreaX + effectiveWidth - 8} y2={textAreaY} />
			<line x1={textAreaX + effectiveWidth} y1={textAreaY} x2={textAreaX + effectiveWidth} y2={textAreaY + 8} />
			<!-- Bottom-left corner -->
			<line x1={textAreaX} y1={textAreaY + effectiveHeight} x2={textAreaX + 8} y2={textAreaY + effectiveHeight} />
			<line x1={textAreaX} y1={textAreaY + effectiveHeight} x2={textAreaX} y2={textAreaY + effectiveHeight - 8} />
			<!-- Bottom-right corner -->
			<line x1={textAreaX + effectiveWidth} y1={textAreaY + effectiveHeight} x2={textAreaX + effectiveWidth - 8} y2={textAreaY + effectiveHeight} />
			<line x1={textAreaX + effectiveWidth} y1={textAreaY + effectiveHeight} x2={textAreaX + effectiveWidth} y2={textAreaY + effectiveHeight - 8} />
		</g>
	{/if}

	<FitText
		text={resolvedText}
		x={textAreaX}
		y={textAreaY}
		width={effectiveWidth}
		height={effectiveHeight}
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
