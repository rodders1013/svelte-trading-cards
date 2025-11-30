<script lang="ts" module>
	import { z } from 'zod';
	import { AnimationConfigSchema } from '$lib/animations/types.js';
	import { EffectConfigSchema } from '$lib/effects/types.js';
	import { IconDataSchema } from '$lib/components/icons/Icon.svelte';

	export const BadgeShapeSchema = z.enum(['pill', 'square', 'diamond', 'hexagon', 'shield', 'star', 'circle']);
	export type BadgeShape = z.infer<typeof BadgeShapeSchema>;

	export const BadgePresetSchema = z.enum([
		// Rarity presets
		'common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic',
		// Status presets
		'verified', 'new', 'sold', 'limited', 'promo', 'exclusive',
		// Custom (no preset styling)
		'custom'
	]);
	export type BadgePreset = z.infer<typeof BadgePresetSchema>;

	export const BadgeSizeSchema = z.enum(['sm', 'md', 'lg']);
	export type BadgeSize = z.infer<typeof BadgeSizeSchema>;

	// Predefined text options - no free text allowed
	export const BadgeTextPresetSchema = z.enum([
		// Rarity labels
		'COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY', 'MYTHIC',
		// Status labels
		'NEW', 'HOT', 'SOLD', 'LIMITED', 'PROMO', 'EXCLUSIVE', 'VERIFIED',
		// Edition labels
		'1ST EDITION', 'SPECIAL', 'COLLECTOR', 'PREMIUM', 'ULTRA',
		// Empty (icon only or data field)
		'none'
	]);
	export type BadgeTextPreset = z.infer<typeof BadgeTextPresetSchema>;

	export const BadgePropsSchema = z.object({
		// Text from preset or data field only - no free text
		textPreset: BadgeTextPresetSchema.default('none'),
		dataField: z.string().optional(),
		shape: BadgeShapeSchema.default('pill'),
		preset: BadgePresetSchema.default('custom'),
		backgroundColor: z.string().default('#3b82f6'),
		textColor: z.string().default('#ffffff'),
		borderColor: z.string().optional(),
		borderWidth: z.number().default(0),
		size: BadgeSizeSchema.default('md'),
		fontFamily: z.string().default('Arial, sans-serif'),
		fontWeight: z.string().default('bold'),
		icon: IconDataSchema.optional(),
		iconColor: z.string().optional(),
		opacity: z.number().min(0).max(1).default(1),
		animation: AnimationConfigSchema.optional(),
		effect: EffectConfigSchema.optional()
	});

	export type BadgeProps = z.infer<typeof BadgePropsSchema>;

	// Preset color configurations
	export const BADGE_PRESETS: Record<BadgePreset, { bg: string; text: string; border?: string }> = {
		// Rarity
		common: { bg: '#6b7280', text: '#ffffff' },
		uncommon: { bg: '#22c55e', text: '#ffffff' },
		rare: { bg: '#3b82f6', text: '#ffffff' },
		epic: { bg: '#a855f7', text: '#ffffff' },
		legendary: { bg: '#f59e0b', text: '#000000', border: '#fbbf24' },
		mythic: { bg: '#ec4899', text: '#ffffff', border: '#f472b6' },
		// Status
		verified: { bg: '#3b82f6', text: '#ffffff' },
		new: { bg: '#22c55e', text: '#ffffff' },
		sold: { bg: '#ef4444', text: '#ffffff' },
		limited: { bg: '#f59e0b', text: '#000000' },
		promo: { bg: '#8b5cf6', text: '#ffffff' },
		exclusive: { bg: '#0f172a', text: '#fbbf24', border: '#fbbf24' },
		// Custom uses provided colors
		custom: { bg: '#3b82f6', text: '#ffffff' }
	};
</script>

<script lang="ts">
	import type { ContainerContext, CardData } from '$lib/types';
	import { AnimationWrapper } from '$lib/animations/index.js';
	import { EffectWrapper } from '$lib/effects/index.js';

	let {
		textPreset = 'none',
		dataField,
		shape = 'pill',
		preset = 'custom',
		backgroundColor = '#3b82f6',
		textColor = '#ffffff',
		borderColor,
		borderWidth = 0,
		size = 'md',
		fontFamily = 'Arial, sans-serif',
		fontWeight = 'bold',
		icon,
		iconColor,
		opacity = 1,
		animation,
		effect,
		container,
		data
	}: BadgeProps & {
		container: ContainerContext;
		data?: CardData;
	} = $props();

	// Text from data field (trusted) or preset only - no free text
	const resolvedText = $derived.by(() => {
		// Data field takes priority (trusted source)
		if (dataField && data && data[dataField] !== undefined) {
			return String(data[dataField]);
		}
		// Otherwise use preset text
		return textPreset === 'none' ? '' : textPreset;
	});

	// Get colors from preset or custom
	const colors = $derived.by(() => {
		if (preset !== 'custom') {
			return BADGE_PRESETS[preset];
		}
		return { bg: backgroundColor, text: textColor, border: borderColor };
	});

	const bgColor = $derived(preset === 'custom' ? backgroundColor : colors.bg);
	const txtColor = $derived(preset === 'custom' ? textColor : colors.text);
	const bdrColor = $derived(borderColor ?? colors.border);
	const bdrWidth = $derived(bdrColor ? (borderWidth || 2) : 0);

	// Size configurations
	const sizeConfig = $derived.by(() => {
		const configs = {
			sm: { fontSize: 10, padding: 4, iconSize: 12 },
			md: { fontSize: 14, padding: 6, iconSize: 16 },
			lg: { fontSize: 18, padding: 8, iconSize: 20 }
		};
		return configs[size];
	});

	// Calculate dimensions based on container
	const width = $derived(container.width);
	const height = $derived(container.height);
	const cx = $derived(width / 2);
	const cy = $derived(height / 2);

	// Generate shape path
	const shapePath = $derived.by(() => {
		const w = width - bdrWidth;
		const h = height - bdrWidth;
		const offset = bdrWidth / 2;
		const rx = w / 2;
		const ry = h / 2;

		switch (shape) {
			case 'pill':
				return { type: 'rect' as const, x: offset, y: offset, width: w, height: h, rx: h / 2 };
			case 'square':
				return { type: 'rect' as const, x: offset, y: offset, width: w, height: h, rx: 4 };
			case 'circle':
				return { type: 'circle' as const, cx, cy, r: Math.min(rx, ry) - offset };
			case 'diamond': {
				const points = [
					`${cx},${offset}`,
					`${width - offset},${cy}`,
					`${cx},${height - offset}`,
					`${offset},${cy}`
				].join(' ');
				return { type: 'polygon' as const, points };
			}
			case 'hexagon': {
				const points = [];
				for (let i = 0; i < 6; i++) {
					const angle = (Math.PI / 3) * i - Math.PI / 2;
					const px = cx + (rx - offset) * Math.cos(angle);
					const py = cy + (ry - offset) * Math.sin(angle);
					points.push(`${px},${py}`);
				}
				return { type: 'polygon' as const, points: points.join(' ') };
			}
			case 'shield': {
				const path = `M ${offset + w * 0.1},${offset}
					L ${width - offset - w * 0.1},${offset}
					Q ${width - offset},${offset} ${width - offset},${offset + h * 0.15}
					L ${width - offset},${offset + h * 0.5}
					Q ${width - offset},${offset + h * 0.7} ${cx},${height - offset}
					Q ${offset},${offset + h * 0.7} ${offset},${offset + h * 0.5}
					L ${offset},${offset + h * 0.15}
					Q ${offset},${offset} ${offset + w * 0.1},${offset} Z`;
				return { type: 'path' as const, d: path };
			}
			case 'star': {
				const outerR = Math.min(rx, ry) - offset;
				const innerR = outerR * 0.4;
				const points = [];
				for (let i = 0; i < 10; i++) {
					const angle = (Math.PI / 5) * i - Math.PI / 2;
					const r = i % 2 === 0 ? outerR : innerR;
					const px = cx + r * Math.cos(angle);
					const py = cy + r * Math.sin(angle);
					points.push(`${px},${py}`);
				}
				return { type: 'polygon' as const, points: points.join(' ') };
			}
			default:
				return { type: 'rect' as const, x: offset, y: offset, width: w, height: h, rx: h / 2 };
		}
	});

	// Icon positioning
	const hasIcon = $derived(icon?.body);
	const iconSize = $derived(sizeConfig.iconSize);
	const textOffset = $derived(hasIcon ? iconSize + 4 : 0);
</script>

<EffectWrapper {effect} transformOrigin="{cx}px {cy}px">
	<AnimationWrapper {animation} transformOrigin="{cx}px {cy}px">
		<g opacity={opacity}>
			<!-- Background shape -->
			{#if shapePath.type === 'rect'}
				<rect
					x={shapePath.x}
					y={shapePath.y}
					width={shapePath.width}
					height={shapePath.height}
					rx={shapePath.rx}
					fill={bgColor}
					stroke={bdrColor}
					stroke-width={bdrWidth}
				/>
			{:else if shapePath.type === 'circle'}
				<circle
					cx={shapePath.cx}
					cy={shapePath.cy}
					r={shapePath.r}
					fill={bgColor}
					stroke={bdrColor}
					stroke-width={bdrWidth}
				/>
			{:else if shapePath.type === 'polygon'}
				<polygon
					points={shapePath.points}
					fill={bgColor}
					stroke={bdrColor}
					stroke-width={bdrWidth}
				/>
			{:else if shapePath.type === 'path'}
				<path
					d={shapePath.d}
					fill={bgColor}
					stroke={bdrColor}
					stroke-width={bdrWidth}
				/>
			{/if}

			<!-- Icon (if provided) -->
			{#if hasIcon && icon}
				<svg
					x={cx - (textOffset + iconSize) / 2}
					y={cy - iconSize / 2}
					width={iconSize}
					height={iconSize}
					viewBox="0 0 {icon.width ?? 24} {icon.height ?? 24}"
					fill="none"
				>
					<g fill={iconColor ?? txtColor} style="color: {iconColor ?? txtColor}">
						{@html icon.body}
					</g>
				</svg>
			{/if}

			<!-- Text -->
			{#if resolvedText}
				<text
					x={cx + (hasIcon ? textOffset / 2 : 0)}
					y={cy}
					text-anchor="middle"
					dominant-baseline="central"
					font-family={fontFamily}
					font-weight={fontWeight}
					font-size={sizeConfig.fontSize}
					fill={txtColor}
				>
					{resolvedText}
				</text>
			{/if}
		</g>
	</AnimationWrapper>
</EffectWrapper>
