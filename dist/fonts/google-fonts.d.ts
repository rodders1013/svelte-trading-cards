/**
 * Google Fonts available in the library.
 *
 * These fonts are loaded from Google Fonts CDN on the client,
 * and should have TTF files bundled for server-side rendering.
 *
 * All fonts listed here are free and open source (SIL Open Font License).
 */
import type { FontCategory } from './web-safe.js';
export interface GoogleFont {
    /** Font name as it appears on Google Fonts */
    name: string;
    /** CSS font-family value (with fallback) */
    value: string;
    /** Display label in UI */
    label: string;
    /** Font category for grouping */
    category: FontCategory;
    /** Available weights (for reference) */
    weights: number[];
}
/**
 * Curated list of Google Fonts.
 * These are popular, versatile fonts good for trading cards.
 */
export declare const GOOGLE_FONTS: GoogleFont[];
/**
 * Get Google Fonts formatted for dropdown menus.
 */
export declare function getGoogleFontOptions(): Array<{
    value: string;
    label: string;
    category: FontCategory;
}>;
/**
 * Get a Google Font by name.
 */
export declare function getGoogleFontByName(name: string): GoogleFont | undefined;
/**
 * Get all unique font names (for preloading all fonts).
 */
export declare function getAllGoogleFontNames(): string[];
