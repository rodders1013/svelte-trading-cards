import { z } from 'zod';
import type { DataAdapter } from '../types.js';
/**
 * Xbox game data schema (Xbox Live/Game Pass format)
 */
export declare const XboxGameSchema: z.ZodObject<{
    id: z.ZodString;
    gameName: z.ZodString;
    gamertag: z.ZodOptional<z.ZodString>;
    coverArt: z.ZodString;
    achievements: z.ZodNumber;
    gamerscore: z.ZodNumber;
    hoursPlayed: z.ZodOptional<z.ZodNumber>;
    userRating: z.ZodOptional<z.ZodNumber>;
    criticScore: z.ZodOptional<z.ZodNumber>;
    difficulty: z.ZodOptional<z.ZodNumber>;
    genre: z.ZodOptional<z.ZodString>;
    lastPlayed: z.ZodOptional<z.ZodString>;
    features: z.ZodOptional<z.ZodArray<z.ZodString>>;
    modes: z.ZodOptional<z.ZodArray<z.ZodString>>;
    platforms: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
export type XboxGame = z.infer<typeof XboxGameSchema>;
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
export declare const XboxAdapter: DataAdapter<XboxGame>;
