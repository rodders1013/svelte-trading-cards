<script lang="ts" module>
	import { z } from 'zod';
	import { AnimationConfigSchema } from '$lib/animations/types.js';
	import { EffectConfigSchema } from '$lib/effects/types.js';
	import { BlendMode } from '$lib/blend/types.js';

	export const ImagePropsSchema = z.object({
		imageUrl: z.string().optional(),
		dataField: z.string().optional(),
		opacity: z.number().min(0).max(1).default(1),
		preserveAspectRatio: z.string().default('xMidYMid slice'),
		animation: AnimationConfigSchema.optional(),
		effect: EffectConfigSchema.optional(),
		blendMode: BlendMode.optional()
	});

	export type ImageProps = z.infer<typeof ImagePropsSchema>;
</script>

<script lang="ts">
	import type { ContainerContext, CardData } from '$lib/types';
	import { AnimationWrapper } from '$lib/animations/index.js';
	import { EffectWrapper } from '$lib/effects/index.js';

	let {
		imageUrl,
		dataField,
		opacity = 1,
		preserveAspectRatio = 'xMidYMid slice',
		animation,
		effect,
		blendMode,
		container,
		data
	}: ImageProps & {
		container: ContainerContext;
		data?: CardData;
	} = $props();

	const uid = Math.random().toString(36).substring(2, 9);
	const clipId = `image-clip-${uid}`;

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

	// Only clip if container has radius
	const needsClip = $derived(container.radius > 0);

	// Calculate center point for animation transform-origin
	const centerX = $derived(container.width / 2);
	const centerY = $derived(container.height / 2);
</script>

{#if resolvedImageUrl}
	{#if needsClip}
		<defs>
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
		</defs>
	{/if}

	<EffectWrapper {effect} {blendMode} transformOrigin="{centerX}px {centerY}px">
		<AnimationWrapper {animation} transformOrigin="{centerX}px {centerY}px">
			<image
				href={resolvedImageUrl}
				x="0"
				y="0"
				width={container.width}
				height={container.height}
				{preserveAspectRatio}
				{opacity}
				clip-path={needsClip ? `url(#${clipId})` : undefined}
			/>
		</AnimationWrapper>
	</EffectWrapper>
{/if}
