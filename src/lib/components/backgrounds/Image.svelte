<script lang="ts" module>
	import { z } from 'zod';
	import { AnimationConfigSchema } from '$lib/animations/types.js';

	export const ImagePropsSchema = z.object({
		imageUrl: z.string().optional(),
		dataField: z.string().optional(),
		opacity: z.number().min(0).max(1).default(1),
		preserveAspectRatio: z.string().default('xMidYMid slice'),
		animation: AnimationConfigSchema.optional()
	});

	export type ImageProps = z.infer<typeof ImagePropsSchema>;
</script>

<script lang="ts">
	import type { ContainerContext, CardData } from '$lib/types';
	import { AnimationWrapper } from '$lib/animations/index.js';

	let {
		imageUrl,
		dataField,
		opacity = 1,
		preserveAspectRatio = 'xMidYMid slice',
		animation,
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
		if (dataField && data?.images && typeof data.images === 'object') {
			const images = data.images as Record<string, string>;
			return images[dataField] ?? imageUrl;
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
{/if}
