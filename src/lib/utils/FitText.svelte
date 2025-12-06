<script lang="ts">
	import { fitTextToBox, type TextFitOptions } from './textFitting.js';
	import { measureText } from './textMeasure.js';
	import { loadFont } from '$lib/fonts';
	import { onMount } from 'svelte';

	interface Props {
		text?: string;
		x?: number;
		y?: number;
		width?: number;
		height?: number;
		minSize?: number;
		maxSize?: number;
		fontFamily?: string;
		fontWeight?: string;
		fontStyle?: 'normal' | 'italic';
		textDecoration?: 'none' | 'underline' | 'line-through';
		textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
		horizontalAlign?: 'left' | 'center' | 'right';
		verticalAlign?: 'top' | 'center' | 'bottom';
		fill?: string;
		opacity?: number;
		/** Inset/padding to subtract from available space */
		inset?: number;
		/** If true, don't wrap text - keep on single line */
		singleLine?: boolean;
		/** Line height multiplier (default 1.2) */
		lineHeightRatio?: number;
		/** Debug mode - show bounding box */
		debug?: boolean;
	}

	let {
		text = '',
		x = 0,
		y = 0,
		width = 100,
		height = 100,
		minSize = 12,
		maxSize = 72,
		fontFamily = 'Arial, sans-serif',
		fontWeight = 'normal',
		fontStyle = 'normal',
		textDecoration = 'none',
		textTransform = 'none',
		horizontalAlign = 'left',
		verticalAlign = 'top',
		fill = '#000000',
		opacity = 1,
		inset = 0,
		singleLine = false,
		lineHeightRatio = 1.2,
		debug = false
	}: Props = $props();

	let fontsLoaded = $state(typeof document === 'undefined');
	let currentFontFamily = $state(fontFamily);

	// Load the specific font and wait for it before measuring
	async function ensureFontLoaded(font: string) {
		if (typeof document === 'undefined') return;

		// Load the font (handles Google, brand, and web-safe fonts)
		await loadFont(font);

		// Also wait for document.fonts.ready for any other pending fonts
		if (document.fonts) {
			await document.fonts.ready;
		}

		fontsLoaded = true;
		currentFontFamily = font;
	}

	onMount(() => {
		ensureFontLoaded(fontFamily);
	});

	// Re-load font when fontFamily changes
	$effect(() => {
		if (fontFamily !== currentFontFamily) {
			fontsLoaded = false;
			ensureFontLoaded(fontFamily);
		}
	});

	// Apply text transform before measuring
	const transformedText = $derived.by(() => {
		if (!text) return '';
		switch (textTransform) {
			case 'uppercase':
				return text.toUpperCase();
			case 'lowercase':
				return text.toLowerCase();
			case 'capitalize':
				return text.replace(/\b\w/g, (c) => c.toUpperCase());
			default:
				return text;
		}
	});

	const fitOptions: TextFitOptions = $derived({
		inset,
		singleLine,
		lineHeightRatio,
		fontWeight,
		fontStyle
	});

	let fitted = $derived(
		transformedText && fontsLoaded
			? fitTextToBox(transformedText, width, height, fontFamily, minSize, maxSize, measureText, fitOptions)
			: null
	);

	// Effective dimensions after inset
	const effectiveWidth = $derived(width - inset * 2);
	const effectiveHeight = $derived(height - inset * 2);

	let textAnchor = $derived.by(() => {
		if (horizontalAlign === 'center') return 'middle';
		if (horizontalAlign === 'right') return 'end';
		return 'start';
	});

	let textX = $derived.by(() => {
		const baseX = x + inset;
		if (horizontalAlign === 'center') return x + width / 2;
		if (horizontalAlign === 'right') return x + width - inset;
		return baseX;
	});

	// Calculate vertical position
	// Note: We use dominant-baseline="central" on the text element,
	// so y positions the visual center of each line, not the baseline.
	// This gives better centering especially for fonts with descenders.
	let verticalOffset = $derived.by(() => {
		if (!fitted) return inset;
		const totalTextHeight = fitted.lines.length * fitted.lineHeight;

		if (verticalAlign === 'center') {
			// Center the text block, accounting for line height
			// Add half a line height to position first line's center correctly
			return (height - totalTextHeight) / 2 + fitted.lineHeight / 2;
		} else if (verticalAlign === 'bottom') {
			// Position from bottom, with half line height offset for central baseline
			return height - totalTextHeight - inset + fitted.lineHeight / 2;
		}
		// Top alignment: start at inset + half line height for central baseline
		return inset + fitted.lineHeight / 2;
	});
</script>

{#if debug}
	<!-- Debug: show bounding box -->
	<rect
		{x}
		{y}
		{width}
		{height}
		fill="none"
		stroke="red"
		stroke-width="1"
		stroke-dasharray="4,2"
		opacity="0.5"
	/>
	<!-- Debug: show effective area (after inset) -->
	{#if inset > 0}
		<rect
			x={x + inset}
			y={y + inset}
			width={effectiveWidth}
			height={effectiveHeight}
			fill="none"
			stroke="blue"
			stroke-width="1"
			stroke-dasharray="2,2"
			opacity="0.5"
		/>
	{/if}
{/if}

{#if fitted}
	<text
		x={textX}
		y={y + verticalOffset}
		font-family={fontFamily}
		font-size={fitted.fontSize}
		font-weight={fontWeight}
		font-style={fontStyle}
		text-decoration={textDecoration}
		text-anchor={textAnchor}
		dominant-baseline="central"
		{fill}
		{opacity}
	>
		{#each fitted.lines as line, i}
			<tspan x={textX} dy={i === 0 ? 0 : fitted.lineHeight} dominant-baseline="central">
				{line}
			</tspan>
		{/each}
	</text>
{/if}
