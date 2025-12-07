<script lang="ts" module>
	import { z } from 'zod';
	import { AnimationConfigSchema } from '$lib/styling/animations/types.js';
	import { EffectConfigSchema } from '$lib/styling/effects/types.js';
	import { BlendMode } from '$lib/styling/blend/types.js';
	import { HolographicConfigSchema } from '$lib/styling/HolographicWrapper.svelte';

	export const RibbonPositionSchema = z.enum(['top-left', 'top-right', 'bottom-left', 'bottom-right', 'top', 'bottom']);
	export type RibbonPosition = z.infer<typeof RibbonPositionSchema>;

	export const RibbonStyleSchema = z.enum(['flat', 'folded', 'banner', 'bookmark']);
	export type RibbonStyle = z.infer<typeof RibbonStyleSchema>;

	// Predefined text options - no free text allowed
	export const RibbonTextPresetSchema = z.enum([
		// Status/Availability
		'NEW', 'HOT', 'SOLD', 'SOLD OUT', 'LIMITED', 'EXCLUSIVE',
		// Editions
		'1ST EDITION', 'SPECIAL', 'COLLECTOR', 'PREMIUM',
		// Promotions
		'PROMO', 'BONUS', 'FREE', 'SALE',
		// Quality/Rarity
		'RARE', 'ULTRA RARE', 'LEGENDARY', 'MYTHIC',
		// Verification
		'VERIFIED', 'AUTHENTIC', 'OFFICIAL',
		// Data field only
		'none'
	]);
	export type RibbonTextPreset = z.infer<typeof RibbonTextPresetSchema>;

	export const RibbonPropsSchema = z.object({
		// Text from preset or data field only - no free text
		textPreset: RibbonTextPresetSchema.default('none'),
		dataField: z.string().optional(),
		position: RibbonPositionSchema.default('top-right'),
		style: RibbonStyleSchema.default('folded'),
		color: z.string().default('#ef4444'),
		textColor: z.string().default('#ffffff'),
		shadowColor: z.string().default('#b91c1c'),
		fontSize: z.number().default(12),
		fontFamily: z.string().default('Arial, sans-serif'),
		fontWeight: z.string().default('bold'),
		angle: z.number().default(45),
		ribbonWidth: z.number().optional(),
		opacity: z.number().min(0).max(1).default(1),
		animation: AnimationConfigSchema.optional(),
		effect: EffectConfigSchema.optional(),
		blendMode: BlendMode.optional(),
		holographic: HolographicConfigSchema.optional()
	});

	export type RibbonProps = z.infer<typeof RibbonPropsSchema>;
</script>

<script lang="ts">
	import type { ContainerContext, CardData, UniversalModifiers } from '$lib/types';
	import ComponentWrapper from '$lib/styling/ComponentWrapper.svelte';
	import FitText from '$lib/utils/FitText.svelte';

	let {
		textPreset = 'none',
		dataField,
		position = 'top-right',
		style = 'folded',
		color = '#ef4444',
		textColor = '#ffffff',
		shadowColor = '#b91c1c',
		fontSize = 12,
		fontFamily = 'Arial, sans-serif',
		fontWeight = 'bold',
		angle = 45,
		ribbonWidth,
		opacity = 1,
		animation,
		effect,
		blendMode,
		holographic,
		container,
		data
	}: RibbonProps & {
		container: ContainerContext;
		data?: CardData;
	} = $props();

	const width = $derived(container.width);
	const height = $derived(container.height);
	const cx = $derived(width / 2);

	// Collect modifiers for unified wrapper
	const modifiers: UniversalModifiers = $derived({ effect, animation, blendMode, holographic });

	// Text from data field (trusted) or preset only - no free text
	const resolvedText = $derived.by(() => {
		// Data field takes priority (trusted source)
		if (dataField && data && data[dataField] !== undefined) {
			return String(data[dataField]);
		}
		// Otherwise use preset text
		return textPreset === 'none' ? 'RIBBON' : textPreset;
	});

	// Calculate ribbon dimensions
	const rWidth = $derived(ribbonWidth ?? Math.min(width, height) * 0.8);
	const rHeight = $derived(fontSize * 2);

	// Calculate the fold size (used by folded and banner styles)
	const foldSize = $derived(rHeight * 0.3);

	// Check if this is a corner ribbon (rotated at angle)
	const isCorner = $derived(position.includes('-'));

	// Text area dimensions - must account for ribbon shape AND visibility
	// For corner ribbons at 45°, the ribbon extends outside the container
	// We need to calculate the VISIBLE text area, not the full ribbon width
	const textPadding = $derived(fontSize * 0.4);
	const textAreaWidth = $derived.by(() => {
		if (isCorner) {
			// For corner ribbons, calculate the visible portion
			// The ribbon center is positioned at rWidth * 0.3 from the corner
			// At 45°, the visible diagonal is roughly: (rWidth * 0.3) * sqrt(2) * 2
			// Use about 60% of the ribbon width for visible text area
			const visiblePortion = rWidth * 0.6;
			return visiblePortion - textPadding * 2;
		}
		// For horizontal ribbons (top/bottom), use full width
		return rWidth - textPadding * 2;
	});
	const textAreaHeight = $derived(rHeight - textPadding);

	// Position-based transforms
	const transform = $derived.by(() => {
		const isCorner = position.includes('-');

		if (!isCorner) {
			// Horizontal banners (top/bottom)
			if (position === 'top') {
				return `translate(${cx}, ${rHeight / 2})`;
			} else {
				return `translate(${cx}, ${height - rHeight / 2})`;
			}
		}

		// Corner ribbons
		const effectiveAngle = position.includes('left') ? -angle : angle;
		let translateX: number;
		let translateY: number;

		if (position === 'top-right') {
			translateX = width - rWidth * 0.3;
			translateY = rWidth * 0.3;
		} else if (position === 'top-left') {
			translateX = rWidth * 0.3;
			translateY = rWidth * 0.3;
		} else if (position === 'bottom-right') {
			translateX = width - rWidth * 0.3;
			translateY = height - rWidth * 0.3;
		} else {
			translateX = rWidth * 0.3;
			translateY = height - rWidth * 0.3;
		}

		return `translate(${translateX}, ${translateY}) rotate(${effectiveAngle})`;
	});

	// Generate ribbon path based on style
	const ribbonPath = $derived.by(() => {
		const halfW = rWidth / 2;
		const halfH = rHeight / 2;
		const foldSize = rHeight * 0.3;

		switch (style) {
			case 'folded':
				// Ribbon with folded ends
				return `M ${-halfW - foldSize},${0}
					L ${-halfW},${-halfH}
					L ${halfW},${-halfH}
					L ${halfW + foldSize},${0}
					L ${halfW},${halfH}
					L ${-halfW},${halfH}
					Z`;
			case 'banner':
				// Banner with pointed ends
				return `M ${-halfW},${-halfH}
					L ${halfW},${-halfH}
					L ${halfW + foldSize},${0}
					L ${halfW},${halfH}
					L ${-halfW},${halfH}
					L ${-halfW - foldSize},${0}
					Z`;
			case 'bookmark':
				// Bookmark style with notch at bottom
				return `M ${-halfW},${-halfH}
					L ${halfW},${-halfH}
					L ${halfW},${halfH}
					L ${0},${halfH - foldSize}
					L ${-halfW},${halfH}
					Z`;
			case 'flat':
			default:
				// Simple rectangle
				return `M ${-halfW},${-halfH}
					L ${halfW},${-halfH}
					L ${halfW},${halfH}
					L ${-halfW},${halfH}
					Z`;
		}
	});

	// Shadow path for folded style (the fold behind)
	const shadowPath = $derived.by(() => {
		if (style !== 'folded') return null;
		const halfW = rWidth / 2;
		const halfH = rHeight / 2;
		const foldSize = rHeight * 0.3;
		const shadowDepth = foldSize * 0.7;

		// Left shadow
		const leftShadow = `M ${-halfW},${-halfH}
			L ${-halfW - foldSize},${0}
			L ${-halfW},${halfH}
			L ${-halfW - shadowDepth},${halfH + shadowDepth}
			L ${-halfW - foldSize - shadowDepth},${shadowDepth}
			L ${-halfW - shadowDepth},${-halfH + shadowDepth}
			Z`;

		// Right shadow
		const rightShadow = `M ${halfW},${-halfH}
			L ${halfW + foldSize},${0}
			L ${halfW},${halfH}
			L ${halfW + shadowDepth},${halfH + shadowDepth}
			L ${halfW + foldSize + shadowDepth},${shadowDepth}
			L ${halfW + shadowDepth},${-halfH + shadowDepth}
			Z`;

		return { left: leftShadow, right: rightShadow };
	});

	// When holographic, use 'inherit' for ribbon color
	const effectiveRibbonFill = $derived(holographic ? 'inherit' : color);
</script>

<ComponentWrapper {container} {modifiers}>
	<g opacity={opacity} transform={transform}>
		<!-- Shadow/fold for folded style -->
		{#if shadowPath}
			<path d={shadowPath.left} fill={shadowColor} />
			<path d={shadowPath.right} fill={shadowColor} />
		{/if}

		<!-- Main ribbon -->
		<path d={ribbonPath} fill={effectiveRibbonFill} />

		<!-- Text - auto-fits to available space -->
		<FitText
			text={resolvedText.toUpperCase()}
			x={-textAreaWidth / 2}
			y={style === 'bookmark' ? -rHeight * 0.5 - textAreaHeight * 0.1 : -textAreaHeight / 2}
			width={textAreaWidth}
			height={textAreaHeight}
			minSize={6}
			maxSize={fontSize}
			{fontFamily}
			{fontWeight}
			horizontalAlign="center"
			verticalAlign="center"
			fill={textColor}
			singleLine={true}
		/>
	</g>
</ComponentWrapper>
