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
	import type { AnimationOrigin } from './types.js';
	import { getAnimationName } from './presets.js';

	let {
		animation,
		transformOrigin,
		children
	}: AnimationWrapperProps & {
		children: Snippet;
	} = $props();

	// Unique ID for trace filter
	const uid = Math.random().toString(36).substring(2, 9);

	// Convert AnimationOrigin enum to CSS transform-origin value
	function originToCSS(origin: AnimationOrigin): string {
		const map: Record<AnimationOrigin, string> = {
			'center': 'center',
			'top-left': 'top left',
			'top': 'top center',
			'top-right': 'top right',
			'left': 'center left',
			'right': 'center right',
			'bottom-left': 'bottom left',
			'bottom': 'bottom center',
			'bottom-right': 'bottom right'
		};
		return map[origin] || 'center';
	}

	// Get animation class name based on type, direction, and pattern/style
	const animationClass = $derived.by(() => {
		if (!animation || animation.type === 'none') return '';

		// Handle pulse patterns
		if (animation.type === 'pulse' && animation.pulsePattern && animation.pulsePattern !== 'single') {
			return `tc-pulse-${animation.pulsePattern}`;
		}

		// Handle float styles
		if (animation.type === 'float' && animation.floatStyle && animation.floatStyle !== 'gentle') {
			return `tc-float-${animation.floatStyle}`;
		}

		return getAnimationName(animation.type, animation.direction);
	});

	// Compute the effective transform origin
	// If animation has a non-center origin, use it; otherwise fall back to prop
	const effectiveOrigin = $derived.by(() => {
		if (animation?.origin && animation.origin !== 'center') {
			return originToCSS(animation.origin);
		}
		return transformOrigin || 'center';
	});

	// Generate CSS custom properties for animation configuration
	const styleVars = $derived.by(() => {
		if (!animation || animation.type === 'none') return '';

		let duration = animation.duration;

		// Trace animation needs much longer duration for the neon sign effect
		if (animation.type === 'trace') {
			duration = duration * 6;
		}

		const vars: string[] = [
			`--tc-duration: ${duration}s`,
			`--tc-easing: ${animation.easing}`,
			`--tc-delay: ${animation.delay}s`,
			`--tc-iterations: ${animation.iterationCount}`,
			`--tc-play-state: ${animation.paused ? 'paused' : 'running'}`,
			// SVG transform properties - must be inline for proper control
			'transform-box: fill-box'
		];

		// Add scale for pulse animation
		if (animation.type === 'pulse') {
			vars.push(`--tc-scale: ${animation.scale}`);
		}

		// Add float variables
		if (animation.type === 'float') {
			vars.push(`--tc-float-distance: ${animation.floatDistance}`);
			vars.push(`--tc-float-rotation: ${animation.floatRotation}`);
		}

		// Add transform-origin
		vars.push(`transform-origin: ${effectiveOrigin}`);

		return vars.join('; ');
	});

	const isAnimated = $derived(animation && animation.type !== 'none');
</script>

<!--
	AnimationWrapper applies animation classes and CSS variables to child content.
	The actual keyframes and animation classes are injected into the SVG by CardCanvas.
	This ensures animations work when the library is used in any context.

	Trace animation is special: it renders the content twice - solid underneath,
	and a slightly larger traced version on top.
-->
{#if isAnimated && animation?.type === 'trace'}
	<!-- Trace: render solid content first, then larger traced version with glow -->
	<defs>
		<filter id="trace-glow-{uid}" x="-50%" y="-50%" width="200%" height="200%">
			<feGaussianBlur stdDeviation="3" result="blur" />
			<feMerge>
				<feMergeNode in="blur" />
				<feMergeNode in="blur" />
				<feMergeNode in="SourceGraphic" />
			</feMerge>
		</filter>
	</defs>
	<g>
		{@render children()}
	</g>
	<g
		class="tc-animated {animationClass}"
		style="{styleVars}; transform: scale(1.05); transform-origin: {effectiveOrigin};"
		filter="url(#trace-glow-{uid})"
	>
		{@render children()}
	</g>
{:else if isAnimated}
	<g class="tc-animated {animationClass}" style={styleVars}>
		{@render children()}
	</g>
{:else}
	{@render children()}
{/if}
