export type { BuiltInShape, ShapeData, ShapeSource, ShapeConfig, ShapeRenderOptions } from './types';
export { BuiltInShapeSchema, BUILT_IN_SHAPES, SHAPE_CATEGORIES } from './types';
export { BUNDLED_SHAPES, getShapeData, isBuiltInShape, ICON_PRESETS, ICON_PRESET_LABELS, getIconPreset } from './bundledShapes';
export { resolveShapeData, getShapeDataFromAny, sanitizeShapeBody, stripFillAttributes, getShapeTransform, prepareShapeBody, getShapeRenderData } from './shapeUtils';
export { default as ShapePicker } from './ShapePicker.svelte';
