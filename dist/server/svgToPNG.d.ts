/**
 * SVG to PNG conversion using resvg-js.
 *
 * Uses the Rust-based resvg library compiled to WASM for high-quality
 * server-side SVG rendering.
 */
export interface PNGOptions {
    /** Output width in pixels. Defaults to CARD_WIDTH (750) */
    width?: number;
    /** Output height in pixels. Defaults to CARD_HEIGHT (1050) */
    height?: number;
    /** Background color (CSS color string). Defaults to transparent */
    backgroundColor?: string;
    /** Skip size/complexity validation (use with caution) */
    skipValidation?: boolean;
}
export declare class SVGValidationError extends Error {
    constructor(message: string);
}
export interface PNGResult {
    /** The PNG buffer */
    buffer: Buffer;
    /** Output width */
    width: number;
    /** Output height */
    height: number;
}
/**
 * Converts an SVG string to a PNG buffer.
 *
 * Uses resvg-js for high-quality server-side rendering.
 * No DOMParser or canvas dependencies required.
 *
 * @param svgString - The SVG string to convert
 * @param options - PNG generation options
 * @returns The PNG buffer with metadata
 *
 * @example
 * ```typescript
 * import { renderToSVGString, svgToPNG } from 'svelte-trading-cards/server';
 *
 * const svg = renderToSVGString(template, data);
 * const { buffer } = await svgToPNG(svg);
 *
 * // Use in API response
 * return new Response(buffer, {
 *   headers: { 'Content-Type': 'image/png' }
 * });
 * ```
 */
export declare function svgToPNG(svgString: string, options?: PNGOptions): Promise<PNGResult>;
/**
 * Converts an SVG string to a PNG data URL.
 *
 * @param svgString - The SVG string to convert
 * @param options - PNG generation options
 * @returns The PNG as a data URL
 */
export declare function svgToPNGDataURL(svgString: string, options?: PNGOptions): Promise<string>;
