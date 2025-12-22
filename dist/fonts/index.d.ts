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
import { type FontCategory } from './web-safe.js';
import type { DatasetId } from '../presets';
export * from './web-safe.js';
export * from './brand-fonts.js';
export * from './google-fonts.js';
export * from './loader.js';
export { default as FontLoader } from './FontLoader.svelte';
/**
 * Font option for UI dropdowns, with optional grouping.
 */
export interface FontDropdownOption {
    value: string;
    label: string;
    category?: FontCategory | 'brand';
}
/**
 * Get all fonts for a dataset (brand fonts first, then web-safe, then Google Fonts).
 * Returns options suitable for a dropdown UI.
 */
export declare function getAllFontsForDataset(datasetId: DatasetId): FontDropdownOption[];
/**
 * Get fonts organized by category for grouped dropdown display.
 * Brand fonts come first, followed by web-safe fonts by category.
 */
export declare function getFontsByGroupForDataset(datasetId: DatasetId): {
    brand: FontDropdownOption[];
    'sans-serif': FontDropdownOption[];
    serif: FontDropdownOption[];
    monospace: FontDropdownOption[];
    display: FontDropdownOption[];
    cursive: FontDropdownOption[];
};
/**
 * Get display name for a font category.
 */
export declare function getFontCategoryDisplayName(category: FontCategory | 'brand'): string;
/**
 * Font group labels for UI headers.
 */
export declare const FONT_GROUP_LABELS: Record<FontCategory | 'brand', string>;
/**
 * Legacy compatibility: simple flat list of fonts for existing code.
 * Use getAllFontsForDataset() for dataset-aware fonts.
 *
 * @deprecated Use getAllFontsForDataset(datasetId) instead
 */
export declare const fontFamilies: {
    value: string;
    label: string;
}[];
