/**
 * Shared Presets Index
 * Re-exports all shared label categories
 */
export * from './rarity.js';
export * from './status.js';
export * from './editions.js';
export * from './general.js';

import { RARITY_LABELS } from './rarity.js';
import { STATUS_LABELS } from './status.js';
import { EDITION_LABELS } from './editions.js';
import { GENERAL_LABELS } from './general.js';

/**
 * All shared labels combined
 */
export const SHARED_LABELS = [
	...RARITY_LABELS,
	...STATUS_LABELS,
	...EDITION_LABELS,
	...GENERAL_LABELS
] as const;

export type SharedLabel = (typeof SHARED_LABELS)[number];
