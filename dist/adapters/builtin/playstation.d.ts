import { z } from 'zod';
import type { DataAdapter } from '../types.js';
/**
 * PlayStation game data schema (PSN Trophy/Game format)
 */
export declare const PlayStationGameSchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
    psnId: z.ZodOptional<z.ZodString>;
    boxArt: z.ZodString;
    trophies: z.ZodNumber;
    platinumCount: z.ZodOptional<z.ZodNumber>;
    bronzeCount: z.ZodOptional<z.ZodNumber>;
    silverCount: z.ZodOptional<z.ZodNumber>;
    goldCount: z.ZodOptional<z.ZodNumber>;
    completionPercent: z.ZodOptional<z.ZodNumber>;
    userRating: z.ZodOptional<z.ZodNumber>;
    criticScore: z.ZodOptional<z.ZodNumber>;
    difficulty: z.ZodOptional<z.ZodNumber>;
    category: z.ZodOptional<z.ZodString>;
    lastSynced: z.ZodOptional<z.ZodString>;
    features: z.ZodOptional<z.ZodArray<z.ZodString>>;
    dlc: z.ZodOptional<z.ZodArray<z.ZodString>>;
    platforms: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
export type PlayStationGame = z.infer<typeof PlayStationGameSchema>;
/**
 * PlayStation data adapter.
 *
 * Transforms PlayStation Network game/trophy data into CardData format.
 * Supports PSN trophy breakdowns (Platinum, Gold, Silver, Bronze) and completion tracking.
 *
 * @example
 * ```typescript
 * import { PlayStationAdapter } from 'svelte-trading-cards/adapters';
 *
 * const psnGame = {
 *   id: '1',
 *   title: 'God of War Ragnarök',
 *   boxArt: 'https://example.com/gow.jpg',
 *   trophies: 52,
 *   platinumCount: 1,
 *   goldCount: 3,
 *   silverCount: 12,
 *   bronzeCount: 36,
 *   completionPercent: 87,
 *   difficulty: 7,
 *   category: 'Action RPG'
 * };
 *
 * const cardData = PlayStationAdapter.transform(psnGame);
 * ```
 */
export declare const PlayStationAdapter: DataAdapter<PlayStationGame>;
