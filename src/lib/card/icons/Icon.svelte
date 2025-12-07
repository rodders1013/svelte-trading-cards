<script lang="ts" module>
	import { z } from 'zod';
	import { AnimationConfigSchema } from '$lib/styling/animations/types.js';
	import { EffectConfigSchema } from '$lib/styling/effects/types.js';
	import { BlendMode } from '$lib/styling/blend/types.js';

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
		size: z.number().optional(), // If not set, fills container
		opacity: z.number().min(0).max(1).default(1),
		rotation: z.number().default(0), // Degrees
		flipHorizontal: z.boolean().default(false),
		flipVertical: z.boolean().default(false),
		animation: AnimationConfigSchema.optional(),
		effect: EffectConfigSchema.optional(),
		blendMode: BlendMode.optional()
	});

	export type IconData = z.infer<typeof IconDataSchema>;
	export type IconProps = z.infer<typeof IconPropsSchema>;

	/**
	 * Sanitizes SVG body content to prevent XSS attacks.
	 * Removes script tags, event handlers, and dangerous elements/attributes.
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
	import type { ContainerContext, CardData, UniversalModifiers } from '$lib/types';
	import ComponentWrapper from '$lib/styling/ComponentWrapper.svelte';

	let {
		iconData,
		iconName,
		color = 'currentColor',
		size,
		opacity = 1,
		rotation = 0,
		flipHorizontal = false,
		flipVertical = false,
		animation,
		effect,
		blendMode,
		container,
		data
	}: IconProps & {
		container: ContainerContext;
		data?: CardData;
	} = $props();

	// Calculate icon dimensions and positioning
	const iconSize = $derived.by(() => {
		if (size) return size;
		// Fit to container while maintaining aspect ratio
		return Math.min(container.width, container.height);
	});

	const iconWidth = $derived(iconData?.width ?? 24);
	const iconHeight = $derived(iconData?.height ?? 24);

	// Center the icon in the container
	const x = $derived((container.width - iconSize) / 2);
	const y = $derived((container.height - iconSize) / 2);

	// Build transform string for rotation/flip
	const transform = $derived.by(() => {
		const transforms: string[] = [];
		const cx = x + iconSize / 2;
		const cy = y + iconSize / 2;

		if (rotation !== 0) {
			transforms.push(`rotate(${rotation} ${cx} ${cy})`);
		}

		if (flipHorizontal || flipVertical) {
			const scaleX = flipHorizontal ? -1 : 1;
			const scaleY = flipVertical ? -1 : 1;
			transforms.push(`translate(${cx} ${cy}) scale(${scaleX} ${scaleY}) translate(${-cx} ${-cy})`);
		}

		return transforms.join(' ');
	});

	// Build viewBox from icon data
	const viewBox = $derived(`${iconData?.left ?? 0} ${iconData?.top ?? 0} ${iconWidth} ${iconHeight}`);

	// Sanitize icon body to prevent XSS
	const sanitizedBody = $derived(iconData?.body ? sanitizeSvgBody(iconData.body) : '');

	// Collect modifiers for unified wrapper
	const modifiers: UniversalModifiers = $derived({ effect, animation, blendMode });
</script>

{#if iconData?.body}
	<ComponentWrapper {container} {modifiers}>
		<g transform={transform} opacity={opacity}>
			<svg
				x={x}
				y={y}
				width={iconSize}
				height={iconSize}
				viewBox={viewBox}
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<g fill={color} style="color: {color}">
					{@html sanitizedBody}
				</g>
			</svg>
		</g>
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
