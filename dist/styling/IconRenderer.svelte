<script lang="ts" module>
	import { z } from 'zod';

	/**
	 * Transform configuration for icons.
	 * Controls scale, position offset, rotation, and flip.
	 */
	export const IconTransformConfigSchema = z.object({
		/** Scale factor (1 = fill container, 0.5 = half size) */
		scale: z.number().min(0.1).max(10).default(1),
		/** Horizontal offset as percentage of container width (-100 to 100) */
		offsetX: z.number().min(-100).max(100).default(0),
		/** Vertical offset as percentage of container height (-100 to 100) */
		offsetY: z.number().min(-100).max(100).default(0),
		/** Rotation in degrees */
		rotation: z.number().min(0).max(360).default(0),
		/** Flip horizontally */
		flipHorizontal: z.boolean().default(false),
		/** Flip vertically */
		flipVertical: z.boolean().default(false)
	});

	export type IconTransformConfig = z.infer<typeof IconTransformConfigSchema>;

	/**
	 * Default transform config
	 */
	export const DEFAULT_ICON_TRANSFORM: IconTransformConfig = {
		scale: 1,
		offsetX: 0,
		offsetY: 0,
		rotation: 0,
		flipHorizontal: false,
		flipVertical: false
	};

	/**
	 * Sanitizes SVG body content to prevent XSS attacks.
	 */
	export function sanitizeSvgBody(body: string): string {
		return body
			.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
			.replace(/\s+on\w+\s*=\s*["'][^"']*["']/gi, '')
			.replace(/\s+on\w+\s*=\s*[^\s>]+/gi, '')
			.replace(/href\s*=\s*["']javascript:[^"']*["']/gi, '')
			.replace(/xlink:href\s*=\s*["']javascript:[^"']*["']/gi, '')
			.replace(/href\s*=\s*["']data:(?!image\/)[^"']*["']/gi, '')
			.replace(/xlink:href\s*=\s*["']data:(?!image\/)[^"']*["']/gi, '')
			.replace(/<foreignObject\b[^>]*>[\s\S]*?<\/foreignObject>/gi, '')
			.replace(/<use\b[^>]*href\s*=\s*["']https?:[^"']*["'][^>]*\/?>/gi, '')
			.replace(/<set\b[^>]*\bonbegin\b[^>]*\/?>/gi, '')
			.replace(/<animate\b[^>]*\bonbegin\b[^>]*\/?>/gi, '');
	}

	/**
	 * Strip fill attributes from SVG body to allow inheritance
	 */
	export function stripFillAttributes(body: string): string {
		return body
			.replace(/fill="[^"]*"/gi, '')
			.replace(/fill='[^']*'/gi, '');
	}
</script>

<script lang="ts">
	import HolographicWrapper, { type HolographicConfig } from './HolographicWrapper.svelte';

	interface Props {
		/** SVG body content (the inner paths/shapes) */
		body: string;
		/** Native icon width (e.g., 24) */
		width?: number;
		/** Native icon height (e.g., 24) */
		height?: number;
		/** Container width to render into */
		containerWidth: number;
		/** Container height to render into */
		containerHeight: number;
		/** How to fit icon in container */
		scaleMode?: 'contain' | 'cover' | 'stretch';
		/** Transform for scale, offset, rotation, flip */
		transform?: Partial<IconTransformConfig>;
		/** Fill color */
		fill?: string;
		/** Stroke color */
		stroke?: string;
		/** Stroke width */
		strokeWidth?: number;
		/** Holographic effect config */
		holographic?: HolographicConfig;
		/** Opacity */
		opacity?: number;
	}

	let {
		body,
		width = 24,
		height = 24,
		containerWidth,
		containerHeight,
		scaleMode = 'contain',
		transform,
		fill = 'currentColor',
		stroke,
		strokeWidth = 1,
		holographic,
		opacity = 1
	}: Props = $props();

	// Sanitize and prepare body - always strip fills so <g fill={...}> controls color
	const sanitizedBody = $derived(sanitizeSvgBody(body));
	const strippedBody = $derived(stripFillAttributes(sanitizedBody));

	// Check if holographic applies to fill or stroke
	const holoAppliesFill = $derived(
		holographic && (holographic.apply === 'fill' || holographic.apply === 'both')
	);
	const holoAppliesStroke = $derived(
		holographic && (holographic.apply === 'stroke' || holographic.apply === 'both')
	);

	// Effective colors based on holographic mode
	const effectiveFill = $derived(holoAppliesFill ? 'inherit' : fill);
	const effectiveStroke = $derived(holoAppliesStroke ? 'inherit' : stroke);

	// Calculate base scale to fit icon in container
	const baseScale = $derived.by(() => {
		switch (scaleMode) {
			case 'contain':
				return Math.min(containerWidth / width, containerHeight / height);
			case 'cover':
				return Math.max(containerWidth / width, containerHeight / height);
			case 'stretch':
				// For stretch, we'll handle X and Y separately
				return 1;
		}
	});

	// Calculate final transform
	const finalTransform = $derived.by(() => {
		const userScale = transform?.scale ?? 1;
		const offsetX = transform?.offsetX ?? 0;
		const offsetY = transform?.offsetY ?? 0;
		const rotation = transform?.rotation ?? 0;
		const flipH = transform?.flipHorizontal ?? false;
		const flipV = transform?.flipVertical ?? false;

		// Calculate scaled icon dimensions
		let scaleX: number;
		let scaleY: number;

		if (scaleMode === 'stretch') {
			scaleX = (containerWidth / width) * userScale;
			scaleY = (containerHeight / height) * userScale;
		} else {
			scaleX = scaleY = baseScale * userScale;
		}

		// Calculate scaled dimensions
		const scaledWidth = width * scaleX;
		const scaledHeight = height * scaleY;

		// Center position with offset
		const panX = (offsetX / 100) * containerWidth;
		const panY = (offsetY / 100) * containerHeight;
		const x = (containerWidth - scaledWidth) / 2 + panX;
		const y = (containerHeight - scaledHeight) / 2 + panY;

		// Build transform parts
		const parts: string[] = [];

		// Translate to position
		parts.push(`translate(${x}, ${y})`);

		// Scale
		parts.push(`scale(${scaleX}, ${scaleY})`);

		// Rotation and flip need to be applied around the icon center
		if (rotation !== 0 || flipH || flipV) {
			const iconCenterX = width / 2;
			const iconCenterY = height / 2;

			// Move to center, apply rotation/flip, move back
			parts.push(`translate(${iconCenterX}, ${iconCenterY})`);

			if (rotation !== 0) {
				parts.push(`rotate(${rotation})`);
			}

			if (flipH || flipV) {
				parts.push(`scale(${flipH ? -1 : 1}, ${flipV ? -1 : 1})`);
			}

			parts.push(`translate(${-iconCenterX}, ${-iconCenterY})`);
		}

		return parts.join(' ');
	});

	// Determine if we need stroke
	const hasStroke = $derived(stroke || holoAppliesStroke);
</script>

<!--
	IconRenderer - Central component for rendering SVG icon content.

	Uses transform + scale approach (not nested svg+viewBox) for better
	holographic gradient inheritance.

	Usage:
	<IconRenderer
		body={iconBody}
		width={24}
		height={24}
		containerWidth={100}
		containerHeight={100}
		fill="#ff0000"
		stroke="#000"
		strokeWidth={2}
		holographic={{ color: '#3b82f6', secondaryColor: '#ec4899', apply: 'fill' }}
	/>
-->

{#snippet iconContent()}
	<g
		transform={finalTransform}
		fill={effectiveFill}
		stroke={hasStroke ? effectiveStroke : undefined}
		stroke-width={hasStroke ? strokeWidth : undefined}
		{opacity}
	>
		{@html strippedBody}
	</g>
{/snippet}

{#if holographic}
	<HolographicWrapper {...holographic}>
		{@render iconContent()}
	</HolographicWrapper>
{:else}
	{@render iconContent()}
{/if}
