<script lang="ts">
	/**
	 * TextRenderer - Unified text rendering component
	 *
	 * Provides two modes:
	 * - 'fit': Auto-sizes text to fit container (uses FitText)
	 * - 'fixed': Renders text at fixed size
	 *
	 * Standardizes alignment and baseline handling across all
	 * text-rendering components in the library.
	 */
	import FitText from './FitText.svelte';
	import {
		getTextAnchor,
		getDominantBaseline,
		getAlignedX,
		getAlignedY,
		type HorizontalAlign,
		type VerticalAlign
	} from '../types/alignment';

	type RenderMode = 'fit' | 'fixed';

	interface Props {
		text: string;
		mode?: RenderMode;
		x?: number;
		y?: number;
		width: number;
		height: number;
		/** Fixed font size (only used when mode='fixed') */
		fontSize?: number;
		/** Minimum font size (only used when mode='fit') */
		minFontSize?: number;
		/** Maximum font size (only used when mode='fit') */
		maxFontSize?: number;
		fontFamily?: string;
		fontWeight?: string | number;
		fontStyle?: 'normal' | 'italic';
		textDecoration?: 'none' | 'underline' | 'line-through';
		textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
		color?: string;
		opacity?: number;
		horizontalAlign?: HorizontalAlign;
		verticalAlign?: VerticalAlign;
		padding?: number;
		/** If true, don't wrap text (only affects mode='fit') */
		singleLine?: boolean;
		/** Line height multiplier (default 1.2) */
		lineHeightRatio?: number;
	}

	let {
		text,
		mode = 'fit',
		x = 0,
		y = 0,
		width,
		height,
		fontSize = 14,
		minFontSize = 12,
		maxFontSize = 72,
		fontFamily = 'Arial, sans-serif',
		fontWeight = 'normal',
		fontStyle = 'normal',
		textDecoration = 'none',
		textTransform = 'none',
		color = '#000000',
		opacity = 1,
		horizontalAlign = 'center',
		verticalAlign = 'center',
		padding = 0,
		singleLine = false,
		lineHeightRatio = 1.2
	}: Props = $props();

	// Fixed mode calculations
	const textAnchor = $derived(getTextAnchor(horizontalAlign));
	const dominantBaseline = $derived(getDominantBaseline(verticalAlign));
	const textX = $derived(getAlignedX(horizontalAlign, x, width, padding));
	const textY = $derived(getAlignedY(verticalAlign, y, height, padding));

	// Apply text transform
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
</script>

{#if mode === 'fit'}
	<FitText
		text={text}
		{x}
		{y}
		{width}
		{height}
		minSize={minFontSize}
		maxSize={maxFontSize}
		{fontFamily}
		fontWeight={String(fontWeight)}
		{fontStyle}
		{textDecoration}
		{textTransform}
		{horizontalAlign}
		{verticalAlign}
		fill={color}
		{opacity}
		inset={padding}
		{singleLine}
		{lineHeightRatio}
	/>
{:else}
	<text
		x={textX}
		y={textY}
		font-family={fontFamily}
		font-size={fontSize}
		font-weight={fontWeight}
		font-style={fontStyle}
		text-decoration={textDecoration}
		fill={color}
		{opacity}
		text-anchor={textAnchor}
		dominant-baseline={dominantBaseline}
	>
		{transformedText}
	</text>
{/if}
