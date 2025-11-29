<script lang="ts" module>
	import { z } from 'zod';
	import { AnimationConfigSchema } from '$lib/animations/types.js';
	import { EffectConfigSchema } from '$lib/effects/types.js';

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
		effect: EffectConfigSchema.optional()
	});

	export type IconData = z.infer<typeof IconDataSchema>;
	export type IconProps = z.infer<typeof IconPropsSchema>;
</script>

<script lang="ts">
	import type { ContainerContext, CardData } from '$lib/types';
	import { AnimationWrapper } from '$lib/animations/index.js';
	import { EffectWrapper } from '$lib/effects/index.js';

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

	// Calculate the center point for animation transform-origin
	const centerX = $derived(x + iconSize / 2);
	const centerY = $derived(y + iconSize / 2);

	// Build transform string
	const transform = $derived.by(() => {
		const transforms: string[] = [];
		const centerX = x + iconSize / 2;
		const centerY = y + iconSize / 2;

		if (rotation !== 0) {
			transforms.push(`rotate(${rotation} ${centerX} ${centerY})`);
		}

		if (flipHorizontal || flipVertical) {
			const scaleX = flipHorizontal ? -1 : 1;
			const scaleY = flipVertical ? -1 : 1;
			transforms.push(`translate(${centerX} ${centerY}) scale(${scaleX} ${scaleY}) translate(${-centerX} ${-centerY})`);
		}

		return transforms.join(' ');
	});

	// Build viewBox from icon data
	const viewBox = $derived(`${iconData?.left ?? 0} ${iconData?.top ?? 0} ${iconWidth} ${iconHeight}`);
</script>

{#if iconData?.body}
	<EffectWrapper {effect} transformOrigin="{centerX}px {centerY}px">
		<AnimationWrapper {animation} transformOrigin="{centerX}px {centerY}px">
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
						{@html iconData.body}
					</g>
				</svg>
			</g>
		</AnimationWrapper>
	</EffectWrapper>
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
