<script lang="ts" module>
	import { z } from 'zod';
	import { AnimationConfigSchema } from './types.js';

	export const AnimationWrapperPropsSchema = z.object({
		animation: AnimationConfigSchema.optional(),
		// Transform origin for animations (CSS value like 'center', '50% 50%', etc.)
		transformOrigin: z.string().optional()
	});

	export type AnimationWrapperProps = z.infer<typeof AnimationWrapperPropsSchema>;
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { SPEED_DURATIONS } from './types.js';
	import { getAnimationName } from './presets.js';

	let {
		animation,
		transformOrigin,
		children
	}: AnimationWrapperProps & {
		children: Snippet;
	} = $props();

	// Get animation class name based on type and direction
	const animationClass = $derived.by(() => {
		if (!animation || animation.type === 'none') return '';
		return getAnimationName(animation.type, animation.direction);
	});

	// Generate CSS custom properties for animation configuration
	const styleVars = $derived.by(() => {
		if (!animation || animation.type === 'none') return '';

		const duration = SPEED_DURATIONS[animation.speed];
		const vars: string[] = [
			`--tc-duration: ${duration}s`,
			`--tc-easing: ${animation.easing}`,
			`--tc-delay: ${animation.delay}s`,
			`--tc-iterations: ${animation.iterationCount}`,
			`--tc-play-state: ${animation.paused ? 'paused' : 'running'}`,
			// SVG transform properties - must be inline for proper control
			'transform-box: fill-box'
		];

		// Add transform-origin (use explicit coordinates or default to center)
		vars.push(`transform-origin: ${transformOrigin || 'center'}`);

		return vars.join('; ');
	});

	const isAnimated = $derived(animation && animation.type !== 'none');
</script>

<!--
	AnimationWrapper applies animation classes and CSS variables to child content.
	The actual keyframes and animation classes are injected into the SVG by CardCanvas.
	This ensures animations work when the library is used in any context.
-->
{#if isAnimated}
	<g class="tc-animated {animationClass}" style={styleVars}>
		{@render children()}
	</g>
{:else}
	{@render children()}
{/if}
