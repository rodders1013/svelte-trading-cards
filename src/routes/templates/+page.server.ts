import type { PageServerLoad } from './$types';
import { listPublicTemplates, listTemplateFacets } from '$lib/server/templates/repository.js';
import { isDatabaseConfigured } from '$lib/server/db.js';

export const load: PageServerLoad = async ({ url }) => {
	if (!isDatabaseConfigured()) {
		return {
			enabled: false,
			templates: [],
			filters: {
				search: '',
				username: '',
				scope: '',
				gameKey: '',
				sort: 'recent'
			},
			facets: {
				usernames: [],
				gameKeys: []
			},
			total: 0
		};
	}

	const filters = {
		search: url.searchParams.get('search') ?? '',
		username: url.searchParams.get('username') ?? '',
		scope: url.searchParams.get('scope') ?? '',
		gameKey: url.searchParams.get('gameKey') ?? '',
		sort: (url.searchParams.get('sort') ?? 'recent') as 'recent' | 'name' | 'popular'
	};

	const [result, facets] = await Promise.all([
		listPublicTemplates({
			limit: 60,
			offset: 0,
			search: filters.search || undefined,
			username: filters.username || undefined,
			scope: (filters.scope || undefined) as 'universal' | 'game' | undefined,
			gameKey: filters.gameKey || undefined,
			sort: filters.sort
		}),
		listTemplateFacets()
	]);

	return {
		enabled: true,
		templates: result.templates,
		total: result.total,
		filters,
		facets
	};
};
