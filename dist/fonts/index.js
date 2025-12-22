/**
 * Fonts System
 * Centralized font management for trading card components
 *
 * Provides:
 * - Universal web-safe fonts (Microsoft Core Web Fonts)
 * - Google Fonts with dynamic loading support
 * - Dataset-specific brand fonts
 * - Helper functions for font selection UI
 * - Utilities for dynamic font loading in consuming projects
 */
import { WEB_SAFE_FONTS, FONT_CATEGORY_NAMES, getFontsByCategory, getWebSafeFonts } from './web-safe.js';
import { BRAND_FONTS, getBrandFontsForDataset, getBrandFontOptions } from './brand-fonts.js';
import { GOOGLE_FONTS, getGoogleFontOptions } from './google-fonts.js';
// Re-export everything
export * from './web-safe.js';
export * from './brand-fonts.js';
export * from './google-fonts.js';
export * from './loader.js';
export { default as FontLoader } from './FontLoader.svelte';
/**
 * Get all fonts for a dataset (brand fonts first, then web-safe, then Google Fonts).
 * Returns options suitable for a dropdown UI.
 */
export function getAllFontsForDataset(datasetId) {
    const brandFonts = getBrandFontOptions(datasetId).map((f) => ({
        ...f,
        category: 'brand'
    }));
    const webSafeFonts = WEB_SAFE_FONTS.map((f) => ({
        value: f.value,
        label: f.label,
        category: f.category
    }));
    const googleFonts = GOOGLE_FONTS.map((f) => ({
        value: f.value,
        label: f.label,
        category: f.category
    }));
    return [...brandFonts, ...webSafeFonts, ...googleFonts];
}
/**
 * Get fonts organized by category for grouped dropdown display.
 * Brand fonts come first, followed by web-safe fonts by category.
 */
export function getFontsByGroupForDataset(datasetId) {
    const brandFonts = getBrandFontOptions(datasetId).map((f) => ({
        ...f,
        category: 'brand'
    }));
    const categorized = getFontsByCategory();
    return {
        brand: brandFonts,
        'sans-serif': categorized['sans-serif'].map((f) => ({
            value: f.value,
            label: f.label,
            category: f.category
        })),
        serif: categorized.serif.map((f) => ({
            value: f.value,
            label: f.label,
            category: f.category
        })),
        monospace: categorized.monospace.map((f) => ({
            value: f.value,
            label: f.label,
            category: f.category
        })),
        display: categorized.display.map((f) => ({
            value: f.value,
            label: f.label,
            category: f.category
        })),
        cursive: categorized.cursive.map((f) => ({
            value: f.value,
            label: f.label,
            category: f.category
        }))
    };
}
/**
 * Get display name for a font category.
 */
export function getFontCategoryDisplayName(category) {
    if (category === 'brand') {
        return 'Brand';
    }
    return FONT_CATEGORY_NAMES[category];
}
/**
 * Font group labels for UI headers.
 */
export const FONT_GROUP_LABELS = {
    brand: 'Brand',
    'sans-serif': 'Sans-Serif',
    serif: 'Serif',
    monospace: 'Monospace',
    display: 'Display',
    cursive: 'Cursive'
};
/**
 * Legacy compatibility: simple flat list of fonts for existing code.
 * Use getAllFontsForDataset() for dataset-aware fonts.
 *
 * @deprecated Use getAllFontsForDataset(datasetId) instead
 */
export const fontFamilies = getWebSafeFonts();
