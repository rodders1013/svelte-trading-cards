import { z } from 'zod';
// =============================================================================
// PLAYSTATION GAME DATA TYPES
// =============================================================================
/**
 * PlayStation game data schema (PSN Trophy/Game format)
 */
export const PlayStationGameSchema = z.object({
    id: z.string(),
    title: z.string(),
    psnId: z.string().optional(),
    boxArt: z.string(),
    trophies: z.number(),
    platinumCount: z.number().optional(),
    bronzeCount: z.number().optional(),
    silverCount: z.number().optional(),
    goldCount: z.number().optional(),
    completionPercent: z.number().optional(),
    userRating: z.number().optional(),
    criticScore: z.number().optional(),
    difficulty: z.number().optional(),
    category: z.string().optional(),
    lastSynced: z.string().optional(),
    features: z.array(z.string()).optional(),
    dlc: z.array(z.string()).optional(),
    platforms: z.array(z.string()).optional()
});
// =============================================================================
// PLAYSTATION ADAPTER
// =============================================================================
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
export const PlayStationAdapter = {
    id: 'playstation',
    name: 'PlayStation Games',
    description: 'PlayStation Network game data with trophy breakdown',
    category: 'gaming',
    icon: 'mdi:sony-playstation',
    transform(game) {
        return {
            // Core fields
            title: game.title,
            imageUrl: game.boxArt,
            // User info
            username: game.psnId,
            // Trophy counts
            trophies: game.trophies,
            platinumCount: game.platinumCount ?? 0,
            goldCount: game.goldCount ?? 0,
            silverCount: game.silverCount ?? 0,
            bronzeCount: game.bronzeCount ?? 0,
            // Stats
            completionPercent: game.completionPercent ?? 0,
            userRating: game.userRating ?? 0,
            criticScore: game.criticScore ?? 0,
            difficulty: game.difficulty ?? 5,
            // Metadata
            category: game.category ?? 'Game',
            lastSynced: game.lastSynced,
            features: game.features ?? [],
            dlc: game.dlc ?? [],
            platforms: game.platforms ?? ['PS5']
        };
    },
    getFields() {
        return [
            { key: 'title', label: 'Game Title', type: 'string', required: true },
            { key: 'imageUrl', label: 'Box Art', type: 'image', required: true },
            { key: 'username', label: 'PSN ID', type: 'string' },
            { key: 'trophies', label: 'Total Trophies', type: 'number' },
            {
                key: 'platinumCount',
                label: 'Platinum Trophies',
                type: 'number',
                description: 'Number of platinum trophies earned'
            },
            { key: 'goldCount', label: 'Gold Trophies', type: 'number' },
            { key: 'silverCount', label: 'Silver Trophies', type: 'number' },
            { key: 'bronzeCount', label: 'Bronze Trophies', type: 'number' },
            {
                key: 'completionPercent',
                label: 'Completion %',
                type: 'number',
                description: 'Game completion percentage (0-100)'
            },
            { key: 'userRating', label: 'User Rating', type: 'number' },
            { key: 'criticScore', label: 'Critic Score', type: 'number' },
            { key: 'difficulty', label: 'Difficulty', type: 'number', description: 'Difficulty rating (1-10)' },
            { key: 'category', label: 'Category', type: 'string' },
            { key: 'lastSynced', label: 'Last Synced', type: 'date' },
            { key: 'features', label: 'Features', type: 'array' },
            { key: 'dlc', label: 'DLC', type: 'array' },
            { key: 'platforms', label: 'Platforms', type: 'array' }
        ];
    },
    getSampleData() {
        return {
            title: 'God of War Ragnarök',
            imageUrl: 'https://image.api.playstation.com/vulcan/ap/rnd/202207/1210/4xJ8XB3bi888QTLZYdl7Oi0s.png',
            username: 'KratosPlayer',
            trophies: 52,
            platinumCount: 1,
            goldCount: 3,
            silverCount: 12,
            bronzeCount: 36,
            completionPercent: 87,
            userRating: 9.2,
            criticScore: 94,
            difficulty: 7,
            category: 'Action RPG',
            lastSynced: '2024-03-15',
            features: ['PS5 Exclusive', 'DualSense', 'Ray Tracing'],
            dlc: ['Valhalla'],
            platforms: ['PS5', 'PS4']
        };
    },
    validate(source) {
        const result = PlayStationGameSchema.safeParse(source);
        return result.success;
    },
    suggestedTemplates: ['playstation-trophy-card', 'gaming-achievement']
};
