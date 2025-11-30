<script lang="ts" module>
	import { z } from 'zod';
	import { AnimationConfigSchema } from '$lib/animations';

	// Predefined clip shapes
	export const ClipShapeEnum = z.enum([
		'rect',
		'circle',
		'ellipse',
		'hexagon',
		'octagon',
		'diamond',
		'shield',
		'star',
		'polygon'
	]);

	export type ClipShape = z.infer<typeof ClipShapeEnum>;

	export const GroupPropsSchema = z.object({
		x: z.number().default(0),
		y: z.number().default(0),
		width: z.number(),
		height: z.number(),
		radius: z.number().default(0),
		clipContent: z.boolean().default(true),
		clipShape: ClipShapeEnum.default('rect'),
		clipPoints: z.array(z.object({ x: z.number(), y: z.number() })).optional(),
		animation: AnimationConfigSchema.optional()
	});

	export type GroupProps = z.infer<typeof GroupPropsSchema>;
</script>

<script lang="ts">
	import type { ComponentDefinition, ContainerContext, CardData } from '$lib/types';
	import type { AnimationConfig } from '$lib/animations';
	import ComponentRenderer from './ComponentRenderer.svelte';
	import AnimationWrapper from '$lib/animations/AnimationWrapper.svelte';

	let {
		x = 0,
		y = 0,
		width,
		height,
		radius = 0,
		clipContent = true,
		clipShape = 'rect',
		clipPoints,
		animation,
		children,
		data,
		container: _container
	}: GroupProps & {
		children?: ComponentDefinition[];
		data: CardData;
		container: ContainerContext;
	} = $props();

	// Check if animation should be applied
	const hasAnimation = $derived(animation && animation.type !== 'none');

	const uid = Math.random().toString(36).substring(2, 9);
	const clipId = `group-clip-${uid}`;

	// Calculate center and radii for shapes
	const cx = $derived(width / 2);
	const cy = $derived(height / 2);
	const rx = $derived(width / 2);
	const ry = $derived(height / 2);

	// Generate clip path points for various shapes
	const clipPathData = $derived.by(() => {
		switch (clipShape) {
			case 'circle': {
				const r = Math.min(rx, ry);
				return { type: 'circle', cx, cy, r };
			}
			case 'ellipse': {
				return { type: 'ellipse', cx, cy, rx, ry };
			}
			case 'hexagon': {
				// Pointy-top hexagon
				const points = [];
				for (let i = 0; i < 6; i++) {
					const angle = (Math.PI / 3) * i - Math.PI / 2;
					const px = cx + rx * Math.cos(angle);
					const py = cy + ry * Math.sin(angle);
					points.push(`${px},${py}`);
				}
				return { type: 'polygon', points: points.join(' ') };
			}
			case 'octagon': {
				const inset = Math.min(width, height) * 0.293; // ~tan(22.5°)
				const points = [
					`${inset},0`,
					`${width - inset},0`,
					`${width},${inset}`,
					`${width},${height - inset}`,
					`${width - inset},${height}`,
					`${inset},${height}`,
					`0,${height - inset}`,
					`0,${inset}`
				];
				return { type: 'polygon', points: points.join(' ') };
			}
			case 'diamond': {
				const points = [`${cx},0`, `${width},${cy}`, `${cx},${height}`, `0,${cy}`];
				return { type: 'polygon', points: points.join(' ') };
			}
			case 'shield': {
				// Shield shape - rounded top, pointed bottom
				const path = `M ${width * 0.1},0
					L ${width * 0.9},0
					Q ${width},0 ${width},${height * 0.1}
					L ${width},${height * 0.5}
					Q ${width},${height * 0.7} ${cx},${height}
					Q 0,${height * 0.7} 0,${height * 0.5}
					L 0,${height * 0.1}
					Q 0,0 ${width * 0.1},0 Z`;
				return { type: 'path', d: path };
			}
			case 'star': {
				// 5-pointed star
				const points = [];
				const outerR = Math.min(rx, ry);
				const innerR = outerR * 0.4;
				for (let i = 0; i < 10; i++) {
					const angle = (Math.PI / 5) * i - Math.PI / 2;
					const r = i % 2 === 0 ? outerR : innerR;
					const px = cx + r * Math.cos(angle);
					const py = cy + r * Math.sin(angle);
					points.push(`${px},${py}`);
				}
				return { type: 'polygon', points: points.join(' ') };
			}
			case 'polygon': {
				if (clipPoints && clipPoints.length >= 3) {
					// Custom polygon from user-provided points (normalized 0-1, scaled to width/height)
					const points = clipPoints.map((p) => `${p.x * width},${p.y * height}`);
					return { type: 'polygon', points: points.join(' ') };
				}
				return { type: 'rect', width, height, radius };
			}
			default:
				return { type: 'rect', width, height, radius };
		}
	});

	// Determine if we need clipping
	const needsClip = $derived(clipContent && (radius > 0 || clipShape !== 'rect'));

	// Create container context for children (includes shape info)
	const childContainer: ContainerContext = $derived({
		width,
		height,
		radius: clipShape === 'rect' ? radius : 0,
		clipShape: clipShape,
		clipPoints: clipPoints
	});
</script>

{#if hasAnimation && animation}
	<AnimationWrapper {animation} transformOrigin="{width / 2}px {height / 2}px">
		<g transform="translate({x}, {y})">
			{#if needsClip}
				<defs>
					<clipPath id={clipId}>
						{#if clipPathData.type === 'rect'}
							<rect x="0" y="0" width={clipPathData.width} height={clipPathData.height} rx={clipPathData.radius} ry={clipPathData.radius} />
						{:else if clipPathData.type === 'circle'}
							<circle cx={clipPathData.cx} cy={clipPathData.cy} r={clipPathData.r} />
						{:else if clipPathData.type === 'ellipse'}
							<ellipse cx={clipPathData.cx} cy={clipPathData.cy} rx={clipPathData.rx} ry={clipPathData.ry} />
						{:else if clipPathData.type === 'polygon'}
							<polygon points={clipPathData.points} />
						{:else if clipPathData.type === 'path'}
							<path d={clipPathData.d} />
						{/if}
					</clipPath>
				</defs>
			{/if}

			<g clip-path={needsClip ? `url(#${clipId})` : undefined}>
				{#if children}
					{#each children as child (child.id)}
						<ComponentRenderer definition={child} {data} container={childContainer} />
					{/each}
				{/if}
			</g>
		</g>
	</AnimationWrapper>
{:else}
	<g transform="translate({x}, {y})">
		{#if needsClip}
			<defs>
				<clipPath id={clipId}>
					{#if clipPathData.type === 'rect'}
						<rect x="0" y="0" width={clipPathData.width} height={clipPathData.height} rx={clipPathData.radius} ry={clipPathData.radius} />
					{:else if clipPathData.type === 'circle'}
						<circle cx={clipPathData.cx} cy={clipPathData.cy} r={clipPathData.r} />
					{:else if clipPathData.type === 'ellipse'}
						<ellipse cx={clipPathData.cx} cy={clipPathData.cy} rx={clipPathData.rx} ry={clipPathData.ry} />
					{:else if clipPathData.type === 'polygon'}
						<polygon points={clipPathData.points} />
					{:else if clipPathData.type === 'path'}
						<path d={clipPathData.d} />
					{/if}
				</clipPath>
			</defs>
		{/if}

		<g clip-path={needsClip ? `url(#${clipId})` : undefined}>
			{#if children}
				{#each children as child (child.id)}
					<ComponentRenderer definition={child} {data} container={childContainer} />
				{/each}
			{/if}
		</g>
	</g>
{/if}
