import { z } from 'zod';
export declare const RatingIconPresetSchema: z.ZodEnum<{
    custom: "custom";
    circle: "circle";
    diamond: "diamond";
    star: "star";
    heart: "heart";
    trophy: "trophy";
    fire: "fire";
    "thumbs-up": "thumbs-up";
    lightning: "lightning";
    pepper: "pepper";
    skull: "skull";
}>;
export type RatingIconPreset = z.infer<typeof RatingIconPresetSchema>;
export declare const ValueFormatSchema: z.ZodEnum<{
    none: "none";
    decimal: "decimal";
    percent: "percent";
    fraction: "fraction";
}>;
export type ValueFormat = z.infer<typeof ValueFormatSchema>;
export declare const IconRatingPropsSchema: z.ZodObject<{
    dataField: z.ZodOptional<z.ZodString>;
    value: z.ZodOptional<z.ZodNumber>;
    max: z.ZodDefault<z.ZodNumber>;
    min: z.ZodDefault<z.ZodNumber>;
    sourceMax: z.ZodOptional<z.ZodNumber>;
    iconPreset: z.ZodDefault<z.ZodEnum<{
        custom: "custom";
        circle: "circle";
        diamond: "diamond";
        star: "star";
        heart: "heart";
        trophy: "trophy";
        fire: "fire";
        "thumbs-up": "thumbs-up";
        lightning: "lightning";
        pepper: "pepper";
        skull: "skull";
    }>>;
    customIcon: z.ZodOptional<z.ZodObject<{
        body: z.ZodString;
        width: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        height: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        left: z.ZodOptional<z.ZodNumber>;
        top: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
    customIconName: z.ZodOptional<z.ZodString>;
    filledColor: z.ZodDefault<z.ZodString>;
    emptyColor: z.ZodDefault<z.ZodString>;
    useEmptyOpacity: z.ZodDefault<z.ZodBoolean>;
    emptyOpacity: z.ZodDefault<z.ZodNumber>;
    size: z.ZodDefault<z.ZodNumber>;
    gap: z.ZodDefault<z.ZodNumber>;
    allowHalf: z.ZodDefault<z.ZodBoolean>;
    showValue: z.ZodDefault<z.ZodBoolean>;
    valuePosition: z.ZodDefault<z.ZodEnum<{
        left: "left";
        right: "right";
    }>>;
    valueFormat: z.ZodDefault<z.ZodEnum<{
        none: "none";
        decimal: "decimal";
        percent: "percent";
        fraction: "fraction";
    }>>;
    valueFontSize: z.ZodDefault<z.ZodNumber>;
    valueFontFamily: z.ZodDefault<z.ZodString>;
    valueColor: z.ZodDefault<z.ZodString>;
    valueGap: z.ZodDefault<z.ZodNumber>;
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
export type IconRatingProps = z.infer<typeof IconRatingPropsSchema>;
export declare const RATING_ICON_PRESETS: Record<string, import("../..").ShapeData>;
export declare const RATING_ICON_LABELS: Record<RatingIconPreset, string>;
import type { ContainerContext, CardData } from '../../types';
type $$ComponentProps = IconRatingProps & {
    container: ContainerContext;
    data?: CardData;
};
declare const IconRating: import("svelte").Component<$$ComponentProps, {}, "">;
type IconRating = ReturnType<typeof IconRating>;
export default IconRating;
