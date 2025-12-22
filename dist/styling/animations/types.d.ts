import { z } from 'zod';
/**
 * Animation System Types
 *
 * Reusable CSS animations for SVG components.
 * Animated in preview, static on PNG export.
 */
export declare const AnimationType: z.ZodEnum<{
    none: "none";
    spin: "spin";
    pulse: "pulse";
    bounce: "bounce";
    shake: "shake";
    float: "float";
    fade: "fade";
    ping: "ping";
    trace: "trace";
}>;
export type AnimationType = z.infer<typeof AnimationType>;
export declare const AnimationDirection: z.ZodEnum<{
    clockwise: "clockwise";
    counterclockwise: "counterclockwise";
}>;
export type AnimationDirection = z.infer<typeof AnimationDirection>;
export declare const AnimationEasing: z.ZodEnum<{
    linear: "linear";
    ease: "ease";
    "ease-in": "ease-in";
    "ease-out": "ease-out";
    "ease-in-out": "ease-in-out";
}>;
export type AnimationEasing = z.infer<typeof AnimationEasing>;
export declare const AnimationOrigin: z.ZodEnum<{
    center: "center";
    "top-left": "top-left";
    top: "top";
    "top-right": "top-right";
    left: "left";
    right: "right";
    "bottom-left": "bottom-left";
    bottom: "bottom";
    "bottom-right": "bottom-right";
}>;
export type AnimationOrigin = z.infer<typeof AnimationOrigin>;
export declare const PulsePattern: z.ZodEnum<{
    single: "single";
    heartbeat: "heartbeat";
    triple: "triple";
}>;
export type PulsePattern = z.infer<typeof PulsePattern>;
export declare const FloatStyle: z.ZodEnum<{
    gentle: "gentle";
    bob: "bob";
    sway: "sway";
    orbit: "orbit";
}>;
export type FloatStyle = z.infer<typeof FloatStyle>;
export declare const AnimationConfigSchema: z.ZodObject<{
    type: z.ZodDefault<z.ZodEnum<{
        none: "none";
        spin: "spin";
        pulse: "pulse";
        bounce: "bounce";
        shake: "shake";
        float: "float";
        fade: "fade";
        ping: "ping";
        trace: "trace";
    }>>;
    duration: z.ZodDefault<z.ZodNumber>;
    direction: z.ZodDefault<z.ZodEnum<{
        clockwise: "clockwise";
        counterclockwise: "counterclockwise";
    }>>;
    origin: z.ZodDefault<z.ZodEnum<{
        center: "center";
        "top-left": "top-left";
        top: "top";
        "top-right": "top-right";
        left: "left";
        right: "right";
        "bottom-left": "bottom-left";
        bottom: "bottom";
        "bottom-right": "bottom-right";
    }>>;
    scale: z.ZodDefault<z.ZodNumber>;
    pulsePattern: z.ZodDefault<z.ZodEnum<{
        single: "single";
        heartbeat: "heartbeat";
        triple: "triple";
    }>>;
    floatStyle: z.ZodDefault<z.ZodEnum<{
        gentle: "gentle";
        bob: "bob";
        sway: "sway";
        orbit: "orbit";
    }>>;
    floatDistance: z.ZodDefault<z.ZodNumber>;
    floatRotation: z.ZodDefault<z.ZodNumber>;
    easing: z.ZodDefault<z.ZodEnum<{
        linear: "linear";
        ease: "ease";
        "ease-in": "ease-in";
        "ease-out": "ease-out";
        "ease-in-out": "ease-in-out";
    }>>;
    delay: z.ZodDefault<z.ZodNumber>;
    iterationCount: z.ZodDefault<z.ZodUnion<readonly [z.ZodNumber, z.ZodLiteral<"infinite">]>>;
    paused: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
export type AnimationConfig = z.infer<typeof AnimationConfigSchema>;
export interface AnimationPreset {
    name: AnimationType;
    label: string;
    description: string;
    keyframes: string;
    defaultEasing: AnimationEasing;
    supportsDirection: boolean;
}
