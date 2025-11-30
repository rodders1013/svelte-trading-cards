import { z } from 'zod';

// =============================================================================
// PLATFORM-SPECIFIC DATA TYPES - Each dataset has its own unique shape
// =============================================================================

/**
 * Xbox game data - uses Xbox-specific terminology
 */
export const XboxGameSchema = z.object({
	id: z.string(),
	gameName: z.string(),
	gamertag: z.string(),
	coverArt: z.string(),
	achievements: z.number(),
	gamerscore: z.number(),
	hoursPlayed: z.number(),
	genre: z.string(),
	lastPlayed: z.string()
});

export type XboxGame = z.infer<typeof XboxGameSchema>;

/**
 * PlayStation game data - uses PSN-specific terminology
 */
export const PlayStationGameSchema = z.object({
	id: z.string(),
	title: z.string(),
	psnId: z.string(),
	boxArt: z.string(),
	trophies: z.number(),
	platinumCount: z.number(),
	bronzeCount: z.number(),
	silverCount: z.number(),
	goldCount: z.number(),
	completionPercent: z.number(),
	category: z.string(),
	lastSynced: z.string()
});

export type PlayStationGame = z.infer<typeof PlayStationGameSchema>;

/**
 * Steam game data - uses Steam-specific terminology
 */
export const SteamGameSchema = z.object({
	id: z.string(),
	appName: z.string(),
	steamUsername: z.string(),
	headerImage: z.string(),
	achievementsUnlocked: z.number(),
	achievementsTotal: z.number(),
	playtimeMinutes: z.number(),
	playtimeForever: z.string(),
	tags: z.array(z.string()),
	lastPlayedTimestamp: z.number()
});

export type SteamGame = z.infer<typeof SteamGameSchema>;

// =============================================================================
// DATA FIELDS - What fields each dataset exposes in the creator dropdowns
// =============================================================================

export interface DataFieldOption {
	value: string;
	label: string;
	type?: 'text' | 'number' | 'image' | 'date';
}

export const xboxDataFields: DataFieldOption[] = [
	{ value: 'gameName', label: 'Game Name', type: 'text' },
	{ value: 'gamertag', label: 'Gamertag', type: 'text' },
	{ value: 'coverArt', label: 'Cover Art', type: 'image' },
	{ value: 'achievements', label: 'Achievements', type: 'number' },
	{ value: 'gamerscore', label: 'Gamerscore', type: 'number' },
	{ value: 'hoursPlayed', label: 'Hours Played', type: 'number' },
	{ value: 'genre', label: 'Genre', type: 'text' },
	{ value: 'lastPlayed', label: 'Last Played', type: 'date' }
];

export const playstationDataFields: DataFieldOption[] = [
	{ value: 'title', label: 'Game Title', type: 'text' },
	{ value: 'psnId', label: 'PSN ID', type: 'text' },
	{ value: 'boxArt', label: 'Box Art', type: 'image' },
	{ value: 'trophies', label: 'Total Trophies', type: 'number' },
	{ value: 'platinumCount', label: 'Platinum Trophies', type: 'number' },
	{ value: 'goldCount', label: 'Gold Trophies', type: 'number' },
	{ value: 'silverCount', label: 'Silver Trophies', type: 'number' },
	{ value: 'bronzeCount', label: 'Bronze Trophies', type: 'number' },
	{ value: 'completionPercent', label: 'Completion %', type: 'number' },
	{ value: 'category', label: 'Category', type: 'text' },
	{ value: 'lastSynced', label: 'Last Synced', type: 'date' }
];

export const steamDataFields: DataFieldOption[] = [
	{ value: 'appName', label: 'Game Name', type: 'text' },
	{ value: 'steamUsername', label: 'Steam Username', type: 'text' },
	{ value: 'headerImage', label: 'Header Image', type: 'image' },
	{ value: 'achievementsUnlocked', label: 'Achievements Unlocked', type: 'number' },
	{ value: 'achievementsTotal', label: 'Total Achievements', type: 'number' },
	{ value: 'playtimeMinutes', label: 'Playtime (minutes)', type: 'number' },
	{ value: 'playtimeForever', label: 'Playtime (formatted)', type: 'text' },
	{ value: 'tags', label: 'Tags', type: 'text' },
	{ value: 'lastPlayedTimestamp', label: 'Last Played', type: 'number' }
];

// =============================================================================
// DATASET TYPES
// =============================================================================

export interface Dataset<T> {
	id: string;
	name: string;
	description: string;
	platform: string;
	dataFields: DataFieldOption[];
	cards: T[];
}

export type XboxDataset = Dataset<XboxGame>;
export type PlayStationDataset = Dataset<PlayStationGame>;
export type SteamDataset = Dataset<SteamGame>;

// Union type for any card
export type AnyCard = XboxGame | PlayStationGame | SteamGame;
export type AnyDataset = Dataset<AnyCard>;

// =============================================================================
// FIELD MAPPING - For remapping templates between datasets
// =============================================================================

/**
 * Maps template field bindings to a different dataset's fields.
 * Key: original field name in template
 * Value: new field name in target dataset
 */
export type FieldMapping = Record<string, string>;

/**
 * Suggests possible field mappings based on field type matching
 */
export function suggestFieldMappings(
	sourceFields: DataFieldOption[],
	targetFields: DataFieldOption[]
): FieldMapping {
	const mapping: FieldMapping = {};

	for (const source of sourceFields) {
		// Try to find a field with matching type
		const typeMatch = targetFields.find(
			(t) => t.type === source.type && !Object.values(mapping).includes(t.value)
		);
		if (typeMatch) {
			mapping[source.value] = typeMatch.value;
		}
	}

	return mapping;
}

// =============================================================================
// SAVED TEMPLATE
// =============================================================================

export const SavedTemplateSchema = z.object({
	id: z.string(),
	name: z.string(),
	createdAt: z.string(),
	updatedAt: z.string(),
	datasetId: z.string().optional(), // Which dataset this template was designed for
	template: z.object({
		name: z.string(),
		components: z.array(z.unknown())
	})
});

export type SavedTemplate = z.infer<typeof SavedTemplateSchema>;
