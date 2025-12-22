import { z } from 'zod';
export declare const TextPresetSchema: z.ZodEnum<{
    none: "none";
    COMMON: "COMMON";
    UNCOMMON: "UNCOMMON";
    RARE: "RARE";
    EPIC: "EPIC";
    LEGENDARY: "LEGENDARY";
    MYTHIC: "MYTHIC";
    NEW: "NEW";
    HOT: "HOT";
    VERIFIED: "VERIFIED";
    "1ST EDITION": "1ST EDITION";
    COLLECTOR: "COLLECTOR";
    SPECIAL: "SPECIAL";
    PREMIUM: "PREMIUM";
    ULTRA: "ULTRA";
    EXCLUSIVE: "EXCLUSIVE";
    PROMO: "PROMO";
    LIMITED: "LIMITED";
    SOLD: "SOLD";
}>;
export type TextPreset = z.infer<typeof TextPresetSchema>;
/**
 * Text bounds configuration for constraining text within a safe zone.
 * Useful when layer has a clip shape - insets define where text can render.
 * Values are percentages (0-50) of the container dimensions.
 */
export declare const TextBoundsConfigSchema: z.ZodObject<{
    insetLeft: z.ZodDefault<z.ZodNumber>;
    insetRight: z.ZodDefault<z.ZodNumber>;
    insetTop: z.ZodDefault<z.ZodNumber>;
    insetBottom: z.ZodDefault<z.ZodNumber>;
    showGuide: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
export type TextBoundsConfig = z.infer<typeof TextBoundsConfigSchema>;
export declare const TextFieldPropsSchema: z.ZodObject<{
    textPreset: z.ZodOptional<z.ZodEnum<{
        none: "none";
        COMMON: "COMMON";
        UNCOMMON: "UNCOMMON";
        RARE: "RARE";
        EPIC: "EPIC";
        LEGENDARY: "LEGENDARY";
        MYTHIC: "MYTHIC";
        NEW: "NEW";
        HOT: "HOT";
        VERIFIED: "VERIFIED";
        "1ST EDITION": "1ST EDITION";
        COLLECTOR: "COLLECTOR";
        SPECIAL: "SPECIAL";
        PREMIUM: "PREMIUM";
        ULTRA: "ULTRA";
        EXCLUSIVE: "EXCLUSIVE";
        PROMO: "PROMO";
        LIMITED: "LIMITED";
        SOLD: "SOLD";
    }>>;
    dataField: z.ZodOptional<z.ZodString>;
    maxFontSize: z.ZodDefault<z.ZodNumber>;
    minFontSize: z.ZodDefault<z.ZodNumber>;
    fontFamily: z.ZodDefault<z.ZodString>;
    fontWeight: z.ZodDefault<z.ZodString>;
    fontStyle: z.ZodOptional<z.ZodEnum<{
        normal: "normal";
        italic: "italic";
    }>>;
    textDecoration: z.ZodOptional<z.ZodEnum<{
        none: "none";
        underline: "underline";
        "line-through": "line-through";
    }>>;
    textTransform: z.ZodOptional<z.ZodEnum<{
        none: "none";
        uppercase: "uppercase";
        lowercase: "lowercase";
        capitalize: "capitalize";
    }>>;
    color: z.ZodDefault<z.ZodString>;
    opacity: z.ZodOptional<z.ZodNumber>;
    alignment: z.ZodDefault<z.ZodEnum<{
        center: "center";
        left: "left";
        right: "right";
    }>>;
    verticalAlign: z.ZodDefault<z.ZodEnum<{
        center: "center";
        top: "top";
        bottom: "bottom";
    }>>;
    padding: z.ZodOptional<z.ZodNumber>;
    lineHeight: z.ZodOptional<z.ZodNumber>;
    bounds: z.ZodOptional<z.ZodObject<{
        insetLeft: z.ZodDefault<z.ZodNumber>;
        insetRight: z.ZodDefault<z.ZodNumber>;
        insetTop: z.ZodDefault<z.ZodNumber>;
        insetBottom: z.ZodDefault<z.ZodNumber>;
        showGuide: z.ZodDefault<z.ZodBoolean>;
    }, z.core.$strip>>;
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
export type TextFieldProps = z.infer<typeof TextFieldPropsSchema>;
import type { ContainerContext, CardData } from '../../types';
type $$ComponentProps = TextFieldProps & {
    container: ContainerContext;
    data?: CardData;
};
declare const TextField: import("svelte").Component<$$ComponentProps, {}, "">;
type TextField = ReturnType<typeof TextField>;
export default TextField;
