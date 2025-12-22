export { default as FitText } from './FitText.svelte';
export { default as TextRenderer } from './TextRenderer.svelte';
export { fitTextToBox, fitText } from './textFitting.js';
export { measureText } from './textMeasure.js';
// Container utilities - eliminate duplicated center calculations
export { getContainerMetrics, getTransformOrigin, getTransformOriginFromDimensions } from './container.js';
// Data resolution utilities - eliminate duplicated data field lookups
export { resolveDataField, resolveTextContent, parseString, parseNumber, parseArray } from './data.js';
