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
 * Comprehensive list of web-safe fonts (~35 fonts).
 * Organized by category: sans-serif, serif, monospace, display, cursive.
 */
export const WEB_SAFE_FONTS: FontOption[] = [
	// ═══════════════════════════════════════════════════════════════════
	// SANS-SERIF (clean, modern, readable)
	// ═══════════════════════════════════════════════════════════════════
	{ value: 'Arial, sans-serif', label: 'Arial', category: 'sans-serif' },
	{ value: 'Helvetica, Arial, sans-serif', label: 'Helvetica', category: 'sans-serif' },
	{ value: 'Verdana, sans-serif', label: 'Verdana', category: 'sans-serif' },
	{ value: 'Tahoma, sans-serif', label: 'Tahoma', category: 'sans-serif' },
	{ value: 'Trebuchet MS, sans-serif', label: 'Trebuchet MS', category: 'sans-serif' },
	{ value: 'Segoe UI, sans-serif', label: 'Segoe UI', category: 'sans-serif' },
	{ value: 'Geneva, sans-serif', label: 'Geneva', category: 'sans-serif' },
	{ value: 'Optima, sans-serif', label: 'Optima', category: 'sans-serif' },
	{ value: 'Avenir, sans-serif', label: 'Avenir', category: 'sans-serif' },
	{ value: 'Century Gothic, sans-serif', label: 'Century Gothic', category: 'sans-serif' },
	{
		value: 'Franklin Gothic Medium, sans-serif',
		label: 'Franklin Gothic',
		category: 'sans-serif'
	},
	{ value: 'Futura, sans-serif', label: 'Futura', category: 'sans-serif' },
	{ value: 'Gill Sans, sans-serif', label: 'Gill Sans', category: 'sans-serif' },

	// ═══════════════════════════════════════════════════════════════════
	// SERIF (elegant, traditional, editorial)
	// ═══════════════════════════════════════════════════════════════════
	{ value: 'Georgia, serif', label: 'Georgia', category: 'serif' },
	{ value: 'Times New Roman, serif', label: 'Times New Roman', category: 'serif' },
	{ value: 'Palatino Linotype, Palatino, serif', label: 'Palatino', category: 'serif' },
	{ value: 'Book Antiqua, Palatino, serif', label: 'Book Antiqua', category: 'serif' },
	{ value: 'Garamond, serif', label: 'Garamond', category: 'serif' },
	{ value: 'Baskerville, serif', label: 'Baskerville', category: 'serif' },
	{ value: 'Didot, serif', label: 'Didot', category: 'serif' },
	{ value: 'Bodoni MT, serif', label: 'Bodoni', category: 'serif' },
	{ value: 'Cambria, serif', label: 'Cambria', category: 'serif' },
	{ value: 'Rockwell, serif', label: 'Rockwell', category: 'serif' },

	// ═══════════════════════════════════════════════════════════════════
	// MONOSPACE (technical, code, retro)
	// ═══════════════════════════════════════════════════════════════════
	{ value: 'Courier New, monospace', label: 'Courier New', category: 'monospace' },
	{ value: 'Consolas, monospace', label: 'Consolas', category: 'monospace' },
	{ value: 'Monaco, monospace', label: 'Monaco', category: 'monospace' },
	{ value: 'Lucida Console, monospace', label: 'Lucida Console', category: 'monospace' },
	{ value: 'Andale Mono, monospace', label: 'Andale Mono', category: 'monospace' },

	// ═══════════════════════════════════════════════════════════════════
	// DISPLAY (bold, impactful, headlines)
	// ═══════════════════════════════════════════════════════════════════
	{ value: 'Impact, sans-serif', label: 'Impact', category: 'display' },
	{ value: 'Arial Black, sans-serif', label: 'Arial Black', category: 'display' },
	{ value: 'Copperplate, fantasy', label: 'Copperplate', category: 'display' },
	{ value: 'Haettenschweiler, sans-serif', label: 'Haettenschweiler', category: 'display' },

	// ═══════════════════════════════════════════════════════════════════
	// CURSIVE/SCRIPT (decorative, handwritten, playful)
	// ═══════════════════════════════════════════════════════════════════
	{ value: 'Brush Script MT, cursive', label: 'Brush Script', category: 'cursive' },
	{ value: 'Lucida Handwriting, cursive', label: 'Lucida Handwriting', category: 'cursive' },
	{ value: 'Comic Sans MS, cursive', label: 'Comic Sans', category: 'cursive' },
	{ value: 'Snell Roundhand, cursive', label: 'Snell Roundhand', category: 'cursive' },
	{ value: 'Zapfino, cursive', label: 'Zapfino', category: 'cursive' }
] as const;

/**
 * Display names for font categories in UI.
 */
export const FONT_CATEGORY_NAMES: Record<FontCategory, string> = {
	'sans-serif': 'Sans-Serif',
	serif: 'Serif',
	monospace: 'Monospace',
	display: 'Display',
	cursive: 'Cursive'
};

/**
 * Get fonts grouped by category.
 * Returns an object with category names as keys and arrays of fonts as values.
 */
export function getFontsByCategory(): Record<FontCategory, FontOption[]> {
	const result: Record<FontCategory, FontOption[]> = {
		'sans-serif': [],
		serif: [],
		monospace: [],
		display: [],
		cursive: []
	};

	for (const font of WEB_SAFE_FONTS) {
		result[font.category].push(font);
	}

	return result;
}

/**
 * Get a flat list of all web-safe fonts.
 * Returns simple {value, label} objects for dropdown compatibility.
 */
export function getWebSafeFonts(): Array<{ value: string; label: string }> {
	return WEB_SAFE_FONTS.map((f) => ({ value: f.value, label: f.label }));
}
