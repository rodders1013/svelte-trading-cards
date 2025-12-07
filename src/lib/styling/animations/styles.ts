/**
 * Animation Styles Generator
 *
 * Generates CSS keyframes and animation classes as a string
 * that can be injected into SVG <defs> or <style> elements.
 *
 * This approach ensures animations work:
 * - When library is installed in other projects
 * - In SVG exports (animations embedded in the SVG)
 * - In gallery/preview contexts
 * - Static in PNG exports (CSS ignored by raster renderers)
 */

/**
 * All animation keyframes as a CSS string
 */
export const ANIMATION_KEYFRAMES = `
/* Spin - continuous rotation */
@keyframes tc-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
@keyframes tc-spin-reverse {
  from { transform: rotate(360deg); }
  to { transform: rotate(0deg); }
}

/* Pulse - scale up and down */
@keyframes tc-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

/* Bounce - vertical movement */
@keyframes tc-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10%); }
}

/* Shake - horizontal shake */
@keyframes tc-shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-2%); }
  20%, 40%, 60%, 80% { transform: translateX(2%); }
}

/* Float - gentle floating motion */
@keyframes tc-float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  25% { transform: translateY(-3%) rotate(1deg); }
  75% { transform: translateY(3%) rotate(-1deg); }
}

/* Glow - pulsing opacity */
@keyframes tc-glow {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

/* Ping - attention-grabbing scale + fade */
@keyframes tc-ping {
  0% { transform: scale(1); opacity: 1; }
  75%, 100% { transform: scale(1.5); opacity: 0; }
}

/* Shimmer - for holographic/metallic effects */
@keyframes tc-shimmer {
  0% { filter: hue-rotate(0deg); }
  100% { filter: hue-rotate(360deg); }
}

/* Glow Pulse - for glowing borders/elements */
@keyframes tc-glow-pulse {
  0%, 100% { opacity: var(--tc-glow-intensity, 0.5); }
  50% { opacity: calc(var(--tc-glow-intensity, 0.5) * 0.3); }
}

/* Trace - neon sign drawing effect with multiple segments */
@keyframes tc-trace {
  0% { stroke-dashoffset: 0; }
  100% { stroke-dashoffset: 5000; }
}
@keyframes tc-trace-reverse {
  0% { stroke-dashoffset: 5000; }
  100% { stroke-dashoffset: 0; }
}
`;

/**
 * Animation classes that use CSS custom properties for configuration
 */
export const ANIMATION_CLASSES = `
/* Base animation styles */
.tc-animated {
  /* transform-box and transform-origin are set via inline styles for precise control */
}

/* Spin animations */
.tc-spin {
  animation: tc-spin var(--tc-duration, 1.5s) var(--tc-easing, linear) var(--tc-delay, 0s) var(--tc-iterations, infinite) normal both;
  animation-play-state: var(--tc-play-state, running);
}
.tc-spin-reverse {
  animation: tc-spin-reverse var(--tc-duration, 1.5s) var(--tc-easing, linear) var(--tc-delay, 0s) var(--tc-iterations, infinite) normal both;
  animation-play-state: var(--tc-play-state, running);
}

/* Pulse animation */
.tc-pulse {
  animation: tc-pulse var(--tc-duration, 1.5s) var(--tc-easing, ease-in-out) var(--tc-delay, 0s) var(--tc-iterations, infinite) normal both;
  animation-play-state: var(--tc-play-state, running);
}

/* Bounce animation */
.tc-bounce {
  animation: tc-bounce var(--tc-duration, 1.5s) var(--tc-easing, ease-in-out) var(--tc-delay, 0s) var(--tc-iterations, infinite) normal both;
  animation-play-state: var(--tc-play-state, running);
}

/* Shake animation */
.tc-shake {
  animation: tc-shake var(--tc-duration, 1.5s) var(--tc-easing, ease-in-out) var(--tc-delay, 0s) var(--tc-iterations, infinite) normal both;
  animation-play-state: var(--tc-play-state, running);
}

/* Float animation */
.tc-float {
  animation: tc-float var(--tc-duration, 3s) var(--tc-easing, ease-in-out) var(--tc-delay, 0s) var(--tc-iterations, infinite) normal both;
  animation-play-state: var(--tc-play-state, running);
}

/* Glow animation */
.tc-glow {
  animation: tc-glow var(--tc-duration, 1.5s) var(--tc-easing, ease-in-out) var(--tc-delay, 0s) var(--tc-iterations, infinite) normal both;
  animation-play-state: var(--tc-play-state, running);
}

/* Ping animation */
.tc-ping {
  animation: tc-ping var(--tc-duration, 1s) var(--tc-easing, ease-out) var(--tc-delay, 0s) var(--tc-iterations, infinite) normal both;
  animation-play-state: var(--tc-play-state, running);
}

/* Shimmer animation (for holographic effects) */
.tc-shimmer {
  animation: tc-shimmer var(--tc-duration, 3s) var(--tc-easing, linear) var(--tc-delay, 0s) var(--tc-iterations, infinite) normal both;
  animation-play-state: var(--tc-play-state, running);
}

/* Glow pulse animation (for glowing borders) */
.tc-glow-pulse {
  animation: tc-glow-pulse var(--tc-duration, 2s) var(--tc-easing, ease-in-out) var(--tc-delay, 0s) var(--tc-iterations, infinite) normal both;
  animation-play-state: var(--tc-play-state, running);
}

/* Trace animation (neon sign drawing effect with multiple segments) */
.tc-trace {
  stroke-dasharray: 150;
  animation: tc-trace var(--tc-duration, 15s) var(--tc-easing, linear) var(--tc-delay, 0s) var(--tc-iterations, infinite) normal both;
  animation-play-state: var(--tc-play-state, running);
}
.tc-trace-reverse {
  stroke-dasharray: 150;
  animation: tc-trace-reverse var(--tc-duration, 15s) var(--tc-easing, linear) var(--tc-delay, 0s) var(--tc-iterations, infinite) normal both;
  animation-play-state: var(--tc-play-state, running);
}
`;

/**
 * Get complete animation CSS for injection into SVG
 */
export function getAnimationCSS(): string {
	return ANIMATION_KEYFRAMES + ANIMATION_CLASSES;
}

/**
 * Generate inline style string for animation configuration
 */
export function getAnimationStyleVars(config: {
	duration?: number;
	easing?: string;
	delay?: number;
	iterations?: number | 'infinite';
	paused?: boolean;
	glowIntensity?: number;
}): string {
	const vars: string[] = [];

	if (config.duration !== undefined) {
		vars.push(`--tc-duration: ${config.duration}s`);
	}
	if (config.easing) {
		vars.push(`--tc-easing: ${config.easing}`);
	}
	if (config.delay !== undefined) {
		vars.push(`--tc-delay: ${config.delay}s`);
	}
	if (config.iterations !== undefined) {
		vars.push(`--tc-iterations: ${config.iterations}`);
	}
	if (config.paused !== undefined) {
		vars.push(`--tc-play-state: ${config.paused ? 'paused' : 'running'}`);
	}
	if (config.glowIntensity !== undefined) {
		vars.push(`--tc-glow-intensity: ${config.glowIntensity}`);
	}

	return vars.join('; ');
}
