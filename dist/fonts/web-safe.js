/**
 * Web-safe fonts organized by category.
 * These fonts are available on most operating systems and work reliably
 * for both browser display and server-side PNG export.
 */
/**
 * Universal web-safe fonts that work on Windows, macOS, and Linux.
 * These are primarily Microsoft Core Web Fonts which are widely installed.
 * Organized by category: sans-serif, serif, monospace, display, cursive.
 */
export const WEB_SAFE_FONTS = [
    // ═══════════════════════════════════════════════════════════════════
    // SANS-SERIF (clean, modern, readable)
    // Microsoft Core Web Fonts - available on all platforms
    // ═══════════════════════════════════════════════════════════════════
    { value: 'Arial, sans-serif', label: 'Arial', category: 'sans-serif' },
    { value: 'Verdana, sans-serif', label: 'Verdana', category: 'sans-serif' },
    { value: 'Tahoma, sans-serif', label: 'Tahoma', category: 'sans-serif' },
    { value: 'Trebuchet MS, sans-serif', label: 'Trebuchet MS', category: 'sans-serif' },
    // ═══════════════════════════════════════════════════════════════════
    // SERIF (elegant, traditional, editorial)
    // Microsoft Core Web Fonts - available on all platforms
    // ═══════════════════════════════════════════════════════════════════
    { value: 'Georgia, serif', label: 'Georgia', category: 'serif' },
    { value: 'Times New Roman, serif', label: 'Times New Roman', category: 'serif' },
    // ═══════════════════════════════════════════════════════════════════
    // MONOSPACE (technical, code, retro)
    // Microsoft Core Web Fonts - available on all platforms
    // ═══════════════════════════════════════════════════════════════════
    { value: 'Courier New, monospace', label: 'Courier New', category: 'monospace' },
    // ═══════════════════════════════════════════════════════════════════
    // DISPLAY (bold, impactful, headlines)
    // Microsoft Core Web Fonts - available on all platforms
    // ═══════════════════════════════════════════════════════════════════
    { value: 'Impact, sans-serif', label: 'Impact', category: 'display' },
    { value: 'Arial Black, sans-serif', label: 'Arial Black', category: 'display' },
    // ═══════════════════════════════════════════════════════════════════
    // CURSIVE/SCRIPT (decorative, handwritten, playful)
    // Microsoft Core Web Fonts - available on all platforms
    // ═══════════════════════════════════════════════════════════════════
    { value: 'Comic Sans MS, cursive', label: 'Comic Sans', category: 'cursive' }
];
/**
 * Display names for font categories in UI.
 */
export const FONT_CATEGORY_NAMES = {
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
export function getFontsByCategory() {
    const result = {
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
export function getWebSafeFonts() {
    return WEB_SAFE_FONTS.map((f) => ({ value: f.value, label: f.label }));
}
