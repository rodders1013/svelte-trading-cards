<script lang="ts" module>
	import { z } from 'zod';
	import { AnimationConfigSchema } from '$lib/animations/types.js';
	import { EffectConfigSchema } from '$lib/effects/types.js';

	export const DividerStyleSchema = z.enum(['solid', 'dashed', 'dotted', 'gradient', 'double']);
	export type DividerStyle = z.infer<typeof DividerStyleSchema>;

	export const DividerFadeSchema = z.enum(['none', 'left', 'right', 'both']);
	export type DividerFade = z.infer<typeof DividerFadeSchema>;

	export const DividerOrnamentSchema = z.enum(['none', 'diamond', 'star', 'circle', 'square']);
	export type DividerOrnament = z.infer<typeof DividerOrnamentSchema>;

	export const DividerPropsSchema = z.object({
		style: DividerStyleSchema.default('solid'),
		color: z.string().default('#ffffff'),
		secondaryColor: z.string().optional(),
		thickness: z.number().default(2),
		fade: DividerFadeSchema.default('none'),
		ornament: DividerOrnamentSchema.default('none'),
		ornamentSize: z.number().default(12),
		ornamentColor: z.string().optional(),
		dashLength: z.number().default(8),
		gapLength: z.number().default(4),
		opacity: z.number().min(0).max(1).default(1),
		animation: AnimationConfigSchema.optional(),
		effect: EffectConfigSchema.optional()
	});

	export type DividerProps = z.infer<typeof DividerPropsSchema>;
</script>

<script lang="ts">
	import type { ContainerContext, CardData } from '$lib/types';
	import { AnimationWrapper } from '$lib/animations/index.js';
	import { EffectWrapper } from '$lib/effects/index.js';

	let {
		style = 'solid',
		color = '#ffffff',
		secondaryColor,
		thickness = 2,
		fade = 'none',
		ornament = 'none',
		ornamentSize = 12,
		ornamentColor,
		dashLength = 8,
		gapLength = 4,
		opacity = 1,
		animation,
		effect,
		container,
		data
	}: DividerProps & {
		container: ContainerContext;
		data?: CardData;
	} = $props();

	const uid = Math.random().toString(36).substring(2, 9);
	const gradientId = `divider-gradient-${uid}`;
	const fadeGradientId = `divider-fade-${uid}`;

	const width = $derived(container.width);
	const height = $derived(container.height);
	const cx = $derived(width / 2);
	const cy = $derived(height / 2);

	// Ornament takes space in the middle
	const ornamentSpace = $derived(ornament !== 'none' ? ornamentSize + 8 : 0);
	const leftLineEnd = $derived(cx - ornamentSpace / 2);
	const rightLineStart = $derived(cx + ornamentSpace / 2);

	// Dash array based on style
	const strokeDasharray = $derived.by(() => {
		switch (style) {
			case 'dashed':
				return `${dashLength} ${gapLength}`;
			case 'dotted':
				return `${thickness} ${thickness * 2}`;
			default:
				return 'none';
		}
	});

	// Get ornament fill color
	const ornFill = $derived(ornamentColor ?? color);
</script>

<defs>
	<!-- Gradient for gradient style -->
	{#if style === 'gradient'}
		<linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
			<stop offset="0%" stop-color={color} />
			<stop offset="50%" stop-color={secondaryColor ?? color} />
			<stop offset="100%" stop-color={color} />
		</linearGradient>
	{/if}

	<!-- Fade gradient masks -->
	{#if fade !== 'none'}
		<linearGradient id={fadeGradientId} x1="0%" y1="0%" x2="100%" y2="0%">
			{#if fade === 'left' || fade === 'both'}
				<stop offset="0%" stop-color="white" stop-opacity="0" />
				<stop offset="20%" stop-color="white" stop-opacity="1" />
			{:else}
				<stop offset="0%" stop-color="white" stop-opacity="1" />
			{/if}
			{#if fade === 'right' || fade === 'both'}
				<stop offset="80%" stop-color="white" stop-opacity="1" />
				<stop offset="100%" stop-color="white" stop-opacity="0" />
			{:else}
				<stop offset="100%" stop-color="white" stop-opacity="1" />
			{/if}
		</linearGradient>
		<mask id="fade-mask-{uid}">
			<rect x="0" y="0" width={width} height={height} fill="url(#{fadeGradientId})" />
		</mask>
	{/if}
</defs>

<EffectWrapper {effect} transformOrigin="{cx}px {cy}px">
	<AnimationWrapper {animation} transformOrigin="{cx}px {cy}px">
		<g opacity={opacity} mask={fade !== 'none' ? `url(#fade-mask-${uid})` : undefined}>
			<!-- Left line (or full line if no ornament) -->
			{#if ornament === 'none'}
				<!-- Single full line -->
				{#if style === 'double'}
					<line
						x1={0}
						y1={cy - thickness}
						x2={width}
						y2={cy - thickness}
						stroke={color}
						stroke-width={thickness}
					/>
					<line
						x1={0}
						y1={cy + thickness}
						x2={width}
						y2={cy + thickness}
						stroke={color}
						stroke-width={thickness}
					/>
				{:else}
					<line
						x1={0}
						y1={cy}
						x2={width}
						y2={cy}
						stroke={style === 'gradient' ? `url(#${gradientId})` : color}
						stroke-width={thickness}
						stroke-dasharray={strokeDasharray}
						stroke-linecap="round"
					/>
				{/if}
			{:else}
				<!-- Left segment -->
				<line
					x1={0}
					y1={cy}
					x2={leftLineEnd}
					y2={cy}
					stroke={style === 'gradient' ? `url(#${gradientId})` : color}
					stroke-width={thickness}
					stroke-dasharray={strokeDasharray}
					stroke-linecap="round"
				/>

				<!-- Right segment -->
				<line
					x1={rightLineStart}
					y1={cy}
					x2={width}
					y2={cy}
					stroke={style === 'gradient' ? `url(#${gradientId})` : color}
					stroke-width={thickness}
					stroke-dasharray={strokeDasharray}
					stroke-linecap="round"
				/>

				<!-- Ornament -->
				{#if ornament === 'diamond'}
					<polygon
						points="{cx},{cy - ornamentSize / 2} {cx + ornamentSize / 2},{cy} {cx},{cy + ornamentSize / 2} {cx - ornamentSize / 2},{cy}"
						fill={ornFill}
					/>
				{:else if ornament === 'circle'}
					<circle cx={cx} cy={cy} r={ornamentSize / 2} fill={ornFill} />
				{:else if ornament === 'star'}
					{@const outerR = ornamentSize / 2}
					{@const innerR = outerR * 0.4}
					{@const points = Array.from({ length: 10 }, (_, i) => {
						const angle = (Math.PI / 5) * i - Math.PI / 2;
						const r = i % 2 === 0 ? outerR : innerR;
						return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
					}).join(' ')}
					<polygon points={points} fill={ornFill} />
				{:else if ornament === 'square'}
					<rect
						x={cx - ornamentSize / 2}
						y={cy - ornamentSize / 2}
						width={ornamentSize}
						height={ornamentSize}
						fill={ornFill}
						transform="rotate(45 {cx} {cy})"
					/>
				{/if}
			{/if}
		</g>
	</AnimationWrapper>
</EffectWrapper>
