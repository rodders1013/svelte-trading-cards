import { z } from 'zod';
/**
 * Xbox game data - uses Xbox-specific terminology
 */
export declare const XboxGameSchema: z.ZodObject<{
    id: z.ZodString;
    gameName: z.ZodString;
    gamertag: z.ZodString;
    coverArt: z.ZodString;
    achievements: z.ZodNumber;
    gamerscore: z.ZodNumber;
    hoursPlayed: z.ZodNumber;
    userRating: z.ZodNumber;
    criticScore: z.ZodNumber;
    difficulty: z.ZodNumber;
    genre: z.ZodString;
    lastPlayed: z.ZodString;
    features: z.ZodOptional<z.ZodArray<z.ZodString>>;
    modes: z.ZodOptional<z.ZodArray<z.ZodString>>;
    platforms: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
export type XboxGame = z.infer<typeof XboxGameSchema>;
/**
 * PlayStation game data - uses PSN-specific terminology
 */
export declare const PlayStationGameSchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
    psnId: z.ZodString;
    boxArt: z.ZodString;
    trophies: z.ZodNumber;
    platinumCount: z.ZodNumber;
    bronzeCount: z.ZodNumber;
    silverCount: z.ZodNumber;
    goldCount: z.ZodNumber;
    completionPercent: z.ZodNumber;
    userRating: z.ZodNumber;
    criticScore: z.ZodNumber;
    difficulty: z.ZodNumber;
    category: z.ZodString;
    lastSynced: z.ZodString;
    features: z.ZodOptional<z.ZodArray<z.ZodString>>;
    dlc: z.ZodOptional<z.ZodArray<z.ZodString>>;
    platforms: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
export type PlayStationGame = z.infer<typeof PlayStationGameSchema>;
/**
 * Steam game data - uses Steam-specific terminology
 */
export declare const SteamGameSchema: z.ZodObject<{
    id: z.ZodString;
    appName: z.ZodString;
    steamUsername: z.ZodString;
    headerImage: z.ZodString;
    achievementsUnlocked: z.ZodNumber;
    achievementsTotal: z.ZodNumber;
    playtimeMinutes: z.ZodNumber;
    playtimeForever: z.ZodString;
    userRating: z.ZodNumber;
    steamRating: z.ZodNumber;
    difficulty: z.ZodNumber;
    tags: z.ZodArray<z.ZodString>;
    lastPlayedTimestamp: z.ZodNumber;
    features: z.ZodOptional<z.ZodArray<z.ZodString>>;
    highlights: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
export type SteamGame = z.infer<typeof SteamGameSchema>;
export type { DataFieldOption } from '../creator/types.js';
import type { DataFieldOption } from '../creator/types.js';
export declare const xboxDataFields: DataFieldOption[];
export declare const playstationDataFields: DataFieldOption[];
export declare const steamDataFields: DataFieldOption[];
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
export type AnyCard = XboxGame | PlayStationGame | SteamGame;
export type AnyDataset = Dataset<AnyCard>;
/**
 * Maps template field bindings to a different dataset's fields.
 * Key: original field name in template
 * Value: new field name in target dataset
 */
export type FieldMapping = Record<string, string>;
/**
 * Suggests possible field mappings based on field type matching
 */
export declare function suggestFieldMappings(sourceFields: DataFieldOption[], targetFields: DataFieldOption[]): FieldMapping;
export declare const SavedTemplateSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
    datasetId: z.ZodOptional<z.ZodString>;
    template: z.ZodObject<{
        name: z.ZodString;
        components: z.ZodArray<z.ZodUnknown>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type SavedTemplate = z.infer<typeof SavedTemplateSchema>;
