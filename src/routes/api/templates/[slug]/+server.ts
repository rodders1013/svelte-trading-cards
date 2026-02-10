import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { ZodError } from 'zod';
import {
	deleteTemplateBySlug,
	getPublicTemplateBySlug,
	updateTemplateBySlug
} from '$lib/server/templates/repository.js';
import { isDatabaseConfigured } from '$lib/server/db.js';

function getEditToken(request: Request): string | null {
	const headerToken = request.headers.get('x-edit-token');
	if (headerToken) return headerToken;
	return null;
}

export const GET: RequestHandler = async ({ params }) => {
	if (!isDatabaseConfigured()) {
		throw error(500, 'DATABASE_URL is not configured');
	}

	const template = await getPublicTemplateBySlug(params.slug);
	if (!template) throw error(404, 'Template not found');
	return json(template);
};

export const PATCH: RequestHandler = async ({ params, request }) => {
	if (!isDatabaseConfigured()) {
		throw error(500, 'DATABASE_URL is not configured');
	}

	const editToken = getEditToken(request);
	if (!editToken) throw error(401, 'x-edit-token is required');

	try {
		const payload = await request.json();
		const updated = await updateTemplateBySlug(params.slug, editToken, payload);
		if (!updated) throw error(404, 'Template not found or invalid token');
		return json(updated);
	} catch (err) {
		if (typeof err === 'object' && err !== null && 'status' in err) {
			throw err;
		}
		if (err instanceof ZodError) {
			throw error(400, err.issues.map((issue) => issue.message).join(', '));
		}
		throw error(500, 'Failed to update template');
	}
};

export const DELETE: RequestHandler = async ({ params, request }) => {
	if (!isDatabaseConfigured()) {
		throw error(500, 'DATABASE_URL is not configured');
	}

	const editToken = getEditToken(request);
	if (!editToken) throw error(401, 'x-edit-token is required');

	const removed = await deleteTemplateBySlug(params.slug, editToken);
	if (!removed) throw error(404, 'Template not found or invalid token');

	return new Response(null, { status: 204 });
};
