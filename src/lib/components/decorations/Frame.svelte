<script lang="ts" module>
	import { z } from 'zod';
	import { AnimationConfigSchema } from '$lib/animations/types.js';
	import { EffectConfigSchema } from '$lib/effects/types.js';

	export const FrameStyleSchema = z.enum(['simple', 'ornate', 'art-deco', 'celtic', 'tribal', 'elegant']);
	export type FrameStyle = z.infer<typeof FrameStyleSchema>;

	export const FrameSizeSchema = z.enum(['sm', 'md', 'lg']);
	export type FrameSize = z.infer<typeof FrameSizeSchema>;

	export const FramePropsSchema = z.object({
		style: FrameStyleSchema.default('simple'),
		corners: z.boolean().default(true),
		edges: z.boolean().default(false),
		color: z.string().default('#fbbf24'),
		secondaryColor: z.string().optional(),
		size: FrameSizeSchema.default('md'),
		strokeWidth: z.number().default(2),
		opacity: z.number().min(0).max(1).default(1),
		animation: AnimationConfigSchema.optional(),
		effect: EffectConfigSchema.optional()
	});

	export type FrameProps = z.infer<typeof FramePropsSchema>;
</script>

<script lang="ts">
	import type { ContainerContext, CardData } from '$lib/types';
	import { AnimationWrapper } from '$lib/animations/index.js';
	import { EffectWrapper } from '$lib/effects/index.js';

	let {
		style = 'simple',
		corners = true,
		edges = false,
		color = '#fbbf24',
		secondaryColor,
		size = 'md',
		strokeWidth = 2,
		opacity = 1,
		animation,
		effect,
		container,
		data
	}: FrameProps & {
		container: ContainerContext;
		data?: CardData;
	} = $props();

	const width = $derived(container.width);
	const height = $derived(container.height);
	const cx = $derived(width / 2);
	const cy = $derived(height / 2);

	// Size multiplier
	const sizeMultiplier = $derived.by(() => {
		switch (size) {
			case 'sm': return 0.6;
			case 'md': return 1;
			case 'lg': return 1.4;
			default: return 1;
		}
	});

	// Corner decoration size
	const cornerSize = $derived(40 * sizeMultiplier);
	const padding = $derived(8);

	// Edge decoration size
	const edgeLength = $derived(60 * sizeMultiplier);

	// Secondary color fallback
	const secColor = $derived(secondaryColor ?? color);

	// Generate corner path based on style
	function getCornerPath(corner: 'tl' | 'tr' | 'bl' | 'br'): string {
		const s = cornerSize;

		// Base transforms for each corner
		const transforms: Record<typeof corner, { x: number; y: number; rotate: number }> = {
			tl: { x: padding, y: padding, rotate: 0 },
			tr: { x: width - padding, y: padding, rotate: 90 },
			br: { x: width - padding, y: height - padding, rotate: 180 },
			bl: { x: padding, y: height - padding, rotate: 270 }
		};

		switch (style) {
			case 'simple':
				// Simple L-shape
				return `M 0,${s} L 0,0 L ${s},0`;
			case 'ornate':
				// Ornate curls
				return `M 0,${s}
					Q 0,${s * 0.5} ${s * 0.2},${s * 0.3}
					Q ${s * 0.4},${s * 0.1} ${s * 0.5},${s * 0.1}
					L ${s},0
					M 0,0 L ${s * 0.3},0
					M 0,0 L 0,${s * 0.3}`;
			case 'art-deco':
				// Art deco geometric
				return `M 0,${s} L 0,${s * 0.6} L ${s * 0.4},${s * 0.4} L ${s * 0.6},0 L ${s},0
					M ${s * 0.15},${s * 0.5} L ${s * 0.5},${s * 0.15}`;
			case 'celtic':
				// Celtic knot style
				return `M 0,${s}
					C 0,${s * 0.7} ${s * 0.3},${s * 0.5} ${s * 0.3},${s * 0.3}
					C ${s * 0.3},${s * 0.1} ${s * 0.5},0 ${s},0
					M ${s * 0.15},${s * 0.6}
					C ${s * 0.15},${s * 0.4} ${s * 0.4},${s * 0.15} ${s * 0.6},${s * 0.15}`;
			case 'tribal':
				// Tribal/angular style
				return `M 0,${s} L 0,${s * 0.7} L ${s * 0.3},${s * 0.5} L ${s * 0.3},${s * 0.3} L ${s * 0.5},${s * 0.3} L ${s * 0.7},0 L ${s},0
					M ${s * 0.1},${s * 0.5} L ${s * 0.2},${s * 0.4} L ${s * 0.4},${s * 0.2} L ${s * 0.5},${s * 0.1}`;
			case 'elegant':
				// Elegant flourish
				return `M 0,${s}
					Q 0,${s * 0.3} ${s * 0.3},${s * 0.1}
					Q ${s * 0.5},0 ${s},0
					M ${s * 0.1},${s * 0.7}
					Q ${s * 0.2},${s * 0.4} ${s * 0.4},${s * 0.2}
					Q ${s * 0.6},${s * 0.1} ${s * 0.7},${s * 0.1}`;
			default:
				return `M 0,${s} L 0,0 L ${s},0`;
		}
	}

	// Get edge decoration path
	function getEdgePath(edge: 'top' | 'right' | 'bottom' | 'left'): string {
		const len = edgeLength;
		const h = cornerSize * 0.4;

		switch (style) {
			case 'simple':
				return `M ${-len / 2},0 L ${len / 2},0`;
			case 'ornate':
				return `M ${-len / 2},0
					Q ${-len / 4},${-h} 0,0
					Q ${len / 4},${h} ${len / 2},0`;
			case 'art-deco':
				return `M ${-len / 2},0 L ${-len / 4},${-h / 2} L 0,0 L ${len / 4},${-h / 2} L ${len / 2},0`;
			case 'celtic':
				return `M ${-len / 2},0
					C ${-len / 4},${-h} ${-len / 8},${h} 0,0
					C ${len / 8},${-h} ${len / 4},${h} ${len / 2},0`;
			case 'tribal':
				return `M ${-len / 2},0 L ${-len / 3},${-h / 2} L ${-len / 6},0 L 0,${-h / 2} L ${len / 6},0 L ${len / 3},${-h / 2} L ${len / 2},0`;
			case 'elegant':
				return `M ${-len / 2},0
					Q ${-len / 4},${-h * 0.8} 0,0
					Q ${len / 4},${h * 0.8} ${len / 2},0`;
			default:
				return `M ${-len / 2},0 L ${len / 2},0`;
		}
	}

	// Corner positions and rotations
	const cornerConfigs = [
		{ id: 'tl', x: padding, y: padding, rotate: 0 },
		{ id: 'tr', x: width - padding, y: padding, rotate: 90 },
		{ id: 'br', x: width - padding, y: height - padding, rotate: 180 },
		{ id: 'bl', x: padding, y: height - padding, rotate: 270 }
	] as const;

	// Edge positions and rotations
	const edgeConfigs = [
		{ id: 'top', x: cx, y: padding + cornerSize * 0.2, rotate: 0 },
		{ id: 'right', x: width - padding - cornerSize * 0.2, y: cy, rotate: 90 },
		{ id: 'bottom', x: cx, y: height - padding - cornerSize * 0.2, rotate: 180 },
		{ id: 'left', x: padding + cornerSize * 0.2, y: cy, rotate: 270 }
	] as const;
</script>

<EffectWrapper {effect} transformOrigin="{cx}px {cy}px">
	<AnimationWrapper {animation} transformOrigin="{cx}px {cy}px">
		<g opacity={opacity}>
			<!-- Corner decorations -->
			{#if corners}
				{#each cornerConfigs as corner (corner.id)}
					<g transform="translate({corner.x}, {corner.y}) rotate({corner.rotate})">
						<path
							d={getCornerPath(corner.id)}
							fill="none"
							stroke={color}
							stroke-width={strokeWidth}
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
						{#if style === 'ornate' || style === 'elegant'}
							<!-- Additional decorative element -->
							<circle cx={cornerSize * 0.15} cy={cornerSize * 0.15} r={3 * sizeMultiplier} fill={secColor} />
						{/if}
					</g>
				{/each}
			{/if}

			<!-- Edge decorations -->
			{#if edges}
				{#each edgeConfigs as edge (edge.id)}
					<g transform="translate({edge.x}, {edge.y}) rotate({edge.rotate})">
						<path
							d={getEdgePath(edge.id)}
							fill="none"
							stroke={color}
							stroke-width={strokeWidth}
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</g>
				{/each}
			{/if}
		</g>
	</AnimationWrapper>
</EffectWrapper>
