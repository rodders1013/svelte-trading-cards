/**
 * Datasets Index
 * Re-exports all dataset-specific labels
 */
export * from './playstation.js';
export * from './xbox.js';
export * from './steam.js';
/**
 * Registry of all dataset labels
 */
export declare const DATASET_LABELS: {
    readonly playstation: readonly ["PSN ID", "PLAYER", "PLATINUM", "GOLD", "SILVER", "BRONZE", "TROPHY COUNT", "TROPHIES", "COMPLETION", "PLAYTIME", "HOURS PLAYED", "LAST SYNCED", "LAST PLAYED", "PS5", "PS4", "PS VR", "PS VR2", "PS PLUS", "EXCLUSIVE", "INDIE", "AAA", "REMASTER", "REMAKE"];
    readonly xbox: readonly ["GAMERTAG", "PLAYER", "GAMERSCORE", "ACHIEVEMENTS", "ACHIEVEMENT COUNT", "HOURS PLAYED", "PLAYTIME", "COMPLETION", "LAST PLAYED", "XBOX SERIES X", "XBOX SERIES S", "XBOX ONE", "XBOX 360", "GAME PASS", "GAME PASS ULTIMATE", "BACKWARDS COMPATIBLE", "EXCLUSIVE", "CONSOLE EXCLUSIVE", "DAY ONE", "OPTIMIZED"];
    readonly steam: readonly ["STEAM ID", "PLAYER", "ACHIEVEMENTS", "ACHIEVEMENT COUNT", "PERFECT GAME", "HOURS PLAYED", "PLAYTIME", "COMPLETION", "LAST PLAYED", "PLAYTIME FOREVER", "PLAYTIME 2 WEEKS", "STEAM DECK", "STEAM DECK VERIFIED", "STEAM DECK PLAYABLE", "VR SUPPORTED", "VR ONLY", "CONTROLLER SUPPORT", "EARLY ACCESS", "FREE TO PLAY", "INDIE", "AAA", "WORKSHOP", "TRADING CARDS", "CLOUD SAVES"];
};
export type DatasetId = keyof typeof DATASET_LABELS;
