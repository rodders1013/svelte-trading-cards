/**
 * Standardized alignment types used across all text-rendering components.
 * Eliminates inconsistent alignment prop names and values.
 */

export type HorizontalAlign = 'left' | 'center' | 'right';
export type VerticalAlign = 'top' | 'center' | 'bottom';

/**
 * Label position for components like ProgressBar
 * Extends horizontal alignment with special positions
 */
export type LabelPosition = HorizontalAlign | 'inside' | 'none';

/**
 * Combined alignment props interface
 */
export interface AlignmentProps {
	horizontalAlign?: HorizontalAlign;
	verticalAlign?: VerticalAlign;
}

/**
 * Convert SVG text-anchor from horizontal alignment
 */
export function getTextAnchor(align: HorizontalAlign): 'start' | 'middle' | 'end' {
	switch (align) {
		case 'left':
			return 'start';
		case 'right':
			return 'end';
		default:
			return 'middle';
	}
}

/**
 * Convert SVG dominant-baseline from vertical alignment
 */
export function getDominantBaseline(
	align: VerticalAlign
): 'hanging' | 'central' | 'auto' {
	switch (align) {
		case 'top':
			return 'hanging';
		case 'bottom':
			return 'auto';
		default:
			return 'central';
	}
}

/**
 * Normalize legacy alignment values to standard
 */
export function normalizeHorizontalAlign(value: string | undefined): HorizontalAlign {
	if (value === 'start') return 'left';
	if (value === 'end') return 'right';
	if (value === 'left' || value === 'right' || value === 'center') {
		return value;
	}
	return 'center';
}

export function normalizeVerticalAlign(value: string | undefined): VerticalAlign {
	if (value === 'top' || value === 'bottom' || value === 'center') {
		return value;
	}
	return 'center';
}

/**
 * Calculate X position from horizontal alignment
 */
export function getAlignedX(
	align: HorizontalAlign,
	x: number,
	width: number,
	padding = 0
): number {
	switch (align) {
		case 'left':
			return x + padding;
		case 'right':
			return x + width - padding;
		default:
			return x + width / 2;
	}
}

/**
 * Calculate Y position from vertical alignment
 */
export function getAlignedY(
	align: VerticalAlign,
	y: number,
	height: number,
	padding = 0
): number {
	switch (align) {
		case 'top':
			return y + padding;
		case 'bottom':
			return y + height - padding;
		default:
			return y + height / 2;
	}
}
