<script lang="ts" module>
	import { z } from 'zod';
	import { AnimationConfigSchema } from '../../styling/animations/types.js';
	import { EffectConfigSchema } from '../../styling/effects/types.js';
	import { BlendMode } from '../../styling/blend/types.js';
	import { HolographicConfigSchema } from '../../styling/HolographicWrapper.svelte';
	import { IconTransformConfigSchema } from '../../styling/IconRenderer.svelte';

	// IconifyIcon data format
	export const IconDataSchema = z.object({
		body: z.string(),
		width: z.number().optional().default(24),
		height: z.number().optional().default(24),
		left: z.number().optional(),
		top: z.number().optional()
	});

	export const IconPropsSchema = z.object({
		iconData: IconDataSchema.optional(),
		iconName: z.string().optional(), // For reference/display only
		color: z.string().default('currentColor'),
		stroke: z.string().optional(), // Stroke color
		strokeWidth: z.number().default(1), // Stroke width
		opacity: z.number().min(0).max(1).default(1),
		// Legacy individual transform props (for backward compatibility)
		rotation: z.number().default(0),
		flipHorizontal: z.boolean().default(false),
		flipVertical: z.boolean().default(false),
		// New unified transform (takes precedence if set)
		transform: IconTransformConfigSchema.optional(),
		animation: AnimationConfigSchema.optional(),
		effect: EffectConfigSchema.optional(),
		blendMode: BlendMode.optional(),
		holographic: HolographicConfigSchema.optional()
	});

	export type IconData = z.infer<typeof IconDataSchema>;
	export type IconProps = z.infer<typeof IconPropsSchema>;

	/**
	 * Sanitizes SVG body content to prevent XSS attacks.
	 * Removes script tags, event handlers, and dangerous elements/attributes.
	 * @deprecated Use sanitizeSvgBody from IconRenderer instead
	 */
	export function sanitizeSvgBody(body: string): string {
		return body
			// Remove script tags and their content
			.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
			// Remove on* event handlers (onclick, onload, onerror, etc.)
			.replace(/\s+on\w+\s*=\s*["'][^"']*["']/gi, '')
			.replace(/\s+on\w+\s*=\s*[^\s>]+/gi, '')
			// Remove javascript: URLs
			.replace(/href\s*=\s*["']javascript:[^"']*["']/gi, '')
			.replace(/xlink:href\s*=\s*["']javascript:[^"']*["']/gi, '')
			// Remove data: URLs that could contain scripts (but allow data:image)
			.replace(/href\s*=\s*["']data:(?!image\/)[^"']*["']/gi, '')
			.replace(/xlink:href\s*=\s*["']data:(?!image\/)[^"']*["']/gi, '')
			// Remove foreignObject which can contain HTML
			.replace(/<foreignObject\b[^>]*>[\s\S]*?<\/foreignObject>/gi, '')
			// Remove use elements pointing to external resources
			.replace(/<use\b[^>]*href\s*=\s*["']https?:[^"']*["'][^>]*\/?>/gi, '')
			// Remove set and animate elements that could trigger scripts
			.replace(/<set\b[^>]*\bonbegin\b[^>]*\/?>/gi, '')
			.replace(/<animate\b[^>]*\bonbegin\b[^>]*\/?>/gi, '');
	}
</script>

<script lang="ts">
	import type { ContainerContext, CardData, UniversalModifiers } from '../../types';
	import ComponentWrapper from '../../styling/ComponentWrapper.svelte';
	import IconRenderer, { type IconTransformConfig } from '../../styling/IconRenderer.svelte';

	let {
		iconData,
		iconName,
		color = 'currentColor',
		stroke,
		strokeWidth = 1,
		opacity = 1,
		rotation = 0,
		flipHorizontal = false,
		flipVertical = false,
		transform,
		animation,
		effect,
		blendMode,
		holographic,
		container,
		data
	}: IconProps & {
		container: ContainerContext;
		data?: CardData;
	} = $props();

	// Merge legacy transform props with new transform object
	// New transform takes precedence if set
	const effectiveTransform: Partial<IconTransformConfig> = $derived({
		scale: transform?.scale ?? 1,
		offsetX: transform?.offsetX ?? 0,
		offsetY: transform?.offsetY ?? 0,
		rotation: transform?.rotation ?? rotation,
		flipHorizontal: transform?.flipHorizontal ?? flipHorizontal,
		flipVertical: transform?.flipVertical ?? flipVertical
	});

	// Collect modifiers for unified wrapper (excluding holographic - handled by IconRenderer)
	const modifiers: UniversalModifiers = $derived({ effect, animation, blendMode });
</script>

{#if iconData?.body}
	<ComponentWrapper {container} {modifiers}>
		<IconRenderer
			body={iconData.body}
			width={iconData.width ?? 24}
			height={iconData.height ?? 24}
			containerWidth={container.width}
			containerHeight={container.height}
			scaleMode="contain"
			transform={effectiveTransform}
			fill={color}
			{stroke}
			{strokeWidth}
			{holographic}
			{opacity}
		/>
	</ComponentWrapper>
{:else}
	<!-- Placeholder when no icon selected -->
	<g opacity={0.3}>
		<rect
			x={(container.width - 64) / 2}
			y={(container.height - 64) / 2}
			width={64}
			height={64}
			fill="none"
			stroke="#888"
			stroke-width="2"
			stroke-dasharray="4 4"
			rx="8"
		/>
		<text
			x={container.width / 2}
			y={container.height / 2 + 4}
			text-anchor="middle"
			fill="#888"
			font-size="12"
			font-family="Arial, sans-serif"
		>
			Icon
		</text>
	</g>
{/if}
