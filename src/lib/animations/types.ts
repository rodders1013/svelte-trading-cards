import { z } from 'zod';

/**
 * Animation System Types
 *
 * Reusable CSS animations for SVG components.
 * Animated in preview, static on PNG export.
 */

// Animation preset types
export const AnimationType = z.enum([
	'none',
	'spin',
	'pulse',
	'bounce',
	'shake',
	'float',
	'glow',
	'ping'
]);
export type AnimationType = z.infer<typeof AnimationType>;

// Speed options
export const AnimationSpeed = z.enum(['slow', 'normal', 'fast']);
export type AnimationSpeed = z.infer<typeof AnimationSpeed>;

// Direction for rotation animations
export const AnimationDirection = z.enum(['clockwise', 'counterclockwise']);
export type AnimationDirection = z.infer<typeof AnimationDirection>;

// Easing options
export const AnimationEasing = z.enum(['linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out']);
export type AnimationEasing = z.infer<typeof AnimationEasing>;

// Complete animation configuration
export const AnimationConfigSchema = z.object({
	type: AnimationType.default('none'),
	speed: AnimationSpeed.default('normal'),
	direction: AnimationDirection.default('clockwise'),
	easing: AnimationEasing.default('ease-in-out'),
	delay: z.number().min(0).default(0), // Delay in seconds
	iterationCount: z.union([z.number().min(1), z.literal('infinite')]).default('infinite'),
	paused: z.boolean().default(false)
});

export type AnimationConfig = z.infer<typeof AnimationConfigSchema>;

// Speed to duration mapping (in seconds)
export const SPEED_DURATIONS: Record<AnimationSpeed, number> = {
	slow: 3,
	normal: 1.5,
	fast: 0.75
};

// Animation presets with their keyframe definitions
export interface AnimationPreset {
	name: AnimationType;
	label: string;
	description: string;
	keyframes: string;
	defaultEasing: AnimationEasing;
	supportsDirection: boolean;
}
