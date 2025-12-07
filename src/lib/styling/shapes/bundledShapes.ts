import type { ShapeData, BuiltInShape } from './types';

/**
 * Pre-bundled shape icons from Iconify (MDI set)
 * These are stored locally for instant access without API calls.
 * Total size: ~3KB
 */
export const BUNDLED_SHAPES: Record<BuiltInShape, ShapeData> = {
	// ============================================
	// BASIC GEOMETRIC
	// ============================================
	circle: {
		body: '<path fill="currentColor" d="M12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2"/>',
		width: 24,
		height: 24
	},
	square: {
		body: '<path fill="currentColor" d="M3 3v18h18V3"/>',
		width: 24,
		height: 24
	},
	rectangle: {
		body: '<path fill="currentColor" d="M4 6v12h16V6z"/>',
		width: 24,
		height: 24
	},
	triangle: {
		body: '<path fill="currentColor" d="M1 21h22L12 2"/>',
		width: 24,
		height: 24
	},
	diamond: {
		body: '<path fill="currentColor" d="M12 2L2 12l10 10l10-10z"/>',
		width: 24,
		height: 24
	},
	hexagon: {
		body: '<path fill="currentColor" d="M21 16.5c0 .38-.21.71-.53.88l-7.9 4.44c-.16.12-.36.18-.57.18s-.41-.06-.57-.18l-7.9-4.44A.99.99 0 0 1 3 16.5v-9c0-.38.21-.71.53-.88l7.9-4.44c.16-.12.36-.18.57-.18s.41.06.57.18l7.9 4.44c.32.17.53.5.53.88z"/>',
		width: 24,
		height: 24
	},
	octagon: {
		body: '<path fill="currentColor" d="M15.73 3H8.27L3 8.27v7.46L8.27 21h7.46L21 15.73V8.27"/>',
		width: 24,
		height: 24
	},
	pentagon: {
		body: '<path fill="currentColor" d="M12 2.5L2 9.8l3.8 11.7h12.4L22 9.8z"/>',
		width: 24,
		height: 24
	},
	ellipse: {
		body: '<path fill="currentColor" d="M12 4C6.5 4 2 7.58 2 12s4.5 8 10 8s10-3.58 10-8s-4.5-8-10-8"/>',
		width: 24,
		height: 24
	},

	// ============================================
	// DECORATIVE
	// ============================================
	star: {
		body: '<path fill="currentColor" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2L9.19 8.62L2 9.24l5.45 4.73L5.82 21z"/>',
		width: 24,
		height: 24
	},
	heart: {
		body: '<path fill="currentColor" d="m12 21.35l-1.45-1.32C5.4 15.36 2 12.27 2 8.5C2 5.41 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.41 22 8.5c0 3.77-3.4 6.86-8.55 11.53z"/>',
		width: 24,
		height: 24
	},
	shield: {
		body: '<path fill="currentColor" d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12c5.16-1.26 9-6.45 9-12V5z"/>',
		width: 24,
		height: 24
	},
	bookmark: {
		body: '<path fill="currentColor" d="M17 3H7a2 2 0 0 0-2 2v16l7-3l7 3V5a2 2 0 0 0-2-2"/>',
		width: 24,
		height: 24
	},
	label: {
		body: '<path fill="currentColor" d="M17.63 5.84C17.27 5.33 16.67 5 16 5H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h11c.67 0 1.27-.34 1.63-.85L22 12z"/>',
		width: 24,
		height: 24
	},
	cloud: {
		body: '<path fill="currentColor" d="M6.5 20q-2.28 0-3.89-1.57Q1 16.85 1 14.58q0-1.95 1.17-3.48q1.18-1.53 3.08-1.95q.63-2.3 2.5-3.72Q9.63 4 12 4q2.93 0 4.96 2.04Q19 8.07 19 11q1.73.2 2.86 1.5q1.14 1.28 1.14 3q0 1.88-1.31 3.19T18.5 20Z"/>',
		width: 24,
		height: 24
	},
	message: {
		body: '<path fill="currentColor" d="M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2"/>',
		width: 24,
		height: 24
	},

	// ============================================
	// AWARDS & BADGES
	// ============================================
	crown: {
		body: '<path fill="currentColor" d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14z"/>',
		width: 24,
		height: 24
	},
	trophy: {
		body: '<path fill="currentColor" d="M18 2c-.9 0-2 1-2 2H8c0-1-1.1-2-2-2H2v9c0 1 1 2 2 2h2.2c.4 2 1.7 3.7 4.8 4v2.08C8 19.54 8 22 8 22h8s0-2.46-3-2.92V17c3.1-.3 4.4-2 4.8-4H20c1 0 2-1 2-2V2zM6 11H4V4h2zm14 0h-2V4h2z"/>',
		width: 24,
		height: 24
	},
	medal: {
		body: '<path fill="currentColor" d="M20 2H4v2l5.81 4.36a7.004 7.004 0 0 0-4.46 8.84a6.996 6.996 0 0 0 8.84 4.46a7 7 0 0 0 0-13.3L20 4zm-5.06 17.5L12 17.78L9.06 19.5l.78-3.33l-2.59-2.24l3.41-.29L12 10.5l1.34 3.14l3.41.29l-2.59 2.24z"/>',
		width: 24,
		height: 24
	},
	seal: {
		body: '<path fill="currentColor" d="M20.39 19.37L16.38 18L15 22l-3.08-6L9 22l-1.38-4l-4.01 1.37l2.92-6A6.97 6.97 0 0 1 5 9a7 7 0 0 1 7-7a7 7 0 0 1 7 7c0 1.65-.57 3.17-1.53 4.37zM7 9l2.69 1.34l-.19 3l2.5-1.66l2.5 1.65l-.17-2.99L17 9l-2.68-1.35l.18-2.98L12 6.31L9.5 4.65l.17 3.01z"/>',
		width: 24,
		height: 24
	},
	certificate: {
		body: '<path fill="currentColor" d="M4 3c-1.11 0-2 .89-2 2v10a2 2 0 0 0 2 2h8v5l3-3l3 3v-5h2a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm8 2l3 2l3-2v3.5l3 1.5l-3 1.5V15l-3-2l-3 2v-3.5L9 10l3-1.5zM4 5h5v2H4zm0 4h3v2H4zm0 4h5v2H4z"/>',
		width: 24,
		height: 24
	},

	// ============================================
	// CONTAINERS
	// ============================================
	card: {
		body: '<path fill="currentColor" d="M20 20H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2"/>',
		width: 24,
		height: 24
	}
};

// ============================================
// ICON PRESETS - Used by IconRating, Divider ornaments, etc.
// These can be used anywhere icons are needed.
// ============================================
export const ICON_PRESETS: Record<string, ShapeData> = {
	// From BUNDLED_SHAPES (reuse existing)
	star: BUNDLED_SHAPES.star,
	heart: BUNDLED_SHAPES.heart,
	diamond: BUNDLED_SHAPES.diamond,
	circle: BUNDLED_SHAPES.circle,
	square: BUNDLED_SHAPES.square,
	trophy: BUNDLED_SHAPES.trophy,

	// Additional rating/decorative icons
	fire: {
		body: '<path fill="currentColor" d="M17.66 11.2c-.23-.3-.51-.56-.77-.82c-.67-.6-1.43-1.03-2.07-1.66C13.33 7.26 13 4.85 13.95 3c-.95.23-1.78.75-2.49 1.32c-2.59 2.08-3.61 5.75-2.39 8.9c.04.1.08.2.08.33c0 .22-.15.42-.35.5c-.23.1-.47.04-.66-.12a.58.58 0 0 1-.14-.17c-1.13-1.43-1.31-3.48-.55-5.12C5.78 10 4.87 12.3 5 14.47c.06.5.12 1 .29 1.5c.14.6.41 1.2.71 1.73c1.08 1.73 2.95 2.97 4.96 3.22c2.14.27 4.43-.12 6.07-1.6c1.83-1.66 2.47-4.32 1.53-6.6l-.13-.26c-.21-.46-.77-1.26-.77-1.26zm-3.16 6.3c-.28.24-.74.5-1.1.6c-1.12.4-2.24-.16-2.9-.82c1.19-.28 1.9-1.16 2.11-2.05c.17-.8-.15-1.46-.28-2.23c-.12-.74-.1-1.37.17-2.06c.19.38.39.76.63 1.06c.77 1 1.98 1.44 2.24 2.8c.04.14.06.28.06.43c.03.82-.33 1.72-.93 2.27z"/>',
		width: 24,
		height: 24
	},
	'thumbs-up': {
		body: '<path fill="currentColor" d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57l.03-.32c0-.41-.17-.79-.44-1.06L14.17 1L7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/>',
		width: 24,
		height: 24
	},
	lightning: {
		body: '<path fill="currentColor" d="M11 21h-1l1-7H7.5c-.58 0-.57-.32-.38-.66c.19-.34.05-.08.07-.12C8.48 10.94 10.42 7.54 13 3h1l-1 7h3.5c.49 0 .56.33.47.51l-.07.15C12.96 17.55 11 21 11 21z"/>',
		width: 24,
		height: 24
	},
	flower: {
		body: '<path fill="currentColor" d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm0-18C8.1 4 5 7.1 5 11c0 2.4 1.2 4.5 3 5.7V18c0 .6.4 1 1 1h6c.6 0 1-.4 1-1v-1.3c1.8-1.3 3-3.4 3-5.7c0-3.9-3.1-7-7-7zm2.9 10.5l-.9.6V17H10v-1.9l-.9-.6C7.8 13.6 7 12.4 7 11c0-2.8 2.2-5 5-5s5 2.2 5 5c0 1.4-.8 2.6-2.1 3.5z"/>',
		width: 24,
		height: 24
	},
	pepper: {
		body: '<path fill="currentColor" d="M16.71 4.29a1 1 0 0 0-1.42 0l-1 1A6 6 0 0 0 12 5a5.78 5.78 0 0 0-3.4 1.1a9.57 9.57 0 0 0-3.26 5.24A14.43 14.43 0 0 0 5 16c0 1.5.31 2.54.82 3.18A2.18 2.18 0 0 0 7.5 20c1.51 0 2.72-1.17 4.5-3.26C13.72 18.83 14.99 20 16.5 20a2.18 2.18 0 0 0 1.68-.82c.51-.64.82-1.68.82-3.18a14.43 14.43 0 0 0-.34-4.66a9.57 9.57 0 0 0-3.26-5.24A1 1 0 0 0 14.29 5L16.71 7.42a1 1 0 0 0 0-1.42l-1-1.71zM12 7a3.5 3.5 0 0 1 2.08.69a7.58 7.58 0 0 1 2.57 4.19A12.15 12.15 0 0 1 17 16c0 1.07-.18 1.63-.38 1.88a.33.33 0 0 1-.12.12c-.62 0-1.62-.88-3.24-2.76a1 1 0 0 0-1.52 0C10.12 17.12 9.12 18 8.5 18a.33.33 0 0 1-.12-.12C8.18 17.63 8 17.07 8 16a12.15 12.15 0 0 1 .35-4.12a7.58 7.58 0 0 1 2.57-4.19A3.5 3.5 0 0 1 12 7z"/>',
		width: 24,
		height: 24
	},
	skull: {
		body: '<path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12v8c0 1.1.9 2 2 2h3v-2H4v-6h3v-1c0-2.76 2.24-5 5-5s5 2.24 5 5v1h3v6h-3v2h3c1.1 0 2-.9 2-2v-8c0-5.52-4.48-10-10-10zm-2 14c-.83 0-1.5-.67-1.5-1.5S9.17 13 10 13s1.5.67 1.5 1.5S10.83 16 10 16zm4 0c-.83 0-1.5-.67-1.5-1.5S13.17 13 14 13s1.5.67 1.5 1.5S14.83 16 14 16zm-3.5 2h3v2h-3v-2z"/>',
		width: 24,
		height: 24
	}
};

/**
 * Labels for icon presets (for UI dropdowns)
 */
export const ICON_PRESET_LABELS: Record<string, string> = {
	star: 'Star',
	heart: 'Heart',
	diamond: 'Diamond',
	circle: 'Circle',
	square: 'Square',
	trophy: 'Trophy',
	fire: 'Fire',
	'thumbs-up': 'Thumbs Up',
	lightning: 'Lightning',
	flower: 'Flower',
	pepper: 'Pepper',
	skull: 'Skull'
};

/**
 * Get icon preset data by name
 */
export function getIconPreset(name: string): ShapeData | undefined {
	return ICON_PRESETS[name];
}

/**
 * Get shape data by name
 */
export function getShapeData(shape: BuiltInShape): ShapeData {
	return BUNDLED_SHAPES[shape];
}

/**
 * Check if a shape name is a valid built-in shape
 */
export function isBuiltInShape(shape: string): shape is BuiltInShape {
	return shape in BUNDLED_SHAPES;
}
