<script lang="ts" module>
	import { z } from 'zod';

	export const HolographicConfigSchema = z.object({
		/** Primary color */
		color: z.string().default('#3b82f6'),
		/** Secondary color to cycle to */
		secondaryColor: z.string().default('#ec4899'),
		/** Optional third color for rainbow effect */
		tertiaryColor: z.string().optional(),
		/** Animation speed in seconds (lower = faster) */
		speed: z.number().min(0.5).max(10).default(3),
		/** Gradient direction in degrees (0 = left-to-right, 90 = top-to-bottom) */
		angle: z.number().min(0).max(360).default(45),
		/** Apply to fill, stroke, or both */
		apply: z.enum(['fill', 'stroke', 'both']).default('fill')
	});

	export type HolographicConfig = z.infer<typeof HolographicConfigSchema>;
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		color = '#3b82f6',
		secondaryColor = '#ec4899',
		tertiaryColor,
		speed = 3,
		angle = 45,
		apply = 'fill',
		children
	}: Partial<HolographicConfig> & {
		children: Snippet;
	} = $props();

	// Generate unique ID for gradient
	const uid = Math.random().toString(36).substring(2, 9);
	const gradientId = `holo-${uid}`;

	// Calculate gradient direction from angle
	// angle 0 = left to right, 90 = top to bottom
	const x1 = $derived(Math.round(50 - Math.cos((angle * Math.PI) / 180) * 50));
	const y1 = $derived(Math.round(50 - Math.sin((angle * Math.PI) / 180) * 50));
	const x2 = $derived(Math.round(50 + Math.cos((angle * Math.PI) / 180) * 50));
	const y2 = $derived(Math.round(50 + Math.sin((angle * Math.PI) / 180) * 50));

	// Build color cycle values
	const colorCycle1 = $derived(
		tertiaryColor
			? `${color};${secondaryColor};${tertiaryColor};${color}`
			: `${color};${secondaryColor};${color}`
	);
	const colorCycle2 = $derived(
		tertiaryColor
			? `${secondaryColor};${tertiaryColor};${color};${secondaryColor}`
			: `${secondaryColor};${color};${secondaryColor}`
	);
	const colorCycle3 = $derived(
		tertiaryColor
			? `${tertiaryColor};${color};${secondaryColor};${tertiaryColor}`
			: `${color};${secondaryColor};${color}`
	);

	// Gradient URL
	const gradientUrl = $derived(`url(#${gradientId})`);

	// Style based on apply mode
	const fillStyle = $derived(apply === 'fill' || apply === 'both' ? gradientUrl : undefined);
	const strokeStyle = $derived(apply === 'stroke' || apply === 'both' ? gradientUrl : undefined);
</script>

<!--
	HolographicWrapper applies an animated color-shifting gradient effect
	to child content. The gradient cycles between 2-3 colors creating
	a holographic/iridescent appearance.

	Usage:
	<HolographicWrapper color="#3b82f6" secondaryColor="#ec4899" speed={3}>
		<rect ... />
	</HolographicWrapper>
-->

<defs>
	<linearGradient id={gradientId} x1="{x1}%" y1="{y1}%" x2="{x2}%" y2="{y2}%">
		<stop offset="0%">
			<animate
				attributeName="stop-color"
				values={colorCycle1}
				dur="{speed}s"
				repeatCount="indefinite"
			/>
		</stop>
		<stop offset="50%">
			<animate
				attributeName="stop-color"
				values={colorCycle2}
				dur="{speed}s"
				repeatCount="indefinite"
			/>
		</stop>
		<stop offset="100%">
			<animate
				attributeName="stop-color"
				values={colorCycle3}
				dur="{speed}s"
				repeatCount="indefinite"
			/>
		</stop>
	</linearGradient>
</defs>

<g fill={fillStyle} stroke={strokeStyle}>
	{@render children()}
</g>
