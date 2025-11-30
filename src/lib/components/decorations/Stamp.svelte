<script lang="ts" module>
	import { z } from 'zod';
	import { AnimationConfigSchema } from '$lib/animations/types.js';
	import { EffectConfigSchema } from '$lib/effects/types.js';
	import { IconDataSchema } from '$lib/components/icons/Icon.svelte';

	export const StampStyleSchema = z.enum(['wax-seal', 'rubber', 'foil', 'embossed', 'badge']);
	export type StampStyle = z.infer<typeof StampStyleSchema>;

	// Predefined text options - no free text allowed
	export const StampTextPresetSchema = z.enum([
		// Edition numbers (formatted)
		'#001', '#010', '#050', '#100', '#500', '#1000',
		// Edition labels
		'1ST EDITION', 'LIMITED EDITION', 'SPECIAL EDITION', 'COLLECTOR EDITION',
		// Verification
		'AUTHENTIC', 'VERIFIED', 'OFFICIAL', 'CERTIFIED', 'APPROVED',
		// Quality
		'PREMIUM', 'ELITE', 'MASTER', 'ORIGINAL',
		// Years
		'2024', '2025', '2026',
		// Data field only (no preset text)
		'none'
	]);
	export type StampTextPreset = z.infer<typeof StampTextPresetSchema>;

	export const StampPropsSchema = z.object({
		// Text from preset or data field only - no free text
		textPreset: StampTextPresetSchema.default('none'),
		dataField: z.string().optional(),
		style: StampStyleSchema.default('wax-seal'),
		color: z.string().default('#dc2626'),
		textColor: z.string().default('#ffffff'),
		secondaryColor: z.string().optional(),
		icon: IconDataSchema.optional(),
		iconColor: z.string().optional(),
		rotation: z.number().default(-15),
		fontSize: z.number().default(10),
		fontFamily: z.string().default('Arial, sans-serif'),
		fontWeight: z.string().default('bold'),
		borderWidth: z.number().default(3),
		showRing: z.boolean().default(true),
		opacity: z.number().min(0).max(1).default(0.9),
		animation: AnimationConfigSchema.optional(),
		effect: EffectConfigSchema.optional()
	});

	export type StampProps = z.infer<typeof StampPropsSchema>;
</script>

<script lang="ts">
	import type { ContainerContext, CardData } from '$lib/types';
	import { AnimationWrapper } from '$lib/animations/index.js';
	import { EffectWrapper } from '$lib/effects/index.js';

	let {
		textPreset = 'none',
		dataField,
		style = 'wax-seal',
		color = '#dc2626',
		textColor = '#ffffff',
		secondaryColor,
		icon,
		iconColor,
		rotation = -15,
		fontSize = 10,
		fontFamily = 'Arial, sans-serif',
		fontWeight = 'bold',
		borderWidth = 3,
		showRing = true,
		opacity = 0.9,
		animation,
		effect,
		container,
		data
	}: StampProps & {
		container: ContainerContext;
		data?: CardData;
	} = $props();

	const uid = Math.random().toString(36).substring(2, 9);
	const textPathId = `stamp-text-path-${uid}`;

	const width = $derived(container.width);
	const height = $derived(container.height);
	const cx = $derived(width / 2);
	const cy = $derived(height / 2);
	const radius = $derived(Math.min(width, height) / 2 - 4);

	// Text from data field (trusted) or preset only - no free text
	const resolvedText = $derived.by(() => {
		// Data field takes priority (trusted source)
		if (dataField && data && data[dataField] !== undefined) {
			return String(data[dataField]);
		}
		// Otherwise use preset text
		return textPreset === 'none' ? '' : textPreset;
	});

	// Secondary color fallback (darker shade)
	const secColor = $derived(secondaryColor ?? color);

	// Wax seal drip points (irregular edge)
	const waxPoints = $derived.by(() => {
		if (style !== 'wax-seal') return [];
		const points: { x: number; y: number }[] = [];
		const numPoints = 24;
		for (let i = 0; i < numPoints; i++) {
			const angle = (2 * Math.PI * i) / numPoints;
			// Add some randomness based on angle (deterministic)
			const variance = Math.sin(angle * 5) * 0.08 + Math.cos(angle * 3) * 0.05;
			const r = radius * (1 + variance);
			points.push({
				x: cx + r * Math.cos(angle),
				y: cy + r * Math.sin(angle)
			});
		}
		return points;
	});

	// Generate wax seal path
	const waxPath = $derived.by(() => {
		if (waxPoints.length < 3) return '';
		let path = `M ${waxPoints[0].x},${waxPoints[0].y}`;
		for (let i = 1; i < waxPoints.length; i++) {
			const prev = waxPoints[i - 1];
			const curr = waxPoints[i];
			const cpX = (prev.x + curr.x) / 2;
			const cpY = (prev.y + curr.y) / 2;
			path += ` Q ${prev.x},${prev.y} ${cpX},${cpY}`;
		}
		path += ' Z';
		return path;
	});

	// Text path for circular text
	const textPathRadius = $derived(radius * 0.7);

	// Has icon check
	const hasIcon = $derived(icon?.body);
	const iconSize = $derived(radius * (resolvedText ? 0.5 : 0.8));
</script>

<defs>
	{#if showRing && resolvedText}
		<path
			id={textPathId}
			d="M {cx - textPathRadius},{cy} a {textPathRadius},{textPathRadius} 0 1,1 {textPathRadius * 2},0 a {textPathRadius},{textPathRadius} 0 1,1 {-textPathRadius * 2},0"
			fill="none"
		/>
	{/if}
</defs>

<EffectWrapper {effect} transformOrigin="{cx}px {cy}px">
	<AnimationWrapper {animation} transformOrigin="{cx}px {cy}px">
		<g opacity={opacity} transform="rotate({rotation} {cx} {cy})">
			{#if style === 'wax-seal'}
				<!-- Wax seal with irregular edges -->
				<path d={waxPath} fill={color} />
				<!-- Inner ring -->
				{#if showRing}
					<circle cx={cx} cy={cy} r={radius * 0.75} fill="none" stroke={secColor} stroke-width={borderWidth} />
				{/if}
			{:else if style === 'rubber'}
				<!-- Rubber stamp - double circle border -->
				<circle cx={cx} cy={cy} r={radius} fill="none" stroke={color} stroke-width={borderWidth * 2} />
				<circle cx={cx} cy={cy} r={radius - borderWidth * 2} fill="none" stroke={color} stroke-width={1} />
				{#if showRing}
					<circle cx={cx} cy={cy} r={radius * 0.6} fill="none" stroke={color} stroke-width={1} />
				{/if}
			{:else if style === 'foil'}
				<!-- Foil stamp - solid with shine effect -->
				<circle cx={cx} cy={cy} r={radius} fill={color} />
				<circle cx={cx} cy={cy} r={radius * 0.85} fill="none" stroke={secColor} stroke-width={2} />
				<!-- Shine effect -->
				<ellipse
					cx={cx - radius * 0.2}
					cy={cy - radius * 0.2}
					rx={radius * 0.4}
					ry={radius * 0.2}
					fill="white"
					opacity="0.3"
					transform="rotate(-30 {cx} {cy})"
				/>
			{:else if style === 'embossed'}
				<!-- Embossed - raised effect with shadows -->
				<circle cx={cx + 2} cy={cy + 2} r={radius} fill="rgba(0,0,0,0.3)" />
				<circle cx={cx} cy={cy} r={radius} fill={color} />
				<circle cx={cx} cy={cy} r={radius * 0.8} fill="none" stroke={secColor} stroke-width={borderWidth} />
			{:else if style === 'badge'}
				<!-- Badge style - starburst -->
				{@const numPoints = 16}
				{@const outerR = radius}
				{@const innerR = radius * 0.85}
				{@const points = Array.from({ length: numPoints * 2 }, (_, i) => {
					const angle = (Math.PI * i) / numPoints - Math.PI / 2;
					const r = i % 2 === 0 ? outerR : innerR;
					return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
				}).join(' ')}
				<polygon points={points} fill={color} />
				{#if showRing}
					<circle cx={cx} cy={cy} r={innerR * 0.85} fill="none" stroke={secColor} stroke-width={borderWidth} />
				{/if}
			{/if}

			<!-- Icon in center -->
			{#if hasIcon && icon}
				<svg
					x={cx - iconSize / 2}
					y={cy - iconSize / 2 - (resolvedText ? fontSize * 0.5 : 0)}
					width={iconSize}
					height={iconSize}
					viewBox="0 0 {icon.width ?? 24} {icon.height ?? 24}"
					fill="none"
				>
					<g fill={iconColor ?? textColor} style="color: {iconColor ?? textColor}">
						{@html icon.body}
					</g>
				</svg>
			{/if}

			<!-- Text -->
			{#if resolvedText}
				{@const isRubber = style === 'rubber'}
				{#if showRing && !isRubber}
					<!-- Circular text around the edge -->
					<text
						font-family={fontFamily}
						font-weight={fontWeight}
						font-size={fontSize}
						fill={textColor}
					>
						<textPath href="#{textPathId}" startOffset="50%" text-anchor="middle">
							{resolvedText.toUpperCase()}
						</textPath>
					</text>
				{:else}
					<!-- Center text -->
					<text
						x={cx}
						y={cy + (hasIcon ? iconSize / 2 + fontSize * 0.5 : 0)}
						text-anchor="middle"
						dominant-baseline="central"
						font-family={fontFamily}
						font-weight={fontWeight}
						font-size={fontSize}
						fill={isRubber ? color : textColor}
						letter-spacing="0.1em"
					>
						{resolvedText.toUpperCase()}
					</text>
				{/if}
			{/if}
		</g>
	</AnimationWrapper>
</EffectWrapper>
