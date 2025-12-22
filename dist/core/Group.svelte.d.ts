import { z } from 'zod';
export declare const GroupPropsSchema: z.ZodObject<{
    x: z.ZodDefault<z.ZodNumber>;
    y: z.ZodDefault<z.ZodNumber>;
    width: z.ZodNumber;
    height: z.ZodNumber;
    radius: z.ZodDefault<z.ZodNumber>;
    clipContent: z.ZodDefault<z.ZodBoolean>;
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
            left: z.ZodOptional<z.ZodNumber>;
            top: z.ZodOptional<z.ZodNumber>;
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
}, z.core.$strip>;
export type GroupProps = z.infer<typeof GroupPropsSchema>;
import type { ComponentDefinition, ContainerContext, CardData } from '../types';
type $$ComponentProps = GroupProps & {
    children?: ComponentDefinition[];
    data: CardData;
    container: ContainerContext;
};
declare const Group: import("svelte").Component<$$ComponentProps, {}, "">;
type Group = ReturnType<typeof Group>;
export default Group;
