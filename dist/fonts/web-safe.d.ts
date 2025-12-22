/**
 * Web-safe fonts organized by category.
 * These fonts are available on most operating systems and work reliably
 * for both browser display and server-side PNG export.
 */
export type FontCategory = 'sans-serif' | 'serif' | 'monospace' | 'display' | 'cursive';
export interface FontOption {
    /** CSS font-family value */
    value: string;
    /** Display name in UI */
    label: string;
    /** Font category for grouping */
    category: FontCategory;
}
/**
 * Universal web-safe fonts that work on Windows, macOS, and Linux.
 * These are primarily Microsoft Core Web Fonts which are widely installed.
 * Organized by category: sans-serif, serif, monospace, display, cursive.
 */
export declare const WEB_SAFE_FONTS: FontOption[];
/**
 * Display names for font categories in UI.
 */
export declare const FONT_CATEGORY_NAMES: Record<FontCategory, string>;
/**
 * Get fonts grouped by category.
 * Returns an object with category names as keys and arrays of fonts as values.
 */
export declare function getFontsByCategory(): Record<FontCategory, FontOption[]>;
/**
 * Get a flat list of all web-safe fonts.
 * Returns simple {value, label} objects for dropdown compatibility.
 */
export declare function getWebSafeFonts(): Array<{
    value: string;
    label: string;
}>;
