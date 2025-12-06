/**
 * Font Loading Utilities
 *
 * Provides helpers for dynamic font loading in consuming projects.
 * The library provides these utilities but doesn't handle the actual loading -
 * that's the responsibility of the consuming project.
 */

import { WEB_SAFE_FONTS } from './web-safe.js';
import { GOOGLE_FONTS } from './google-fonts.js';

// Cache of web-safe font family values for quick lookup
const webSafeFontValues = new Set(WEB_SAFE_FONTS.map(f => f.value));

// Cache of Google Font names for quick lookup
const googleFontNames = new Set(GOOGLE_FONTS.map(f => f.name));

/**
 * Extract the font name from a CSS font-family value.
 * e.g., "Roboto, sans-serif" → "Roboto"
 */
export function extractFontName(fontFamily: string): string {
	// Get the first font in the stack (before the comma)
	const firstFont = fontFamily.split(',')[0].trim();
	// Remove quotes if present
	return firstFont.replace(/["']/g, '');
}

/**
 * Check if a font-family value is web-safe (no loading needed).
 */
export function isWebSafeFont(fontFamily: string): boolean {
	return webSafeFontValues.has(fontFamily);
}

/**
 * Check if a font is a known Google Font from our library.
 */
export function isGoogleFont(fontFamily: string): boolean {
	const fontName = extractFontName(fontFamily);
	return googleFontNames.has(fontName);
}

/**
 * Extract all unique font families from a card configuration.
 * Walks through all zones and components to find fontFamily properties.
 */
export function extractFontsFromCard(cardConfig: unknown): string[] {
	const fonts = new Set<string>();

	function walk(obj: unknown): void {
		if (!obj || typeof obj !== 'object') return;

		if (Array.isArray(obj)) {
			obj.forEach(walk);
			return;
		}

		const record = obj as Record<string, unknown>;

		// Check for fontFamily property
		if (typeof record.fontFamily === 'string' && record.fontFamily) {
			fonts.add(record.fontFamily);
		}

		// Check for labelFontFamily (ProgressBar)
		if (typeof record.labelFontFamily === 'string' && record.labelFontFamily) {
			fonts.add(record.labelFontFamily);
		}

		// Check for valueFontFamily (IconRating)
		if (typeof record.valueFontFamily === 'string' && record.valueFontFamily) {
			fonts.add(record.valueFontFamily);
		}

		// Recurse into nested objects
		Object.values(record).forEach(walk);
	}

	walk(cardConfig);
	return [...fonts];
}

/**
 * Filter fonts to only those that need loading (not web-safe).
 */
export function getFontsNeedingLoad(fonts: string[]): string[] {
	return fonts.filter(f => !isWebSafeFont(f));
}

/**
 * Get the Google Font names from a list of font-family values.
 * Returns just the font names (without fallbacks) for fonts that are Google Fonts.
 */
export function getGoogleFontNames(fontFamilies: string[]): string[] {
	return fontFamilies
		.filter(f => !isWebSafeFont(f) && isGoogleFont(f))
		.map(extractFontName);
}

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
export function getGoogleFontsUrl(
	fontNames: string[],
	weights: number[] = [400, 700]
): string {
	if (fontNames.length === 0) return '';

	const weightStr = weights.join(';');
	const families = fontNames
		.map(name => `family=${encodeURIComponent(name)}:wght@${weightStr}`)
		.join('&');

	return `https://fonts.googleapis.com/css2?${families}&display=swap`;
}

/**
 * Generate a Google Fonts URL from a card configuration.
 * Extracts fonts, filters to Google Fonts only, and generates the URL.
 *
 * @param cardConfig The card configuration object
 * @returns Google Fonts CSS URL, or empty string if no Google Fonts needed
 */
export function getGoogleFontsUrlForCard(cardConfig: unknown): string {
	const fonts = extractFontsFromCard(cardConfig);
	const googleFonts = getGoogleFontNames(fonts);
	return getGoogleFontsUrl(googleFonts);
}

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
export async function waitForFonts(fontNames: string[]): Promise<void> {
	if (typeof document === 'undefined') return; // SSR guard

	await Promise.all(
		fontNames.flatMap(name => [
			document.fonts.load(`400 16px "${name}"`),
			document.fonts.load(`700 16px "${name}"`)
		])
	);
}

/**
 * Generate a lightweight Google Fonts URL for dropdown previews.
 * Uses the `text=` parameter to load only the characters needed to display font names.
 * This results in ~20-40KB total instead of 1-3MB for full fonts.
 *
 * @returns Google Fonts CSS URL with minimal character sets
 */
export function getGoogleFontsPreviewUrl(): string {
	if (GOOGLE_FONTS.length === 0) return '';

	// Collect all unique characters needed across all font names
	const allChars = new Set<string>();
	GOOGLE_FONTS.forEach(font => {
		font.name.split('').forEach(char => allChars.add(char));
	});
	const textParam = encodeURIComponent([...allChars].join(''));

	// Build family parameters with weight 400
	const families = GOOGLE_FONTS
		.map(font => `family=${encodeURIComponent(font.name)}:wght@400`)
		.join('&');

	return `https://fonts.googleapis.com/css2?${families}&text=${textParam}&display=swap`;
}

// Track which fonts have been fully loaded
const loadedFonts = new Set<string>();

/**
 * Load a single Google Font on demand (full character set).
 * Safe to call multiple times - will only load once.
 *
 * @param fontFamily The font-family value (e.g., "Roboto, sans-serif")
 * @returns Promise that resolves when font is loaded
 */
export async function loadGoogleFont(fontFamily: string): Promise<void> {
	if (typeof document === 'undefined') return; // SSR guard
	if (isWebSafeFont(fontFamily)) return; // No need to load
	if (!isGoogleFont(fontFamily)) return; // Not a known Google Font

	const fontName = extractFontName(fontFamily);

	if (loadedFonts.has(fontName)) return; // Already loaded
	loadedFonts.add(fontName);

	// Create and add the stylesheet link
	const url = getGoogleFontsUrl([fontName]);
	const linkId = `google-font-${fontName.replace(/\s+/g, '-').toLowerCase()}`;

	if (document.getElementById(linkId)) return; // Link already exists

	const link = document.createElement('link');
	link.id = linkId;
	link.href = url;
	link.rel = 'stylesheet';
	document.head.appendChild(link);

	// Wait for the font to actually load
	await waitForFonts([fontName]);
}

/**
 * Load multiple Google Fonts on demand.
 *
 * @param fontFamilies Array of font-family values
 * @returns Promise that resolves when all fonts are loaded
 */
export async function loadGoogleFonts(fontFamilies: string[]): Promise<void> {
	await Promise.all(fontFamilies.map(loadGoogleFont));
}

/**
 * Check if a Google Font has been fully loaded.
 */
export function isGoogleFontLoaded(fontFamily: string): boolean {
	const fontName = extractFontName(fontFamily);
	return loadedFonts.has(fontName);
}
