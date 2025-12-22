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
export declare function getTextAnchor(align: HorizontalAlign): 'start' | 'middle' | 'end';
/**
 * Convert SVG dominant-baseline from vertical alignment
 */
export declare function getDominantBaseline(align: VerticalAlign): 'hanging' | 'central' | 'auto';
/**
 * Normalize legacy alignment values to standard
 */
export declare function normalizeHorizontalAlign(value: string | undefined): HorizontalAlign;
export declare function normalizeVerticalAlign(value: string | undefined): VerticalAlign;
/**
 * Calculate X position from horizontal alignment
 */
export declare function getAlignedX(align: HorizontalAlign, x: number, width: number, padding?: number): number;
/**
 * Calculate Y position from vertical alignment
 */
export declare function getAlignedY(align: VerticalAlign, y: number, height: number, padding?: number): number;
