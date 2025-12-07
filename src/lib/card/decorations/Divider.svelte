<script lang="ts" module>
	import { z } from 'zod';
	import { AnimationConfigSchema } from '$lib/styling/animations/types.js';
	import { EffectConfigSchema } from '$lib/styling/effects/types.js';
	import { BlendMode } from '$lib/styling/blend/types.js';
	import { HolographicConfigSchema } from '$lib/styling/HolographicWrapper.svelte';
	import { IconDataSchema } from '$lib/card/icons/Icon.svelte';
	import { IconTransformConfigSchema } from '$lib/styling/IconRenderer.svelte';
	import { ICON_PRESETS } from '$lib/styling/shapes/bundledShapes.js';

	export const DividerStyleSchema = z.enum(['solid', 'dashed', 'dotted', 'gradient', 'double']);
	export type DividerStyle = z.infer<typeof DividerStyleSchema>;

	export const DividerFadeSchema = z.enum(['none', 'left', 'right', 'both']);
	export type DividerFade = z.infer<typeof DividerFadeSchema>;

	// Preset icon options for divider center
	export const DividerIconPresetSchema = z.enum([
		'none',
		'diamond',
		'star',
		'circle',
		'square',
		'heart',
		'flower',
		'custom'
	]);
	export type DividerIconPreset = z.infer<typeof DividerIconPresetSchema>;

	// Labels for preset icons
	export const DIVIDER_ICON_LABELS: Record<DividerIconPreset, string> = {
		none: 'None',
		diamond: 'Diamond',
		star: 'Star',
		circle: 'Circle',
		square: 'Square',
		heart: 'Heart',
		flower: 'Flower',
		custom: 'Custom...'
	};

	export const DividerPropsSchema = z.object({
		style: DividerStyleSchema.default('solid'),
		color: z.string().default('#ffffff'),
		secondaryColor: z.string().optional(),
		thickness: z.number().default(2),
		fade: DividerFadeSchema.default('none'),
		// Icon - preset or custom icon in center of divider
		iconPreset: DividerIconPresetSchema.default('none'),
		customIcon: IconDataSchema.optional(),
		customIconName: z.string().optional(),
		iconSize: z.number().default(16),
		iconColor: z.string().optional(),
		iconStroke: z.string().optional(),
		iconStrokeWidth: z.number().default(1),
		iconTransform: IconTransformConfigSchema.optional(),
		dashLength: z.number().default(8),
		gapLength: z.number().default(4),
		opacity: z.number().min(0).max(1).default(1),
		animation: AnimationConfigSchema.optional(),
		effect: EffectConfigSchema.optional(),
		blendMode: BlendMode.optional(),
		holographic: HolographicConfigSchema.optional()
	});

	export type DividerProps = z.infer<typeof DividerPropsSchema>;
</script>

<script lang="ts">
	import type { ContainerContext, CardData, UniversalModifiers } from '$lib/types';
	import ComponentWrapper from '$lib/styling/ComponentWrapper.svelte';
	import IconRenderer from '$lib/styling/IconRenderer.svelte';

	let {
		style = 'solid',
		color = '#ffffff',
		secondaryColor,
		thickness = 2,
		fade = 'none',
		iconPreset = 'none',
		customIcon,
		customIconName,
		iconSize = 16,
		iconColor,
		iconStroke,
		iconStrokeWidth = 1,
		iconTransform,
		dashLength = 8,
		gapLength = 4,
		opacity = 1,
		animation,
		effect: effectConfig,
		blendMode,
		holographic,
		container,
		data
	}: DividerProps & {
		container: ContainerContext;
		data?: CardData;
	} = $props();

	const uid = Math.random().toString(36).substring(2, 9);
	const gradientId = `divider-gradient-${uid}`;
	const fadeGradientId = `divider-fade-${uid}`;

	const width = $derived(container.width);
	const height = $derived(container.height);
	const cx = $derived(width / 2);
	const cy = $derived(height / 2);

	// Collect modifiers for unified wrapper
	const modifiers: UniversalModifiers = $derived({ effect: effectConfig, animation, blendMode, holographic });

	// Get the active icon data
	const dividerIcon = $derived.by(() => {
		if (iconPreset === 'custom' && customIcon) {
			return customIcon;
		}
		if (iconPreset !== 'none' && iconPreset !== 'custom') {
			return ICON_PRESETS[iconPreset];
		}
		return null;
	});

	const hasIcon = $derived(iconPreset !== 'none' && dividerIcon !== null);

	// Icon takes space in the middle
	const iconSpace = $derived(hasIcon ? iconSize + 8 : 0);
	const leftLineEnd = $derived(cx - iconSpace / 2);
	const rightLineStart = $derived(cx + iconSpace / 2);

	// Get icon fill color
	const iconFill = $derived(iconColor ?? color);

	// Generate dash segments for dashed/dotted styles using rects
	const dashSegments = $derived.by(() => {
		if (style === 'solid' || style === 'gradient' || style === 'double') return null;

		const segmentLength = style === 'dotted' ? thickness : dashLength;
		const gap = style === 'dotted' ? thickness * 2 : gapLength;
		const segments: Array<{ x: number; width: number; isLeft: boolean }> = [];

		// Left side segments
		let x = 0;
		while (x < leftLineEnd) {
			const segWidth = Math.min(segmentLength, leftLineEnd - x);
			if (segWidth > 0) {
				segments.push({ x, width: segWidth, isLeft: true });
			}
			x += segmentLength + gap;
		}

		// Right side segments
		x = rightLineStart;
		while (x < width) {
			const segWidth = Math.min(segmentLength, width - x);
			if (segWidth > 0) {
				segments.push({ x, width: segWidth, isLeft: false });
			}
			x += segmentLength + gap;
		}

		return segments;
	});
</script>

<defs>
	<!-- Gradient for gradient style -->
	{#if style === 'gradient' && !holographic}
		<linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
			<stop offset="0%" stop-color={color} />
			<stop offset="50%" stop-color={secondaryColor ?? color} />
			<stop offset="100%" stop-color={color} />
		</linearGradient>
	{/if}

	<!-- Fade gradient masks -->
	{#if fade !== 'none'}
		<linearGradient id={fadeGradientId} x1="0%" y1="0%" x2="100%" y2="0%">
			{#if fade === 'left' || fade === 'both'}
				<stop offset="0%" stop-color="white" stop-opacity="0" />
				<stop offset="20%" stop-color="white" stop-opacity="1" />
			{:else}
				<stop offset="0%" stop-color="white" stop-opacity="1" />
			{/if}
			{#if fade === 'right' || fade === 'both'}
				<stop offset="80%" stop-color="white" stop-opacity="1" />
				<stop offset="100%" stop-color="white" stop-opacity="0" />
			{:else}
				<stop offset="100%" stop-color="white" stop-opacity="1" />
			{/if}
		</linearGradient>
		<mask id="fade-mask-{uid}">
			<rect x="0" y="0" width={width} height={height} fill="url(#{fadeGradientId})" />
		</mask>
	{/if}
</defs>

<ComponentWrapper {container} {modifiers}>
	<g opacity={opacity} mask={fade !== 'none' ? `url(#fade-mask-${uid})` : undefined} fill={holographic ? 'inherit' : undefined}>
		<!-- Lines using rects with fill -->
		{#if style === 'solid' || style === 'gradient'}
			<!-- Solid or gradient line using rect -->
			{#if !hasIcon}
				<rect
					x={0}
					y={cy - thickness / 2}
					width={width}
					height={thickness}
					rx={thickness / 2}
					fill={holographic ? undefined : (style === 'gradient' ? `url(#${gradientId})` : color)}
				/>
			{:else}
				<!-- Left segment -->
				<rect
					x={0}
					y={cy - thickness / 2}
					width={leftLineEnd}
					height={thickness}
					rx={thickness / 2}
					fill={holographic ? undefined : color}
				/>
				<!-- Right segment -->
				<rect
					x={rightLineStart}
					y={cy - thickness / 2}
					width={width - rightLineStart}
					height={thickness}
					rx={thickness / 2}
					fill={holographic ? undefined : color}
				/>
			{/if}
		{:else if style === 'double'}
			<!-- Double line -->
			{#if !hasIcon}
				<rect
					x={0}
					y={cy - thickness * 1.5}
					width={width}
					height={thickness}
					rx={thickness / 2}
					fill={holographic ? undefined : color}
				/>
				<rect
					x={0}
					y={cy + thickness * 0.5}
					width={width}
					height={thickness}
					rx={thickness / 2}
					fill={holographic ? undefined : color}
				/>
			{:else}
				<!-- Left segments -->
				<rect x={0} y={cy - thickness * 1.5} width={leftLineEnd} height={thickness} rx={thickness / 2} fill={holographic ? undefined : color} />
				<rect x={0} y={cy + thickness * 0.5} width={leftLineEnd} height={thickness} rx={thickness / 2} fill={holographic ? undefined : color} />
				<!-- Right segments -->
				<rect x={rightLineStart} y={cy - thickness * 1.5} width={width - rightLineStart} height={thickness} rx={thickness / 2} fill={holographic ? undefined : color} />
				<rect x={rightLineStart} y={cy + thickness * 0.5} width={width - rightLineStart} height={thickness} rx={thickness / 2} fill={holographic ? undefined : color} />
			{/if}
		{:else if dashSegments}
			<!-- Dashed or dotted using rect segments -->
			{#each dashSegments as seg (seg.x)}
				<rect
					x={seg.x}
					y={cy - thickness / 2}
					width={seg.width}
					height={thickness}
					rx={style === 'dotted' ? thickness / 2 : 1}
					fill={holographic ? undefined : color}
				/>
			{/each}
		{/if}

		<!-- Center icon -->
		{#if hasIcon && dividerIcon}
			<g transform="translate({cx - iconSize / 2}, {cy - iconSize / 2})">
				<IconRenderer
					body={dividerIcon.body}
					width={dividerIcon.width ?? 24}
					height={dividerIcon.height ?? 24}
					containerWidth={iconSize}
					containerHeight={iconSize}
					fill={iconFill}
					stroke={iconStroke}
					strokeWidth={iconStrokeWidth}
					transform={iconTransform}
					{holographic}
				/>
			</g>
		{/if}
	</g>
</ComponentWrapper>
