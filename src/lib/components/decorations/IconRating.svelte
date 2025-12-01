<script lang="ts" module>
	import { z } from 'zod';
	import { AnimationConfigSchema } from '$lib/animations/types.js';
	import { EffectConfigSchema } from '$lib/effects/types.js';
	import { IconDataSchema } from '$lib/components/icons/Icon.svelte';

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
		effect: EffectConfigSchema.optional()
	});

	export type IconRatingProps = z.infer<typeof IconRatingPropsSchema>;

	// Pre-loaded icon data for presets
	// Using simple SVG paths that work well at small sizes
	export const RATING_ICON_PRESETS: Record<
		Exclude<RatingIconPreset, 'custom'>,
		{ body: string; width: number; height: number }
	> = {
		star: {
			body: '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87l1.18 6.88L12 17.77l-6.18 3.25L7 14.14L2 9.27l6.91-1.01L12 2z" fill="currentColor"/>',
			width: 24,
			height: 24
		},
		heart: {
			body: '<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="currentColor"/>',
			width: 24,
			height: 24
		},
		fire: {
			body: '<path d="M17.66 11.2c-.23-.3-.51-.56-.77-.82c-.67-.6-1.43-1.03-2.07-1.66C13.33 7.26 13 4.85 13.95 3c-.95.23-1.78.75-2.49 1.32c-2.59 2.08-3.61 5.75-2.39 8.9c.04.1.08.2.08.33c0 .22-.15.42-.35.5c-.23.1-.47.04-.66-.12a.58.58 0 0 1-.14-.17c-1.13-1.43-1.31-3.48-.55-5.12C5.78 10 4.87 12.3 5 14.47c.06.5.12 1 .29 1.5c.14.6.41 1.2.71 1.73c1.08 1.73 2.95 2.97 4.96 3.22c2.14.27 4.43-.12 6.07-1.6c1.83-1.66 2.47-4.32 1.53-6.6l-.13-.26c-.21-.46-.77-1.26-.77-1.26zm-3.16 6.3c-.28.24-.74.5-1.1.6c-1.12.4-2.24-.16-2.9-.82c1.19-.28 1.9-1.16 2.11-2.05c.17-.8-.15-1.46-.28-2.23c-.12-.74-.1-1.37.17-2.06c.19.38.39.76.63 1.06c.77 1 1.98 1.44 2.24 2.8c.04.14.06.28.06.43c.03.82-.33 1.72-.93 2.27z" fill="currentColor"/>',
			width: 24,
			height: 24
		},
		'thumbs-up': {
			body: '<path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57l.03-.32c0-.41-.17-.79-.44-1.06L14.17 1L7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" fill="currentColor"/>',
			width: 24,
			height: 24
		},
		lightning: {
			body: '<path d="M11 21h-1l1-7H7.5c-.58 0-.57-.32-.38-.66c.19-.34.05-.08.07-.12C8.48 10.94 10.42 7.54 13 3h1l-1 7h3.5c.49 0 .56.33.47.51l-.07.15C12.96 17.55 11 21 11 21z" fill="currentColor"/>',
			width: 24,
			height: 24
		},
		trophy: {
			body: '<path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94A5.01 5.01 0 0 0 11 15.9V19H7v2h10v-2h-4v-3.1a5.01 5.01 0 0 0 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z" fill="currentColor"/>',
			width: 24,
			height: 24
		},
		diamond: {
			body: '<path d="M19 3H5L2 9l10 12L22 9l-3-6zM9.62 8l1.5-3h1.76l1.5 3H9.62zM11 14.77L6.64 9h2.6l1.76 4.34V14.77zm2 0v-1.43L14.76 9h2.6L13 14.77zM4.84 8L6.54 5h1.49l-1.5 3H4.84zm12.63 0l-1.5-3h1.49l1.7 3h-1.69z" fill="currentColor"/>',
			width: 24,
			height: 24
		},
		circle: {
			body: '<circle cx="12" cy="12" r="10" fill="currentColor"/>',
			width: 24,
			height: 24
		},
		pepper: {
			body: '<path d="M16.71 4.29a1 1 0 0 0-1.42 0l-1 1A6 6 0 0 0 12 5a5.78 5.78 0 0 0-3.4 1.1a9.57 9.57 0 0 0-3.26 5.24A14.43 14.43 0 0 0 5 16c0 1.5.31 2.54.82 3.18A2.18 2.18 0 0 0 7.5 20c1.51 0 2.72-1.17 4.5-3.26C13.72 18.83 14.99 20 16.5 20a2.18 2.18 0 0 0 1.68-.82c.51-.64.82-1.68.82-3.18a14.43 14.43 0 0 0-.34-4.66a9.57 9.57 0 0 0-3.26-5.24A1 1 0 0 0 14.29 5L16.71 7.42a1 1 0 0 0 0-1.42l-1-1.71zM12 7a3.5 3.5 0 0 1 2.08.69a7.58 7.58 0 0 1 2.57 4.19A12.15 12.15 0 0 1 17 16c0 1.07-.18 1.63-.38 1.88a.33.33 0 0 1-.12.12c-.62 0-1.62-.88-3.24-2.76a1 1 0 0 0-1.52 0C10.12 17.12 9.12 18 8.5 18a.33.33 0 0 1-.12-.12C8.18 17.63 8 17.07 8 16a12.15 12.15 0 0 1 .35-4.12a7.58 7.58 0 0 1 2.57-4.19A3.5 3.5 0 0 1 12 7z" fill="currentColor"/>',
			width: 24,
			height: 24
		},
		skull: {
			body: '<path d="M12 2C6.48 2 2 6.48 2 12v8c0 1.1.9 2 2 2h3v-2H4v-6h3v-1c0-2.76 2.24-5 5-5s5 2.24 5 5v1h3v6h-3v2h3c1.1 0 2-.9 2-2v-8c0-5.52-4.48-10-10-10zm-2 14c-.83 0-1.5-.67-1.5-1.5S9.17 13 10 13s1.5.67 1.5 1.5S10.83 16 10 16zm4 0c-.83 0-1.5-.67-1.5-1.5S13.17 13 14 13s1.5.67 1.5 1.5S14.83 16 14 16zm-3.5 2h3v2h-3v-2z" fill="currentColor"/>',
			width: 24,
			height: 24
		}
	};

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
	import type { ContainerContext, CardData } from '$lib/types';
	import { AnimationWrapper } from '$lib/animations/index.js';
	import { EffectWrapper } from '$lib/effects/index.js';
	import { sanitizeSvgBody } from '$lib/components/icons/Icon.svelte';

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
		container,
		data
	}: IconRatingProps & {
		container: ContainerContext;
		data?: CardData;
	} = $props();

	const uid = Math.random().toString(36).substring(2, 9);

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

	// Sanitize icon body
	const sanitizedBody = $derived(iconData?.body ? sanitizeSvgBody(iconData.body) : '');
</script>

<EffectWrapper {effect} transformOrigin="{centerX}px {centerY}px">
	<AnimationWrapper {animation} transformOrigin="{centerX}px {centerY}px">
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
					{@const isHalf =
						!isFilled && index === iconStates.filled && iconStates.hasHalf}
					{@const clipId = `half-clip-${uid}-${index}`}

					<g transform="translate({x}, {startY})">
						{#if isFilled}
							<!-- Fully filled icon -->
							<svg
								width={size}
								height={size}
								viewBox="0 0 {iconData.width ?? 24} {iconData.height ?? 24}"
								fill="none"
							>
								<g fill={filledColor} style="color: {filledColor}">
									{@html sanitizedBody}
								</g>
							</svg>
						{:else if isHalf}
							<!-- Half-filled icon using clip-path -->
							<defs>
								<!-- Use objectBoundingBox so coordinates are 0-1 relative -->
								<clipPath id={clipId} clipPathUnits="objectBoundingBox">
									<rect x="0" y="0" width="0.5" height="1" />
								</clipPath>
							</defs>

							<!-- Empty background (full icon) -->
							<svg
								width={size}
								height={size}
								viewBox="0 0 {iconData.width ?? 24} {iconData.height ?? 24}"
								fill="none"
							>
								<g
									fill={useEmptyOpacity ? filledColor : emptyColor}
									opacity={useEmptyOpacity ? emptyOpacity : 1}
									style="color: {useEmptyOpacity ? filledColor : emptyColor}"
								>
									{@html sanitizedBody}
								</g>
							</svg>

							<!-- Filled half (clipped) - positioned on top -->
							<svg
								width={size}
								height={size}
								viewBox="0 0 {iconData.width ?? 24} {iconData.height ?? 24}"
								fill="none"
								style="position: absolute; top: 0; left: 0;"
								clip-path="url(#{clipId})"
							>
								<g fill={filledColor} style="color: {filledColor}">
									{@html sanitizedBody}
								</g>
							</svg>
						{:else}
							<!-- Empty icon -->
							<svg
								width={size}
								height={size}
								viewBox="0 0 {iconData.width ?? 24} {iconData.height ?? 24}"
								fill="none"
							>
								<g
									fill={useEmptyOpacity ? filledColor : emptyColor}
									opacity={useEmptyOpacity ? emptyOpacity : 1}
									style="color: {useEmptyOpacity ? filledColor : emptyColor}"
								>
									{@html sanitizedBody}
								</g>
							</svg>
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
	</AnimationWrapper>
</EffectWrapper>
