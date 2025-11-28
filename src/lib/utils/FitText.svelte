<script lang="ts">
	import { fitTextToBox } from './textFitting.js';
	import { measureText } from './textMeasure.js';
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
		horizontalAlign?: 'left' | 'center' | 'right';
		verticalAlign?: 'top' | 'center' | 'bottom';
		fill?: string;
		opacity?: number;
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
		horizontalAlign = 'left',
		verticalAlign = 'top',
		fill = '#000000',
		opacity = 1
	}: Props = $props();

	let fontsLoaded = $state(typeof document === 'undefined');

	onMount(async () => {
		if (document.fonts) {
			await document.fonts.ready;
			fontsLoaded = true;
		}
	});

	let fitted = $derived(
		text && fontsLoaded
			? fitTextToBox(text, width, height, fontFamily, minSize, maxSize, measureText)
			: null
	);

	let textAnchor = $derived.by(() => {
		if (horizontalAlign === 'center') return 'middle';
		if (horizontalAlign === 'right') return 'end';
		return 'start';
	});

	let textX = $derived.by(() => {
		if (horizontalAlign === 'center') return x + width / 2;
		if (horizontalAlign === 'right') return x + width;
		return x;
	});

	let verticalOffset = $derived.by(() => {
		if (!fitted) return 0;
		const totalTextHeight = fitted.lines.length * fitted.lineHeight;

		if (verticalAlign === 'center') {
			return (height - totalTextHeight) / 2;
		} else if (verticalAlign === 'bottom') {
			return height - totalTextHeight;
		}
		return 0;
	});
</script>

{#if fitted}
	<text
		x={textX}
		y={y + verticalOffset + fitted.fontSize}
		font-family={fontFamily}
		font-size={fitted.fontSize}
		font-weight={fontWeight}
		text-anchor={textAnchor}
		{fill}
		{opacity}
	>
		{#each fitted.lines as line, i}
			<tspan x={textX} dy={i === 0 ? 0 : fitted.lineHeight}>
				{line}
			</tspan>
		{/each}
	</text>
{/if}
