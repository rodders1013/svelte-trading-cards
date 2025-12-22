import { z } from 'zod';
import type { ShapeSource } from '../styling/shapes';
export declare const CARD_WIDTH = 750;
export declare const CARD_HEIGHT = 1050;
export declare const CARD_RADIUS = 26;
export interface ContainerContext {
    width: number;
    height: number;
    radius: number;
    /** Shape for clipping/borders - uses icon-based shape system */
    shapeSource?: ShapeSource;
}
export declare const ComponentDefinitionSchema: z.ZodType<ComponentDefinition>;
export interface ComponentDefinition {
    id: string;
    type: string;
    props: Record<string, unknown>;
    children?: ComponentDefinition[];
}
export declare const CardTemplateSchema: z.ZodObject<{
    name: z.ZodString;
    components: z.ZodArray<z.ZodType<ComponentDefinition, unknown, z.core.$ZodTypeInternals<ComponentDefinition, unknown>>>;
    display: z.ZodOptional<z.ZodObject<{
        rarity: z.ZodOptional<z.ZodEnum<{
            common: "common";
            uncommon: "uncommon";
            rare: "rare";
            epic: "epic";
            legendary: "legendary";
            mythic: "mythic";
        }>>;
        customGradient: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type CardTemplate = z.infer<typeof CardTemplateSchema>;
