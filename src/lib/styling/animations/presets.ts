import type { AnimationType, AnimationPreset, AnimationEasing } from './types.js';
import { ANIMATION_DEFINITIONS, getAnimationDefinition } from './registry.js';

/**
 * Animation Presets
 *
 * SVG-compatible CSS animations that work in preview
 * and are stripped for static PNG export.
 */

export const ANIMATION_PRESETS: Record<Exclude<AnimationType, 'none'>, AnimationPreset> =
	Object.fromEntries(
		ANIMATION_DEFINITIONS.map((def) => [
			def.id,
			{
				name: def.id,
				label: def.label,
				description: def.description,
				keyframes: def.keyframes.map((kf) => `@keyframes ${kf.name} {${kf.css}}`).join('\n'),
				defaultEasing: def.defaultEasing,
				supportsDirection: def.supportsDirection
			}
		])
	) as Record<Exclude<AnimationType, 'none'>, AnimationPreset>;

/**
 * Get all unique keyframes needed for animations
 */
export function getAllKeyframes(): string {
	return Object.values(ANIMATION_PRESETS)
		.map((preset) => preset.keyframes)
		.join('\n');
}

/**
 * Get keyframes for a specific animation type
 */
export function getKeyframes(type: AnimationType): string {
	if (type === 'none') return '';
	return ANIMATION_PRESETS[type]?.keyframes ?? '';
}

/**
 * Get animation name based on type and direction
 */
export function getAnimationName(type: AnimationType, direction: 'clockwise' | 'counterclockwise' = 'clockwise'): string {
	if (type === 'none') return 'none';
	const def = getAnimationDefinition(type);
	if (def?.directionClassByDirection?.[direction]) {
		return def.directionClassByDirection[direction] as string;
	}
	return `tc-${type}`;
}

/**
 * Get the default easing for an animation type
 */
export function getDefaultEasing(type: AnimationType): AnimationEasing {
	if (type === 'none') return 'ease-in-out';
	return ANIMATION_PRESETS[type]?.defaultEasing ?? 'ease-in-out';
}

/**
 * Check if an animation type supports direction control
 */
export function supportsDirection(type: AnimationType): boolean {
	if (type === 'none') return false;
	return ANIMATION_PRESETS[type]?.supportsDirection ?? false;
}

/**
 * Get all animation options for UI dropdowns
 */
export function getAnimationOptions(): Array<{ value: AnimationType; label: string; description: string }> {
	const options: Array<{ value: AnimationType; label: string; description: string }> = [
		{ value: 'none', label: 'None', description: 'No animation' }
	];

	for (const preset of Object.values(ANIMATION_PRESETS)) {
		options.push({
			value: preset.name,
			label: preset.label,
			description: preset.description
		});
	}

	return options;
}
