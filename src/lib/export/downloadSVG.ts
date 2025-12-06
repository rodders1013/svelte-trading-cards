/**
 * Client-side SVG download utilities.
 *
 * These functions work entirely in the browser - no server required.
 * For server-side PNG generation, use `svelte-trading-cards/server`.
 */

import { CARD_WIDTH, CARD_HEIGHT } from '../types/CardTemplate.js';

/**
 * Fetches an image and converts it to a base64 data URI (client-side).
 */
async function fetchImageAsDataURIClient(url: string): Promise<string | null> {
	try {
		const response = await fetch(url);
		if (!response.ok) return null;

		const blob = await response.blob();
		return new Promise((resolve) => {
			const reader = new FileReader();
			reader.onloadend = () => resolve(reader.result as string);
			reader.onerror = () => resolve(null);
			reader.readAsDataURL(blob);
		});
	} catch {
		return null;
	}
}

/**
 * Embeds external images in an SVG string as base64 data URIs (client-side).
 * This is required before rendering to canvas to avoid CORS tainting.
 */
async function embedImagesClient(svgString: string): Promise<string> {
	// Find all <image> elements with external URLs
	const imageRegex = /<image[^>]*(?:href|xlink:href)=["'](https?:\/\/[^"']+)["'][^>]*>/gi;
	const matches = [...svgString.matchAll(imageRegex)];

	if (matches.length === 0) return svgString;

	// Deduplicate URLs
	const uniqueUrls = [...new Set(matches.map((m) => m[1]))];

	// Fetch all images in parallel
	const urlToDataUri = new Map<string, string>();
	await Promise.all(
		uniqueUrls.map(async (url) => {
			const dataUri = await fetchImageAsDataURIClient(url);
			if (dataUri) {
				urlToDataUri.set(url, dataUri);
			}
		})
	);

	// Replace URLs with data URIs
	let result = svgString;
	for (const [url, dataUri] of urlToDataUri) {
		const escapedUrl = url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		result = result.replace(new RegExp(escapedUrl, 'g'), dataUri);
	}

	return result;
}

/** Pixels per millimeter at 300 DPI (750px / 63.5mm = 11.811) */
const PX_PER_MM = 11.811;

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
export function sanitizeFilename(filename: string): string {
	return (
		filename
			// Remove path separators and dangerous characters
			.replace(/[/\\:*?"<>|]/g, '')
			// Replace any remaining non-alphanumeric chars (except underscore, hyphen, space, dot)
			.replace(/[^\w\s.-]/g, '')
			// Limit length
			.substring(0, 100)
			// Trim whitespace
			.trim() || 'card'
	);
}

/**
 * Applies bleed to an SVG element by expanding the canvas and extending the Card Base layer.
 * Returns a new SVG element - does not modify the original.
 *
 * @param svgElement - The original SVG element
 * @param options - Bleed options
 * @returns A new SVG element with bleed applied
 */
export function applyBleed(svgElement: SVGSVGElement, options: BleedOptions): SVGSVGElement {
	const { bleedMm, cardBaseId = 'card-base' } = options;

	if (bleedMm <= 0) {
		return svgElement;
	}

	// Calculate bleed in pixels
	const bleedPx = Math.round(bleedMm * PX_PER_MM);

	// Clone the SVG
	const clonedSvg = svgElement.cloneNode(true) as SVGSVGElement;

	// Calculate new dimensions
	const newWidth = CARD_WIDTH + bleedPx * 2;
	const newHeight = CARD_HEIGHT + bleedPx * 2;

	// Update SVG dimensions and viewBox
	clonedSvg.setAttribute('width', String(newWidth));
	clonedSvg.setAttribute('height', String(newHeight));
	clonedSvg.setAttribute('viewBox', `0 0 ${newWidth} ${newHeight}`);

	// Find all top-level groups and process them
	const groups = clonedSvg.querySelectorAll(':scope > g');

	groups.forEach((group) => {
		const groupId = group.getAttribute('id') || '';
		const isCardBase = groupId === cardBaseId;

		if (isCardBase) {
			// Extend the Card Base to cover the bleed area
			// Update the group's clip path and children

			// Find and update the clip path definition
			const clipPathId = `clip-${groupId}`;
			const clipPath = clonedSvg.querySelector(`#${clipPathId}`);
			if (clipPath) {
				// Update clip path dimensions
				const clipRect = clipPath.querySelector('rect');
				if (clipRect) {
					clipRect.setAttribute('x', '0');
					clipRect.setAttribute('y', '0');
					clipRect.setAttribute('width', String(newWidth));
					clipRect.setAttribute('height', String(newHeight));
				}
			}

			// Update the group's transform to position at 0,0
			group.setAttribute('transform', 'translate(0, 0)');

			// Find and extend background elements
			const backgrounds = group.querySelectorAll('rect[fill], rect[class*="background"]');
			backgrounds.forEach((bg) => {
				const rect = bg as SVGRectElement;
				// If rect is at 0,0 and full size, extend it to bleed size
				const x = parseFloat(rect.getAttribute('x') || '0');
				const y = parseFloat(rect.getAttribute('y') || '0');
				const w = parseFloat(rect.getAttribute('width') || '0');
				const h = parseFloat(rect.getAttribute('height') || '0');

				if (x === 0 && y === 0 && w >= CARD_WIDTH - 10 && h >= CARD_HEIGHT - 10) {
					rect.setAttribute('width', String(newWidth));
					rect.setAttribute('height', String(newHeight));
				}
			});

			// Find and extend border elements (typically stroke rects)
			const borders = group.querySelectorAll('rect[stroke]');
			borders.forEach((border) => {
				const rect = border as SVGRectElement;
				const x = parseFloat(rect.getAttribute('x') || '0');
				const y = parseFloat(rect.getAttribute('y') || '0');
				const w = parseFloat(rect.getAttribute('width') || '0');
				const h = parseFloat(rect.getAttribute('height') || '0');
				const strokeWidth = parseFloat(rect.getAttribute('stroke-width') || '0');

				// If this is an edge-to-edge border, extend it
				if (x <= strokeWidth && y <= strokeWidth && w >= CARD_WIDTH - strokeWidth * 2 && h >= CARD_HEIGHT - strokeWidth * 2) {
					rect.setAttribute('x', String(strokeWidth / 2));
					rect.setAttribute('y', String(strokeWidth / 2));
					rect.setAttribute('width', String(newWidth - strokeWidth));
					rect.setAttribute('height', String(newHeight - strokeWidth));
				}
			});

			// Also handle pattern backgrounds (foreignObject or pattern fills)
			const patterns = group.querySelectorAll('pattern');
			patterns.forEach((pattern) => {
				// Patterns automatically tile, but we may need to update their parent rect
				const parentRect = pattern.parentElement?.querySelector('rect[fill*="url"]');
				if (parentRect) {
					parentRect.setAttribute('width', String(newWidth));
					parentRect.setAttribute('height', String(newHeight));
				}
			});
		} else {
			// Offset non-Card Base groups by bleed amount
			const currentTransform = group.getAttribute('transform') || '';
			const translateMatch = currentTransform.match(/translate\(([^,)]+),?\s*([^)]*)\)/);

			let x = 0;
			let y = 0;
			if (translateMatch) {
				x = parseFloat(translateMatch[1]) || 0;
				y = parseFloat(translateMatch[2]) || 0;
			}

			// Add bleed offset to position
			group.setAttribute('transform', `translate(${x + bleedPx}, ${y + bleedPx})`);
		}
	});

	return clonedSvg;
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
export function downloadSVG(svgElement: SVGSVGElement, options: DownloadOptions = {}): void {
	const { filename = 'card', bleedMm = 0 } = options;
	const safeFilename = sanitizeFilename(filename);

	// Apply bleed if specified
	const svgToExport = bleedMm > 0 ? applyBleed(svgElement, { bleedMm }) : svgElement;

	const blob = svgToBlob(svgToExport);
	const url = URL.createObjectURL(blob);

	const link = document.createElement('a');
	link.href = url;
	link.download = `${safeFilename}.svg`;
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
 * @param bleedMm - Bleed amount in millimeters (default: 0)
 * @returns A promise that resolves to a Blob containing the PNG
 *
 * @example
 * ```typescript
 * const pngBlob = await svgToPNGClient(svgElement, 2, 3); // 2x resolution with 3mm bleed
 * ```
 */
export async function svgToPNGClient(svgElement: SVGSVGElement, scale = 1, bleedMm = 0): Promise<Blob> {
	// Apply bleed if specified
	const svgToRender = bleedMm > 0 ? applyBleed(svgElement, { bleedMm }) : svgElement;

	const width = (svgToRender.width.baseVal.value || CARD_WIDTH) * scale;
	const height = (svgToRender.height.baseVal.value || CARD_HEIGHT) * scale;

	const canvas = document.createElement('canvas');
	canvas.width = width;
	canvas.height = height;

	const ctx = canvas.getContext('2d');
	if (!ctx) {
		throw new Error('Could not get canvas context');
	}

	// Serialize and embed external images as base64 to avoid CORS tainting
	let svgString = serializeSVG(svgToRender, true);
	svgString = await embedImagesClient(svgString);

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
 * @param options - Download options including scale and bleed
 */
export async function downloadPNGClient(
	svgElement: SVGSVGElement,
	options: DownloadOptions & { scale?: number } = {}
): Promise<void> {
	const { filename = 'card', scale = 1, bleedMm = 0 } = options;
	const safeFilename = sanitizeFilename(filename);

	const blob = await svgToPNGClient(svgElement, scale, bleedMm);
	const url = URL.createObjectURL(blob);

	const link = document.createElement('a');
	link.href = url;
	link.download = `${safeFilename}.png`;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);

	URL.revokeObjectURL(url);
}
