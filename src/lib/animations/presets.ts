import type { AnimationType, AnimationPreset, AnimationEasing } from './types.js';

/**
 * Animation Presets
 *
 * SVG-compatible CSS animations that work in preview
 * and are stripped for static PNG export.
 */

export const ANIMATION_PRESETS: Record<Exclude<AnimationType, 'none'>, AnimationPreset> = {
	spin: {
		name: 'spin',
		label: 'Spin',
		description: 'Continuous rotation',
		keyframes: `
			@keyframes tc-spin {
				from { transform: rotate(0deg); }
				to { transform: rotate(360deg); }
			}
			@keyframes tc-spin-reverse {
				from { transform: rotate(360deg); }
				to { transform: rotate(0deg); }
			}
		`,
		defaultEasing: 'linear',
		supportsDirection: true
	},
	pulse: {
		name: 'pulse',
		label: 'Pulse',
		description: 'Scale up and down gently',
		keyframes: `
			@keyframes tc-pulse {
				0%, 100% { transform: scale(1); }
				50% { transform: scale(1.1); }
			}
		`,
		defaultEasing: 'ease-in-out',
		supportsDirection: false
	},
	bounce: {
		name: 'bounce',
		label: 'Bounce',
		description: 'Bouncy vertical movement',
		keyframes: `
			@keyframes tc-bounce {
				0%, 100% { transform: translateY(0); }
				50% { transform: translateY(-10%); }
			}
		`,
		defaultEasing: 'ease-in-out',
		supportsDirection: false
	},
	shake: {
		name: 'shake',
		label: 'Shake',
		description: 'Quick horizontal shake',
		keyframes: `
			@keyframes tc-shake {
				0%, 100% { transform: translateX(0); }
				10%, 30%, 50%, 70%, 90% { transform: translateX(-2%); }
				20%, 40%, 60%, 80% { transform: translateX(2%); }
			}
		`,
		defaultEasing: 'ease-in-out',
		supportsDirection: false
	},
	float: {
		name: 'float',
		label: 'Float',
		description: 'Gentle floating motion',
		keyframes: `
			@keyframes tc-float {
				0%, 100% { transform: translateY(0) rotate(0deg); }
				25% { transform: translateY(-3%) rotate(1deg); }
				75% { transform: translateY(3%) rotate(-1deg); }
			}
		`,
		defaultEasing: 'ease-in-out',
		supportsDirection: false
	},
	glow: {
		name: 'glow',
		label: 'Glow',
		description: 'Pulsing opacity glow',
		keyframes: `
			@keyframes tc-glow {
				0%, 100% { opacity: 1; }
				50% { opacity: 0.6; }
			}
		`,
		defaultEasing: 'ease-in-out',
		supportsDirection: false
	},
	ping: {
		name: 'ping',
		label: 'Ping',
		description: 'Attention-grabbing ping',
		keyframes: `
			@keyframes tc-ping {
				0% { transform: scale(1); opacity: 1; }
				75%, 100% { transform: scale(1.5); opacity: 0; }
			}
		`,
		defaultEasing: 'ease-out',
		supportsDirection: false
	}
};

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
	if (type === 'spin' && direction === 'counterclockwise') {
		return 'tc-spin-reverse';
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
