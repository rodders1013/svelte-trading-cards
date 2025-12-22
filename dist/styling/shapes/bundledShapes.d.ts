import type { ShapeData, BuiltInShape } from './types';
/**
 * Pre-bundled shape icons from Iconify (MDI set)
 * These are stored locally for instant access without API calls.
 * Total size: ~3KB
 */
export declare const BUNDLED_SHAPES: Record<BuiltInShape, ShapeData>;
export declare const ICON_PRESETS: Record<string, ShapeData>;
/**
 * Labels for icon presets (for UI dropdowns)
 */
export declare const ICON_PRESET_LABELS: Record<string, string>;
/**
 * Get icon preset data by name
 */
export declare function getIconPreset(name: string): ShapeData | undefined;
/**
 * Get shape data by name
 */
export declare function getShapeData(shape: BuiltInShape): ShapeData;
/**
 * Check if a shape name is a valid built-in shape
 */
export declare function isBuiltInShape(shape: string): shape is BuiltInShape;
