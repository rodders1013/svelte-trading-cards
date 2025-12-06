/**
 * Image embedding utility for server-side SVG rendering.
 *
 * External images (URLs) must be embedded as base64 data URIs
 * before the SVG can be rasterized to PNG.
 */

import sharp from 'sharp';

export interface EmbedOptions {
	/** Maximum concurrent image fetches. Defaults to 3 */
	concurrency?: number;
	/** Timeout per image fetch in ms. Defaults to 10000 */
	timeout?: number;
	/** Whether to throw on failed image fetches. Defaults to false */
	throwOnError?: boolean;
}

interface ImageMatch {
	fullMatch: string;
	url: string;
	index: number;
}

/**
 * Fetches an image and converts it to a base64 data URI.
 *
 * @param url - The image URL to fetch
 * @param timeout - Timeout in milliseconds
 * @returns The base64 data URI, or null on failure
 */
async function fetchImageAsDataURI(url: string, timeout: number): Promise<string | null> {
	try {
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), timeout);

		const response = await fetch(url, {
			signal: controller.signal,
			headers: {
				'Accept': 'image/*',
				'User-Agent': 'Mozilla/5.0 (compatible; CardRenderer/1.0)'
			}
		});

		clearTimeout(timeoutId);

		if (!response.ok) {
			console.warn(`Failed to fetch image: ${url} (${response.status})`);
			return null;
		}

		let contentType = response.headers.get('content-type') || 'image/png';
		let imageBuffer: Buffer = Buffer.from(await response.arrayBuffer());

		// resvg-js doesn't reliably support webp - convert to png
		if (contentType.includes('webp')) {
			imageBuffer = await sharp(imageBuffer).png().toBuffer();
			contentType = 'image/png';
		}

		const base64 = imageBuffer.toString('base64');
		return `data:${contentType};base64,${base64}`;
	} catch (error) {
		if (error instanceof Error && error.name === 'AbortError') {
			console.warn(`Image fetch timed out: ${url}`);
		} else {
			console.warn(`Failed to fetch image: ${url}`, error);
		}
		return null;
	}
}

/**
 * Finds all image references in an SVG string.
 *
 * Matches:
 * - <image href="...">
 * - <image xlink:href="...">
 * - url(...) in CSS
 */
function findImageReferences(svgString: string): ImageMatch[] {
	const matches: ImageMatch[] = [];

	// Match <image> elements with href or xlink:href
	const imageRegex = /<image[^>]*(?:href|xlink:href)=["']([^"']+)["'][^>]*>/gi;
	let match;

	while ((match = imageRegex.exec(svgString)) !== null) {
		const url = match[1];
		// Only process external URLs (not data URIs or relative paths that won't resolve)
		if (url.startsWith('http://') || url.startsWith('https://')) {
			matches.push({
				fullMatch: match[0],
				url,
				index: match.index
			});
		}
	}

	// Match url() references in style attributes or CSS
	const urlRegex = /url\(["']?(https?:\/\/[^"')]+)["']?\)/gi;

	while ((match = urlRegex.exec(svgString)) !== null) {
		matches.push({
			fullMatch: match[0],
			url: match[1],
			index: match.index
		});
	}

	return matches;
}

/**
 * Processes items with a concurrency limit.
 * Uses a pool of in-flight promises to limit concurrent operations.
 */
async function processWithConcurrency<T, R>(
	items: T[],
	processor: (item: T) => Promise<R>,
	concurrency: number
): Promise<R[]> {
	const results: R[] = [];
	const inFlight = new Set<Promise<void>>();

	for (const item of items) {
		// Create a promise that removes itself from the set when done
		const promise = processor(item)
			.then((result) => {
				results.push(result);
			})
			.finally(() => {
				inFlight.delete(promise);
			});

		inFlight.add(promise);

		// If we've hit the concurrency limit, wait for one to complete
		if (inFlight.size >= concurrency) {
			await Promise.race(inFlight);
		}
	}

	// Wait for all remaining promises to complete
	await Promise.all(inFlight);
	return results;
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
export async function embedImages(svgString: string, options: EmbedOptions = {}): Promise<string> {
	const { concurrency = 3, timeout = 10000, throwOnError = false } = options;

	const imageMatches = findImageReferences(svgString);

	if (imageMatches.length === 0) {
		return svgString;
	}

	// Deduplicate URLs
	const uniqueUrls = [...new Set(imageMatches.map((m) => m.url))];

	// Fetch all unique images with concurrency limit
	const urlToDataUri = new Map<string, string>();

	await processWithConcurrency(
		uniqueUrls,
		async (url) => {
			const dataUri = await fetchImageAsDataURI(url, timeout);
			if (dataUri) {
				urlToDataUri.set(url, dataUri);
			} else if (throwOnError) {
				throw new Error(`Failed to embed image: ${url}`);
			}
		},
		concurrency
	);

	// Replace URLs with data URIs
	let result = svgString;

	for (const [url, dataUri] of urlToDataUri) {
		// Escape special regex characters in URL
		const escapedUrl = url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		result = result.replace(new RegExp(escapedUrl, 'g'), dataUri);
	}

	return result;
}

/**
 * Checks if an SVG string contains external image references.
 *
 * @param svgString - The SVG string to check
 * @returns True if external images are found
 */
export function hasExternalImages(svgString: string): boolean {
	return findImageReferences(svgString).length > 0;
}
