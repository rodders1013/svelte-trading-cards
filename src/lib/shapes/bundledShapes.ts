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
