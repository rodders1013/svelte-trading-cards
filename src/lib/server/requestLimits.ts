import { error } from '@sveltejs/kit';

/**
 * Enforce an upper bound for request payload size using the Content-Length header.
 * This is a cheap pre-parse guard against oversized JSON bodies.
 */
export function enforceContentLengthLimit(request: Request, maxBytes: number): void {
	const raw = request.headers.get('content-length');
	if (!raw) return;

	const length = Number(raw);
	if (!Number.isFinite(length)) return;

	if (length > maxBytes) {
		throw error(413, `Request body too large (max ${maxBytes} bytes)`);
	}
}

