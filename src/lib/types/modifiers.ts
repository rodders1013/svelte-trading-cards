/**
 * Universal Modifiers System
 *
 * Defines the unified modifier interface that can be applied to any component.
 * This replaces the scattered effect/animation/blendMode props with a single
 * consistent modifiers object.
 */

import type { EffectConfig } from '$lib/styling/effects';
import type { AnimationConfig } from '$lib/styling/animations';
import type { BlendMode } from '$lib/styling/blend';
import type { ShapeSource } from '$lib/styling/shapes';
import type { FilterConfig } from '$lib/styling/filters';
import type { HolographicConfig as HolographicConfigImport } from '$lib/styling/HolographicWrapper.svelte';

// Re-export for convenience
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
export function hasActiveModifiers(modifiers?: UniversalModifiers): boolean {
	if (!modifiers) return false;
	return !!(
		modifiers.effect ||
		(modifiers.animation && modifiers.animation.type !== 'none') ||
		(modifiers.blendMode && modifiers.blendMode !== 'normal') ||
		modifiers.clip ||
		modifiers.border ||
		modifiers.filter ||
		modifiers.holographic
	);
}

/**
 * Create an empty modifiers object with defaults
 */
export function createDefaultModifiers(): UniversalModifiers {
	return {
		blendMode: 'normal'
	};
}

/**
 * Merge modifiers, with second taking precedence
 */
export function mergeModifiers(
	base: UniversalModifiers | undefined,
	override: UniversalModifiers | undefined
): UniversalModifiers {
	if (!base && !override) return {};
	if (!base) return override!;
	if (!override) return base;

	return {
		...base,
		...override,
		border: override.border ? {
			...base.border,
			...override.border
		} : base.border
	};
}
