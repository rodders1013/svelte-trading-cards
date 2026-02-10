import type { PageServerLoad } from './$types';
import { isDatabaseConfigured } from '$lib/server/db.js';
import { getPublicTemplateBySlug } from '$lib/server/templates/repository.js';
import { datasets, type AnyCard } from '$lib/demo';

type DatasetKey = 'xbox' | 'playstation' | 'steam';

function isDatasetKey(value: string | null): value is DatasetKey {
	return value === 'xbox' || value === 'playstation' || value === 'steam';
}

function splitGameKey(gameKey: string | null): { dataset: DatasetKey | null; title: string | null } {
	if (!gameKey) return { dataset: null, title: null };
	const [left, ...rest] = gameKey.split(':');
	if (isDatasetKey(left) && rest.length > 0) {
		return { dataset: left, title: rest.join(':') };
	}
	if (isDatasetKey(left)) {
		return { dataset: left, title: null };
	}
	return { dataset: null, title: gameKey };
}

function getCardTitle(card: AnyCard): string {
	if ('gameName' in card) return card.gameName;
	if ('appName' in card) return card.appName;
	return card.title;
}

function findCardIndex(dataset: DatasetKey, title: string | null): number {
	if (!title) return 0;
	const cards = datasets[dataset].cards as AnyCard[];
	const index = cards.findIndex((card) => getCardTitle(card).toLowerCase() === title.toLowerCase());
	return index >= 0 ? index : 0;
}

export const load: PageServerLoad = async ({ url }) => {
	const templateSlug = url.searchParams.get('template');
	const dataset = url.searchParams.get('dataset');
	const queryGameKey = url.searchParams.get('gameKey');
	const queryGame = splitGameKey(queryGameKey);

	const initialState = {
		initialTemplate: undefined as unknown[] | undefined,
		initialTemplateName: 'New Template',
		initialDataset: isDatasetKey(dataset)
			? dataset
			: (queryGame.dataset ?? 'playstation'),
		initialCardIndex: queryGame.dataset ? findCardIndex(queryGame.dataset, queryGame.title) : 0
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

	const templateGame = splitGameKey(typeof template.gameKey === 'string' ? template.gameKey : null);
	const resolvedDataset = templateGame.dataset ?? initialState.initialDataset;
	const resolvedCardIndex =
		templateGame.dataset ? findCardIndex(templateGame.dataset, templateGame.title) : initialState.initialCardIndex;

	return {
		initialTemplate: template.editorState,
		initialTemplateName: template.name,
		initialDataset: resolvedDataset,
		initialCardIndex: resolvedCardIndex
	};
};
