import { z } from 'zod';
/**
 * Platform-optimized Open Graph image sizes.
 * All sizes are in pixels and optimized for each platform's preview requirements.
 */
export declare const OG_IMAGE_PRESETS: {
    /** Twitter/X - 1.91:1 aspect ratio */
    readonly twitter: {
        readonly width: 1200;
        readonly height: 628;
    };
    /** Facebook - 1.91:1 aspect ratio */
    readonly facebook: {
        readonly width: 1200;
        readonly height: 630;
    };
    /** Discord - 16:9 aspect ratio (larger preview) */
    readonly discord: {
        readonly width: 1200;
        readonly height: 675;
    };
    /** LinkedIn - 1.91:1 aspect ratio */
    readonly linkedin: {
        readonly width: 1200;
        readonly height: 627;
    };
    /** Square format - 1:1 (Instagram, general fallback) */
    readonly square: {
        readonly width: 1200;
        readonly height: 1200;
    };
    /** Portrait format - closer to card aspect ratio */
    readonly portrait: {
        readonly width: 900;
        readonly height: 1200;
    };
};
export type OGImagePreset = keyof typeof OG_IMAGE_PRESETS;
export declare const PositionSchema: z.ZodEnum<{
    "top-left": "top-left";
    "top-right": "top-right";
    "bottom-left": "bottom-left";
    "bottom-right": "bottom-right";
    "top-center": "top-center";
    "bottom-center": "bottom-center";
}>;
export type Position = z.infer<typeof PositionSchema>;
/**
 * Logo configuration for OG images
 */
export declare const LogoConfigSchema: z.ZodObject<{
    url: z.ZodString;
    position: z.ZodOptional<z.ZodEnum<{
        "top-left": "top-left";
        "top-right": "top-right";
        "bottom-left": "bottom-left";
        "bottom-right": "bottom-right";
        "top-center": "top-center";
        "bottom-center": "bottom-center";
    }>>;
    size: z.ZodOptional<z.ZodNumber>;
    padding: z.ZodOptional<z.ZodNumber>;
    opacity: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export type LogoConfig = z.infer<typeof LogoConfigSchema>;
/**
 * Watermark text configuration
 */
export declare const WatermarkConfigSchema: z.ZodObject<{
    text: z.ZodString;
    position: z.ZodOptional<z.ZodEnum<{
        "top-left": "top-left";
        "top-right": "top-right";
        "bottom-left": "bottom-left";
        "bottom-right": "bottom-right";
        "top-center": "top-center";
        "bottom-center": "bottom-center";
    }>>;
    color: z.ZodOptional<z.ZodString>;
    opacity: z.ZodOptional<z.ZodNumber>;
    fontSize: z.ZodOptional<z.ZodNumber>;
    fontFamily: z.ZodOptional<z.ZodString>;
    padding: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export type WatermarkConfig = z.infer<typeof WatermarkConfigSchema>;
/**
 * Caption configuration (title/subtitle below or beside card)
 */
export declare const CaptionConfigSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    subtitle: z.ZodOptional<z.ZodString>;
    color: z.ZodOptional<z.ZodString>;
    titleFontSize: z.ZodOptional<z.ZodNumber>;
    subtitleFontSize: z.ZodOptional<z.ZodNumber>;
    fontFamily: z.ZodOptional<z.ZodString>;
    position: z.ZodOptional<z.ZodEnum<{
        right: "right";
        below: "below";
    }>>;
}, z.core.$strip>;
export type CaptionConfig = z.infer<typeof CaptionConfigSchema>;
/**
 * Full branding configuration
 */
export declare const BrandingConfigSchema: z.ZodObject<{
    logo: z.ZodOptional<z.ZodObject<{
        url: z.ZodString;
        position: z.ZodOptional<z.ZodEnum<{
            "top-left": "top-left";
            "top-right": "top-right";
            "bottom-left": "bottom-left";
            "bottom-right": "bottom-right";
            "top-center": "top-center";
            "bottom-center": "bottom-center";
        }>>;
        size: z.ZodOptional<z.ZodNumber>;
        padding: z.ZodOptional<z.ZodNumber>;
        opacity: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
    watermark: z.ZodOptional<z.ZodObject<{
        text: z.ZodString;
        position: z.ZodOptional<z.ZodEnum<{
            "top-left": "top-left";
            "top-right": "top-right";
            "bottom-left": "bottom-left";
            "bottom-right": "bottom-right";
            "top-center": "top-center";
            "bottom-center": "bottom-center";
        }>>;
        color: z.ZodOptional<z.ZodString>;
        opacity: z.ZodOptional<z.ZodNumber>;
        fontSize: z.ZodOptional<z.ZodNumber>;
        fontFamily: z.ZodOptional<z.ZodString>;
        padding: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
    caption: z.ZodOptional<z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
        subtitle: z.ZodOptional<z.ZodString>;
        color: z.ZodOptional<z.ZodString>;
        titleFontSize: z.ZodOptional<z.ZodNumber>;
        subtitleFontSize: z.ZodOptional<z.ZodNumber>;
        fontFamily: z.ZodOptional<z.ZodString>;
        position: z.ZodOptional<z.ZodEnum<{
            right: "right";
            below: "below";
        }>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type BrandingConfig = z.infer<typeof BrandingConfigSchema>;
/**
 * Custom size specification
 */
export declare const CustomSizeSchema: z.ZodObject<{
    width: z.ZodNumber;
    height: z.ZodNumber;
}, z.core.$strip>;
export type CustomSize = z.infer<typeof CustomSizeSchema>;
/**
 * Full OG image rendering options
 */
export declare const OGImageOptionsSchema: z.ZodObject<{
    preset: z.ZodOptional<z.ZodEnum<{
        square: "square";
        twitter: "twitter";
        facebook: "facebook";
        discord: "discord";
        linkedin: "linkedin";
        portrait: "portrait";
    }>>;
    size: z.ZodOptional<z.ZodObject<{
        width: z.ZodNumber;
        height: z.ZodNumber;
    }, z.core.$strip>>;
    background: z.ZodDefault<z.ZodString>;
    backgroundGradient: z.ZodOptional<z.ZodObject<{
        from: z.ZodString;
        to: z.ZodString;
        direction: z.ZodDefault<z.ZodEnum<{
            vertical: "vertical";
            horizontal: "horizontal";
            diagonal: "diagonal";
        }>>;
    }, z.core.$strip>>;
    cardScale: z.ZodDefault<z.ZodNumber>;
    cardPosition: z.ZodDefault<z.ZodEnum<{
        center: "center";
        left: "left";
        right: "right";
    }>>;
    branding: z.ZodOptional<z.ZodObject<{
        logo: z.ZodOptional<z.ZodObject<{
            url: z.ZodString;
            position: z.ZodOptional<z.ZodEnum<{
                "top-left": "top-left";
                "top-right": "top-right";
                "bottom-left": "bottom-left";
                "bottom-right": "bottom-right";
                "top-center": "top-center";
                "bottom-center": "bottom-center";
            }>>;
            size: z.ZodOptional<z.ZodNumber>;
            padding: z.ZodOptional<z.ZodNumber>;
            opacity: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>>;
        watermark: z.ZodOptional<z.ZodObject<{
            text: z.ZodString;
            position: z.ZodOptional<z.ZodEnum<{
                "top-left": "top-left";
                "top-right": "top-right";
                "bottom-left": "bottom-left";
                "bottom-right": "bottom-right";
                "top-center": "top-center";
                "bottom-center": "bottom-center";
            }>>;
            color: z.ZodOptional<z.ZodString>;
            opacity: z.ZodOptional<z.ZodNumber>;
            fontSize: z.ZodOptional<z.ZodNumber>;
            fontFamily: z.ZodOptional<z.ZodString>;
            padding: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>>;
        caption: z.ZodOptional<z.ZodObject<{
            title: z.ZodOptional<z.ZodString>;
            subtitle: z.ZodOptional<z.ZodString>;
            color: z.ZodOptional<z.ZodString>;
            titleFontSize: z.ZodOptional<z.ZodNumber>;
            subtitleFontSize: z.ZodOptional<z.ZodNumber>;
            fontFamily: z.ZodOptional<z.ZodString>;
            position: z.ZodOptional<z.ZodEnum<{
                right: "right";
                below: "below";
            }>>;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
    scale: z.ZodDefault<z.ZodNumber>;
    cardRadius: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export type OGImageOptions = z.infer<typeof OGImageOptionsSchema>;
/**
 * Get dimensions for a preset or custom size
 */
export declare function getOGImageSize(options: OGImageOptions): {
    width: number;
    height: number;
};
/**
 * Calculate position coordinates based on position name
 */
export declare function getPositionCoords(position: Position, containerWidth: number, containerHeight: number, elementWidth: number, elementHeight: number, padding: number): {
    x: number;
    y: number;
};
/**
 * Get text anchor based on position
 */
export declare function getTextAnchor(position: Position): string;
