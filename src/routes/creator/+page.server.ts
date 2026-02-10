import type { PageServerLoad } from './$types';
import { isDatabaseConfigured } from '$lib/server/db.js';
import { getPublicTemplateBySlug } from '$lib/server/templates/repository.js';

export const load: PageServerLoad = async ({ url }) => {
	const templateSlug = url.searchParams.get('template');
	const dataset = url.searchParams.get('dataset');

	const initialState = {
		initialTemplate: undefined as unknown[] | undefined,
		initialTemplateName: 'New Template',
		initialDataset: dataset && ['xbox', 'playstation', 'steam'].includes(dataset) ? dataset : 'xbox'
	};

	if (!templateSlug || !isDatabaseConfigured()) {
		return initialState;
	}

	const template = await getPublicTemplateBySlug(templateSlug);
	if (!template?.editorState) {
		return {
			...initialState,
			initialTemplateName: template?.name ?? initialState.initialTemplateName
		};
	}

	return {
		initialTemplate: template.editorState,
		initialTemplateName: template.name,
		initialDataset:
			(template.gameKey && ['xbox', 'playstation', 'steam'].includes(template.gameKey)
				? template.gameKey
				: initialState.initialDataset)
	};
};
