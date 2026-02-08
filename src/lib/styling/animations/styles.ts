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

import { getAllAnimationKeyframes, getAllAnimationClasses } from './registry.js';

/**
 * All animation keyframes as a CSS string
 */
export const ANIMATION_KEYFRAMES = `${getAllAnimationKeyframes()}`;

/**
 * Animation classes that use CSS custom properties for configuration
 */
export const ANIMATION_CLASSES = `
/* Base animation styles */
.tc-animated {
  /* transform-box and transform-origin are set via inline styles for precise control */
}

${getAllAnimationClasses()}
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
