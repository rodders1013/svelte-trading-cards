import { z } from 'zod';
/**
 * Effects System Types
 *
 * SVG filter-based visual effects that can be applied to any component.
 * Effects can be static or animated using the existing animation system.
 */
// Available effect types
export const EffectType = z.enum([
    'none',
    'glow', // Soft outer glow (drop shadow style)
    'strokeGlow', // Blur glow on strokes/borders
    'shadow', // Drop shadow
    'neon', // Intense multi-layer glow
    'innerGlow', // Inward glow effect
    'lift', // Subtle lifted paper shadow
    'outline' // Stroke outline effect
]);
// Glow effect configuration (drop shadow style)
export const GlowEffectSchema = z.object({
    type: z.literal('glow'),
    color: z.string().default('#3b82f6'),
    blur: z.number().min(1).max(50).default(10),
    intensity: z.number().min(0).max(1).default(0.7),
    animated: z.boolean().default(false),
    animationDuration: z.number().min(0.1).max(10).default(1.5)
});
// Stroke glow effect configuration (blur filter on strokes/borders)
export const StrokeGlowEffectSchema = z.object({
    type: z.literal('strokeGlow'),
    color: z.string().optional(), // If not set, uses stroke color
    blur: z.number().min(1).max(50).default(10),
    intensity: z.number().min(0).max(1).default(0.5),
    animated: z.boolean().default(false),
    animationDuration: z.number().min(0.1).max(10).default(1.5)
});
// Drop shadow effect configuration
export const ShadowEffectSchema = z.object({
    type: z.literal('shadow'),
    color: z.string().default('rgba(0, 0, 0, 0.5)'),
    blur: z.number().min(0).max(50).default(8),
    offsetX: z.number().min(-50).max(50).default(4),
    offsetY: z.number().min(-50).max(50).default(4),
    animated: z.boolean().default(false),
    animationDuration: z.number().min(0.1).max(10).default(1.5)
});
// Neon effect configuration (intense multi-layer glow)
export const NeonEffectSchema = z.object({
    type: z.literal('neon'),
    color: z.string().default('#ff00ff'),
    intensity: z.number().min(0).max(1).default(0.9),
    spread: z.number().min(1).max(3).default(2), // Number of glow layers
    animated: z.boolean().default(false),
    animationDuration: z.number().min(0.1).max(10).default(1.5)
});
// Inner glow effect configuration
export const InnerGlowEffectSchema = z.object({
    type: z.literal('innerGlow'),
    color: z.string().default('#ffffff'),
    blur: z.number().min(1).max(30).default(8),
    intensity: z.number().min(0).max(1).default(0.5),
    animated: z.boolean().default(false),
    animationDuration: z.number().min(0.1).max(10).default(1.5)
});
// Lift effect configuration (paper lift shadow)
export const LiftEffectSchema = z.object({
    type: z.literal('lift'),
    elevation: z.enum(['sm', 'md', 'lg', 'xl']).default('md'),
    animated: z.boolean().default(false),
    animationDuration: z.number().min(0.1).max(10).default(1.5)
});
// Outline effect configuration
export const OutlineEffectSchema = z.object({
    type: z.literal('outline'),
    color: z.string().default('#ffffff'),
    width: z.number().min(1).max(10).default(2),
    animated: z.boolean().default(false),
    animationDuration: z.number().min(0.1).max(10).default(1.5)
});
// Union of all effect configurations
export const EffectConfigSchema = z.discriminatedUnion('type', [
    GlowEffectSchema,
    StrokeGlowEffectSchema,
    ShadowEffectSchema,
    NeonEffectSchema,
    InnerGlowEffectSchema,
    LiftEffectSchema,
    OutlineEffectSchema
]);
// Lift elevation to shadow values mapping
export const LIFT_ELEVATIONS = {
    sm: { blur: 4, offsetY: 2, opacity: 0.1 },
    md: { blur: 8, offsetY: 4, opacity: 0.15 },
    lg: { blur: 16, offsetY: 8, opacity: 0.2 },
    xl: { blur: 24, offsetY: 12, opacity: 0.25 }
};
