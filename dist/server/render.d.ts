/**
 * Server-side SVG rendering.
 *
 * Renders card templates to SVG strings using Svelte's SSR capabilities.
 */
import type { CardTemplate, CardData } from '../types/index.js';
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
export declare function renderToSVGString(template: CardTemplate, data: CardData, options?: RenderOptions): string;
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
export declare function renderToSVGStringWithImages(template: CardTemplate, data: CardData, options?: RenderOptions & {
    embedOptions?: import('./embedImages.js').EmbedOptions;
}): Promise<string>;
