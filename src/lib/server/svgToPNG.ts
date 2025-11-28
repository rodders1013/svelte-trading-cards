/**
 * SVG to PNG conversion using resvg-js.
 *
 * Uses the Rust-based resvg library compiled to WASM for high-quality
 * server-side SVG rendering.
 */

import { CARD_WIDTH, CARD_HEIGHT } from '../types/CardTemplate.js';

export interface PNGOptions {
	/** Output width in pixels. Defaults to CARD_WIDTH (750) */
	width?: number;
	/** Output height in pixels. Defaults to CARD_HEIGHT (1050) */
	height?: number;
	/** Background color (CSS color string). Defaults to transparent */
	backgroundColor?: string;
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
export async function svgToPNG(svgString: string, options: PNGOptions = {}): Promise<PNGResult> {
	const { width = CARD_WIDTH, height = CARD_HEIGHT, backgroundColor } = options;

	// Dynamically import resvg-js
	const { Resvg } = await import('@resvg/resvg-js');

	// Configure resvg options
	const resvgOptions: {
		background?: string;
		fitTo: { mode: 'width'; value: number };
	} = {
		fitTo: {
			mode: 'width',
			value: width
		}
	};

	// Add background if specified
	if (backgroundColor) {
		resvgOptions.background = backgroundColor;
	}

	// Render SVG to PNG
	const resvg = new Resvg(svgString, resvgOptions);
	const pngData = resvg.render();
	const buffer = Buffer.from(pngData.asPng());

	return {
		buffer,
		width: pngData.width,
		height: pngData.height
	};
}

/**
 * Converts an SVG string to a PNG data URL.
 *
 * @param svgString - The SVG string to convert
 * @param options - PNG generation options
 * @returns The PNG as a data URL
 */
export async function svgToPNGDataURL(svgString: string, options: PNGOptions = {}): Promise<string> {
	const { buffer } = await svgToPNG(svgString, options);
	return `data:image/png;base64,${buffer.toString('base64')}`;
}
