<script lang="ts" module>
	import { z } from 'zod';
	import { AnimationConfigSchema } from '$lib/animations/types.js';
	import { EffectConfigSchema } from '$lib/effects/types.js';

	export const ProgressBarStyleSchema = z.enum(['rounded', 'square', 'pointed']);
	export type ProgressBarStyle = z.infer<typeof ProgressBarStyleSchema>;

	export const LabelPositionSchema = z.enum(['left', 'center', 'right', 'inside', 'none']);
	export type LabelPosition = z.infer<typeof LabelPositionSchema>;

	export const ProgressBarPropsSchema = z.object({
		value: z.number().default(0),
		max: z.number().default(100),
		dataField: z.string().optional(),
		color: z.string().default('#22c55e'),
		backgroundColor: z.string().default('#374151'),
		borderColor: z.string().optional(),
		borderWidth: z.number().default(0),
		showLabel: z.boolean().default(true),
		labelPosition: LabelPositionSchema.default('right'),
		labelColor: z.string().default('#ffffff'),
		labelFontSize: z.number().default(12),
		labelFontFamily: z.string().default('Arial, sans-serif'),
		labelFormat: z.enum(['value', 'percent', 'fraction']).default('value'),
		style: ProgressBarStyleSchema.default('rounded'),
		segments: z.number().default(0),
		segmentGap: z.number().default(2),
		glowEnabled: z.boolean().default(false),
		glowColor: z.string().optional(),
		glowIntensity: z.number().default(0.5),
		opacity: z.number().min(0).max(1).default(1),
		animation: AnimationConfigSchema.optional(),
		effect: EffectConfigSchema.optional()
	});

	export type ProgressBarProps = z.infer<typeof ProgressBarPropsSchema>;
</script>

<script lang="ts">
	import type { ContainerContext, CardData } from '$lib/types';
	import { AnimationWrapper } from '$lib/animations/index.js';
	import { EffectWrapper } from '$lib/effects/index.js';

	let {
		value = 0,
		max = 100,
		dataField,
		color = '#22c55e',
		backgroundColor = '#374151',
		borderColor,
		borderWidth = 0,
		showLabel = true,
		labelPosition = 'right',
		labelColor = '#ffffff',
		labelFontSize = 12,
		labelFontFamily = 'Arial, sans-serif',
		labelFormat = 'value',
		style = 'rounded',
		segments = 0,
		segmentGap = 2,
		glowEnabled = false,
		glowColor,
		glowIntensity = 0.5,
		opacity = 1,
		animation,
		effect,
		container,
		data
	}: ProgressBarProps & {
		container: ContainerContext;
		data?: CardData;
	} = $props();

	const uid = Math.random().toString(36).substring(2, 9);
	const glowFilterId = `progress-glow-${uid}`;

	const width = $derived(container.width);
	const height = $derived(container.height);
	const cx = $derived(width / 2);
	const cy = $derived(height / 2);

	// Resolve value from dataField
	const resolvedValue = $derived.by(() => {
		if (dataField && data && data[dataField] !== undefined) {
			const v = data[dataField];
			return typeof v === 'number' ? v : parseFloat(String(v)) || 0;
		}
		return value;
	});

	// Calculate percentage
	const percentage = $derived(Math.min(100, Math.max(0, (resolvedValue / max) * 100)));

	// Label text based on format
	const labelText = $derived.by(() => {
		switch (labelFormat) {
			case 'percent':
				return `${Math.round(percentage)}%`;
			case 'fraction':
				return `${resolvedValue}/${max}`;
			default:
				return String(resolvedValue);
		}
	});

	// Bar dimensions (account for label space)
	const labelSpace = $derived(showLabel && (labelPosition === 'left' || labelPosition === 'right') ? 40 : 0);
	const barX = $derived(labelPosition === 'left' ? labelSpace : borderWidth / 2);
	const barWidth = $derived(width - labelSpace - borderWidth);
	const barHeight = $derived(height - borderWidth);
	const barY = $derived(borderWidth / 2);

	// Border radius based on style
	const borderRadius = $derived.by(() => {
		switch (style) {
			case 'rounded':
				return barHeight / 2;
			case 'square':
				return 2;
			case 'pointed':
				return 0;
			default:
				return barHeight / 2;
		}
	});

	// Filled width
	const filledWidth = $derived((barWidth * percentage) / 100);

	// Segment rendering
	const segmentCount = $derived(segments > 0 ? segments : 0);
	const segmentWidth = $derived(segmentCount > 0 ? (barWidth - (segmentCount - 1) * segmentGap) / segmentCount : 0);
	const filledSegments = $derived(segmentCount > 0 ? Math.ceil((percentage / 100) * segmentCount) : 0);
</script>

<defs>
	{#if glowEnabled}
		<filter id={glowFilterId} x="-50%" y="-50%" width="200%" height="200%">
			<feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
			<feComposite in="blur" in2="SourceGraphic" operator="over" />
		</filter>
	{/if}
</defs>

<EffectWrapper {effect} transformOrigin="{cx}px {cy}px">
	<AnimationWrapper {animation} transformOrigin="{cx}px {cy}px">
		<g opacity={opacity}>
			<!-- Background bar -->
			{#if segments === 0}
				<rect
					x={barX}
					y={barY}
					width={barWidth}
					height={barHeight}
					rx={borderRadius}
					fill={backgroundColor}
					stroke={borderColor}
					stroke-width={borderWidth}
				/>
			{:else}
				<!-- Segmented background -->
				{#each Array(segmentCount) as _, i (i)}
					<rect
						x={barX + i * (segmentWidth + segmentGap)}
						y={barY}
						width={segmentWidth}
						height={barHeight}
						rx={style === 'rounded' ? 2 : 0}
						fill={backgroundColor}
					/>
				{/each}
			{/if}

			<!-- Filled bar / Glow layer -->
			{#if glowEnabled && filledWidth > 0}
				<rect
					x={barX}
					y={barY}
					width={filledWidth}
					height={barHeight}
					rx={borderRadius}
					fill={glowColor ?? color}
					opacity={glowIntensity}
					filter="url(#{glowFilterId})"
				/>
			{/if}

			<!-- Filled bar -->
			{#if segments === 0}
				{#if filledWidth > 0}
					<rect
						x={barX}
						y={barY}
						width={filledWidth}
						height={barHeight}
						rx={borderRadius}
						fill={color}
					/>
				{/if}
			{:else}
				<!-- Segmented fill -->
				{#each Array(filledSegments) as _, i (i)}
					{@const isLastFilled = i === filledSegments - 1}
					{@const segmentFillWidth = isLastFilled
						? segmentWidth * ((percentage % (100 / segmentCount)) / (100 / segmentCount) || 1)
						: segmentWidth}
					<rect
						x={barX + i * (segmentWidth + segmentGap)}
						y={barY}
						width={segmentFillWidth}
						height={barHeight}
						rx={style === 'rounded' ? 2 : 0}
						fill={color}
					/>
				{/each}
			{/if}

			<!-- Label -->
			{#if showLabel && labelPosition !== 'none'}
				<text
					x={labelPosition === 'left' ? 0 :
					   labelPosition === 'right' ? width :
					   labelPosition === 'center' ? cx :
					   barX + filledWidth / 2}
					y={cy}
					text-anchor={labelPosition === 'left' ? 'start' :
					            labelPosition === 'right' ? 'end' :
					            'middle'}
					dominant-baseline="central"
					font-family={labelFontFamily}
					font-size={labelFontSize}
					font-weight="600"
					fill={labelPosition === 'inside' && percentage > 10 ? '#ffffff' : labelColor}
				>
					{labelText}
				</text>
			{/if}
		</g>
	</AnimationWrapper>
</EffectWrapper>
