<script lang="ts" module>
	import { z } from 'zod';
	import { AnimationConfigSchema } from '$lib/styling/animations/types.js';
	import { EffectConfigSchema } from '$lib/styling/effects/types.js';
	import { BlendMode } from '$lib/styling/blend/types.js';
	import { HolographicConfigSchema } from '$lib/styling/HolographicWrapper.svelte';

	export const ListStyleSchema = z.enum(['bullet', 'numbered', 'dash', 'arrow', 'none']);
	export type ListStyle = z.infer<typeof ListStyleSchema>;

	export const ListPropsSchema = z.object({
		// Data binding - accepts array OR delimited string
		dataField: z.string(),
		delimiter: z.string().default(','),

		// Display style
		style: ListStyleSchema.default('bullet'),

		// Typography
		fontSize: z.number().default(14),
		fontFamily: z.string().default('Arial, sans-serif'),
		fontWeight: z.string().default('normal'),
		color: z.string().default('#ffffff'),
		lineHeight: z.number().default(1.6),

		// Bullet/number styling
		bulletColor: z.string().optional(),
		bulletSize: z.number().optional(),
		numberPadding: z.number().default(2),

		// Layout
		alignment: z.enum(['left', 'center', 'right']).default('left'),
		verticalAlign: z.enum(['top', 'center', 'bottom']).default('top'),
		itemSpacing: z.number().default(4),
		indent: z.number().default(20),

		// Overflow handling
		maxItems: z.number().optional(),
		overflowText: z.string().default('+{n} more'),
		overflowColor: z.string().optional(),

		// General
		opacity: z.number().min(0).max(1).default(1),
		animation: AnimationConfigSchema.optional(),
		effect: EffectConfigSchema.optional(),
		blendMode: BlendMode.optional(),
		holographic: HolographicConfigSchema.optional()
	});

	export type ListProps = z.infer<typeof ListPropsSchema>;
</script>

<script lang="ts">
	import type { ContainerContext, CardData, UniversalModifiers } from '$lib/types';
	import ComponentWrapper from '$lib/styling/ComponentWrapper.svelte';
	import FitText from '$lib/utils/FitText.svelte';

	let {
		dataField,
		delimiter = ',',
		style = 'bullet',
		fontSize = 14,
		fontFamily = 'Arial, sans-serif',
		fontWeight = 'normal',
		color = '#ffffff',
		lineHeight = 1.6,
		bulletColor,
		bulletSize,
		numberPadding = 2,
		alignment = 'left',
		verticalAlign = 'top',
		itemSpacing = 4,
		indent = 20,
		maxItems,
		overflowText = '+{n} more',
		overflowColor,
		opacity = 1,
		animation,
		effect,
		blendMode,
		holographic,
		container,
		data
	}: ListProps & {
		container: ContainerContext;
		data?: CardData;
	} = $props();

	// Container dimensions
	const width = $derived(container.width);
	const height = $derived(container.height);
	const cx = $derived(width / 2);

	// Collect modifiers for unified wrapper
	const modifiers: UniversalModifiers = $derived({ effect, animation, blendMode, holographic });

	// Resolve items from data
	const resolvedItems = $derived.by(() => {
		if (!dataField || !data) return [];

		const rawValue = data[dataField];

		// Already an array
		if (Array.isArray(rawValue)) {
			return rawValue.map((item) => String(item));
		}

		// String - split by delimiter
		if (typeof rawValue === 'string') {
			return rawValue
				.split(delimiter)
				.map((item) => item.trim())
				.filter((item) => item.length > 0);
		}

		return [];
	});

	// Apply maxItems truncation
	const displayData = $derived.by(() => {
		if (!maxItems || resolvedItems.length <= maxItems) {
			return { items: resolvedItems, overflow: 0 };
		}
		return {
			items: resolvedItems.slice(0, maxItems),
			overflow: resolvedItems.length - maxItems
		};
	});

	// Calculate item height
	const itemHeight = $derived(fontSize * lineHeight + itemSpacing);

	// Calculate available width for text (accounting for bullet/marker space)
	const textAreaWidth = $derived.by(() => {
		if (style === 'none') return width;
		return width - indent - 4; // Leave some margin after bullet
	});

	// Calculate total content height
	const totalContentHeight = $derived.by(() => {
		const itemCount = displayData.items.length + (displayData.overflow > 0 ? 1 : 0);
		return itemCount * itemHeight - itemSpacing; // Remove last spacing
	});

	// Calculate starting Y based on vertical alignment
	const startY = $derived.by(() => {
		switch (verticalAlign) {
			case 'center':
				return (height - totalContentHeight) / 2;
			case 'bottom':
				return height - totalContentHeight;
			default:
				return 0;
		}
	});

	// Calculate X positions based on alignment
	const bulletX = $derived.by(() => {
		switch (alignment) {
			case 'center':
				return cx - indent / 2;
			case 'right':
				return width - indent;
			default:
				return indent / 2;
		}
	});

	const textX = $derived.by(() => {
		switch (alignment) {
			case 'center':
				return cx + indent / 2;
			case 'right':
				return width;
			default:
				return indent;
		}
	});

	const textAnchor = $derived.by(() => {
		switch (alignment) {
			case 'center':
				return 'start';
			case 'right':
				return 'end';
			default:
				return 'start';
		}
	});

	// Bullet styling
	const bulletRadius = $derived((bulletSize ?? fontSize) * 0.2);
	const effectiveBulletColor = $derived(bulletColor ?? color);
	const effectiveOverflowColor = $derived(overflowColor ?? color);

	// When holographic, use 'inherit' for fill colors
	const effectiveFill = $derived(holographic ? 'inherit' : color);
	const effectiveBulletFill = $derived(holographic ? 'inherit' : effectiveBulletColor);
	const effectiveOverflowFill = $derived(holographic ? 'inherit' : effectiveOverflowColor);

	// Get bullet/marker for style
	function getMarker(index: number): string {
		switch (style) {
			case 'numbered':
				return `${index + 1}.`;
			case 'dash':
				return '\u2013'; // en-dash
			case 'arrow':
				return '\u2192'; // right arrow
			default:
				return '';
		}
	}
</script>

{#snippet listContent()}
	<g {opacity}>
		{#each displayData.items as item, index (index)}
			{@const y = startY + index * itemHeight}
			{@const itemTextHeight = fontSize * lineHeight}

			<!-- Bullet (circle) -->
			{#if style === 'bullet'}
				<circle
					cx={bulletX}
					cy={y + fontSize * 0.5}
					r={bulletRadius}
					fill={effectiveBulletFill}
				/>
			{:else if style !== 'none'}
				<!-- Numbered, Dash, Arrow markers -->
				<text
					x={bulletX}
					{y}
					font-family={fontFamily}
					font-size={fontSize}
					fill={effectiveBulletFill}
					dominant-baseline="hanging"
					text-anchor={alignment === 'right' ? 'end' : 'start'}
				>
					{getMarker(index)}
				</text>
			{/if}

			<!-- Item text - auto-fits to available space -->
			<FitText
				text={item}
				x={style === 'none' ? 0 : textX}
				{y}
				width={textAreaWidth}
				height={itemTextHeight}
				minSize={6}
				maxSize={fontSize}
				{fontFamily}
				{fontWeight}
				horizontalAlign={style === 'none' ? alignment : 'left'}
				verticalAlign="top"
				fill={effectiveFill}
				singleLine={true}
			/>
		{/each}

		<!-- Overflow indicator -->
		{#if displayData.overflow > 0}
			{@const y = startY + displayData.items.length * itemHeight}
			{@const overflowTextHeight = fontSize * lineHeight}
			<FitText
				text={overflowText.replace('{n}', String(displayData.overflow))}
				x={style === 'none' ? 0 : textX}
				{y}
				width={textAreaWidth}
				height={overflowTextHeight}
				minSize={6}
				maxSize={fontSize * 0.9}
				{fontFamily}
				fontWeight="normal"
				horizontalAlign={style === 'none' ? alignment : 'left'}
				verticalAlign="top"
				fill={effectiveOverflowFill}
				opacity={0.7}
				singleLine={true}
			/>
		{/if}
	</g>
{/snippet}

<ComponentWrapper {container} {modifiers}>
	{@render listContent()}
</ComponentWrapper>
