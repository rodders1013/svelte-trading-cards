import { z } from 'zod';
export declare const ImageShapeSourceSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    type: z.ZodLiteral<"builtin">;
    shape: z.ZodEnum<{
        message: "message";
        circle: "circle";
        square: "square";
        rectangle: "rectangle";
        triangle: "triangle";
        diamond: "diamond";
        hexagon: "hexagon";
        octagon: "octagon";
        pentagon: "pentagon";
        ellipse: "ellipse";
        star: "star";
        heart: "heart";
        shield: "shield";
        bookmark: "bookmark";
        label: "label";
        cloud: "cloud";
        crown: "crown";
        trophy: "trophy";
        medal: "medal";
        seal: "seal";
        certificate: "certificate";
        card: "card";
    }>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"custom">;
    iconData: z.ZodObject<{
        body: z.ZodString;
        width: z.ZodDefault<z.ZodNumber>;
        height: z.ZodDefault<z.ZodNumber>;
    }, z.core.$strip>;
    iconName: z.ZodOptional<z.ZodString>;
}, z.core.$strip>], "type">;
export declare const ImagePropsSchema: z.ZodObject<{
    imageUrl: z.ZodOptional<z.ZodString>;
    dataField: z.ZodOptional<z.ZodString>;
    opacity: z.ZodDefault<z.ZodNumber>;
    preserveAspectRatio: z.ZodDefault<z.ZodString>;
    shapeSource: z.ZodOptional<z.ZodDiscriminatedUnion<[z.ZodObject<{
        type: z.ZodLiteral<"builtin">;
        shape: z.ZodEnum<{
            message: "message";
            circle: "circle";
            square: "square";
            rectangle: "rectangle";
            triangle: "triangle";
            diamond: "diamond";
            hexagon: "hexagon";
            octagon: "octagon";
            pentagon: "pentagon";
            ellipse: "ellipse";
            star: "star";
            heart: "heart";
            shield: "shield";
            bookmark: "bookmark";
            label: "label";
            cloud: "cloud";
            crown: "crown";
            trophy: "trophy";
            medal: "medal";
            seal: "seal";
            certificate: "certificate";
            card: "card";
        }>;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"custom">;
        iconData: z.ZodObject<{
            body: z.ZodString;
            width: z.ZodDefault<z.ZodNumber>;
            height: z.ZodDefault<z.ZodNumber>;
        }, z.core.$strip>;
        iconName: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>], "type">>;
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
    filter: z.ZodOptional<z.ZodObject<{
        brightness: z.ZodDefault<z.ZodNumber>;
        contrast: z.ZodDefault<z.ZodNumber>;
        saturate: z.ZodDefault<z.ZodNumber>;
        blur: z.ZodDefault<z.ZodNumber>;
        grayscale: z.ZodDefault<z.ZodNumber>;
        sepia: z.ZodDefault<z.ZodNumber>;
        hueRotate: z.ZodDefault<z.ZodNumber>;
        invert: z.ZodDefault<z.ZodNumber>;
    }, z.core.$strip>>;
    transform: z.ZodOptional<z.ZodObject<{
        offsetX: z.ZodDefault<z.ZodNumber>;
        offsetY: z.ZodDefault<z.ZodNumber>;
        scale: z.ZodDefault<z.ZodNumber>;
        rotation: z.ZodDefault<z.ZodNumber>;
        flipHorizontal: z.ZodDefault<z.ZodBoolean>;
        flipVertical: z.ZodDefault<z.ZodBoolean>;
    }, z.core.$strip>>;
    border: z.ZodOptional<z.ZodObject<{
        color: z.ZodString;
        width: z.ZodNumber;
        opacity: z.ZodOptional<z.ZodNumber>;
        style: z.ZodOptional<z.ZodEnum<{
            solid: "solid";
            dashed: "dashed";
            dotted: "dotted";
        }>>;
        glow: z.ZodOptional<z.ZodObject<{
            color: z.ZodString;
            intensity: z.ZodNumber;
            blur: z.ZodNumber;
            animated: z.ZodOptional<z.ZodBoolean>;
            speed: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
    holographic: z.ZodOptional<z.ZodObject<{
        color: z.ZodOptional<z.ZodString>;
        secondaryColor: z.ZodOptional<z.ZodString>;
        tertiaryColor: z.ZodOptional<z.ZodString>;
        speed: z.ZodOptional<z.ZodNumber>;
        angle: z.ZodOptional<z.ZodNumber>;
        apply: z.ZodOptional<z.ZodEnum<{
            fill: "fill";
            stroke: "stroke";
            both: "both";
        }>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type ImageProps = z.infer<typeof ImagePropsSchema>;
import type { ContainerContext, CardData } from '../../types';
type $$ComponentProps = ImageProps & {
    container: ContainerContext;
    data?: CardData;
};
declare const Image: import("svelte").Component<$$ComponentProps, {}, "">;
type Image = ReturnType<typeof Image>;
export default Image;
