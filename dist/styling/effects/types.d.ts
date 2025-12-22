import { z } from 'zod';
/**
 * Effects System Types
 *
 * SVG filter-based visual effects that can be applied to any component.
 * Effects can be static or animated using the existing animation system.
 */
export declare const EffectType: z.ZodEnum<{
    none: "none";
    glow: "glow";
    strokeGlow: "strokeGlow";
    shadow: "shadow";
    neon: "neon";
    innerGlow: "innerGlow";
    lift: "lift";
    outline: "outline";
}>;
export type EffectType = z.infer<typeof EffectType>;
export declare const GlowEffectSchema: z.ZodObject<{
    type: z.ZodLiteral<"glow">;
    color: z.ZodDefault<z.ZodString>;
    blur: z.ZodDefault<z.ZodNumber>;
    intensity: z.ZodDefault<z.ZodNumber>;
    animated: z.ZodDefault<z.ZodBoolean>;
    animationDuration: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
export type GlowEffect = z.infer<typeof GlowEffectSchema>;
export declare const StrokeGlowEffectSchema: z.ZodObject<{
    type: z.ZodLiteral<"strokeGlow">;
    color: z.ZodOptional<z.ZodString>;
    blur: z.ZodDefault<z.ZodNumber>;
    intensity: z.ZodDefault<z.ZodNumber>;
    animated: z.ZodDefault<z.ZodBoolean>;
    animationDuration: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
export type StrokeGlowEffect = z.infer<typeof StrokeGlowEffectSchema>;
export declare const ShadowEffectSchema: z.ZodObject<{
    type: z.ZodLiteral<"shadow">;
    color: z.ZodDefault<z.ZodString>;
    blur: z.ZodDefault<z.ZodNumber>;
    offsetX: z.ZodDefault<z.ZodNumber>;
    offsetY: z.ZodDefault<z.ZodNumber>;
    animated: z.ZodDefault<z.ZodBoolean>;
    animationDuration: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
export type ShadowEffect = z.infer<typeof ShadowEffectSchema>;
export declare const NeonEffectSchema: z.ZodObject<{
    type: z.ZodLiteral<"neon">;
    color: z.ZodDefault<z.ZodString>;
    intensity: z.ZodDefault<z.ZodNumber>;
    spread: z.ZodDefault<z.ZodNumber>;
    animated: z.ZodDefault<z.ZodBoolean>;
    animationDuration: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
export type NeonEffect = z.infer<typeof NeonEffectSchema>;
export declare const InnerGlowEffectSchema: z.ZodObject<{
    type: z.ZodLiteral<"innerGlow">;
    color: z.ZodDefault<z.ZodString>;
    blur: z.ZodDefault<z.ZodNumber>;
    intensity: z.ZodDefault<z.ZodNumber>;
    animated: z.ZodDefault<z.ZodBoolean>;
    animationDuration: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
export type InnerGlowEffect = z.infer<typeof InnerGlowEffectSchema>;
export declare const LiftEffectSchema: z.ZodObject<{
    type: z.ZodLiteral<"lift">;
    elevation: z.ZodDefault<z.ZodEnum<{
        sm: "sm";
        md: "md";
        lg: "lg";
        xl: "xl";
    }>>;
    animated: z.ZodDefault<z.ZodBoolean>;
    animationDuration: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
export type LiftEffect = z.infer<typeof LiftEffectSchema>;
export declare const OutlineEffectSchema: z.ZodObject<{
    type: z.ZodLiteral<"outline">;
    color: z.ZodDefault<z.ZodString>;
    width: z.ZodDefault<z.ZodNumber>;
    animated: z.ZodDefault<z.ZodBoolean>;
    animationDuration: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
export type OutlineEffect = z.infer<typeof OutlineEffectSchema>;
export declare const EffectConfigSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    type: z.ZodLiteral<"glow">;
    color: z.ZodDefault<z.ZodString>;
    blur: z.ZodDefault<z.ZodNumber>;
    intensity: z.ZodDefault<z.ZodNumber>;
    animated: z.ZodDefault<z.ZodBoolean>;
    animationDuration: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"strokeGlow">;
    color: z.ZodOptional<z.ZodString>;
    blur: z.ZodDefault<z.ZodNumber>;
    intensity: z.ZodDefault<z.ZodNumber>;
    animated: z.ZodDefault<z.ZodBoolean>;
    animationDuration: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"shadow">;
    color: z.ZodDefault<z.ZodString>;
    blur: z.ZodDefault<z.ZodNumber>;
    offsetX: z.ZodDefault<z.ZodNumber>;
    offsetY: z.ZodDefault<z.ZodNumber>;
    animated: z.ZodDefault<z.ZodBoolean>;
    animationDuration: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"neon">;
    color: z.ZodDefault<z.ZodString>;
    intensity: z.ZodDefault<z.ZodNumber>;
    spread: z.ZodDefault<z.ZodNumber>;
    animated: z.ZodDefault<z.ZodBoolean>;
    animationDuration: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"innerGlow">;
    color: z.ZodDefault<z.ZodString>;
    blur: z.ZodDefault<z.ZodNumber>;
    intensity: z.ZodDefault<z.ZodNumber>;
    animated: z.ZodDefault<z.ZodBoolean>;
    animationDuration: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"lift">;
    elevation: z.ZodDefault<z.ZodEnum<{
        sm: "sm";
        md: "md";
        lg: "lg";
        xl: "xl";
    }>>;
    animated: z.ZodDefault<z.ZodBoolean>;
    animationDuration: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"outline">;
    color: z.ZodDefault<z.ZodString>;
    width: z.ZodDefault<z.ZodNumber>;
    animated: z.ZodDefault<z.ZodBoolean>;
    animationDuration: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>], "type">;
export type EffectConfig = z.infer<typeof EffectConfigSchema>;
export declare const LIFT_ELEVATIONS: {
    readonly sm: {
        readonly blur: 4;
        readonly offsetY: 2;
        readonly opacity: 0.1;
    };
    readonly md: {
        readonly blur: 8;
        readonly offsetY: 4;
        readonly opacity: 0.15;
    };
    readonly lg: {
        readonly blur: 16;
        readonly offsetY: 8;
        readonly opacity: 0.2;
    };
    readonly xl: {
        readonly blur: 24;
        readonly offsetY: 12;
        readonly opacity: 0.25;
    };
};
export interface EffectPreset {
    type: EffectType;
    label: string;
    description: string;
    icon: string;
}
