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
	'fade',
	'ping',
	'trace'
]);
export type AnimationType = z.infer<typeof AnimationType>;


// Direction for rotation animations
export const AnimationDirection = z.enum(['clockwise', 'counterclockwise']);
export type AnimationDirection = z.infer<typeof AnimationDirection>;

// Easing options
export const AnimationEasing = z.enum(['linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out']);
export type AnimationEasing = z.infer<typeof AnimationEasing>;

// Transform origin options for animations
export const AnimationOrigin = z.enum([
	'center',
	'top-left',
	'top',
	'top-right',
	'left',
	'right',
	'bottom-left',
	'bottom',
	'bottom-right'
]);
export type AnimationOrigin = z.infer<typeof AnimationOrigin>;

// Pulse pattern options
export const PulsePattern = z.enum([
	'single', // Standard single pulse
	'heartbeat', // Double pulse (ba-bump)
	'triple' // Triple pulse
]);
export type PulsePattern = z.infer<typeof PulsePattern>;

// Float style options
export const FloatStyle = z.enum([
	'gentle', // Vertical + slight rotation (default)
	'bob', // Vertical only, no rotation
	'sway', // Horizontal movement
	'orbit' // Circular motion
]);
export type FloatStyle = z.infer<typeof FloatStyle>;

// Complete animation configuration
export const AnimationConfigSchema = z.object({
	type: AnimationType.default('none'),
	duration: z.number().min(0.1).max(10).default(1.5), // Duration in seconds
	direction: AnimationDirection.default('clockwise'),
	origin: AnimationOrigin.default('center'), // Transform origin for spin/pulse/etc
	scale: z.number().min(1).max(2).default(1.1), // Scale amount for pulse animation (1.1 = 10% bigger)
	pulsePattern: PulsePattern.default('single'), // Pattern for pulse animation
	floatStyle: FloatStyle.default('gentle'), // Style for float animation
	floatDistance: z.number().min(1).max(15).default(3), // Float distance in percent
	floatRotation: z.number().min(0).max(10).default(1), // Float rotation in degrees
	easing: AnimationEasing.default('ease-in-out'),
	delay: z.number().min(0).default(0), // Delay in seconds
	iterationCount: z.union([z.number().min(1), z.literal('infinite')]).default('infinite'),
	paused: z.boolean().default(false)
});

export type AnimationConfig = z.infer<typeof AnimationConfigSchema>;

// Animation presets with their keyframe definitions
export interface AnimationPreset {
	name: AnimationType;
	label: string;
	description: string;
	keyframes: string;
	defaultEasing: AnimationEasing;
	supportsDirection: boolean;
}
