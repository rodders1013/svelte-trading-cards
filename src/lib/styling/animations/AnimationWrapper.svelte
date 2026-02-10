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

	// Unique ID for SVG defs in this wrapper instance
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
		} else if (animation.type === 'glint') {
			duration = duration * 2.5;
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

		if (animation.type === 'trace') {
			const segmentPct = Math.min(30, Math.max(1, animation.traceSegmentPct ?? 4));
			const segmentPx = Math.max(3, Math.round(segmentPct * 1.5));
			const count = Math.max(1, animation.traceCount ?? 1);
			let gapPx = Math.max(6, Math.round(segmentPx * 6));
			let dashArray = `${segmentPx} ${gapPx}`;

			if (animation.type === 'trace' && animation.traceMode === 'multi-ball') {
				const effectiveCount = Math.min(8, Math.max(2, count));
				gapPx = Math.max(3, Math.round(segmentPx * (8 / effectiveCount)));
				dashArray = `${segmentPx} ${gapPx}`;
			}

			if (animation.type === 'trace' && animation.traceMode === 'line') {
				const lineSegment = Math.max(segmentPx * 4, 12);
				gapPx = Math.max(6, Math.round(lineSegment * 0.6));
				dashArray = `${lineSegment} ${gapPx}`;
			}

			if (animation.type === 'trace' && animation.traceMode === 'reveal') {
				dashArray = `5000 5000`;
			}

			vars.push(`--tc-trace-dasharray: ${dashArray}`);
			vars.push('--tc-trace-offset: 5000');
			vars.push(`--tc-trace-linecap: round`);
			if (animation.traceSize !== undefined) {
				vars.push(`--tc-trace-width: ${animation.traceSize}`);
			}
			vars.push(`--tc-trace-opacity: ${animation.traceOpacity ?? 1}`);
			vars.push(`--tc-trace-color: ${animation.traceColor ?? 'currentColor'}`);
			vars.push(`--tc-trace-glow-color: ${animation.traceGlowColor ?? animation.traceColor ?? 'currentColor'}`);
		}

		if (animation.type === 'glint') {
			if (animation.glintSize !== undefined) {
				vars.push(`--tc-glint-width: ${animation.glintSize}`);
			}
			vars.push(`--tc-glint-opacity: ${animation.glintOpacity ?? 0.9}`);
			vars.push(`--tc-glint-color: ${animation.glintColor ?? '#ffffff'}`);
			vars.push(`--tc-glint-glow-color: ${animation.glintGlowColor ?? animation.glintColor ?? '#ffffff'}`);
		}

		// Add transform-origin
		vars.push(`transform-origin: ${effectiveOrigin}`);

		return vars.join('; ');
	});

	const isAnimated = $derived(animation && animation.type !== 'none');
	const traceGlow = $derived(animation?.type === 'trace' ? animation.traceGlow ?? 3 : 3);
	const glintGlow = $derived(animation?.type === 'glint' ? animation.glintGlow ?? 2 : 2);
	const glintBandWidth = $derived.by(() => {
		if (animation?.type !== 'glint') return 0.12;
		return Math.min(40, Math.max(2, animation.glintBandPct ?? 12)) / 100;
	});
	const glintDuration = $derived.by(() => {
		if (animation?.type !== 'glint') return 3.75;
		return animation.duration * 2.5;
	});
	const glintSweepValues = $derived.by(() => {
		if (animation?.type !== 'glint' || animation.direction !== 'counterclockwise') {
			return '-1.2;2.2';
		}
		return '2.2;-1.2';
	});
	const glintRepeatCount = $derived.by((): string => {
		if (animation?.type !== 'glint') return 'indefinite';
		if (animation.paused) return '1';
		if (animation.iterationCount === 'infinite') return 'indefinite';
		return String(animation.iterationCount);
	});
	const isTraceAnimated = $derived(isAnimated && animation?.type === 'trace');
	const isGlintAnimated = $derived(isAnimated && animation?.type === 'glint');

</script>

<!--
	AnimationWrapper applies animation classes and CSS variables to child content.
	The actual keyframes and animation classes are injected into the SVG by CardCanvas.
	This ensures animations work when the library is used in any context.

	Trace and glint are special: both render base content plus a dedicated overlay pass.
-->
{#if isTraceAnimated}
	<!-- Trace: render solid content first, then larger traced version with glow -->
	<defs>
		<filter id="trace-glow-{uid}" x="-50%" y="-50%" width="200%" height="200%">
			<feGaussianBlur stdDeviation={traceGlow} result="blur" />
			<feFlood flood-color="var(--tc-trace-glow-color, currentColor)" result="glowColor" />
			<feComposite in="glowColor" in2="blur" operator="in" result="glow" />
			<feMerge>
				<feMergeNode in="glow" />
				<feMergeNode in="glow" />
				<feMergeNode in="SourceGraphic" />
			</feMerge>
		</filter>
	</defs>
	<g>
		{@render children()}
	</g>
	<g
		class="{animationClass}"
		style="{styleVars}; fill: none;"
		filter="url(#trace-glow-{uid})"
	>
		{@render children()}
	</g>
{:else if isGlintAnimated}
	<!-- Glint: render solid content first, then a masked highlight sweep -->
	<defs>
		<filter id="glint-glow-{uid}" x="-50%" y="-50%" width="200%" height="200%">
			<feGaussianBlur stdDeviation={glintGlow} result="blur" />
			<feFlood flood-color="var(--tc-glint-glow-color, #ffffff)" result="glowColor" />
			<feComposite in="glowColor" in2="blur" operator="in" result="glow" />
			<feMerge>
				<feMergeNode in="glow" />
				<feMergeNode in="SourceGraphic" />
			</feMerge>
		</filter>
		<mask id="glint-mask-{uid}" maskContentUnits="objectBoundingBox">
			<rect x="0" y="0" width="1" height="1" fill="black" />
			<rect
				x="-1.2"
				y="-0.5"
				width={glintBandWidth}
				height="2"
				fill="white"
				transform="rotate(-20 0.5 0.5)"
			>
				<animate
					attributeName="x"
					values={glintSweepValues}
					dur={`${glintDuration}s`}
					begin={`${animation?.delay ?? 0}s`}
					repeatCount={glintRepeatCount}
				/>
			</rect>
		</mask>
	</defs>
	<g>
		{@render children()}
	</g>
	<g
		mask="url(#glint-mask-{uid})"
		filter="url(#glint-glow-{uid})"
		style="{styleVars}; fill: var(--tc-glint-color, #ffffff); stroke: var(--tc-glint-color, #ffffff); stroke-width: var(--tc-glint-width, inherit); opacity: var(--tc-glint-opacity, 0.9);"
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
