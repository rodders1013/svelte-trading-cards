import type { AnimationType, AnimationPreset, AnimationEasing } from './types.js';
/**
 * Animation Presets
 *
 * SVG-compatible CSS animations that work in preview
 * and are stripped for static PNG export.
 */
export declare const ANIMATION_PRESETS: Record<Exclude<AnimationType, 'none'>, AnimationPreset>;
/**
 * Get all unique keyframes needed for animations
 */
export declare function getAllKeyframes(): string;
/**
 * Get keyframes for a specific animation type
 */
export declare function getKeyframes(type: AnimationType): string;
/**
 * Get animation name based on type and direction
 */
export declare function getAnimationName(type: AnimationType, direction?: 'clockwise' | 'counterclockwise'): string;
/**
 * Get the default easing for an animation type
 */
export declare function getDefaultEasing(type: AnimationType): AnimationEasing;
/**
 * Check if an animation type supports direction control
 */
export declare function supportsDirection(type: AnimationType): boolean;
/**
 * Get all animation options for UI dropdowns
 */
export declare function getAnimationOptions(): Array<{
    value: AnimationType;
    label: string;
    description: string;
}>;
