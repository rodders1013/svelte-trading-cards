/**
 * Datasets Index
 * Re-exports all dataset-specific labels
 */
export * from './playstation.js';
export * from './xbox.js';
export * from './steam.js';

import { PLAYSTATION_LABELS } from './playstation.js';
import { XBOX_LABELS } from './xbox.js';
import { STEAM_LABELS } from './steam.js';

/**
 * Registry of all dataset labels
 */
export const DATASET_LABELS = {
	playstation: PLAYSTATION_LABELS,
	xbox: XBOX_LABELS,
	steam: STEAM_LABELS
} as const;

export type DatasetId = keyof typeof DATASET_LABELS;
