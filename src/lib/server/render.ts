/**
 * Server-side SVG rendering.
 *
 * Renders card templates to SVG strings using Svelte's SSR capabilities.
 */

import { render } from 'svelte/server';
import type { CardTemplate, CardData } from '../types/index.js';
import { CARD_WIDTH, CARD_HEIGHT } from '../types/CardTemplate.js';
import CardCanvas from '../core/CardCanvas.svelte';

export interface RenderOptions {
	/** Card width in pixels. Defaults to CARD_WIDTH (750) */
	width?: number;
	/** Card height in pixels. Defaults to CARD_HEIGHT (1050) */
	height?: number;
	/** Include XML declaration. Defaults to true */
	includeDeclaration?: boolean;
}

/**
 * Renders a card template to an SVG string.
 *
 * This uses Svelte's server-side rendering to produce identical
 * output to the client-side CardCanvas component.
 *
 * @param template - The card template to render
 * @param data - The card data
 * @param options - Render options
 * @returns The rendered SVG string
 *
 * @example
 * ```typescript
 * import { renderToSVGString, svgToPNG } from 'svelte-trading-cards/server';
 *
 * // In a SvelteKit API route
 * export async function GET({ params }) {
 *   const cardData = await db.getCard(params.cardId);
 *   const template = await db.getTemplate(cardData.templateId);
 *
 *   const svg = renderToSVGString(template, cardData);
 *   const { buffer } = await svgToPNG(svg);
 *
 *   return new Response(buffer, {
 *     headers: {
 *       'Content-Type': 'image/png',
 *       'Content-Disposition': `attachment; filename="${cardData.id}.png"`
 *     }
 *   });
 * }
 * ```
 */
export function renderToSVGString(
	template: CardTemplate,
	data: CardData,
	options: RenderOptions = {}
): string {
	const { width = CARD_WIDTH, height = CARD_HEIGHT, includeDeclaration = true } = options;

	// Use Svelte 5's server-side render function
	const result = render(CardCanvas, {
		props: {
			template,
			data,
			width,
			height
		}
	});

	let svgString = result.body;

	// Ensure proper namespace
	if (!svgString.includes('xmlns=')) {
		svgString = svgString.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
	}

	// Add xlink namespace if needed (for image href)
	if (svgString.includes('xlink:href') && !svgString.includes('xmlns:xlink')) {
		svgString = svgString.replace(
			'xmlns="http://www.w3.org/2000/svg"',
			'xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"'
		);
	}

	if (includeDeclaration) {
		svgString = '<?xml version="1.0" encoding="UTF-8"?>\n' + svgString;
	}

	return svgString;
}

/**
 * Renders a card template to an SVG string with embedded images.
 *
 * Convenience function that combines renderToSVGString and embedImages.
 *
 * @param template - The card template to render
 * @param data - The card data
 * @param options - Render options
 * @returns The rendered SVG string with embedded images
 */
export async function renderToSVGStringWithImages(
	template: CardTemplate,
	data: CardData,
	options: RenderOptions & { embedOptions?: import('./embedImages.js').EmbedOptions } = {}
): Promise<string> {
	const { embedOptions, ...renderOptions } = options;

	const svgString = renderToSVGString(template, data, renderOptions);

	// Only import embedImages if we need it
	const { embedImages, hasExternalImages } = await import('./embedImages.js');

	if (hasExternalImages(svgString)) {
		return embedImages(svgString, embedOptions);
	}

	return svgString;
}
