import { z } from 'zod';
import type { DataAdapter, DataFieldDefinition } from '../types.js';
import type { CardData } from '$lib/types/index.js';

// =============================================================================
// STEAM GAME DATA TYPES
// =============================================================================

/**
 * Steam game data schema (Steam API format)
 */
export const SteamGameSchema = z.object({
	id: z.string(),
	appName: z.string(),
	steamUsername: z.string().optional(),
	headerImage: z.string(),
	achievementsUnlocked: z.number(),
	achievementsTotal: z.number(),
	playtimeMinutes: z.number().optional(),
	playtimeForever: z.string().optional(),
	userRating: z.number().optional(),
	steamRating: z.number().optional(),
	difficulty: z.number().optional(),
	tags: z.array(z.string()).optional(),
	lastPlayedTimestamp: z.number().optional(),
	features: z.array(z.string()).optional(),
	highlights: z.array(z.string()).optional()
});

export type SteamGame = z.infer<typeof SteamGameSchema>;

// =============================================================================
// STEAM ADAPTER
// =============================================================================

/**
 * Steam data adapter.
 *
 * Transforms Steam game/achievement data into CardData format.
 * Supports Steam achievement progress and playtime tracking.
 *
 * @example
 * ```typescript
 * import { SteamAdapter } from 'svelte-trading-cards/adapters';
 *
 * const steamGame = {
 *   id: '1',
 *   appName: 'Half-Life: Alyx',
 *   headerImage: 'https://example.com/hla.jpg',
 *   steamUsername: 'GordonFreeman',
 *   achievementsUnlocked: 42,
 *   achievementsTotal: 45,
 *   playtimeMinutes: 960,
 *   playtimeForever: '16h',
 *   tags: ['VR', 'FPS', 'Sci-fi']
 * };
 *
 * const cardData = SteamAdapter.transform(steamGame);
 * ```
 */
export const SteamAdapter: DataAdapter<SteamGame> = {
	id: 'steam',
	name: 'Steam Games',
	description: 'Steam game data with achievements and playtime',
	category: 'gaming',
	icon: 'mdi:steam',

	transform(game: SteamGame): CardData {
		// Calculate completion percentage
		const completionPercent =
			game.achievementsTotal > 0
				? Math.round((game.achievementsUnlocked / game.achievementsTotal) * 100)
				: 0;

		// Convert minutes to hours for display
		const hoursPlayed = game.playtimeMinutes ? Math.round(game.playtimeMinutes / 60) : 0;

		return {
			// Core fields
			title: game.appName,
			imageUrl: game.headerImage,

			// User info
			username: game.steamUsername,

			// Achievement stats
			achievementsUnlocked: game.achievementsUnlocked,
			achievementsTotal: game.achievementsTotal,
			completionPercent,

			// Playtime
			playtimeMinutes: game.playtimeMinutes ?? 0,
			playtimeForever: game.playtimeForever ?? `${hoursPlayed}h`,
			hoursPlayed,

			// Ratings
			userRating: game.userRating ?? 0,
			steamRating: game.steamRating ?? 0,
			difficulty: game.difficulty ?? 5,

			// Metadata
			tags: game.tags ?? [],
			lastPlayedTimestamp: game.lastPlayedTimestamp,
			features: game.features ?? [],
			highlights: game.highlights ?? []
		};
	},

	getFields(): DataFieldDefinition[] {
		return [
			{ key: 'title', label: 'Game Name', type: 'string', required: true },
			{ key: 'imageUrl', label: 'Header Image', type: 'image', required: true },
			{ key: 'username', label: 'Steam Username', type: 'string' },
			{
				key: 'achievementsUnlocked',
				label: 'Achievements Unlocked',
				type: 'number',
				description: 'Number of achievements earned'
			},
			{
				key: 'achievementsTotal',
				label: 'Total Achievements',
				type: 'number',
				description: 'Total number of achievements in game'
			},
			{
				key: 'completionPercent',
				label: 'Completion %',
				type: 'number',
				description: 'Achievement completion percentage (calculated)'
			},
			{
				key: 'playtimeMinutes',
				label: 'Playtime (minutes)',
				type: 'number',
				description: 'Total playtime in minutes'
			},
			{
				key: 'playtimeForever',
				label: 'Playtime (formatted)',
				type: 'string',
				description: 'Formatted playtime string (e.g., "16h")'
			},
			{
				key: 'hoursPlayed',
				label: 'Hours Played',
				type: 'number',
				description: 'Total playtime in hours (calculated)'
			},
			{ key: 'userRating', label: 'User Rating', type: 'number' },
			{
				key: 'steamRating',
				label: 'Steam Rating',
				type: 'number',
				description: 'Steam review score'
			},
			{ key: 'difficulty', label: 'Difficulty', type: 'number', description: 'Difficulty rating (1-10)' },
			{ key: 'tags', label: 'Tags', type: 'array', description: 'Steam store tags' },
			{ key: 'lastPlayedTimestamp', label: 'Last Played', type: 'number' },
			{ key: 'features', label: 'Features', type: 'array' },
			{ key: 'highlights', label: 'Highlights', type: 'array' }
		];
	},

	getSampleData(): CardData {
		return {
			title: 'Half-Life: Alyx',
			imageUrl: 'https://cdn.akamai.steamstatic.com/steam/apps/546560/header.jpg',
			username: 'GordonFreeman',
			achievementsUnlocked: 42,
			achievementsTotal: 45,
			completionPercent: 93,
			playtimeMinutes: 960,
			playtimeForever: '16h',
			hoursPlayed: 16,
			userRating: 9.5,
			steamRating: 98,
			difficulty: 5,
			tags: ['VR Only', 'FPS', 'Sci-fi', 'Action', 'Atmospheric'],
			lastPlayedTimestamp: 1710288000,
			features: ['VR Support', 'Steam Achievements', 'Steam Cloud'],
			highlights: ['Most immersive VR experience', 'Revolutionary VR controls']
		};
	},

	validate(source: unknown): source is SteamGame {
		const result = SteamGameSchema.safeParse(source);
		return result.success;
	},

	suggestedTemplates: ['steam-achievement-card', 'gaming-achievement']
};
