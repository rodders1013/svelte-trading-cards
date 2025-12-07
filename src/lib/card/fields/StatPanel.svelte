<script lang="ts" module>
	import { z } from 'zod';
	import { AnimationConfigSchema } from '$lib/styling/animations/types.js';
	import { EffectConfigSchema } from '$lib/styling/effects/types.js';
	import { BlendMode } from '$lib/styling/blend/types.js';
	import { HolographicConfigSchema } from '$lib/styling/HolographicWrapper.svelte';

	// Predefined label options - no free text allowed
	export const StatLabelPresetSchema = z.enum([
		// Combat/Game stats
		'ATTACK', 'DEFENSE', 'HEALTH', 'HP', 'MP', 'MANA', 'POWER', 'SPEED', 'LUCK',
		'STRENGTH', 'AGILITY', 'INTELLIGENCE', 'STAMINA', 'ARMOR', 'DAMAGE',
		// Card stats
		'LEVEL', 'RANK', 'TIER', 'RARITY', 'EDITION', 'YEAR', 'SERIES',
		// General stats
		'SCORE', 'POINTS', 'VALUE', 'RATING', 'COUNT', 'TOTAL', 'MAX',
		// Categories
		'TYPE', 'CLASS', 'ELEMENT', 'FACTION', 'TEAM', 'ROLE',
		// Descriptive
		'STATUS', 'CONDITION', 'QUALITY', 'GRADE'
	]);
	export type StatLabelPreset = z.infer<typeof StatLabelPresetSchema>;

	export const StatRowSchema = z.object({
		// Label must be a preset - no free text
		labelPreset: StatLabelPresetSchema,
		// Value must come from data field - no free text
		dataField: z.string(),
		showBar: z.boolean().default(false),
		barColor: z.string().default('#3b82f6'),
		barMax: z.number().default(100),
		icon: z.string().optional()
	});

	export type StatRow = z.infer<typeof StatRowSchema>;

	export const StatPanelPropsSchema = z.object({
		rows: z.array(StatRowSchema).default([]),
		labelColor: z.string().default('#9ca3af'),
		valueColor: z.string().default('#ffffff'),
		divider: z.boolean().default(true),
		dividerColor: z.string().default('#374151'),
		compact: z.boolean().default(false),
		fontFamily: z.string().default('Arial, sans-serif'),
		labelFontSize: z.number().default(12),
		valueFontSize: z.number().default(14),
		barHeight: z.number().default(6),
		barBackgroundColor: z.string().default('#1f2937'),
		barBorderRadius: z.number().default(3),
		opacity: z.number().min(0).max(1).default(1),
		animation: AnimationConfigSchema.optional(),
		effect: EffectConfigSchema.optional(),
		blendMode: BlendMode.optional(),
		holographic: HolographicConfigSchema.optional()
	});

	export type StatPanelProps = z.infer<typeof StatPanelPropsSchema>;
</script>

<script lang="ts">
	import type { ContainerContext, CardData, UniversalModifiers } from '$lib/types';
	import ComponentWrapper from '$lib/styling/ComponentWrapper.svelte';
	import FitText from '$lib/utils/FitText.svelte';

	let {
		rows = [],
		labelColor = '#9ca3af',
		valueColor = '#ffffff',
		divider = true,
		dividerColor = '#374151',
		compact = false,
		fontFamily = 'Arial, sans-serif',
		labelFontSize = 12,
		valueFontSize = 14,
		barHeight = 6,
		barBackgroundColor = '#1f2937',
		barBorderRadius = 3,
		opacity = 1,
		animation,
		effect,
		blendMode,
		holographic,
		container,
		data
	}: StatPanelProps & {
		container: ContainerContext;
		data?: CardData;
	} = $props();

	const width = $derived(container.width);
	const height = $derived(container.height);

	// Collect modifiers for unified wrapper
	const modifiers: UniversalModifiers = $derived({ effect, animation, blendMode, holographic });

	// Calculate row layout
	const padding = $derived(compact ? 4 : 8);
	const rowCount = $derived(rows.length);
	const availableHeight = $derived(height - padding * 2);
	const rowHeight = $derived(rowCount > 0 ? availableHeight / rowCount : 0);

	// Calculate dimensions for label and value areas
	const labelWidth = $derived((width - padding * 2) * 0.45); // 45% for label
	const valueWidth = $derived((width - padding * 2) * 0.45); // 45% for value
	const textRowHeight = $derived.by(() => {
		// Height for text content, accounting for bar if present
		const maxBarSpace = rows.some(r => r.showBar) ? barHeight + 4 : 0;
		return Math.max(16, rowHeight - maxBarSpace);
	});

	// Resolve row values from data - values must come from data field
	const resolvedRows = $derived.by(() => {
		return rows.map(row => {
			// Value must come from data field (trusted source)
			const value = data && data[row.dataField] !== undefined
				? data[row.dataField] as string | number
				: '';
			return {
				label: row.labelPreset, // Use preset label
				value,
				showBar: row.showBar,
				barColor: row.barColor,
				barMax: row.barMax
			};
		});
	});

	// Calculate bar percentage
	function getBarPercentage(value: string | number, max: number): number {
		const numValue = typeof value === 'number' ? value : parseFloat(value) || 0;
		return Math.min(100, Math.max(0, (numValue / max) * 100));
	}

	// When holographic, use 'inherit' for fill colors
	const effectiveLabelFill = $derived(holographic ? 'inherit' : labelColor);
	const effectiveValueFill = $derived(holographic ? 'inherit' : valueColor);
</script>

{#snippet statPanelContent()}
	<g opacity={opacity}>
		{#each resolvedRows as row, index (index)}
			{@const y = padding + index * rowHeight}
			{@const showBarForRow = row.showBar && typeof row.value === 'number'}
			{@const barY = y + textRowHeight + 2}
			{@const textHeight = showBarForRow ? textRowHeight - 2 : textRowHeight}

			<!-- Divider line (except for first row) -->
			{#if divider && index > 0}
				<line
					x1={padding}
					y1={y}
					x2={width - padding}
					y2={y}
					stroke={dividerColor}
					stroke-width="1"
				/>
			{/if}

			<!-- Label - auto-fits to available space -->
			<FitText
				text={row.label}
				x={padding}
				y={y}
				width={labelWidth}
				height={textHeight}
				minSize={6}
				maxSize={labelFontSize}
				{fontFamily}
				fontWeight="normal"
				horizontalAlign="left"
				verticalAlign="center"
				fill={effectiveLabelFill}
				singleLine={true}
			/>

			<!-- Value - auto-fits to available space -->
			<FitText
				text={String(row.value)}
				x={width - padding - valueWidth}
				y={y}
				width={valueWidth}
				height={textHeight}
				minSize={6}
				maxSize={valueFontSize}
				{fontFamily}
				fontWeight="bold"
				horizontalAlign="right"
				verticalAlign="center"
				fill={effectiveValueFill}
				singleLine={true}
			/>

			<!-- Bar (if enabled and value is numeric) -->
			{#if showBarForRow}
				{@const barWidth = width - padding * 2}
				{@const percentage = getBarPercentage(row.value, row.barMax)}
				{@const filledWidth = (barWidth * percentage) / 100}

				<!-- Bar background -->
				<rect
					x={padding}
					y={barY}
					width={barWidth}
					height={barHeight}
					rx={barBorderRadius}
					fill={barBackgroundColor}
				/>

				<!-- Bar fill -->
				<rect
					x={padding}
					y={barY}
					width={filledWidth}
					height={barHeight}
					rx={barBorderRadius}
					fill={holographic ? 'inherit' : row.barColor}
				/>
			{/if}
		{/each}
	</g>
{/snippet}

<ComponentWrapper {container} {modifiers}>
	{@render statPanelContent()}
</ComponentWrapper>
