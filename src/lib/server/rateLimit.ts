import { error } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';

interface Bucket {
	count: number;
	resetAt: number;
}

const buckets = new Map<string, Bucket>();

function getKey(event: RequestEvent, scope: string): string {
	let client = 'unknown';
	try {
		client = event.getClientAddress();
	} catch {
		// Fallback for environments where client address is unavailable.
		const xff = event.request.headers.get('x-forwarded-for');
		client = xff?.split(',')[0]?.trim() || 'unknown';
	}
	return `${scope}:${client}`;
}

function cleanup(now: number): void {
	for (const [key, value] of buckets) {
		if (value.resetAt <= now) {
			buckets.delete(key);
		}
	}
}

/**
 * Simple in-memory per-IP rate limiter.
 * Suitable for single-instance MVP deployments.
 */
export function enforceRateLimit(
	event: RequestEvent,
	scope: string,
	maxRequests: number,
	windowMs: number
): void {
	const now = Date.now();
	cleanup(now);

	const key = getKey(event, scope);
	const bucket = buckets.get(key);

	if (!bucket || bucket.resetAt <= now) {
		buckets.set(key, { count: 1, resetAt: now + windowMs });
		return;
	}

	if (bucket.count >= maxRequests) {
		throw error(429, 'Too many requests. Please try again shortly.');
	}

	bucket.count += 1;
}

