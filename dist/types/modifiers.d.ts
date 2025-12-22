/**
 * Universal Modifiers System
 *
 * Defines the unified modifier interface that can be applied to any component.
 * This replaces the scattered effect/animation/blendMode props with a single
 * consistent modifiers object.
 */
import type { EffectConfig } from '../styling/effects';
import type { AnimationConfig } from '../styling/animations';
import type { BlendMode } from '../styling/blend';
import type { ShapeSource } from '../styling/shapes';
import type { FilterConfig } from '../styling/filters';
import type { HolographicConfig as HolographicConfigImport } from '../styling/HolographicWrapper.svelte';
export type HolographicConfig = HolographicConfigImport;
/**
 * Border modifier configuration
 * Applied as a modifier to any component, follows the component's clip shape
 * Note: For glow effects on borders, use Effect → strokeGlow
 */
export interface BorderModifier {
    /** Border color */
    color: string;
    /** Border width in pixels */
    width: number;
    /** Border opacity (0-1) */
    opacity?: number;
    /** Border style */
    style?: 'solid' | 'dashed' | 'dotted';
}
/**
 * Universal modifiers that can be applied to any component
 *
 * This interface provides a consistent way to add visual effects,
 * animations, and transformations to any component in the system.
 */
export interface UniversalModifiers {
    /** Visual effect (glow, shadow, neon, etc.) */
    effect?: EffectConfig;
    /** Animation (pulse, float, spin, etc.) */
    animation?: AnimationConfig;
    /** Blend mode for compositing with layers below */
    blendMode?: BlendMode;
    /** Clip content to shape */
    clip?: ShapeSource;
    /** Border that follows clip shape */
    border?: BorderModifier;
    /** Image filters (brightness, contrast, etc.) */
    filter?: FilterConfig;
    /** Holographic color-shifting effect */
    holographic?: HolographicConfig;
}
/**
 * Check if any modifiers are active (non-default values)
 */
export declare function hasActiveModifiers(modifiers?: UniversalModifiers): boolean;
/**
 * Create an empty modifiers object with defaults
 */
export declare function createDefaultModifiers(): UniversalModifiers;
/**
 * Merge modifiers, with second taking precedence
 */
export declare function mergeModifiers(base: UniversalModifiers | undefined, override: UniversalModifiers | undefined): UniversalModifiers;
