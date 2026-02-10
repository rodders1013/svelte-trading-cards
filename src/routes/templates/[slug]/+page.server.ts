import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getPublicTemplateBySlug } from '$lib/server/templates/repository.js';
import { isDatabaseConfigured } from '$lib/server/db.js';

export const load: PageServerLoad = async ({ params }) => {
	if (!isDatabaseConfigured()) {
		throw error(500, 'Template database is not configured');
	}

	const template = await getPublicTemplateBySlug(params.slug);
	if (!template) throw error(404, 'Template not found');

	return { template };
};
