import { CARD_WIDTH, CARD_HEIGHT } from '../../types/index.js';
import { renderToSVGString } from '../render.js';
import { embedImages } from '../embedImages.js';
import { svgToPNG } from '../svgToPNG.js';
import { getOGImageSize, getPositionCoords, getTextAnchor } from './types.js';
// =============================================================================
// OG IMAGE RENDERER
// =============================================================================
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
export async function renderOGImage(template, data, options = {}) {
    // Apply defaults
    const opts = {
        preset: options.preset ?? 'twitter',
        size: options.size,
        background: options.background ?? '#1a1a2e',
        backgroundGradient: options.backgroundGradient,
        cardScale: options.cardScale ?? 0.85,
        cardPosition: options.cardPosition ?? 'center',
        branding: options.branding,
        scale: options.scale ?? 1,
        cardRadius: options.cardRadius
    };
    const { width, height } = getOGImageSize(opts);
    const scale = opts.scale;
    // Calculate card dimensions to fit within the OG image
    const cardAspect = CARD_WIDTH / CARD_HEIGHT;
    const maxCardHeight = height * opts.cardScale;
    const maxCardWidth = maxCardHeight * cardAspect;
    // Ensure card fits horizontally too
    let cardWidth = maxCardWidth;
    let cardHeight = maxCardHeight;
    if (cardWidth > width * 0.9) {
        cardWidth = width * 0.9;
        cardHeight = cardWidth / cardAspect;
    }
    // Calculate card position
    let cardX;
    if (opts.cardPosition === 'left') {
        cardX = width * 0.1;
    }
    else if (opts.cardPosition === 'right') {
        cardX = width - cardWidth - width * 0.1;
    }
    else {
        cardX = (width - cardWidth) / 2;
    }
    // Adjust vertical position if caption is below
    const hasCaption = opts.branding?.caption && opts.branding.caption.position === 'below';
    const captionHeight = hasCaption ? 60 : 0;
    const cardY = (height - cardHeight - captionHeight) / 2;
    // Render the card SVG
    const cardSvg = await renderToSVGString(template, data);
    // Build the composite SVG
    const compositeSvg = buildCompositeSVG({
        width,
        height,
        cardSvg,
        cardX,
        cardY,
        cardWidth,
        cardHeight,
        cardRadius: opts.cardRadius,
        background: opts.background,
        backgroundGradient: opts.backgroundGradient,
        branding: opts.branding
    });
    // Embed any external images (logo, card images)
    const svgWithImages = await embedImages(compositeSvg);
    // Convert to PNG (scale by rendering at higher resolution)
    const outputWidth = width * scale;
    const outputHeight = height * scale;
    const result = await svgToPNG(svgWithImages, { width: outputWidth, height: outputHeight });
    return {
        buffer: result.buffer,
        width: outputWidth,
        height: outputHeight
    };
}
function buildCompositeSVG(opts) {
    const { width, height, cardSvg, cardX, cardY, cardWidth, cardHeight, cardRadius, background, backgroundGradient, branding } = opts;
    // Calculate scale for the card
    const scaleX = cardWidth / CARD_WIDTH;
    const scaleY = cardHeight / CARD_HEIGHT;
    const cardScale = Math.min(scaleX, scaleY);
    // Extract inner content from card SVG (remove outer svg tag)
    const cardContent = extractSVGContent(cardSvg);
    // Build gradient definition if needed
    let gradientDef = '';
    let backgroundFill = background;
    if (backgroundGradient) {
        const gradientId = 'og-bg-gradient';
        gradientDef = buildGradientDef(gradientId, backgroundGradient);
        backgroundFill = `url(#${gradientId})`;
    }
    // Build branding elements
    const brandingElements = branding ? buildBrandingElements(branding, width, height, cardX, cardY, cardWidth, cardHeight) : '';
    // Build clip path for card rounded corners
    const clipId = 'card-clip';
    const radius = cardRadius ?? 26 * cardScale; // Default card radius scaled
    const clipDef = `<clipPath id="${clipId}">
		<rect x="${cardX}" y="${cardY}" width="${cardWidth}" height="${cardHeight}" rx="${radius}" ry="${radius}"/>
	</clipPath>`;
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
	<defs>
		${gradientDef}
		${clipDef}
	</defs>

	<!-- Background -->
	<rect width="100%" height="100%" fill="${backgroundFill}"/>

	<!-- Card -->
	<g clip-path="url(#${clipId})">
		<g transform="translate(${cardX}, ${cardY}) scale(${cardScale})">
			${cardContent}
		</g>
	</g>

	<!-- Branding -->
	${brandingElements}
</svg>`;
}
function extractSVGContent(svg) {
    // Remove the outer <svg> tag and return inner content
    const match = svg.match(/<svg[^>]*>([\s\S]*)<\/svg>/i);
    return match ? match[1] : svg;
}
function buildGradientDef(id, gradient) {
    let x1 = '0%', y1 = '0%', x2 = '0%', y2 = '100%';
    if (gradient.direction === 'horizontal') {
        x2 = '100%';
        y2 = '0%';
    }
    else if (gradient.direction === 'diagonal') {
        x2 = '100%';
        y2 = '100%';
    }
    return `<linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">
		<stop offset="0%" stop-color="${gradient.from}"/>
		<stop offset="100%" stop-color="${gradient.to}"/>
	</linearGradient>`;
}
function buildBrandingElements(branding, width, height, cardX, cardY, cardWidth, cardHeight) {
    const elements = [];
    // Logo
    if (branding.logo) {
        const logo = branding.logo;
        const size = logo.size ?? 48;
        const padding = logo.padding ?? 24;
        const position = logo.position ?? 'top-left';
        const opacity = logo.opacity ?? 1;
        const { x, y } = getPositionCoords(position, width, height, size, size, padding);
        elements.push(`<image href="${logo.url}" x="${x}" y="${y}" width="${size}" height="${size}" opacity="${opacity}" preserveAspectRatio="xMidYMid meet"/>`);
    }
    // Watermark
    if (branding.watermark) {
        const wm = branding.watermark;
        const padding = wm.padding ?? 16;
        const position = wm.position ?? 'bottom-right';
        const fontSize = wm.fontSize ?? 18;
        const color = wm.color ?? '#ffffff';
        const opacity = wm.opacity ?? 0.6;
        const fontFamily = wm.fontFamily ?? 'Arial, sans-serif';
        const { x, y } = getWatermarkPosition(position, width, height, padding, fontSize);
        const anchor = getTextAnchor(position);
        elements.push(`<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="${fontFamily}" font-size="${fontSize}" fill="${color}" opacity="${opacity}">${escapeXml(wm.text)}</text>`);
    }
    // Caption (below or beside card)
    if (branding.caption) {
        const cap = branding.caption;
        const color = cap.color ?? '#ffffff';
        const titleSize = cap.titleFontSize ?? 28;
        const subtitleSize = cap.subtitleFontSize ?? 18;
        const fontFamily = cap.fontFamily ?? 'Arial, sans-serif';
        if (cap.position === 'below') {
            // Center below card
            const captionX = cardX + cardWidth / 2;
            let captionY = cardY + cardHeight + 30;
            if (cap.title) {
                elements.push(`<text x="${captionX}" y="${captionY}" text-anchor="middle" font-family="${fontFamily}" font-size="${titleSize}" font-weight="bold" fill="${color}">${escapeXml(cap.title)}</text>`);
                captionY += subtitleSize + 8;
            }
            if (cap.subtitle) {
                elements.push(`<text x="${captionX}" y="${captionY}" text-anchor="middle" font-family="${fontFamily}" font-size="${subtitleSize}" fill="${color}" opacity="0.8">${escapeXml(cap.subtitle)}</text>`);
            }
        }
        else {
            // Right of card
            const captionX = cardX + cardWidth + 40;
            let captionY = cardY + cardHeight / 2 - 20;
            if (cap.title) {
                elements.push(`<text x="${captionX}" y="${captionY}" text-anchor="start" font-family="${fontFamily}" font-size="${titleSize}" font-weight="bold" fill="${color}">${escapeXml(cap.title)}</text>`);
                captionY += titleSize + 8;
            }
            if (cap.subtitle) {
                elements.push(`<text x="${captionX}" y="${captionY}" text-anchor="start" font-family="${fontFamily}" font-size="${subtitleSize}" fill="${color}" opacity="0.8">${escapeXml(cap.subtitle)}</text>`);
            }
        }
    }
    return elements.join('\n\t');
}
function getWatermarkPosition(position, width, height, padding, fontSize) {
    let x;
    let y;
    // Horizontal
    if (position.includes('left')) {
        x = padding;
    }
    else if (position.includes('right')) {
        x = width - padding;
    }
    else {
        x = width / 2;
    }
    // Vertical (adjust for text baseline)
    if (position.includes('top')) {
        y = padding + fontSize;
    }
    else if (position.includes('bottom')) {
        y = height - padding;
    }
    else {
        y = height / 2;
    }
    return { x, y };
}
function escapeXml(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}
