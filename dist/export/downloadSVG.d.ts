/**
 * Client-side SVG download utilities.
 *
 * These functions work entirely in the browser - no server required.
 * For server-side PNG generation, use `svelte-trading-cards/server`.
 */
export interface DownloadOptions {
    /** Filename without extension. Defaults to 'card' */
    filename?: string;
    /** Include XML declaration and doctype. Defaults to true */
    includeDeclaration?: boolean;
    /** Bleed amount in millimeters (0-3). Defaults to 0 (no bleed) */
    bleedMm?: number;
}
export interface BleedOptions {
    /** Bleed amount in millimeters */
    bleedMm: number;
    /** ID of the Card Base layer group (defaults to 'card-base') */
    cardBaseId?: string;
}
/**
 * Sanitizes a filename to prevent path traversal and other issues.
 * Only allows alphanumeric characters, underscores, hyphens, and spaces.
 *
 * @param filename - The filename to sanitize
 * @returns A safe filename
 */
export declare function sanitizeFilename(filename: string): string;
/**
 * Applies bleed to an SVG element by expanding the canvas and extending the Card Base layer.
 * Returns a new SVG element - does not modify the original.
 *
 * @param svgElement - The original SVG element
 * @param options - Bleed options
 * @returns A new SVG element with bleed applied
 */
export declare function applyBleed(svgElement: SVGSVGElement, options: BleedOptions): SVGSVGElement;
/**
 * Serializes an SVG element to a string.
 *
 * @param svgElement - The SVG element to serialize
 * @param includeDeclaration - Whether to include XML declaration
 * @returns The serialized SVG string
 */
export declare function serializeSVG(svgElement: SVGSVGElement, includeDeclaration?: boolean): string;
/**
 * Converts an SVG element to a data URL.
 *
 * @param svgElement - The SVG element to convert
 * @returns A data URL containing the SVG
 */
export declare function svgToDataURL(svgElement: SVGSVGElement): string;
/**
 * Converts an SVG element to a Blob.
 *
 * @param svgElement - The SVG element to convert
 * @returns A Blob containing the SVG
 */
export declare function svgToBlob(svgElement: SVGSVGElement): Blob;
/**
 * Downloads an SVG element as a file.
 *
 * This works entirely client-side - no server required.
 * The SVG is serialized from the DOM and downloaded directly.
 *
 * @param svgElement - The SVG element to download (from CardCanvas)
 * @param options - Download options including bleed
 *
 * @example
 * ```svelte
 * <script>
 *   import { CardCanvas, downloadSVG } from 'svelte-trading-cards';
 *
 *   let svgElement: SVGSVGElement;
 *
 *   function handleDownload() {
 *     downloadSVG(svgElement, { filename: 'my-card', bleedMm: 3 });
 *   }
 * </script>
 *
 * <CardCanvas bind:this={svgElement} {template} {data} />
 * <button onclick={handleDownload}>Download SVG</button>
 * ```
 */
export declare function downloadSVG(svgElement: SVGSVGElement, options?: DownloadOptions): void;
/**
 * Converts an SVG element to a PNG using Canvas (client-side).
 *
 * Note: This is a client-side conversion. For server-side PNG generation
 * with proper font support, use `svgToPNG` from `svelte-trading-cards/server`.
 *
 * @param svgElement - The SVG element to convert
 * @param scale - Scale factor for the output (default: 1)
 * @param bleedMm - Bleed amount in millimeters (default: 0)
 * @returns A promise that resolves to a Blob containing the PNG
 *
 * @example
 * ```typescript
 * const pngBlob = await svgToPNGClient(svgElement, 2, 3); // 2x resolution with 3mm bleed
 * ```
 */
export declare function svgToPNGClient(svgElement: SVGSVGElement, scale?: number, bleedMm?: number): Promise<Blob>;
/**
 * Downloads an SVG element as a PNG file (client-side).
 *
 * Note: Client-side PNG conversion may not render custom fonts correctly.
 * For production use with custom fonts, use server-side rendering.
 *
 * @param svgElement - The SVG element to download
 * @param options - Download options including scale and bleed
 */
export declare function downloadPNGClient(svgElement: SVGSVGElement, options?: DownloadOptions & {
    scale?: number;
}): Promise<void>;
