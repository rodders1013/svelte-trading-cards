<script lang="ts" module>
	import { z } from 'zod';
	import { AnimationConfigSchema } from '$lib/animations/types.js';
	import { EffectConfigSchema } from '$lib/effects/types.js';

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
		effect: EffectConfigSchema.optional()
	});

	export type RibbonProps = z.infer<typeof RibbonPropsSchema>;
</script>

<script lang="ts">
	import type { ContainerContext, CardData } from '$lib/types';
	import { AnimationWrapper } from '$lib/animations/index.js';
	import { EffectWrapper } from '$lib/effects/index.js';

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
		container,
		data
	}: RibbonProps & {
		container: ContainerContext;
		data?: CardData;
	} = $props();

	const width = $derived(container.width);
	const height = $derived(container.height);
	const cx = $derived(width / 2);
	const cy = $derived(height / 2);

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
</script>

<EffectWrapper {effect} transformOrigin="{cx}px {cy}px">
	<AnimationWrapper {animation} transformOrigin="{cx}px {cy}px">
		<g opacity={opacity} transform={transform}>
			<!-- Shadow/fold for folded style -->
			{#if shadowPath}
				<path d={shadowPath.left} fill={shadowColor} />
				<path d={shadowPath.right} fill={shadowColor} />
			{/if}

			<!-- Main ribbon -->
			<path d={ribbonPath} fill={color} />

			<!-- Text -->
			<text
				x={0}
				y={style === 'bookmark' ? -rHeight * 0.1 : 0}
				text-anchor="middle"
				dominant-baseline="central"
				font-family={fontFamily}
				font-weight={fontWeight}
				font-size={fontSize}
				fill={textColor}
				letter-spacing="0.05em"
			>
				{resolvedText.toUpperCase()}
			</text>
		</g>
	</AnimationWrapper>
</EffectWrapper>
