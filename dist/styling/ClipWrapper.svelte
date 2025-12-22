<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { ShapeSource } from './shapes';
	import { getShapeRenderData } from './shapes/shapeUtils';

	let {
		shape,
		width,
		height,
		children
	}: {
		shape?: ShapeSource;
		width: number;
		height: number;
		children: Snippet;
	} = $props();

	// Generate unique ID for clip path
	const uid = Math.random().toString(36).substring(2, 9);
	const clipId = $derived(`clip-${uid}`);

	// Get shape render data if we have a shape
	const shapeRender = $derived(shape ? getShapeRenderData(shape, width, height, 'contain') : null);
	const hasClip = $derived(!!shapeRender);
</script>

<!--
	ClipWrapper applies a clip path to child content based on a shape.
	If no shape is provided, children are rendered without clipping.
-->

{#if hasClip && shapeRender}
	<defs>
		<clipPath id={clipId}>
			<g transform={shapeRender.transform}>
				{@html shapeRender.strippedBody}
			</g>
		</clipPath>
	</defs>
	<g clip-path="url(#{clipId})">
		{@render children()}
	</g>
{:else}
	{@render children()}
{/if}
