import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { svgToPNG } from '$lib/server';
import { embedImages, hasExternalImages } from '$lib/server/embedImages';
import { sanitizeFilename } from '$lib/export/downloadSVG.js';
import { enforceRateLimit } from '$lib/server/rateLimit.js';
import { enforceContentLengthLimit } from '$lib/server/requestLimits.js';

export const POST: RequestHandler = async (event) => {
	try {
		enforceRateLimit(event, 'cards:download-png', 20, 60_000);
		enforceContentLengthLimit(event.request, 1_200_000);

		const { svg, filename = 'card' } = await event.request.json();

		if (!svg || typeof svg !== 'string') {
			throw error(400, 'SVG string is required');
		}
		if (svg.length > 1_000_000) {
			throw error(413, 'SVG is too large');
		}

		// Sanitize filename to prevent header injection
		const safeFilename = sanitizeFilename(filename);

		// Embed external images if present
		let processedSvg = svg;
		if (hasExternalImages(svg)) {
			processedSvg = await embedImages(svg, { timeout: 15000 });
		}

		// Convert to PNG
		const { buffer } = await svgToPNG(processedSvg);

		// Convert Node.js Buffer to Uint8Array for Response
		return new Response(new Uint8Array(buffer), {
			headers: {
				'Content-Type': 'image/png',
				'Content-Disposition': `attachment; filename="${safeFilename}.png"`,
				'Cache-Control': 'no-store'
			}
		});
	} catch (err) {
		console.error('PNG generation error:', err);

		if (err instanceof Error && err.message.includes('canvas')) {
			throw error(500, 'Server PNG generation requires canvas package. Run: npm install canvas canvg');
		}

		throw error(500, 'Failed to generate PNG');
	}
};
