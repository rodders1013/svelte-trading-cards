<script lang="ts" module>
	import { z } from 'zod';
	import { AnimationConfigSchema } from '$lib/styling/animations/types.js';
	import { EffectConfigSchema } from '$lib/styling/effects/types.js';
	import { BlendMode } from '$lib/styling/blend/types.js';
	import { HolographicConfigSchema } from '$lib/styling/HolographicWrapper.svelte';
	import { IconDataSchema } from '$lib/card/icons/Icon.svelte';

	export const DividerStyleSchema = z.enum(['solid', 'dashed', 'dotted', 'gradient', 'double']);
	export type DividerStyle = z.infer<typeof DividerStyleSchema>;

	export const DividerFadeSchema = z.enum(['none', 'left', 'right', 'both']);
	export type DividerFade = z.infer<typeof DividerFadeSchema>;

	// Preset ornament icons from icon sets
	export const DividerOrnamentPresetSchema = z.enum([
		'none',
		'diamond',
		'star',
		'circle',
		'square',
		'heart',
		'flower',
		'custom'
	]);
	export type DividerOrnamentPreset = z.infer<typeof DividerOrnamentPresetSchema>;

	// Pre-loaded icon data for ornament presets
	export const ORNAMENT_PRESET_ICONS: Record<
		Exclude<DividerOrnamentPreset, 'none' | 'custom'>,
		{ body: string; width: number; height: number }
	> = {
		diamond: {
			body: '<path d="M12 2L2 12l10 10l10-10L12 2z" fill="currentColor"/>',
			width: 24,
			height: 24
		},
		star: {
			body: '<path d="M12 2l2.4 7.4H22l-6 4.6l2.3 7L12 16.4L5.7 21l2.3-7l-6-4.6h7.6L12 2z" fill="currentColor"/>',
			width: 24,
			height: 24
		},
		circle: {
			body: '<circle cx="12" cy="12" r="10" fill="currentColor"/>',
			width: 24,
			height: 24
		},
		square: {
			body: '<rect x="3" y="3" width="18" height="18" rx="2" fill="currentColor"/>',
			width: 24,
			height: 24
		},
		heart: {
			body: '<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="currentColor"/>',
			width: 24,
			height: 24
		},
		flower: {
			body: '<path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm0-18C8.1 4 5 7.1 5 11c0 2.4 1.2 4.5 3 5.7V18c0 .6.4 1 1 1h6c.6 0 1-.4 1-1v-1.3c1.8-1.3 3-3.4 3-5.7c0-3.9-3.1-7-7-7zm2.9 10.5l-.9.6V17H10v-1.9l-.9-.6C7.8 13.6 7 12.4 7 11c0-2.8 2.2-5 5-5s5 2.2 5 5c0 1.4-.8 2.6-2.1 3.5z" fill="currentColor"/>',
			width: 24,
			height: 24
		}
	};

	// Labels for preset ornaments
	export const ORNAMENT_PRESET_LABELS: Record<DividerOrnamentPreset, string> = {
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
		// Ornament - preset or custom icon
		ornamentPreset: DividerOrnamentPresetSchema.default('none'),
		customOrnament: IconDataSchema.optional(),
		customOrnamentName: z.string().optional(),
		ornamentSize: z.number().default(16),
		ornamentColor: z.string().optional(),
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
	import { sanitizeSvgBody } from '$lib/card/icons/Icon.svelte';

	let {
		style = 'solid',
		color = '#ffffff',
		secondaryColor,
		thickness = 2,
		fade = 'none',
		ornamentPreset = 'none',
		customOrnament,
		customOrnamentName,
		ornamentSize = 16,
		ornamentColor,
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

	// Get the active ornament icon data
	const ornamentIcon = $derived.by(() => {
		if (ornamentPreset === 'custom' && customOrnament) {
			return customOrnament;
		}
		if (ornamentPreset !== 'none' && ornamentPreset !== 'custom') {
			return ORNAMENT_PRESET_ICONS[ornamentPreset];
		}
		return null;
	});

	const hasOrnament = $derived(ornamentPreset !== 'none' && ornamentIcon !== null);

	// Ornament takes space in the middle
	const ornamentSpace = $derived(hasOrnament ? ornamentSize + 8 : 0);
	const leftLineEnd = $derived(cx - ornamentSpace / 2);
	const rightLineStart = $derived(cx + ornamentSpace / 2);

	// Get ornament fill color
	const ornFill = $derived(ornamentColor ?? color);

	// When holographic, use 'inherit' for fill colors
	const effectiveFill = $derived(holographic ? 'inherit' : color);
	const effectiveOrnFill = $derived(holographic ? 'inherit' : ornFill);

	// Sanitize and strip fill from ornament icon body when holographic
	const sanitizedOrnamentBody = $derived(ornamentIcon?.body ? sanitizeSvgBody(ornamentIcon.body) : '');
	const strippedOrnamentBody = $derived(
		sanitizedOrnamentBody
			.replace(/fill="[^"]*"/gi, '')
			.replace(/fill='[^']*'/gi, '')
	);
	const effectiveOrnamentBody = $derived(holographic ? strippedOrnamentBody : sanitizedOrnamentBody);
	// Don't set color style when holographic - let fill inherit from gradient
	const effectiveOrnStyle = $derived(holographic ? '' : `color: ${ornFill}`);

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
			{#if !hasOrnament}
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
			{#if !hasOrnament}
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

		<!-- Ornament icon -->
		{#if hasOrnament && ornamentIcon}
			{@const iconW = ornamentIcon.width ?? 24}
			{@const iconH = ornamentIcon.height ?? 24}
			{@const scale = ornamentSize / Math.max(iconW, iconH)}
			{@const offsetX = cx - (iconW * scale) / 2}
			{@const offsetY = cy - (iconH * scale) / 2}
			<g
				transform="translate({offsetX}, {offsetY}) scale({scale})"
				fill={holographic ? undefined : ornFill}
				style={effectiveOrnStyle}
			>
				{@html effectiveOrnamentBody}
			</g>
		{/if}
	</g>
</ComponentWrapper>
