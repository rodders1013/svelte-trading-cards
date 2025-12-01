/**
 * Dataset-specific brand fonts.
 *
 * Each dataset can have brand fonts that give it a unique identity.
 * These fonts use system fonts where available, with web-safe fallbacks.
 *
 * Note: Custom font files (woff2) can be added later for fonts that aren't
 * available as system fonts. For now, we use fonts that are likely to be
 * available on most systems or have good fallbacks.
 */

import type { DatasetId } from '$lib/presets';

export interface BrandFont {
	/** Unique identifier for this font */
	id: string;
	/** Display name in UI */
	label: string;
	/** CSS font-family value */
	fontFamily: string;
	/** Web-safe fallback font */
	fallback: string;
	/** Which datasets can use this font */
	datasets: DatasetId[];
}

/**
 * Brand fonts for each dataset.
 *
 * PlayStation: Uses Segoe UI (close to Sony SST) - available on Windows,
 *              falls back to system sans-serif
 * Xbox: Uses Segoe UI Bold - the official Xbox font, available on Windows
 * Steam: Uses system sans-serif with heavier weight as Motiva Sans isn't
 *        widely available
 */
export const BRAND_FONTS: BrandFont[] = [
	{
		id: 'playstation-system',
		label: 'PlayStation Style',
		fontFamily: 'Segoe UI, SF Pro Display, -apple-system, sans-serif',
		fallback: 'Arial, sans-serif',
		datasets: ['playstation']
	},
	{
		id: 'xbox-segoe',
		label: 'Xbox Style',
		fontFamily: 'Segoe UI, SF Pro Display, -apple-system, sans-serif',
		fallback: 'Arial, sans-serif',
		datasets: ['xbox']
	},
	{
		id: 'steam-system',
		label: 'Steam Style',
		fontFamily: 'Segoe UI, Roboto, -apple-system, sans-serif',
		fallback: 'Arial, sans-serif',
		datasets: ['steam']
	}
] as const;

/**
 * Get brand fonts available for a specific dataset.
 */
export function getBrandFontsForDataset(datasetId: DatasetId): BrandFont[] {
	return BRAND_FONTS.filter((f) => f.datasets.includes(datasetId));
}

/**
 * Get brand font options formatted for dropdown UI.
 */
export function getBrandFontOptions(
	datasetId: DatasetId
): Array<{ value: string; label: string }> {
	return getBrandFontsForDataset(datasetId).map((f) => ({
		value: f.fontFamily,
		label: f.label
	}));
}
