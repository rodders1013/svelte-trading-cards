/**
 * Universal Modifiers System
 *
 * Defines the unified modifier interface that can be applied to any component.
 * This replaces the scattered effect/animation/blendMode props with a single
 * consistent modifiers object.
 */
/**
 * Check if any modifiers are active (non-default values)
 */
export function hasActiveModifiers(modifiers) {
    if (!modifiers)
        return false;
    return !!(modifiers.effect ||
        (modifiers.animation && modifiers.animation.type !== 'none') ||
        (modifiers.blendMode && modifiers.blendMode !== 'normal') ||
        modifiers.clip ||
        modifiers.border ||
        modifiers.filter ||
        modifiers.holographic);
}
/**
 * Create an empty modifiers object with defaults
 */
export function createDefaultModifiers() {
    return {
        blendMode: 'normal'
    };
}
/**
 * Merge modifiers, with second taking precedence
 */
export function mergeModifiers(base, override) {
    if (!base && !override)
        return {};
    if (!base)
        return override;
    if (!override)
        return base;
    return {
        ...base,
        ...override,
        border: override.border ? {
            ...base.border,
            ...override.border
        } : base.border
    };
}
