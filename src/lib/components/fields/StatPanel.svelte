<script lang="ts" module>
	import { z } from 'zod';
	import { AnimationConfigSchema } from '$lib/animations/types.js';
	import { EffectConfigSchema } from '$lib/effects/types.js';

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
		effect: EffectConfigSchema.optional()
	});

	export type StatPanelProps = z.infer<typeof StatPanelPropsSchema>;
</script>

<script lang="ts">
	import type { ContainerContext, CardData } from '$lib/types';
	import { AnimationWrapper } from '$lib/animations/index.js';
	import { EffectWrapper } from '$lib/effects/index.js';

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
		container,
		data
	}: StatPanelProps & {
		container: ContainerContext;
		data?: CardData;
	} = $props();

	const width = $derived(container.width);
	const height = $derived(container.height);
	const cx = $derived(width / 2);
	const cy = $derived(height / 2);

	// Calculate row layout
	const padding = $derived(compact ? 4 : 8);
	const rowCount = $derived(rows.length);
	const availableHeight = $derived(height - padding * 2);
	const rowHeight = $derived(rowCount > 0 ? availableHeight / rowCount : 0);

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
</script>

<EffectWrapper {effect} transformOrigin="{cx}px {cy}px">
	<AnimationWrapper {animation} transformOrigin="{cx}px {cy}px">
		<g opacity={opacity}>
			{#each resolvedRows as row, index (index)}
				{@const y = padding + index * rowHeight}
				{@const rowCenterY = y + rowHeight / 2}
				{@const showBarForRow = row.showBar && typeof row.value === 'number'}
				{@const barY = rowCenterY + valueFontSize / 2 + 4}

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

				<!-- Label -->
				<text
					x={padding}
					y={rowCenterY - (showBarForRow ? 2 : 0)}
					font-family={fontFamily}
					font-size={labelFontSize}
					fill={labelColor}
					dominant-baseline="central"
				>
					{row.label}
				</text>

				<!-- Value -->
				<text
					x={width - padding}
					y={rowCenterY - (showBarForRow ? 2 : 0)}
					font-family={fontFamily}
					font-size={valueFontSize}
					font-weight="600"
					fill={valueColor}
					text-anchor="end"
					dominant-baseline="central"
				>
					{row.value}
				</text>

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
						fill={row.barColor}
					/>
				{/if}
			{/each}
		</g>
	</AnimationWrapper>
</EffectWrapper>
