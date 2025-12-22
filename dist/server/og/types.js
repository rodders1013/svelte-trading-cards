import { z } from 'zod';
// =============================================================================
// OG IMAGE SIZE PRESETS
// =============================================================================
/**
 * Platform-optimized Open Graph image sizes.
 * All sizes are in pixels and optimized for each platform's preview requirements.
 */
export const OG_IMAGE_PRESETS = {
    /** Twitter/X - 1.91:1 aspect ratio */
    twitter: { width: 1200, height: 628 },
    /** Facebook - 1.91:1 aspect ratio */
    facebook: { width: 1200, height: 630 },
    /** Discord - 16:9 aspect ratio (larger preview) */
    discord: { width: 1200, height: 675 },
    /** LinkedIn - 1.91:1 aspect ratio */
    linkedin: { width: 1200, height: 627 },
    /** Square format - 1:1 (Instagram, general fallback) */
    square: { width: 1200, height: 1200 },
    /** Portrait format - closer to card aspect ratio */
    portrait: { width: 900, height: 1200 }
};
// =============================================================================
// POSITION TYPES
// =============================================================================
export const PositionSchema = z.enum([
    'top-left',
    'top-center',
    'top-right',
    'bottom-left',
    'bottom-center',
    'bottom-right'
]);
// =============================================================================
// BRANDING OPTIONS
// =============================================================================
/**
 * Logo configuration for OG images
 */
export const LogoConfigSchema = z.object({
    /** URL to logo image (PNG, JPG, SVG) */
    url: z.string(),
    /** Position on the image */
    position: PositionSchema.optional(),
    /** Logo size in pixels (height, width auto-scales) */
    size: z.number().optional(),
    /** Padding from edge in pixels */
    padding: z.number().optional(),
    /** Optional opacity (0-1) */
    opacity: z.number().min(0).max(1).optional()
});
/**
 * Watermark text configuration
 */
export const WatermarkConfigSchema = z.object({
    /** Watermark text */
    text: z.string(),
    /** Position on the image */
    position: PositionSchema.optional(),
    /** Text color */
    color: z.string().optional(),
    /** Opacity (0-1) */
    opacity: z.number().min(0).max(1).optional(),
    /** Font size in pixels */
    fontSize: z.number().optional(),
    /** Font family */
    fontFamily: z.string().optional(),
    /** Padding from edge */
    padding: z.number().optional()
});
/**
 * Caption configuration (title/subtitle below or beside card)
 */
export const CaptionConfigSchema = z.object({
    /** Main title text */
    title: z.string().optional(),
    /** Subtitle text (e.g., "by @username") */
    subtitle: z.string().optional(),
    /** Text color */
    color: z.string().optional(),
    /** Title font size */
    titleFontSize: z.number().optional(),
    /** Subtitle font size */
    subtitleFontSize: z.number().optional(),
    /** Font family */
    fontFamily: z.string().optional(),
    /** Position relative to card */
    position: z.enum(['below', 'right']).optional()
});
/**
 * Full branding configuration
 */
export const BrandingConfigSchema = z.object({
    /** Logo image */
    logo: LogoConfigSchema.optional(),
    /** Watermark text */
    watermark: WatermarkConfigSchema.optional(),
    /** Caption (title/subtitle) */
    caption: CaptionConfigSchema.optional()
});
// =============================================================================
// MAIN OG IMAGE OPTIONS
// =============================================================================
/**
 * Custom size specification
 */
export const CustomSizeSchema = z.object({
    width: z.number().min(100).max(4096),
    height: z.number().min(100).max(4096)
});
/**
 * Full OG image rendering options
 */
export const OGImageOptionsSchema = z.object({
    /** Use a preset size or custom dimensions */
    preset: z.enum(['twitter', 'facebook', 'discord', 'linkedin', 'square', 'portrait']).optional(),
    /** Custom size (overrides preset) */
    size: CustomSizeSchema.optional(),
    /** Background color (hex, rgb, or gradient) */
    background: z.string().default('#1a1a2e'),
    /** Optional background gradient (overrides background color) */
    backgroundGradient: z
        .object({
        from: z.string(),
        to: z.string(),
        direction: z.enum(['vertical', 'horizontal', 'diagonal']).default('vertical')
    })
        .optional(),
    /** How much of the image height the card should occupy (0-1) */
    cardScale: z.number().min(0.3).max(1).default(0.85),
    /** Horizontal position of card */
    cardPosition: z.enum(['left', 'center', 'right']).default('center'),
    /** Branding elements */
    branding: BrandingConfigSchema.optional(),
    /** Output scale (1 = actual size, 2 = 2x resolution) */
    scale: z.number().min(1).max(4).default(1),
    /** Card corner radius (inherits from card if not set) */
    cardRadius: z.number().optional()
});
// =============================================================================
// HELPER FUNCTIONS
// =============================================================================
/**
 * Get dimensions for a preset or custom size
 */
export function getOGImageSize(options) {
    if (options.size) {
        return options.size;
    }
    const preset = options.preset ?? 'twitter';
    return OG_IMAGE_PRESETS[preset];
}
/**
 * Calculate position coordinates based on position name
 */
export function getPositionCoords(position, containerWidth, containerHeight, elementWidth, elementHeight, padding) {
    let x;
    let y;
    // Horizontal position
    if (position.includes('left')) {
        x = padding;
    }
    else if (position.includes('right')) {
        x = containerWidth - elementWidth - padding;
    }
    else {
        x = (containerWidth - elementWidth) / 2;
    }
    // Vertical position
    if (position.includes('top')) {
        y = padding;
    }
    else if (position.includes('bottom')) {
        y = containerHeight - elementHeight - padding;
    }
    else {
        y = (containerHeight - elementHeight) / 2;
    }
    return { x, y };
}
/**
 * Get text anchor based on position
 */
export function getTextAnchor(position) {
    if (position.includes('left'))
        return 'start';
    if (position.includes('right'))
        return 'end';
    return 'middle';
}
