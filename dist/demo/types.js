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
    userRating: z.number(),
    criticScore: z.number(),
    difficulty: z.number(),
    genre: z.string(),
    lastPlayed: z.string(),
    features: z.array(z.string()).optional(),
    modes: z.array(z.string()).optional(),
    platforms: z.array(z.string()).optional()
});
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
    userRating: z.number(),
    criticScore: z.number(),
    difficulty: z.number(),
    category: z.string(),
    lastSynced: z.string(),
    features: z.array(z.string()).optional(),
    dlc: z.array(z.string()).optional(),
    platforms: z.array(z.string()).optional()
});
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
    userRating: z.number(),
    steamRating: z.number(),
    difficulty: z.number(),
    tags: z.array(z.string()),
    lastPlayedTimestamp: z.number(),
    features: z.array(z.string()).optional(),
    highlights: z.array(z.string()).optional()
});
export const xboxDataFields = [
    { value: 'gameName', label: 'Game Name', type: 'text' },
    { value: 'gamertag', label: 'Gamertag', type: 'text' },
    { value: 'coverArt', label: 'Cover Art', type: 'image' },
    { value: 'achievements', label: 'Achievements', type: 'number' },
    { value: 'gamerscore', label: 'Gamerscore', type: 'number' },
    { value: 'hoursPlayed', label: 'Hours Played', type: 'number' },
    { value: 'userRating', label: 'User Rating', type: 'number' },
    { value: 'criticScore', label: 'Critic Score', type: 'number' },
    { value: 'difficulty', label: 'Difficulty', type: 'number' },
    { value: 'genre', label: 'Genre', type: 'text' },
    { value: 'lastPlayed', label: 'Last Played', type: 'date' },
    { value: 'features', label: 'Features', type: 'array' },
    { value: 'modes', label: 'Game Modes', type: 'array' },
    { value: 'platforms', label: 'Platforms', type: 'array' }
];
export const playstationDataFields = [
    { value: 'title', label: 'Game Title', type: 'text' },
    { value: 'psnId', label: 'PSN ID', type: 'text' },
    { value: 'boxArt', label: 'Box Art', type: 'image' },
    { value: 'trophies', label: 'Total Trophies', type: 'number' },
    { value: 'platinumCount', label: 'Platinum Trophies', type: 'number' },
    { value: 'goldCount', label: 'Gold Trophies', type: 'number' },
    { value: 'silverCount', label: 'Silver Trophies', type: 'number' },
    { value: 'bronzeCount', label: 'Bronze Trophies', type: 'number' },
    { value: 'completionPercent', label: 'Completion %', type: 'number' },
    { value: 'userRating', label: 'User Rating', type: 'number' },
    { value: 'criticScore', label: 'Critic Score', type: 'number' },
    { value: 'difficulty', label: 'Difficulty', type: 'number' },
    { value: 'category', label: 'Category', type: 'text' },
    { value: 'lastSynced', label: 'Last Synced', type: 'date' },
    { value: 'features', label: 'Features', type: 'array' },
    { value: 'dlc', label: 'DLC', type: 'array' },
    { value: 'platforms', label: 'Platforms', type: 'array' }
];
export const steamDataFields = [
    { value: 'appName', label: 'Game Name', type: 'text' },
    { value: 'steamUsername', label: 'Steam Username', type: 'text' },
    { value: 'headerImage', label: 'Header Image', type: 'image' },
    { value: 'achievementsUnlocked', label: 'Achievements Unlocked', type: 'number' },
    { value: 'achievementsTotal', label: 'Total Achievements', type: 'number' },
    { value: 'playtimeMinutes', label: 'Playtime (minutes)', type: 'number' },
    { value: 'playtimeForever', label: 'Playtime (formatted)', type: 'text' },
    { value: 'userRating', label: 'User Rating', type: 'number' },
    { value: 'steamRating', label: 'Steam Rating', type: 'number' },
    { value: 'difficulty', label: 'Difficulty', type: 'number' },
    { value: 'tags', label: 'Tags', type: 'array' },
    { value: 'lastPlayedTimestamp', label: 'Last Played', type: 'number' },
    { value: 'features', label: 'Features', type: 'array' },
    { value: 'highlights', label: 'Highlights', type: 'array' }
];
/**
 * Suggests possible field mappings based on field type matching
 */
export function suggestFieldMappings(sourceFields, targetFields) {
    const mapping = {};
    for (const source of sourceFields) {
        // Try to find a field with matching type
        const typeMatch = targetFields.find((t) => t.type === source.type && !Object.values(mapping).includes(t.value));
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
