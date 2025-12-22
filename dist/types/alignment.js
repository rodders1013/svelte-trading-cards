/**
 * Standardized alignment types used across all text-rendering components.
 * Eliminates inconsistent alignment prop names and values.
 */
/**
 * Convert SVG text-anchor from horizontal alignment
 */
export function getTextAnchor(align) {
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
export function getDominantBaseline(align) {
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
export function normalizeHorizontalAlign(value) {
    if (value === 'start')
        return 'left';
    if (value === 'end')
        return 'right';
    if (value === 'left' || value === 'right' || value === 'center') {
        return value;
    }
    return 'center';
}
export function normalizeVerticalAlign(value) {
    if (value === 'top' || value === 'bottom' || value === 'center') {
        return value;
    }
    return 'center';
}
/**
 * Calculate X position from horizontal alignment
 */
export function getAlignedX(align, x, width, padding = 0) {
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
export function getAlignedY(align, y, height, padding = 0) {
    switch (align) {
        case 'top':
            return y + padding;
        case 'bottom':
            return y + height - padding;
        default:
            return y + height / 2;
    }
}
