<script lang="ts">
	import type { BorderModifier } from '../types/modifiers';
	import type { ShapeSource } from './shapes';
	import { getShapeRenderData } from './shapes/shapeUtils';

	let {
		border,
		shape,
		width,
		height,
		radius = 0
	}: {
		border: BorderModifier;
		shape?: ShapeSource;
		width: number;
		height: number;
		radius?: number;
	} = $props();

	// Get shape render data if we have a shape
	const shapeRender = $derived(shape ? getShapeRenderData(shape, width, height, 'contain') : null);
	const hasShape = $derived(!!shapeRender);

	// Calculate stroke width scaling for shapes
	const scaledStrokeWidth = $derived.by(() => {
		if (!hasShape || !shapeRender) return border.width;
		// Scale stroke width relative to the shape scaling
		return border.width * (shapeRender.width / width);
	});
</script>

<!--
	BorderRenderer renders a border that follows a shape's outline.
	If no shape is provided, renders a rectangular border.
	Note: For glow effects, use Effect → strokeGlow via EffectWrapper.
-->

<g opacity={border.opacity ?? 1}>
	{#if hasShape && shapeRender}
		<!-- Shape-aware border: render the shape outline -->
		<g transform={shapeRender.transform}>
			<g
				fill="none"
				stroke={border.color}
				stroke-width={scaledStrokeWidth}
				stroke-dasharray={border.style === 'dashed' ? '8,4' : border.style === 'dotted' ? '2,2' : undefined}
			>
				{@html shapeRender.strippedBody}
			</g>
		</g>
	{:else}
		<!-- Rectangle border -->
		<rect
			x={border.width / 2}
			y={border.width / 2}
			width={width - border.width}
			height={height - border.width}
			rx={radius}
			ry={radius}
			fill="none"
			stroke={border.color}
			stroke-width={border.width}
			stroke-dasharray={border.style === 'dashed' ? '8,4' : border.style === 'dotted' ? '2,2' : undefined}
		/>
	{/if}
</g>
