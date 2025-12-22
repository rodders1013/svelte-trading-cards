<script lang="ts" module>
	import { z } from 'zod';
	import { AnimationConfigSchema } from '../../styling/animations/types.js';
	import { EffectConfigSchema } from '../../styling/effects/types.js';
	import { BlendMode } from '../../styling/blend/types.js';
	import { HolographicConfigSchema } from '../../styling/HolographicWrapper.svelte';
	import { IconDataSchema } from '../icons/Icon.svelte';
	import { ICON_PRESETS } from '../../styling/shapes/bundledShapes.js';

	// Preset icon options
	export const RatingIconPresetSchema = z.enum([
		'star',
		'heart',
		'fire',
		'thumbs-up',
		'lightning',
		'trophy',
		'diamond',
		'circle',
		'pepper',
		'skull',
		'custom'
	]);
	export type RatingIconPreset = z.infer<typeof RatingIconPresetSchema>;

	// Value display format
	export const ValueFormatSchema = z.enum(['decimal', 'fraction', 'percent', 'none']);
	export type ValueFormat = z.infer<typeof ValueFormatSchema>;

	export const IconRatingPropsSchema = z.object({
		// Value source (one or the other)
		dataField: z.string().optional(),
		value: z.number().optional(),

		// Range
		max: z.number().default(5),
		min: z.number().default(0),

		// Normalization: scale source values to icon count
		// e.g., sourceMax=100 with max=5 turns 47 into 2.35 stars
		sourceMax: z.number().optional(),

		// Icon selection
		iconPreset: RatingIconPresetSchema.default('star'),
		customIcon: IconDataSchema.optional(),
		customIconName: z.string().optional(),

		// Colors
		filledColor: z.string().default('#fbbf24'),
		emptyColor: z.string().default('#374151'),
		useEmptyOpacity: z.boolean().default(false),
		emptyOpacity: z.number().min(0).max(1).default(0.3),

		// Layout
		size: z.number().default(24),
		gap: z.number().default(4),

		// Half values
		allowHalf: z.boolean().default(true),

		// Value display
		showValue: z.boolean().default(false),
		valuePosition: z.enum(['left', 'right']).default('right'),
		valueFormat: ValueFormatSchema.default('decimal'),
		valueFontSize: z.number().default(14),
		valueFontFamily: z.string().default('Arial, sans-serif'),
		valueColor: z.string().default('#ffffff'),
		valueGap: z.number().default(8),

		// General
		opacity: z.number().min(0).max(1).default(1),
		animation: AnimationConfigSchema.optional(),
		effect: EffectConfigSchema.optional(),
		blendMode: BlendMode.optional(),
		holographic: HolographicConfigSchema.optional()
	});

	export type IconRatingProps = z.infer<typeof IconRatingPropsSchema>;

	// Re-export ICON_PRESETS as RATING_ICON_PRESETS for backward compatibility
	export const RATING_ICON_PRESETS = ICON_PRESETS;

	// Get icon label for display
	export const RATING_ICON_LABELS: Record<RatingIconPreset, string> = {
		star: 'Star',
		heart: 'Heart',
		fire: 'Fire',
		'thumbs-up': 'Thumbs Up',
		lightning: 'Lightning',
		trophy: 'Trophy',
		diamond: 'Diamond',
		circle: 'Circle',
		pepper: 'Pepper',
		skull: 'Skull',
		custom: 'Custom...'
	};
</script>

<script lang="ts">
	import type { ContainerContext, CardData, UniversalModifiers } from '../../types';
	import ComponentWrapper from '../../styling/ComponentWrapper.svelte';
	import IconRenderer from '../../styling/IconRenderer.svelte';

	let {
		dataField,
		value = 0,
		max = 5,
		min = 0,
		sourceMax,
		iconPreset = 'star',
		customIcon,
		customIconName,
		filledColor = '#fbbf24',
		emptyColor = '#374151',
		useEmptyOpacity = false,
		emptyOpacity = 0.3,
		size = 24,
		gap = 4,
		allowHalf = true,
		showValue = false,
		valuePosition = 'right',
		valueFormat = 'decimal',
		valueFontSize = 14,
		valueFontFamily = 'Arial, sans-serif',
		valueColor = '#ffffff',
		valueGap = 8,
		opacity = 1,
		animation,
		effect,
		blendMode,
		holographic,
		container,
		data
	}: IconRatingProps & {
		container: ContainerContext;
		data?: CardData;
	} = $props();

	const uid = Math.random().toString(36).substring(2, 9);

	// Collect modifiers for unified wrapper (excluding holographic - handled per-icon by IconRenderer)
	const modifiers: UniversalModifiers = $derived({ effect, animation, blendMode });

	// Resolve value from data or static
	const resolvedValue = $derived.by(() => {
		if (dataField && data && data[dataField] !== undefined) {
			const v = data[dataField];
			return typeof v === 'number' ? v : parseFloat(String(v)) || 0;
		}
		return value ?? 0;
	});

	// Normalize value if sourceMax is set (e.g., 47/100 → 2.35/5)
	const normalizedValue = $derived.by(() => {
		if (sourceMax && sourceMax > 0) {
			return (resolvedValue / sourceMax) * max;
		}
		return resolvedValue;
	});

	// Clamp value to min/max range
	const clampedValue = $derived(Math.max(min, Math.min(max, normalizedValue)));

	// Calculate filled/half/empty counts
	const iconStates = $derived.by(() => {
		const filled = Math.floor(clampedValue);
		const fractional = clampedValue - filled;
		const hasHalf = allowHalf && fractional >= 0.25 && fractional < 0.75;
		const isAlmostFull = allowHalf && fractional >= 0.75;
		const actualFilled = isAlmostFull ? filled + 1 : filled;
		const actualHasHalf = hasHalf;
		const empty = max - actualFilled - (actualHasHalf ? 1 : 0);

		return {
			filled: actualFilled,
			hasHalf: actualHasHalf,
			empty: Math.max(0, empty)
		};
	});

	// Get icon data (from preset or custom)
	const iconData = $derived.by(() => {
		if (iconPreset === 'custom') {
			return customIcon;
		}
		return RATING_ICON_PRESETS[iconPreset];
	});

	// Format value for display
	function formatValue(val: number, format: ValueFormat, maxVal: number): string {
		switch (format) {
			case 'decimal':
				return val.toFixed(1);
			case 'fraction':
				return `${val}/${maxVal}`;
			case 'percent':
				return `${Math.round((val / maxVal) * 100)}%`;
			case 'none':
			default:
				return '';
		}
	}

	const formattedValue = $derived(formatValue(clampedValue, valueFormat, max));

	// Calculate layout dimensions
	const totalIconsWidth = $derived(max * size + (max - 1) * gap);

	// Calculate value text width (approximate)
	const valueTextWidth = $derived(showValue && formattedValue ? formattedValue.length * valueFontSize * 0.6 : 0);

	// Total width including value
	const totalWidth = $derived.by(() => {
		if (!showValue || !formattedValue) return totalIconsWidth;
		return totalIconsWidth + valueGap + valueTextWidth;
	});

	// Starting X position for icons (centers content in container)
	const startX = $derived.by(() => {
		const contentWidth = totalWidth;
		const baseX = (container.width - contentWidth) / 2;

		if (showValue && valuePosition === 'left') {
			return baseX + valueTextWidth + valueGap;
		}
		return baseX;
	});

	// Y position for vertical centering
	const startY = $derived((container.height - size) / 2);

	// Center point for animations
	const centerX = $derived(container.width / 2);
	const centerY = $derived(container.height / 2);

	// Empty icon color (with opacity handling)
	const emptyIconColor = $derived(useEmptyOpacity ? filledColor : emptyColor);
	const emptyIconOpacity = $derived(useEmptyOpacity ? emptyOpacity : 1);
</script>

{#snippet iconRatingContent()}
	<g opacity={opacity}>
		<!-- Value display (left) -->
		{#if showValue && valuePosition === 'left' && formattedValue}
			<text
				x={startX - valueGap - valueTextWidth / 2}
				y={centerY}
				text-anchor="middle"
				dominant-baseline="central"
				font-family={valueFontFamily}
				font-size={valueFontSize}
				font-weight="600"
				fill={valueColor}
			>
				{formattedValue}
			</text>
		{/if}

		<!-- Icons -->
		{#if iconData}
			{#each Array(max) as _, index}
				{@const x = startX + index * (size + gap)}
				{@const isFilled = index < iconStates.filled}
				{@const isHalf = !isFilled && index === iconStates.filled && iconStates.hasHalf}
				{@const clipId = `half-clip-${uid}-${index}`}

				<g transform="translate({x}, {startY})">
					{#if isFilled}
						<!-- Fully filled icon -->
						<IconRenderer
							body={iconData.body}
							width={iconData.width ?? 24}
							height={iconData.height ?? 24}
							containerWidth={size}
							containerHeight={size}
							fill={filledColor}
							{holographic}
						/>
					{:else if isHalf}
						<!-- Half-filled icon using clip-path -->
						<defs>
							<clipPath id={clipId} clipPathUnits="objectBoundingBox">
								<rect x="0" y="0" width="0.5" height="1" />
							</clipPath>
						</defs>

						<!-- Empty background (full icon) -->
						<IconRenderer
							body={iconData.body}
							width={iconData.width ?? 24}
							height={iconData.height ?? 24}
							containerWidth={size}
							containerHeight={size}
							fill={emptyIconColor}
							opacity={emptyIconOpacity}
						/>

						<!-- Filled half (clipped) - positioned on top -->
						<g clip-path="url(#{clipId})">
							<IconRenderer
								body={iconData.body}
								width={iconData.width ?? 24}
								height={iconData.height ?? 24}
								containerWidth={size}
								containerHeight={size}
								fill={filledColor}
								{holographic}
							/>
						</g>
					{:else}
						<!-- Empty icon -->
						<IconRenderer
							body={iconData.body}
							width={iconData.width ?? 24}
							height={iconData.height ?? 24}
							containerWidth={size}
							containerHeight={size}
							fill={emptyIconColor}
							opacity={emptyIconOpacity}
						/>
					{/if}
				</g>
			{/each}
		{:else}
			<!-- Placeholder when no icon selected -->
			<g opacity={0.3}>
				{#each Array(max) as _, index}
					{@const x = startX + index * (size + gap)}
					<rect
						x={x}
						y={startY}
						width={size}
						height={size}
						fill="none"
						stroke="#888"
						stroke-width="1"
						stroke-dasharray="2 2"
						rx="2"
					/>
				{/each}
			</g>
		{/if}

		<!-- Value display (right) -->
		{#if showValue && valuePosition === 'right' && formattedValue}
			<text
				x={startX + totalIconsWidth + valueGap}
				y={centerY}
				text-anchor="start"
				dominant-baseline="central"
				font-family={valueFontFamily}
				font-size={valueFontSize}
				font-weight="600"
				fill={valueColor}
			>
				{formattedValue}
			</text>
		{/if}
	</g>
{/snippet}

<ComponentWrapper {container} {modifiers}>
	{@render iconRatingContent()}
</ComponentWrapper>
