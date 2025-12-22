export { BuiltInShapeSchema, BUILT_IN_SHAPES, SHAPE_CATEGORIES } from './types';
// Bundled shapes
export { BUNDLED_SHAPES, getShapeData, isBuiltInShape, ICON_PRESETS, ICON_PRESET_LABELS, getIconPreset } from './bundledShapes';
// Utilities
export { resolveShapeData, getShapeDataFromAny, sanitizeShapeBody, stripFillAttributes, getShapeTransform, prepareShapeBody, getShapeRenderData } from './shapeUtils';
// Components
export { default as ShapePicker } from './ShapePicker.svelte';
