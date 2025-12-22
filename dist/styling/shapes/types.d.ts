import { z } from 'zod';
import type { IconData } from '../../card/icons/Icon.svelte';
export declare const BuiltInShapeSchema: z.ZodEnum<{
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
export type BuiltInShape = z.infer<typeof BuiltInShapeSchema>;
export interface ShapeData {
    body: string;
    width: number;
    height: number;
}
export type ShapeSource = {
    type: 'builtin';
    shape: BuiltInShape;
} | {
    type: 'custom';
    iconData: IconData;
    iconName?: string;
};
export interface ShapeConfig {
    source: ShapeSource;
    data?: ShapeData;
}
export interface ShapeRenderOptions {
    width: number;
    height: number;
    scaleMode?: 'contain' | 'cover' | 'stretch';
}
export declare const BUILT_IN_SHAPES: ("message" | "circle" | "square" | "rectangle" | "triangle" | "diamond" | "hexagon" | "octagon" | "pentagon" | "ellipse" | "star" | "heart" | "shield" | "bookmark" | "label" | "cloud" | "crown" | "trophy" | "medal" | "seal" | "certificate" | "card")[];
export declare const SHAPE_CATEGORIES: {
    readonly geometric: readonly ["circle", "square", "rectangle", "triangle", "diamond", "hexagon", "octagon", "pentagon", "ellipse"];
    readonly decorative: readonly ["star", "heart", "shield", "bookmark", "label", "cloud", "message"];
    readonly awards: readonly ["crown", "trophy", "medal", "seal", "certificate"];
    readonly containers: readonly ["card"];
};
