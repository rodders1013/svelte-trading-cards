import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { ZodError } from 'zod';
import { createTemplate, listPublicTemplates } from '$lib/server/templates/repository.js';
import { isDatabaseConfigured } from '$lib/server/db.js';

function getListOptions(url: URL) {
	const limitParam = Number(url.searchParams.get('limit') ?? 24);
	const offsetParam = Number(url.searchParams.get('offset') ?? 0);
	return {
		limit: Number.isFinite(limitParam) ? limitParam : 24,
		offset: Number.isFinite(offsetParam) ? offsetParam : 0,
		search: url.searchParams.get('search') ?? undefined,
		username: url.searchParams.get('username') ?? undefined,
		scope: (url.searchParams.get('scope') ?? undefined) as 'universal' | 'game' | undefined,
		gameKey: url.searchParams.get('gameKey') ?? undefined,
		sort: (url.searchParams.get('sort') ?? undefined) as 'recent' | 'name' | 'popular' | undefined
	};
}

export const GET: RequestHandler = async ({ url }) => {
	if (!isDatabaseConfigured()) {
		throw error(500, 'DATABASE_URL is not configured');
	}

	const result = await listPublicTemplates(getListOptions(url));
	return json(result);
};

export const POST: RequestHandler = async ({ request }) => {
	if (!isDatabaseConfigured()) {
		throw error(500, 'DATABASE_URL is not configured');
	}

	try {
		const payload = await request.json();
		const created = await createTemplate(payload);
		return json(created, { status: 201 });
	} catch (err) {
		if (typeof err === 'object' && err !== null && 'status' in err) {
			throw err;
		}
		if (err instanceof ZodError) {
			throw error(400, err.issues.map((issue) => issue.message).join(', '));
		}
		throw error(500, 'Failed to create template');
	}
};
