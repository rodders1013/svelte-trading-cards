import { z } from 'zod';
import type { DataAdapter } from '../types.js';
/**
 * Steam game data schema (Steam API format)
 */
export declare const SteamGameSchema: z.ZodObject<{
    id: z.ZodString;
    appName: z.ZodString;
    steamUsername: z.ZodOptional<z.ZodString>;
    headerImage: z.ZodString;
    achievementsUnlocked: z.ZodNumber;
    achievementsTotal: z.ZodNumber;
    playtimeMinutes: z.ZodOptional<z.ZodNumber>;
    playtimeForever: z.ZodOptional<z.ZodString>;
    userRating: z.ZodOptional<z.ZodNumber>;
    steamRating: z.ZodOptional<z.ZodNumber>;
    difficulty: z.ZodOptional<z.ZodNumber>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString>>;
    lastPlayedTimestamp: z.ZodOptional<z.ZodNumber>;
    features: z.ZodOptional<z.ZodArray<z.ZodString>>;
    highlights: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
export type SteamGame = z.infer<typeof SteamGameSchema>;
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
export declare const SteamAdapter: DataAdapter<SteamGame>;
