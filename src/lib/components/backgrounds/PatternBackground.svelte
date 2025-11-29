<script lang="ts" module>
	import { z } from 'zod';
	import { AnimationConfigSchema } from '$lib/animations/types.js';
	import { EffectConfigSchema } from '$lib/effects/types.js';

	export const PatternBackgroundPropsSchema = z.object({
		pattern: z.enum(['dots', 'grid', 'diagonal', 'hexagons']),
		color: z.string().default('#ffffff'),
		opacity: z.number().min(0).max(1).default(0.1),
		size: z.number().min(4).max(200).default(32),
		animation: AnimationConfigSchema.optional(),
		effect: EffectConfigSchema.optional()
	});

	export type PatternBackgroundProps = z.infer<typeof PatternBackgroundPropsSchema>;
</script>

<script lang="ts">
	import type { ContainerContext, CardData } from '$lib/types';
	import { AnimationWrapper } from '$lib/animations/index.js';
	import { EffectWrapper } from '$lib/effects/index.js';

	let {
		pattern,
		color = '#ffffff',
		opacity = 0.1,
		size = 32,
		animation,
		effect,
		container,
		data
	}: PatternBackgroundProps & {
		container: ContainerContext;
		data?: CardData;
	} = $props();

	const uid = Math.random().toString(36).substring(2, 9);
	const patternId = `pattern-${uid}`;
	const clipId = `pattern-clip-${uid}`;

	// Only clip if container has radius
	const needsClip = $derived(container.radius > 0);

	// Calculate center point for animation transform-origin
	const centerX = $derived(container.width / 2);
	const centerY = $derived(container.height / 2);
</script>

<defs>
	{#if needsClip}
		<clipPath id={clipId}>
			<rect
				x="0"
				y="0"
				width={container.width}
				height={container.height}
				rx={container.radius}
			/>
		</clipPath>
	{/if}

	{#if pattern === 'dots'}
		<pattern id={patternId} width={size} height={size} patternUnits="userSpaceOnUse">
			<circle cx={size / 2} cy={size / 2} r={size / 8} fill={color} />
		</pattern>
	{:else if pattern === 'grid'}
		<pattern id={patternId} width={size} height={size} patternUnits="userSpaceOnUse">
			<path d="M {size} 0 L 0 0 0 {size}" fill="none" stroke={color} stroke-width="1" />
		</pattern>
	{:else if pattern === 'diagonal'}
		<pattern id={patternId} width={size} height={size} patternUnits="userSpaceOnUse">
			<path
				d="M 0 {size} L {size} 0 M {-size / 4} {size / 4} L {size / 4} {-size / 4} M {size * 3 / 4} {size + size / 4} L {size + size / 4} {size * 3 / 4}"
				stroke={color}
				stroke-width="1"
				fill="none"
			/>
		</pattern>
	{:else if pattern === 'hexagons'}
		{@const h = size}
		{@const w = size * 1.1547}
		<pattern id={patternId} width={w} height={h * 1.5} patternUnits="userSpaceOnUse">
			<polygon
				points="{w / 2},{0} {w},{h / 4} {w},{h * 3 / 4} {w / 2},{h} {0},{h * 3 / 4} {0},{h / 4}"
				fill="none"
				stroke={color}
				stroke-width="1"
				transform="translate(0, {h / 4})"
			/>
			<polygon
				points="{w / 2},{0} {w},{h / 4} {w},{h * 3 / 4} {w / 2},{h} {0},{h * 3 / 4} {0},{h / 4}"
				fill="none"
				stroke={color}
				stroke-width="1"
				transform="translate({w / 2}, {h})"
			/>
		</pattern>
	{/if}
</defs>

<EffectWrapper {effect} transformOrigin="{centerX}px {centerY}px">
	<AnimationWrapper {animation} transformOrigin="{centerX}px {centerY}px">
		<rect
			x="0"
			y="0"
			width={container.width}
			height={container.height}
			fill="url(#{patternId})"
			{opacity}
			clip-path={needsClip ? `url(#${clipId})` : undefined}
		/>
	</AnimationWrapper>
</EffectWrapper>
