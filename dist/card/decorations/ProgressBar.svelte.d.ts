import { z } from 'zod';
export declare const ProgressBarStyleSchema: z.ZodEnum<{
    square: "square";
    rounded: "rounded";
    pointed: "pointed";
}>;
export type ProgressBarStyle = z.infer<typeof ProgressBarStyleSchema>;
export declare const LabelPositionSchema: z.ZodEnum<{
    none: "none";
    center: "center";
    left: "left";
    right: "right";
    inside: "inside";
}>;
export type LabelPosition = z.infer<typeof LabelPositionSchema>;
export declare const ProgressBarPropsSchema: z.ZodObject<{
    value: z.ZodDefault<z.ZodNumber>;
    max: z.ZodDefault<z.ZodNumber>;
    dataField: z.ZodOptional<z.ZodString>;
    color: z.ZodDefault<z.ZodString>;
    backgroundColor: z.ZodDefault<z.ZodString>;
    borderColor: z.ZodOptional<z.ZodString>;
    borderWidth: z.ZodDefault<z.ZodNumber>;
    showLabel: z.ZodDefault<z.ZodBoolean>;
    labelPosition: z.ZodDefault<z.ZodEnum<{
        none: "none";
        center: "center";
        left: "left";
        right: "right";
        inside: "inside";
    }>>;
    labelColor: z.ZodDefault<z.ZodString>;
    labelFontSize: z.ZodDefault<z.ZodNumber>;
    labelFontFamily: z.ZodDefault<z.ZodString>;
    labelFormat: z.ZodDefault<z.ZodEnum<{
        value: "value";
        percent: "percent";
        fraction: "fraction";
    }>>;
    style: z.ZodDefault<z.ZodEnum<{
        square: "square";
        rounded: "rounded";
        pointed: "pointed";
    }>>;
    segments: z.ZodDefault<z.ZodNumber>;
    segmentGap: z.ZodDefault<z.ZodNumber>;
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
export type ProgressBarProps = z.infer<typeof ProgressBarPropsSchema>;
import type { ContainerContext, CardData } from '../../types';
type $$ComponentProps = ProgressBarProps & {
    container: ContainerContext;
    data?: CardData;
};
declare const ProgressBar: import("svelte").Component<$$ComponentProps, {}, "">;
type ProgressBar = ReturnType<typeof ProgressBar>;
export default ProgressBar;
