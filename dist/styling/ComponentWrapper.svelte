<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { UniversalModifiers } from '../types/modifiers';
	import type { ContainerContext } from '../types';
	import EffectWrapper from './effects/EffectWrapper.svelte';
	import AnimationWrapper from './animations/AnimationWrapper.svelte';
	import FilterWrapper from './filters/FilterWrapper.svelte';
	import ClipWrapper from './ClipWrapper.svelte';
	import BorderRenderer from './BorderRenderer.svelte';
	import HolographicWrapper from './HolographicWrapper.svelte';

	let {
		container,
		modifiers = {},
		children
	}: {
		container: ContainerContext;
		modifiers?: UniversalModifiers;
		children: Snippet;
	} = $props();

	// Destructure modifiers with defaults
	const { effect, animation, blendMode, clip, border, filter, holographic } = $derived(modifiers);

	// Calculate transform origin for animations/effects
	const transformOrigin = $derived(`${container.width / 2}px ${container.height / 2}px`);

	// Check if we have any active modifiers
	const hasEffect = $derived(!!effect);
	const hasAnimation = $derived(animation && animation.type !== 'none');
	const hasBlend = $derived(blendMode && blendMode !== 'normal');
	const hasClip = $derived(!!clip);
	const hasBorder = $derived(!!border);
	const hasFilter = $derived(!!filter);
	const hasHolographic = $derived(!!holographic);

	// Check if we need any wrapper at all
	const needsWrapper = $derived(
		hasEffect || hasAnimation || hasBlend || hasClip || hasBorder || hasFilter || hasHolographic
	);
</script>

<!--
	ComponentWrapper is the unified modifier wrapper for all card components.

	It composes the following wrappers in order (outermost to innermost):
	1. EffectWrapper - Visual effects (glow, shadow, neon) + blend mode
	2. AnimationWrapper - Animations (pulse, float, spin)
	3. FilterWrapper - CSS filters (brightness, contrast)
	4. ClipWrapper - Clip to shape
	5. HolographicWrapper - Animated color-shifting effect
	6. Children content
	7. BorderRenderer - Border that follows clip shape (rendered after content)

	This eliminates the need to manually nest these wrappers in every component.
-->

{#snippet content()}
	{@render children()}
	{#if hasBorder && border}
		<BorderRenderer
			{border}
			shape={clip}
			width={container.width}
			height={container.height}
			radius={container.radius}
		/>
	{/if}
{/snippet}

{#if needsWrapper}
	<EffectWrapper {effect} {blendMode} {transformOrigin}>
		<AnimationWrapper {animation} {transformOrigin}>
			<FilterWrapper {filter}>
				<ClipWrapper shape={clip} width={container.width} height={container.height}>
					{#if hasHolographic && holographic}
						<HolographicWrapper {...holographic}>
							{@render content()}
						</HolographicWrapper>
					{:else}
						{@render content()}
					{/if}
				</ClipWrapper>
			</FilterWrapper>
		</AnimationWrapper>
	</EffectWrapper>
{:else}
	{@render children()}
{/if}
