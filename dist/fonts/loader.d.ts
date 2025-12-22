/**
 * Font Loading Utilities
 *
 * Provides helpers for dynamic font loading in consuming projects.
 * Supports:
 * - Google Fonts (loaded from CDN)
 * - Brand fonts like SST (loaded from bundled base64 data)
 * - Web-safe fonts (no loading needed)
 */
/**
 * Extract the font name from a CSS font-family value.
 * e.g., "Roboto, sans-serif" → "Roboto"
 */
export declare function extractFontName(fontFamily: string): string;
/**
 * Check if a font-family value is web-safe (no loading needed).
 */
export declare function isWebSafeFont(fontFamily: string): boolean;
/**
 * Check if a font is a known Google Font from our library.
 */
export declare function isGoogleFont(fontFamily: string): boolean;
/**
 * Extract all unique font families from a card configuration.
 * Walks through all zones and components to find fontFamily properties.
 */
export declare function extractFontsFromCard(cardConfig: unknown): string[];
/**
 * Filter fonts to only those that need loading (not web-safe).
 */
export declare function getFontsNeedingLoad(fonts: string[]): string[];
/**
 * Get the Google Font names from a list of font-family values.
 * Returns just the font names (without fallbacks) for fonts that are Google Fonts.
 */
export declare function getGoogleFontNames(fontFamilies: string[]): string[];
/**
 * Generate a Google Fonts CSS URL for the given font names.
 *
 * @param fontNames Array of font names (e.g., ["Roboto", "Open Sans"])
 * @param weights Array of weights to load (default: [400, 700] for normal and bold)
 * @returns Google Fonts CSS URL
 *
 * @example
 * getGoogleFontsUrl(["Roboto", "Open Sans"])
 * // → "https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&family=Open+Sans:wght@400;700&display=swap"
 */
export declare function getGoogleFontsUrl(fontNames: string[], weights?: number[]): string;
/**
 * Generate a Google Fonts URL from a card configuration.
 * Extracts fonts, filters to Google Fonts only, and generates the URL.
 *
 * @param cardConfig The card configuration object
 * @returns Google Fonts CSS URL, or empty string if no Google Fonts needed
 */
export declare function getGoogleFontsUrlForCard(cardConfig: unknown): string;
/**
 * Preload fonts using the CSS Font Loading API.
 * Call this after adding the Google Fonts stylesheet.
 *
 * @param fontNames Array of font names to preload
 * @returns Promise that resolves when all fonts are loaded
 *
 * @example
 * // In your project:
 * const link = document.createElement('link');
 * link.href = getGoogleFontsUrl(['Roboto']);
 * link.rel = 'stylesheet';
 * document.head.appendChild(link);
 *
 * await waitForFonts(['Roboto']);
 * // Now safe to render
 */
export declare function waitForFonts(fontNames: string[]): Promise<void>;
/**
 * Generate a lightweight Google Fonts URL for dropdown previews.
 * Uses the `text=` parameter to load only the characters needed to display font names.
 * This results in ~20-40KB total instead of 1-3MB for full fonts.
 *
 * @returns Google Fonts CSS URL with minimal character sets
 */
export declare function getGoogleFontsPreviewUrl(): string;
/**
 * Load a single Google Font on demand (full character set).
 * Safe to call multiple times - will only load once.
 *
 * @param fontFamily The font-family value (e.g., "Roboto, sans-serif")
 * @returns Promise that resolves when font is loaded
 */
export declare function loadGoogleFont(fontFamily: string): Promise<void>;
/**
 * Load multiple Google Fonts on demand.
 *
 * @param fontFamilies Array of font-family values
 * @returns Promise that resolves when all fonts are loaded
 */
export declare function loadGoogleFonts(fontFamilies: string[]): Promise<void>;
/**
 * Check if a Google Font has been fully loaded.
 */
export declare function isGoogleFontLoaded(fontFamily: string): boolean;
/**
 * Check if a font is a bundled brand font.
 */
export declare function isBrandFont(fontFamily: string): boolean;
/**
 * Check if a brand font has been loaded.
 */
export declare function isBrandFontLoaded(fontFamily: string): boolean;
/**
 * Load a brand font on demand.
 * Currently supports: SST (PlayStation)
 *
 * @param fontFamily The font-family value (e.g., "SST, Segoe UI, sans-serif")
 * @returns Promise that resolves when font is loaded
 */
export declare function loadBrandFont(fontFamily: string): Promise<void>;
/**
 * Load any font (Google, brand, or web-safe) on demand.
 * This is the unified function that handles all font types.
 *
 * @param fontFamily The font-family value
 * @returns Promise that resolves when font is loaded
 */
export declare function loadFont(fontFamily: string): Promise<void>;
/**
 * Load multiple fonts of any type on demand.
 *
 * @param fontFamilies Array of font-family values
 * @returns Promise that resolves when all fonts are loaded
 */
export declare function loadFonts(fontFamilies: string[]): Promise<void>;
/**
 * Load all fonts used in a card configuration.
 * Automatically detects and loads Google Fonts and brand fonts.
 *
 * @param cardConfig The card configuration object
 * @returns Promise that resolves when all fonts are loaded
 */
export declare function loadFontsForCard(cardConfig: unknown): Promise<void>;
