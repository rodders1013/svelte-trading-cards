import { z } from 'zod';
import type { DataAdapter, DataFieldDefinition } from '../types.js';
import type { CardData } from '$lib/types/index.js';

// =============================================================================
// XBOX GAME DATA TYPES
// =============================================================================

/**
 * Xbox game data schema (Xbox Live/Game Pass format)
 */
export const XboxGameSchema = z.object({
	id: z.string(),
	gameName: z.string(),
	gamertag: z.string().optional(),
	coverArt: z.string(),
	achievements: z.number(),
	gamerscore: z.number(),
	hoursPlayed: z.number().optional(),
	userRating: z.number().optional(),
	criticScore: z.number().optional(),
	difficulty: z.number().optional(),
	genre: z.string().optional(),
	lastPlayed: z.string().optional(),
	features: z.array(z.string()).optional(),
	modes: z.array(z.string()).optional(),
	platforms: z.array(z.string()).optional()
});

export type XboxGame = z.infer<typeof XboxGameSchema>;

// =============================================================================
// XBOX ADAPTER
// =============================================================================

/**
 * Xbox data adapter.
 *
 * Transforms Xbox Live game/achievement data into CardData format.
 * Supports Xbox achievement system with Gamerscore tracking.
 *
 * @example
 * ```typescript
 * import { XboxAdapter } from 'svelte-trading-cards/adapters';
 *
 * const xboxGame = {
 *   id: '1',
 *   gameName: 'Halo Infinite',
 *   coverArt: 'https://example.com/halo.jpg',
 *   gamertag: 'MasterChief117',
 *   achievements: 87,
 *   gamerscore: 1250,
 *   hoursPlayed: 156,
 *   genre: 'FPS'
 * };
 *
 * const cardData = XboxAdapter.transform(xboxGame);
 * ```
 */
export const XboxAdapter: DataAdapter<XboxGame> = {
	id: 'xbox',
	name: 'Xbox Games',
	description: 'Xbox Live game data with achievements and gamerscore',
	category: 'gaming',
	icon: 'mdi:microsoft-xbox',

	transform(game: XboxGame): CardData {
		return {
			// Core fields
			title: game.gameName,
			imageUrl: game.coverArt,

			// User info
			username: game.gamertag,

			// Achievement stats
			achievements: game.achievements,
			gamerscore: game.gamerscore,
			hoursPlayed: game.hoursPlayed ?? 0,

			// Ratings
			userRating: game.userRating ?? 0,
			criticScore: game.criticScore ?? 0,
			difficulty: game.difficulty ?? 5,

			// Metadata
			genre: game.genre ?? 'Game',
			lastPlayed: game.lastPlayed,
			features: game.features ?? [],
			modes: game.modes ?? [],
			platforms: game.platforms ?? ['Xbox Series X|S']
		};
	},

	getFields(): DataFieldDefinition[] {
		return [
			{ key: 'title', label: 'Game Name', type: 'string', required: true },
			{ key: 'imageUrl', label: 'Cover Art', type: 'image', required: true },
			{ key: 'username', label: 'Gamertag', type: 'string' },
			{ key: 'achievements', label: 'Achievements', type: 'number' },
			{
				key: 'gamerscore',
				label: 'Gamerscore',
				type: 'number',
				description: 'Total gamerscore points earned'
			},
			{
				key: 'hoursPlayed',
				label: 'Hours Played',
				type: 'number',
				description: 'Total playtime in hours'
			},
			{ key: 'userRating', label: 'User Rating', type: 'number' },
			{ key: 'criticScore', label: 'Critic Score', type: 'number' },
			{ key: 'difficulty', label: 'Difficulty', type: 'number', description: 'Difficulty rating (1-10)' },
			{ key: 'genre', label: 'Genre', type: 'string' },
			{ key: 'lastPlayed', label: 'Last Played', type: 'date' },
			{ key: 'features', label: 'Features', type: 'array' },
			{ key: 'modes', label: 'Game Modes', type: 'array' },
			{ key: 'platforms', label: 'Platforms', type: 'array' }
		];
	},

	getSampleData(): CardData {
		return {
			title: 'Halo Infinite',
			imageUrl: 'https://store-images.s-microsoft.com/image/apps.14115.13727851868390641.c9cc5f66-aff8-405b-b53e-3d7d9a7c580b.5765c6c4-4e62-4147-b0e2-ecf7e514ed23',
			username: 'MasterChief117',
			achievements: 87,
			gamerscore: 1250,
			hoursPlayed: 156,
			userRating: 8.5,
			criticScore: 87,
			difficulty: 6,
			genre: 'First-Person Shooter',
			lastPlayed: '2024-03-10',
			features: ['Smart Delivery', 'Xbox Play Anywhere', 'Multiplayer'],
			modes: ['Campaign', 'Multiplayer', 'Forge'],
			platforms: ['Xbox Series X|S', 'Xbox One', 'PC']
		};
	},

	validate(source: unknown): source is XboxGame {
		const result = XboxGameSchema.safeParse(source);
		return result.success;
	},

	suggestedTemplates: ['xbox-achievement-card', 'gaming-achievement']
};
