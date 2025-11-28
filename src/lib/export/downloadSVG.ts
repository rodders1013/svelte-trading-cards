/**
 * Client-side SVG download utilities.
 *
 * These functions work entirely in the browser - no server required.
 * For server-side PNG generation, use `svelte-trading-cards/server`.
 */

import { CARD_WIDTH, CARD_HEIGHT } from '../types/CardTemplate.js';

export interface DownloadOptions {
	/** Filename without extension. Defaults to 'card' */
	filename?: string;
	/** Include XML declaration and doctype. Defaults to true */
	includeDeclaration?: boolean;
}

/**
 * Serializes an SVG element to a string.
 *
 * @param svgElement - The SVG element to serialize
 * @param includeDeclaration - Whether to include XML declaration
 * @returns The serialized SVG string
 */
export function serializeSVG(svgElement: SVGSVGElement, includeDeclaration = true): string {
	const serializer = new XMLSerializer();
	let svgString = serializer.serializeToString(svgElement);

	if (includeDeclaration) {
		// Ensure proper XML declaration and namespace
		if (!svgString.includes('xmlns=')) {
			svgString = svgString.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
		}
		svgString = '<?xml version="1.0" encoding="UTF-8"?>\n' + svgString;
	}

	return svgString;
}

/**
 * Converts an SVG element to a data URL.
 *
 * @param svgElement - The SVG element to convert
 * @returns A data URL containing the SVG
 */
export function svgToDataURL(svgElement: SVGSVGElement): string {
	const svgString = serializeSVG(svgElement, true);
	const encoded = encodeURIComponent(svgString);
	return `data:image/svg+xml;charset=utf-8,${encoded}`;
}

/**
 * Converts an SVG element to a Blob.
 *
 * @param svgElement - The SVG element to convert
 * @returns A Blob containing the SVG
 */
export function svgToBlob(svgElement: SVGSVGElement): Blob {
	const svgString = serializeSVG(svgElement, true);
	return new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
}

/**
 * Downloads an SVG element as a file.
 *
 * This works entirely client-side - no server required.
 * The SVG is serialized from the DOM and downloaded directly.
 *
 * @param svgElement - The SVG element to download (from CardCanvas)
 * @param options - Download options
 *
 * @example
 * ```svelte
 * <script>
 *   import { CardCanvas, downloadSVG } from 'svelte-trading-cards';
 *
 *   let svgElement: SVGSVGElement;
 *
 *   function handleDownload() {
 *     downloadSVG(svgElement, { filename: 'my-card' });
 *   }
 * </script>
 *
 * <CardCanvas bind:this={svgElement} {template} {data} />
 * <button onclick={handleDownload}>Download SVG</button>
 * ```
 */
export function downloadSVG(svgElement: SVGSVGElement, options: DownloadOptions = {}): void {
	const { filename = 'card', includeDeclaration = true } = options;

	const blob = svgToBlob(svgElement);
	const url = URL.createObjectURL(blob);

	const link = document.createElement('a');
	link.href = url;
	link.download = `${filename}.svg`;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);

	// Clean up the object URL
	URL.revokeObjectURL(url);
}

/**
 * Converts an SVG element to a PNG using Canvas (client-side).
 *
 * Note: This is a client-side conversion. For server-side PNG generation
 * with proper font support, use `svgToPNG` from `svelte-trading-cards/server`.
 *
 * @param svgElement - The SVG element to convert
 * @param scale - Scale factor for the output (default: 1)
 * @returns A promise that resolves to a Blob containing the PNG
 *
 * @example
 * ```typescript
 * const pngBlob = await svgToPNGClient(svgElement, 2); // 2x resolution
 * ```
 */
export async function svgToPNGClient(svgElement: SVGSVGElement, scale = 1): Promise<Blob> {
	const width = (svgElement.width.baseVal.value || CARD_WIDTH) * scale;
	const height = (svgElement.height.baseVal.value || CARD_HEIGHT) * scale;

	const canvas = document.createElement('canvas');
	canvas.width = width;
	canvas.height = height;

	const ctx = canvas.getContext('2d');
	if (!ctx) {
		throw new Error('Could not get canvas context');
	}

	const svgString = serializeSVG(svgElement, true);
	const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
	const url = URL.createObjectURL(svgBlob);

	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => {
			ctx.drawImage(img, 0, 0, width, height);
			URL.revokeObjectURL(url);

			canvas.toBlob(
				(blob) => {
					if (blob) {
						resolve(blob);
					} else {
						reject(new Error('Failed to create PNG blob'));
					}
				},
				'image/png',
				1.0
			);
		};
		img.onerror = () => {
			URL.revokeObjectURL(url);
			reject(new Error('Failed to load SVG into image'));
		};
		img.src = url;
	});
}

/**
 * Downloads an SVG element as a PNG file (client-side).
 *
 * Note: Client-side PNG conversion may not render custom fonts correctly.
 * For production use with custom fonts, use server-side rendering.
 *
 * @param svgElement - The SVG element to download
 * @param options - Download options including scale
 */
export async function downloadPNGClient(
	svgElement: SVGSVGElement,
	options: DownloadOptions & { scale?: number } = {}
): Promise<void> {
	const { filename = 'card', scale = 1 } = options;

	const blob = await svgToPNGClient(svgElement, scale);
	const url = URL.createObjectURL(blob);

	const link = document.createElement('a');
	link.href = url;
	link.download = `${filename}.png`;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);

	URL.revokeObjectURL(url);
}
