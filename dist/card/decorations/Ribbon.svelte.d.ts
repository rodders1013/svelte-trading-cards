import { z } from 'zod';
export declare const RibbonPositionSchema: z.ZodEnum<{
    "top-left": "top-left";
    top: "top";
    "top-right": "top-right";
    "bottom-left": "bottom-left";
    bottom: "bottom";
    "bottom-right": "bottom-right";
}>;
export type RibbonPosition = z.infer<typeof RibbonPositionSchema>;
export declare const RibbonStyleSchema: z.ZodEnum<{
    flat: "flat";
    bookmark: "bookmark";
    banner: "banner";
    folded: "folded";
}>;
export type RibbonStyle = z.infer<typeof RibbonStyleSchema>;
export declare const RibbonTextPresetSchema: z.ZodEnum<{
    none: "none";
    RARE: "RARE";
    LEGENDARY: "LEGENDARY";
    MYTHIC: "MYTHIC";
    NEW: "NEW";
    HOT: "HOT";
    VERIFIED: "VERIFIED";
    "1ST EDITION": "1ST EDITION";
    COLLECTOR: "COLLECTOR";
    SPECIAL: "SPECIAL";
    PREMIUM: "PREMIUM";
    SALE: "SALE";
    EXCLUSIVE: "EXCLUSIVE";
    PROMO: "PROMO";
    LIMITED: "LIMITED";
    "SOLD OUT": "SOLD OUT";
    SOLD: "SOLD";
    BONUS: "BONUS";
    FREE: "FREE";
    "ULTRA RARE": "ULTRA RARE";
    AUTHENTIC: "AUTHENTIC";
    OFFICIAL: "OFFICIAL";
}>;
export type RibbonTextPreset = z.infer<typeof RibbonTextPresetSchema>;
export declare const RibbonPropsSchema: z.ZodObject<{
    textPreset: z.ZodDefault<z.ZodEnum<{
        none: "none";
        RARE: "RARE";
        LEGENDARY: "LEGENDARY";
        MYTHIC: "MYTHIC";
        NEW: "NEW";
        HOT: "HOT";
        VERIFIED: "VERIFIED";
        "1ST EDITION": "1ST EDITION";
        COLLECTOR: "COLLECTOR";
        SPECIAL: "SPECIAL";
        PREMIUM: "PREMIUM";
        SALE: "SALE";
        EXCLUSIVE: "EXCLUSIVE";
        PROMO: "PROMO";
        LIMITED: "LIMITED";
        "SOLD OUT": "SOLD OUT";
        SOLD: "SOLD";
        BONUS: "BONUS";
        FREE: "FREE";
        "ULTRA RARE": "ULTRA RARE";
        AUTHENTIC: "AUTHENTIC";
        OFFICIAL: "OFFICIAL";
    }>>;
    dataField: z.ZodOptional<z.ZodString>;
    position: z.ZodDefault<z.ZodEnum<{
        "top-left": "top-left";
        top: "top";
        "top-right": "top-right";
        "bottom-left": "bottom-left";
        bottom: "bottom";
        "bottom-right": "bottom-right";
    }>>;
    style: z.ZodDefault<z.ZodEnum<{
        flat: "flat";
        bookmark: "bookmark";
        banner: "banner";
        folded: "folded";
    }>>;
    color: z.ZodDefault<z.ZodString>;
    textColor: z.ZodDefault<z.ZodString>;
    shadowColor: z.ZodDefault<z.ZodString>;
    fontSize: z.ZodDefault<z.ZodNumber>;
    fontFamily: z.ZodDefault<z.ZodString>;
    fontWeight: z.ZodDefault<z.ZodString>;
    angle: z.ZodDefault<z.ZodNumber>;
    ribbonWidth: z.ZodOptional<z.ZodNumber>;
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
export type RibbonProps = z.infer<typeof RibbonPropsSchema>;
import type { ContainerContext, CardData } from '../../types';
type $$ComponentProps = RibbonProps & {
    container: ContainerContext;
    data?: CardData;
};
declare const Ribbon: import("svelte").Component<$$ComponentProps, {}, "">;
type Ribbon = ReturnType<typeof Ribbon>;
export default Ribbon;
