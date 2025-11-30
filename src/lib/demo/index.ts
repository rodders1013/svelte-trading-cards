export * from './types.js';

// Import raw platform data
import xboxDataRaw from './data/xbox-data.json';
import playstationDataRaw from './data/playstation-data.json';
import steamDataRaw from './data/steam-data.json';
import defaultTemplate from './templates/default-template.json';

// Import types and field definitions
import {
	xboxDataFields,
	playstationDataFields,
	steamDataFields,
	type XboxGame,
	type PlayStationGame,
	type SteamGame,
	type XboxDataset,
	type PlayStationDataset,
	type SteamDataset,
	type AnyDataset
} from './types.js';

// =============================================================================
// DATASETS - Each with its own fields and data shape
// =============================================================================

export const datasets: Record<string, AnyDataset> = {
	xbox: {
		id: 'xbox',
		name: 'Xbox Games',
		description: 'Xbox game data with achievements and gamerscore',
		platform: 'xbox',
		dataFields: xboxDataFields,
		cards: xboxDataRaw.cards as XboxGame[]
	},
	playstation: {
		id: 'playstation',
		name: 'PlayStation Games',
		description: 'PlayStation game data with trophy breakdown',
		platform: 'playstation',
		dataFields: playstationDataFields,
		cards: playstationDataRaw.cards as PlayStationGame[]
	},
	steam: {
		id: 'steam',
		name: 'Steam Games',
		description: 'Steam game data with playtime and achievements',
		platform: 'steam',
		dataFields: steamDataFields,
		cards: steamDataRaw.cards as SteamGame[]
	}
} as const;

export type DatasetKey = keyof typeof datasets;

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get the dataFields for a specific dataset
 */
export function getDataFieldsForDataset(datasetId: string) {
	return datasets[datasetId]?.dataFields ?? [];
}

/**
 * Find fields in a template that don't exist in the target dataset
 */
export function findUnmappedFields(
	templateFields: string[],
	targetDatasetId: string
): string[] {
	const targetFields = getDataFieldsForDataset(targetDatasetId);
	const targetFieldValues = new Set(targetFields.map((f) => f.value));

	return templateFields.filter((field) => !targetFieldValues.has(field));
}

// =============================================================================
// TEMPLATES
// =============================================================================

export const templates = {
	default: defaultTemplate
} as const;
