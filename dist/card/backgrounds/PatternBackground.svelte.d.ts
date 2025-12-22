import { z } from 'zod';
export declare const PatternTypeSchema: z.ZodEnum<{
    icon: "icon";
    grid: "grid";
    diagonal: "diagonal";
    dots: "dots";
    hexagons: "hexagons";
    triangles: "triangles";
    squares: "squares";
    diamonds: "diamonds";
    chevrons: "chevrons";
    waves: "waves";
    circles: "circles";
    crosses: "crosses";
    zigzag: "zigzag";
    checkered: "checkered";
    "stripes-h": "stripes-h";
    "stripes-v": "stripes-v";
    confetti: "confetti";
    stars: "stars";
    icons: "icons";
}>;
export type PatternType = z.infer<typeof PatternTypeSchema>;
export declare const PatternIconItemSchema: z.ZodObject<{
    iconData: z.ZodObject<{
        body: z.ZodString;
        width: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        height: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        left: z.ZodOptional<z.ZodNumber>;
        top: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>;
    iconName: z.ZodOptional<z.ZodString>;
    rotation: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
export type PatternIconItem = z.infer<typeof PatternIconItemSchema>;
export declare const PatternBackgroundPropsSchema: z.ZodObject<{
    pattern: z.ZodDefault<z.ZodEnum<{
        icon: "icon";
        grid: "grid";
        diagonal: "diagonal";
        dots: "dots";
        hexagons: "hexagons";
        triangles: "triangles";
        squares: "squares";
        diamonds: "diamonds";
        chevrons: "chevrons";
        waves: "waves";
        circles: "circles";
        crosses: "crosses";
        zigzag: "zigzag";
        checkered: "checkered";
        "stripes-h": "stripes-h";
        "stripes-v": "stripes-v";
        confetti: "confetti";
        stars: "stars";
        icons: "icons";
    }>>;
    color: z.ZodDefault<z.ZodString>;
    opacity: z.ZodDefault<z.ZodNumber>;
    size: z.ZodDefault<z.ZodNumber>;
    spacing: z.ZodDefault<z.ZodNumber>;
    rotation: z.ZodDefault<z.ZodNumber>;
    strokeWidth: z.ZodDefault<z.ZodNumber>;
    icon: z.ZodOptional<z.ZodObject<{
        body: z.ZodString;
        width: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        height: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        left: z.ZodOptional<z.ZodNumber>;
        top: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
    iconName: z.ZodOptional<z.ZodString>;
    iconRotation: z.ZodDefault<z.ZodNumber>;
    iconScale: z.ZodDefault<z.ZodNumber>;
    icons: z.ZodOptional<z.ZodArray<z.ZodObject<{
        iconData: z.ZodObject<{
            body: z.ZodString;
            width: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
            height: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
            left: z.ZodOptional<z.ZodNumber>;
            top: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>;
        iconName: z.ZodOptional<z.ZodString>;
        rotation: z.ZodDefault<z.ZodNumber>;
    }, z.core.$strip>>>;
    rowOffset: z.ZodDefault<z.ZodNumber>;
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
export type PatternBackgroundProps = z.infer<typeof PatternBackgroundPropsSchema>;
export declare const PATTERN_LABELS: Record<PatternType, string>;
export declare const PATTERN_PRESETS: Record<PatternType, {
    size: number;
    spacing: number;
    strokeWidth: number;
}>;
import type { ContainerContext, CardData } from '../../types';
type $$ComponentProps = PatternBackgroundProps & {
    container: ContainerContext;
    data?: CardData;
};
declare const PatternBackground: import("svelte").Component<$$ComponentProps, {}, "">;
type PatternBackground = ReturnType<typeof PatternBackground>;
export default PatternBackground;
