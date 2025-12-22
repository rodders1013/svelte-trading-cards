<script lang="ts" module>
	import { z } from 'zod';
	import { EffectConfigSchema } from './types.js';
	import { BlendMode } from '../blend/types.js';

	export const EffectWrapperPropsSchema = z.object({
		effect: EffectConfigSchema.optional(),
		blendMode: BlendMode.optional(),
		// Transform origin for animations (CSS value like 'center', '50% 50%', etc.)
		transformOrigin: z.string().optional()
	});

	export type EffectWrapperProps = z.infer<typeof EffectWrapperPropsSchema>;
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { LIFT_ELEVATIONS } from './types.js';

	let {
		effect,
		blendMode,
		transformOrigin,
		children
	}: EffectWrapperProps & {
		children: Snippet;
	} = $props();

	// Generate unique ID for this filter instance
	const uid = Math.random().toString(36).substring(2, 9);
	const filterId = $derived(effect ? `effect-${effect.type}-${uid}` : '');

	// Get animation class if effect is animated
	const animationClass = $derived.by(() => {
		if (!effect || !effect.animated) return '';
		// Use the fade animation for pulsing effects
		return 'tc-fade';
	});

	// Generate CSS custom properties for animation
	const styleVars = $derived.by(() => {
		if (!effect || !effect.animated) return '';

		const duration = effect.animationDuration;
		const vars: string[] = [
			`--tc-duration: ${duration}s`,
			`--tc-easing: ease-in-out`,
			`--tc-delay: 0s`,
			`--tc-iterations: infinite`,
			`--tc-play-state: running`,
			'transform-box: fill-box'
		];

		if (transformOrigin) {
			vars.push(`transform-origin: ${transformOrigin}`);
		}

		return vars.join('; ');
	});

	const isAnimated = $derived(effect && effect.animated);
	const hasEffect = $derived(effect !== undefined);
	const hasBlend = $derived(blendMode !== undefined && blendMode !== 'normal');

	// Generate blend mode style
	const blendStyle = $derived(hasBlend ? `mix-blend-mode: ${blendMode}` : '');

	// Helper to get lift shadow values
	function getLiftValues(elevation: 'sm' | 'md' | 'lg' | 'xl') {
		return LIFT_ELEVATIONS[elevation];
	}
</script>

<!--
	EffectWrapper applies SVG filter effects to child content.
	Filters are defined inline with unique IDs to avoid collisions.
	Animations use the existing animation system CSS classes.
-->

{#snippet effectContent()}
	{#if hasEffect && effect}
		<!-- Define the filter -->
		<defs>
			{#if effect.type === 'glow'}
				<filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
					<!-- Blur the alpha channel to create glow shape -->
					<feGaussianBlur in="SourceAlpha" stdDeviation={effect.blur} result="blur" />
					<!-- Create the glow color -->
					<feFlood flood-color={effect.color} flood-opacity={effect.intensity} result="color" />
					<!-- Apply color to the blurred shape -->
					<feComposite in="color" in2="blur" operator="in" result="glow" />
					<!-- Merge glow behind source -->
					<feMerge>
						<feMergeNode in="glow" />
						<feMergeNode in="SourceGraphic" />
					</feMerge>
				</filter>
			{:else if effect.type === 'strokeGlow'}
				<!-- Stroke glow: Gaussian blur applied to the entire element, great for borders/strokes -->
				<filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
					<feGaussianBlur in="SourceGraphic" stdDeviation={effect.blur} result="blur" />
					{#if effect.color}
						<!-- If custom color specified, colorize the blur -->
						<feFlood flood-color={effect.color} flood-opacity={effect.intensity} result="color" />
						<feComposite in="color" in2="blur" operator="in" result="coloredBlur" />
						<feComposite in="coloredBlur" in2="SourceGraphic" operator="over" />
					{:else}
						<!-- No color: just blur with intensity via opacity -->
						<feComposite in="blur" in2="SourceGraphic" operator="over" result="combined" />
						<feComponentTransfer in="combined">
							<feFuncA type="linear" slope={1 + effect.intensity} />
						</feComponentTransfer>
					{/if}
				</filter>
			{:else if effect.type === 'shadow'}
				<filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
					<feDropShadow
						dx={effect.offsetX}
						dy={effect.offsetY}
						stdDeviation={effect.blur}
						flood-color={effect.color}
						flood-opacity="1"
					/>
				</filter>
			{:else if effect.type === 'neon'}
				<!-- Neon: Colorizes element and adds intense multi-layer glow -->
				<filter id={filterId} x="-100%" y="-100%" width="300%" height="300%">
					<!-- Colorize the source element to neon color (bright white core) -->
					<feFlood flood-color="#ffffff" result="white" />
					<feComposite in="white" in2="SourceAlpha" operator="in" result="whiteFill" />

					<!-- Outer glow (largest, most diffuse) -->
					<feGaussianBlur in="SourceAlpha" stdDeviation={20 * effect.spread} result="blur1" />
					<feFlood flood-color={effect.color} flood-opacity={effect.intensity * 0.5} result="color1" />
					<feComposite in="color1" in2="blur1" operator="in" result="glow1" />

					<!-- Middle glow -->
					<feGaussianBlur in="SourceAlpha" stdDeviation={8 * effect.spread} result="blur2" />
					<feFlood flood-color={effect.color} flood-opacity={effect.intensity * 0.8} result="color2" />
					<feComposite in="color2" in2="blur2" operator="in" result="glow2" />

					<!-- Inner glow (tightest, brightest) -->
					<feGaussianBlur in="SourceAlpha" stdDeviation={2 * effect.spread} result="blur3" />
					<feFlood flood-color={effect.color} flood-opacity={effect.intensity} result="color3" />
					<feComposite in="color3" in2="blur3" operator="in" result="glow3" />

					<!-- Tight core glow for that hot center -->
					<feGaussianBlur in="SourceAlpha" stdDeviation={1 * effect.spread} result="blur4" />
					<feFlood flood-color="#ffffff" flood-opacity={effect.intensity * 0.9} result="color4" />
					<feComposite in="color4" in2="blur4" operator="in" result="glow4" />

					<feMerge>
						<feMergeNode in="glow1" />
						<feMergeNode in="glow2" />
						<feMergeNode in="glow3" />
						<feMergeNode in="glow4" />
						<feMergeNode in="whiteFill" />
					</feMerge>
				</filter>
			{:else if effect.type === 'innerGlow'}
				<filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
					<!-- Create inner glow by blurring the inverse -->
					<feComponentTransfer in="SourceAlpha" result="inverse">
						<feFuncA type="table" tableValues="1 0" />
					</feComponentTransfer>
					<feGaussianBlur in="inverse" stdDeviation={effect.blur} result="blur" />
					<feFlood flood-color={effect.color} flood-opacity={effect.intensity} result="color" />
					<feComposite in="color" in2="blur" operator="in" result="innerGlow" />
					<feComposite in="innerGlow" in2="SourceAlpha" operator="in" result="clipped" />
					<feMerge>
						<feMergeNode in="SourceGraphic" />
						<feMergeNode in="clipped" />
					</feMerge>
				</filter>
			{:else if effect.type === 'lift'}
				{@const lift = getLiftValues(effect.elevation)}
				<filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
					<feDropShadow
						dx="0"
						dy={lift.offsetY}
						stdDeviation={lift.blur}
						flood-color="black"
						flood-opacity={lift.opacity}
					/>
				</filter>
			{:else if effect.type === 'outline'}
				<filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
					<!-- Dilate to create outline -->
					<feMorphology in="SourceAlpha" operator="dilate" radius={effect.width} result="dilated" />
					<feFlood flood-color={effect.color} result="color" />
					<feComposite in="color" in2="dilated" operator="in" result="outline" />
					<feMerge>
						<feMergeNode in="outline" />
						<feMergeNode in="SourceGraphic" />
					</feMerge>
				</filter>
			{/if}
		</defs>

		<!-- Apply filter and optional animation -->
		{#if isAnimated}
			<g
				class="tc-animated {animationClass}"
				style={styleVars}
				filter="url(#{filterId})"
			>
				{@render children()}
			</g>
		{:else}
			<g filter="url(#{filterId})">
				{@render children()}
			</g>
		{/if}
	{:else}
		<!-- No effect, just render children -->
		{@render children()}
	{/if}
{/snippet}

<!-- Outer wrapper for blend mode (wraps everything including effects) -->
{#if hasBlend}
	<g style={blendStyle}>
		{@render effectContent()}
	</g>
{:else}
	{@render effectContent()}
{/if}
