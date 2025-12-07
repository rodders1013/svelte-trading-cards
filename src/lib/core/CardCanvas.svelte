<script lang="ts" module>
	import type { CardTemplate, CardData, ContainerContext } from '$lib/types';

	export interface CardCanvasProps {
		template: CardTemplate;
		data: CardData;
		width?: number;
		height?: number;
		/** Bindable reference to the SVG element for downloads */
		svgElement?: SVGSVGElement | null;
	}
</script>

<script lang="ts">
	import { CARD_WIDTH, CARD_HEIGHT, CARD_RADIUS } from '$lib/types';
	import { getAnimationCSS } from '$lib/styling/animations';
	import ComponentRenderer from './ComponentRenderer.svelte';

	let {
		template,
		data,
		width = CARD_WIDTH,
		height = CARD_HEIGHT,
		svgElement = $bindable(null)
	}: CardCanvasProps = $props();

	// Root container context for all components
	const rootContainer: ContainerContext = $derived({
		width,
		height,
		radius: CARD_RADIUS
	});

	// Animation CSS to inject into SVG (ensures animations work in any context)
	const animationCSS = getAnimationCSS();
</script>

<svg bind:this={svgElement} {width} {height} viewBox="0 0 {width} {height}" xmlns="http://www.w3.org/2000/svg">
	<!-- Animation styles embedded in SVG for portability -->
	<defs>
		{@html `<style>${animationCSS}</style>`}
	</defs>
	<!-- White background for transparent areas -->
	<rect x="0" y="0" {width} {height} fill="white" rx={CARD_RADIUS} />
	{#each template.components as component (component.id)}
		<ComponentRenderer definition={component} {data} container={rootContainer} />
	{/each}
</svg>
