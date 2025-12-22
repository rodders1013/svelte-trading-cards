import type { CardTemplate, CardData } from '../../types/index.js';
import { type OGImageOptions } from './types.js';
/**
 * Render a card as an Open Graph image with branding.
 *
 * Creates a landscape (or custom sized) image optimized for social media sharing,
 * with the card centered on a background and optional branding elements.
 *
 * @param template - Card template
 * @param data - Card data
 * @param options - OG image options (size, background, branding)
 * @returns PNG buffer and metadata
 *
 * @example
 * ```typescript
 * import { renderOGImage } from 'svelte-trading-cards/server';
 *
 * const { buffer, width, height } = await renderOGImage(template, data, {
 *   preset: 'twitter',
 *   background: '#1a1a2e',
 *   branding: {
 *     logo: { url: 'https://myapp.com/logo.png', position: 'top-left' },
 *     watermark: { text: 'myapp.com', position: 'bottom-right' }
 *   }
 * });
 * ```
 */
export declare function renderOGImage(template: CardTemplate, data: CardData, options?: Partial<OGImageOptions>): Promise<{
    buffer: Buffer;
    width: number;
    height: number;
}>;
