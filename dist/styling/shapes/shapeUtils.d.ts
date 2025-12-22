import type { ShapeData, ShapeSource, ShapeRenderOptions, BuiltInShape } from './types';
/**
 * Resolve shape source to shape data
 */
export declare function resolveShapeData(source: ShapeSource): ShapeData | null;
/**
 * Get shape data from either a built-in shape name or custom icon
 */
export declare function getShapeDataFromAny(shape?: BuiltInShape | string, customIconData?: {
    body: string;
    width?: number;
    height?: number;
}): ShapeData | null;
/**
 * Sanitize shape body for safe rendering
 */
export declare function sanitizeShapeBody(body: string): string;
/**
 * Strip fill attributes from shape body
 * This allows parent element's fill to be inherited
 */
export declare function stripFillAttributes(body: string): string;
/**
 * Calculate transform to scale shape to container
 */
export declare function getShapeTransform(shapeData: ShapeData, options: ShapeRenderOptions): string;
/**
 * Prepare shape body for rendering
 * - Sanitizes for security
 * - Optionally strips fill attributes
 */
export declare function prepareShapeBody(body: string, options?: {
    stripFill?: boolean;
}): string;
/**
 * Get all data needed to render a shape
 */
export declare function getShapeRenderData(source: ShapeSource, containerWidth: number, containerHeight: number, scaleMode?: 'contain' | 'cover' | 'stretch'): {
    body: string;
    strippedBody: string;
    transform: string;
    width: number;
    height: number;
} | null;
