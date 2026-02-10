import type { PageServerLoad } from './$types';
import { listPublicTemplates } from '$lib/server/templates/repository.js';
import { isDatabaseConfigured } from '$lib/server/db.js';

export const load: PageServerLoad = async () => {
	if (!isDatabaseConfigured()) {
		return {
			enabled: false,
			templates: []
		};
	}

	const templates = await listPublicTemplates(50, 0);
	return {
		enabled: true,
		templates: templates.map((template) => ({
			slug: template.slug,
			name: template.name,
			description: template.description,
			updatedAt: template.updatedAt,
			tags: template.tags
		}))
	};
};
