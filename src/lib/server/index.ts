/**
 * Server-side utilities for svelte-trading-cards.
 *
 * Import from 'svelte-trading-cards/server' to access these utilities.
 *
 * PNG export uses @resvg/resvg-js (bundled - no additional install needed).
 *
 * @example
 * ```typescript
 * import {
 *   renderToSVGString,
 *   embedImages,
 *   svgToPNG
 * } from 'svelte-trading-cards/server';
 *
 * // Render template to SVG
 * const svg = await renderToSVGString(template, data);
 *
 * // Embed external images
 * const svgWithImages = await embedImages(svg);
 *
 * // Convert to PNG
 * const { buffer } = await svgToPNG(svgWithImages);
 * ```
 */

// Rendering
export { renderToSVGString, renderToSVGStringWithImages } from './render.js';
export type { RenderOptions } from './render.js';

// Image embedding
export { embedImages, hasExternalImages } from './embedImages.js';
export type { EmbedOptions } from './embedImages.js';

// PNG conversion
export { svgToPNG, svgToPNGDataURL } from './svgToPNG.js';
export type { PNGOptions, PNGResult } from './svgToPNG.js';

// Re-export types and constants for convenience
export type { CardTemplate, CardData, ContainerContext } from '../types/index.js';
export { CARD_WIDTH, CARD_HEIGHT, CARD_RADIUS } from '../types/CardTemplate.js';
