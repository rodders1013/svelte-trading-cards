/**
 * Image embedding utility for server-side SVG rendering.
 *
 * External images (URLs) must be embedded as base64 data URIs
 * before the SVG can be rasterized to PNG.
 */
export interface EmbedOptions {
    /** Maximum concurrent image fetches. Defaults to 3 */
    concurrency?: number;
    /** Timeout per image fetch in ms. Defaults to 10000 */
    timeout?: number;
    /** Whether to throw on failed image fetches. Defaults to false */
    throwOnError?: boolean;
}
/**
 * Embeds external images in an SVG string as base64 data URIs.
 *
 * This is required before rasterizing SVG to PNG, as external
 * URLs won't resolve during canvas rendering.
 *
 * @param svgString - The SVG string with external image URLs
 * @param options - Embedding options
 * @returns The SVG string with images embedded as data URIs
 *
 * @example
 * ```typescript
 * import { embedImages } from 'svelte-trading-cards/server';
 *
 * const svgWithExternalImages = '<svg>...<image href="https://..."/>...</svg>';
 * const svgWithEmbeddedImages = await embedImages(svgWithExternalImages);
 * ```
 */
export declare function embedImages(svgString: string, options?: EmbedOptions): Promise<string>;
/**
 * Checks if an SVG string contains external image references.
 *
 * @param svgString - The SVG string to check
 * @returns True if external images are found
 */
export declare function hasExternalImages(svgString: string): boolean;
