import type { MeasureTextOptions } from './textMeasure.js';
export interface TextFitResult {
    fontSize: number;
    lines: string[];
    lineWidths: number[];
    lineHeight: number;
    fits: boolean;
    truncated?: boolean;
}
export interface TextFitOptions {
    /** Minimum font size */
    minSize?: number;
    /** Maximum font size */
    maxSize?: number;
    /** Inset/padding to subtract from available space */
    inset?: number;
    /** If true, don't wrap text - keep on single line */
    singleLine?: boolean;
    /** Line height multiplier (default 1.2) */
    lineHeightRatio?: number;
    /** Font weight for accurate measurement */
    fontWeight?: string;
    /** Font style for accurate measurement */
    fontStyle?: string;
}
type MeasureTextFn = (text: string, fontFamily: string, fontSize: number, options?: MeasureTextOptions) => number;
export declare function fitTextToBox(text: string, boxWidth: number, boxHeight: number, fontFamily: string, minSize: number, maxSize: number, measureTextFn: MeasureTextFn, options?: Partial<TextFitOptions>): TextFitResult;
/**
 * Simplified version for components that just need auto-fitting
 * Uses a default measure function
 */
export declare function fitText(text: string, boxWidth: number, boxHeight: number, fontFamily: string, measureTextFn: MeasureTextFn, options?: TextFitOptions): TextFitResult;
export {};
