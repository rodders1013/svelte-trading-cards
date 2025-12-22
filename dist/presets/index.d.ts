/**
 * Presets System
 * Centralized label management for trading card components
 *
 * Provides dataset-specific and shared labels for:
 * - StatPanel (stat labels)
 * - Badge (text labels)
 * - Ribbon (banner text)
 * - TextField (preset text options)
 */
import { SHARED_LABELS } from './shared/index.js';
import { PLAYSTATION_LABELS, XBOX_LABELS, STEAM_LABELS } from './datasets/index.js';
import type { DatasetId } from './datasets/index.js';
export * from './shared/index.js';
export * from './datasets/index.js';
/**
 * Get all available labels for a dataset.
 * Returns dataset-specific labels + all shared labels.
 */
export declare function getLabelsForDataset(datasetId: DatasetId): readonly string[];
/**
 * Get labels organized by category for UI dropdowns.
 * Enables grouped dropdown display with section headers.
 */
export declare function getLabelsByCategory(datasetId: DatasetId): {
    specific: readonly ["PSN ID", "PLAYER", "PLATINUM", "GOLD", "SILVER", "BRONZE", "TROPHY COUNT", "TROPHIES", "COMPLETION", "PLAYTIME", "HOURS PLAYED", "LAST SYNCED", "LAST PLAYED", "PS5", "PS4", "PS VR", "PS VR2", "PS PLUS", "EXCLUSIVE", "INDIE", "AAA", "REMASTER", "REMAKE"] | readonly ["GAMERTAG", "PLAYER", "GAMERSCORE", "ACHIEVEMENTS", "ACHIEVEMENT COUNT", "HOURS PLAYED", "PLAYTIME", "COMPLETION", "LAST PLAYED", "XBOX SERIES X", "XBOX SERIES S", "XBOX ONE", "XBOX 360", "GAME PASS", "GAME PASS ULTIMATE", "BACKWARDS COMPATIBLE", "EXCLUSIVE", "CONSOLE EXCLUSIVE", "DAY ONE", "OPTIMIZED"] | readonly ["STEAM ID", "PLAYER", "ACHIEVEMENTS", "ACHIEVEMENT COUNT", "PERFECT GAME", "HOURS PLAYED", "PLAYTIME", "COMPLETION", "LAST PLAYED", "PLAYTIME FOREVER", "PLAYTIME 2 WEEKS", "STEAM DECK", "STEAM DECK VERIFIED", "STEAM DECK PLAYABLE", "VR SUPPORTED", "VR ONLY", "CONTROLLER SUPPORT", "EARLY ACCESS", "FREE TO PLAY", "INDIE", "AAA", "WORKSHOP", "TRADING CARDS", "CLOUD SAVES"];
    rarity: readonly ["COMMON", "UNCOMMON", "RARE", "EPIC", "LEGENDARY", "MYTHIC"];
    status: readonly ["NEW", "HOT", "FEATURED", "TRENDING", "VERIFIED", "POPULAR", "RECOMMENDED", "TOP RATED", "EDITORS CHOICE"];
    editions: readonly ["1ST EDITION", "LIMITED EDITION", "COLLECTOR", "SPECIAL", "PREMIUM", "ULTRA", "DELUXE", "STANDARD", "FOUNDERS"];
    general: readonly ["SALE", "BEST SELLER", "STAFF PICK", "EXCLUSIVE", "PROMO", "LIMITED", "SOLD OUT", "COMING SOON", "PRE-ORDER", "NONE"];
};
/**
 * Get category name for display in UI
 */
export declare function getCategoryDisplayName(datasetId: DatasetId): string;
/**
 * Check if a label is valid for a given dataset.
 */
export declare function isValidLabel(datasetId: DatasetId, label: string): boolean;
/**
 * Get all available dataset IDs
 */
export declare function getAvailableDatasets(): DatasetId[];
/**
 * Type for any valid label (specific or shared)
 */
export type AnyLabel = (typeof PLAYSTATION_LABELS)[number] | (typeof XBOX_LABELS)[number] | (typeof STEAM_LABELS)[number] | (typeof SHARED_LABELS)[number];
/**
 * Label categories for UI organization
 */
export type LabelCategory = 'specific' | 'rarity' | 'status' | 'editions' | 'general';
/**
 * Default dataset to use when none is specified
 */
export declare const DEFAULT_DATASET: DatasetId;
