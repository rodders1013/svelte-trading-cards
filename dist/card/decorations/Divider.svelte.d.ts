import { z } from 'zod';
export declare const DividerStyleSchema: z.ZodEnum<{
    solid: "solid";
    dashed: "dashed";
    dotted: "dotted";
    gradient: "gradient";
    double: "double";
}>;
export type DividerStyle = z.infer<typeof DividerStyleSchema>;
export declare const DividerFadeSchema: z.ZodEnum<{
    none: "none";
    left: "left";
    right: "right";
    both: "both";
}>;
export type DividerFade = z.infer<typeof DividerFadeSchema>;
export declare const DividerIconPresetSchema: z.ZodEnum<{
    none: "none";
    custom: "custom";
    circle: "circle";
    square: "square";
    diamond: "diamond";
    star: "star";
    heart: "heart";
    flower: "flower";
}>;
export type DividerIconPreset = z.infer<typeof DividerIconPresetSchema>;
export declare const DIVIDER_ICON_LABELS: Record<DividerIconPreset, string>;
export declare const DividerPropsSchema: z.ZodObject<{
    style: z.ZodDefault<z.ZodEnum<{
        solid: "solid";
        dashed: "dashed";
        dotted: "dotted";
        gradient: "gradient";
        double: "double";
    }>>;
    color: z.ZodDefault<z.ZodString>;
    secondaryColor: z.ZodOptional<z.ZodString>;
    thickness: z.ZodDefault<z.ZodNumber>;
    fade: z.ZodDefault<z.ZodEnum<{
        none: "none";
        left: "left";
        right: "right";
        both: "both";
    }>>;
    iconPreset: z.ZodDefault<z.ZodEnum<{
        none: "none";
        custom: "custom";
        circle: "circle";
        square: "square";
        diamond: "diamond";
        star: "star";
        heart: "heart";
        flower: "flower";
    }>>;
    customIcon: z.ZodOptional<z.ZodObject<{
        body: z.ZodString;
        width: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        height: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        left: z.ZodOptional<z.ZodNumber>;
        top: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
    customIconName: z.ZodOptional<z.ZodString>;
    iconSize: z.ZodDefault<z.ZodNumber>;
    iconColor: z.ZodOptional<z.ZodString>;
    iconStroke: z.ZodOptional<z.ZodString>;
    iconStrokeWidth: z.ZodDefault<z.ZodNumber>;
    iconTransform: z.ZodOptional<z.ZodObject<{
        scale: z.ZodDefault<z.ZodNumber>;
        offsetX: z.ZodDefault<z.ZodNumber>;
        offsetY: z.ZodDefault<z.ZodNumber>;
        rotation: z.ZodDefault<z.ZodNumber>;
        flipHorizontal: z.ZodDefault<z.ZodBoolean>;
        flipVertical: z.ZodDefault<z.ZodBoolean>;
    }, z.core.$strip>>;
    dashLength: z.ZodDefault<z.ZodNumber>;
    gapLength: z.ZodDefault<z.ZodNumber>;
    opacity: z.ZodDefault<z.ZodNumber>;
    animation: z.ZodOptional<z.ZodObject<{
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
    }, z.core.$strip>>;
    effect: z.ZodOptional<z.ZodDiscriminatedUnion<[z.ZodObject<{
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
    }, z.core.$strip>], "type">>;
    blendMode: z.ZodOptional<z.ZodEnum<{
        normal: "normal";
        multiply: "multiply";
        screen: "screen";
        overlay: "overlay";
        darken: "darken";
        lighten: "lighten";
        "color-dodge": "color-dodge";
        "color-burn": "color-burn";
        "soft-light": "soft-light";
        "hard-light": "hard-light";
        difference: "difference";
        exclusion: "exclusion";
    }>>;
    holographic: z.ZodOptional<z.ZodObject<{
        color: z.ZodDefault<z.ZodString>;
        secondaryColor: z.ZodDefault<z.ZodString>;
        tertiaryColor: z.ZodOptional<z.ZodString>;
        speed: z.ZodDefault<z.ZodNumber>;
        angle: z.ZodDefault<z.ZodNumber>;
        apply: z.ZodDefault<z.ZodEnum<{
            fill: "fill";
            stroke: "stroke";
            both: "both";
        }>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type DividerProps = z.infer<typeof DividerPropsSchema>;
import type { ContainerContext, CardData } from '../../types';
type $$ComponentProps = DividerProps & {
    container: ContainerContext;
    data?: CardData;
};
declare const Divider: import("svelte").Component<$$ComponentProps, {}, "">;
type Divider = ReturnType<typeof Divider>;
export default Divider;
