<script lang="ts" module>
	import { z } from 'zod';
	import { AnimationConfigSchema } from '$lib/animations/types.js';
	import { EffectConfigSchema } from '$lib/effects/types.js';
	import { BlendMode } from '$lib/blend/types.js';
	import { BuiltInShapeSchema } from '$lib/shapes/types.js';
	import { FilterConfigSchema, ImageTransformConfigSchema } from '$lib/filters/types.js';

	// Shape source schema for Image clipping
	export const ImageShapeSourceSchema = z.discriminatedUnion('type', [
		z.object({ type: z.literal('builtin'), shape: BuiltInShapeSchema }),
		z.object({
			type: z.literal('custom'),
			iconData: z.object({
				body: z.string(),
				width: z.number().default(24),
				height: z.number().default(24)
			}),
			iconName: z.string().optional()
		})
	]);

	export const ImagePropsSchema = z.object({
		imageUrl: z.string().optional(),
		dataField: z.string().optional(),
		opacity: z.number().min(0).max(1).default(1),
		preserveAspectRatio: z.string().default('xMidYMid slice'),
		shapeSource: ImageShapeSourceSchema.optional(),
		animation: AnimationConfigSchema.optional(),
		effect: EffectConfigSchema.optional(),
		blendMode: BlendMode.optional(),
		// New filter and transform props
		filter: FilterConfigSchema.optional(),
		transform: ImageTransformConfigSchema.optional()
	});

	export type ImageProps = z.infer<typeof ImagePropsSchema>;
</script>

<script lang="ts">
	import type { ContainerContext, CardData } from '$lib/types';
	import type { ShapeSource } from '$lib/shapes';
	import { AnimationWrapper } from '$lib/animations/index.js';
	import { EffectWrapper } from '$lib/effects/index.js';
	import { FilterWrapper } from '$lib/filters/index.js';
	import { getShapeRenderData } from '$lib/shapes/shapeUtils.js';
	import { hasActiveFilters } from '$lib/filters/types.js';

	let {
		imageUrl,
		dataField,
		opacity = 1,
		preserveAspectRatio = 'xMidYMid slice',
		shapeSource,
		animation,
		effect,
		blendMode,
		filter,
		transform,
		container,
		data
	}: ImageProps & {
		container: ContainerContext;
		data?: CardData;
	} = $props();

	const uid = Math.random().toString(36).substring(2, 9);
	const clipId = `image-clip-${uid}`;
	const maskId = `image-mask-${uid}`;

	// Resolve image URL from data binding or direct prop
	const resolvedImageUrl = $derived.by(() => {
		if (dataField && data) {
			// First check nested images object
			if (data.images && typeof data.images === 'object') {
				const images = data.images as Record<string, string>;
				if (images[dataField]) return images[dataField];
			}
			// Fallback to top-level data field
			const value = data[dataField];
			if (typeof value === 'string') return value;
		}
		return imageUrl;
	});

	// Determine clipping mode
	const hasCustomShape = $derived(!!shapeSource);
	const isSimpleRect = $derived(
		!shapeSource || (shapeSource.type === 'builtin' && shapeSource.shape === 'rectangle')
	);

	// Get shape render data for mask-based clipping
	const shapeRender = $derived(
		shapeSource && !isSimpleRect
			? getShapeRenderData(shapeSource as ShapeSource, container.width, container.height, 'contain')
			: null
	);

	// Use mask for custom shapes, clipPath otherwise
	const useMask = $derived(hasCustomShape && !isSimpleRect && shapeRender);

	// Calculate center point for transform-origin
	const centerX = $derived(container.width / 2);
	const centerY = $derived(container.height / 2);

	// Simple transform calculation
	// Image size = container × zoom, position = centered + pan offset
	const imgData = $derived.by(() => {
		const scale = transform?.scale ?? 1;
		const panX = (transform?.offsetX ?? 0) / 100 * container.width;
		const panY = (transform?.offsetY ?? 0) / 100 * container.height;
		const rotation = transform?.rotation ?? 0;
		const flipH = transform?.flipHorizontal ?? false;
		const flipV = transform?.flipVertical ?? false;

		// Image dimensions based on zoom
		const w = container.width * scale;
		const h = container.height * scale;

		// Position: centered in container, then shifted by pan
		const x = (container.width - w) / 2 + panX;
		const y = (container.height - h) / 2 + panY;

		// Build transform for rotation/flip (applied around container center)
		let transformStr = '';
		if (rotation !== 0 || flipH || flipV) {
			const parts: string[] = [];
			parts.push(`translate(${centerX}, ${centerY})`);
			if (flipH || flipV) {
				parts.push(`scale(${flipH ? -1 : 1}, ${flipV ? -1 : 1})`);
			}
			if (rotation !== 0) {
				parts.push(`rotate(${rotation})`);
			}
			parts.push(`translate(${-centerX}, ${-centerY})`);
			transformStr = parts.join(' ');
		}

		return { x, y, w, h, transform: transformStr };
	});
</script>

{#if resolvedImageUrl}
	<defs>
		<!-- Clip path: rounded rect or simple rect for container bounds -->
		<clipPath id={clipId}>
			<rect
				x="0"
				y="0"
				width={container.width}
				height={container.height}
				rx={container.radius}
				ry={container.radius}
			/>
		</clipPath>

		<!-- Mask for custom shapes -->
		{#if useMask && shapeRender}
			<mask id={maskId}>
				<g transform={shapeRender.transform} fill="white">
					{@html shapeRender.strippedBody}
				</g>
			</mask>
		{/if}
	</defs>

	<EffectWrapper {effect} {blendMode} transformOrigin="{centerX}px {centerY}px">
		<AnimationWrapper {animation} transformOrigin="{centerX}px {centerY}px">
			<FilterWrapper {filter}>
				<g
					clip-path={!useMask ? `url(#${clipId})` : undefined}
					mask={useMask ? `url(#${maskId})` : undefined}
				>
					{#if imgData.transform}
						<g transform={imgData.transform}>
							<image
								href={resolvedImageUrl}
								x={imgData.x}
								y={imgData.y}
								width={imgData.w}
								height={imgData.h}
								{preserveAspectRatio}
								{opacity}
							/>
						</g>
					{:else}
						<image
							href={resolvedImageUrl}
							x={imgData.x}
							y={imgData.y}
							width={imgData.w}
							height={imgData.h}
							{preserveAspectRatio}
							{opacity}
						/>
					{/if}
				</g>
			</FilterWrapper>
		</AnimationWrapper>
	</EffectWrapper>
{/if}
