/**
 * Dataset-specific brand fonts.
 *
 * Each dataset can have brand fonts that give it a unique identity.
 * Custom fonts (like SST) are bundled in fonts/files/ for server-side rendering
 * and must be loaded via @font-face in the consuming project.
 *
 * Custom font loading example:
 * ```css
 * @font-face {
 *   font-family: 'SST';
 *   src: url('/fonts/SST-Regular.ttf') format('truetype');
 *   font-weight: 400;
 *   font-style: normal;
 * }
 * @font-face {
 *   font-family: 'SST';
 *   src: url('/fonts/SST-Bold.ttf') format('truetype');
 *   font-weight: 700;
 *   font-style: normal;
 * }
 * @font-face {
 *   font-family: 'SST';
 *   src: url('/fonts/SST-Italic.ttf') format('truetype');
 *   font-weight: 400;
 *   font-style: italic;
 * }
 * @font-face {
 *   font-family: 'SST';
 *   src: url('/fonts/SST-BoldItalic.ttf') format('truetype');
 *   font-weight: 700;
 *   font-style: italic;
 * }
 * ```
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
	/** Whether this font requires custom loading (not Google Fonts or web-safe) */
	requiresCustomLoading?: boolean;
	/** TTF files available in fonts/files/ */
	files?: string[];
}

/**
 * Brand fonts for each dataset.
 *
 * PlayStation: Uses SST (Sony's official font) - bundled TTF files
 * Xbox: Uses Segoe UI - available on Windows, falls back to system sans-serif
 * Steam: Uses system sans-serif as Motiva Sans isn't widely available
 */
export const BRAND_FONTS: BrandFont[] = [
	{
		id: 'playstation-sst',
		label: 'SST (PlayStation)',
		fontFamily: 'SST, Segoe UI, sans-serif',
		fallback: 'Segoe UI, Arial, sans-serif',
		datasets: ['playstation'],
		requiresCustomLoading: true,
		files: ['SST-Regular.ttf', 'SST-Bold.ttf', 'SST-Italic.ttf', 'SST-BoldItalic.ttf']
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
