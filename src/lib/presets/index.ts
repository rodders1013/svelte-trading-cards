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

import {
	SHARED_LABELS,
	RARITY_LABELS,
	STATUS_LABELS,
	EDITION_LABELS,
	GENERAL_LABELS
} from './shared/index.js';

import { DATASET_LABELS, PLAYSTATION_LABELS, XBOX_LABELS, STEAM_LABELS } from './datasets/index.js';

import type { DatasetId } from './datasets/index.js';

// Re-export everything
export * from './shared/index.js';
export * from './datasets/index.js';

/**
 * Get all available labels for a dataset.
 * Returns dataset-specific labels + all shared labels.
 */
export function getLabelsForDataset(datasetId: DatasetId): readonly string[] {
	const specific = DATASET_LABELS[datasetId] ?? [];
	return [...specific, ...SHARED_LABELS] as readonly string[];
}

/**
 * Get labels organized by category for UI dropdowns.
 * Enables grouped dropdown display with section headers.
 */
export function getLabelsByCategory(datasetId: DatasetId) {
	return {
		specific: DATASET_LABELS[datasetId] ?? [],
		rarity: RARITY_LABELS,
		status: STATUS_LABELS,
		editions: EDITION_LABELS,
		general: GENERAL_LABELS
	};
}

/**
 * Get category name for display in UI
 */
export function getCategoryDisplayName(datasetId: DatasetId): string {
	switch (datasetId) {
		case 'playstation':
			return 'PlayStation';
		case 'xbox':
			return 'Xbox';
		case 'steam':
			return 'Steam';
		default:
			return datasetId;
	}
}

/**
 * Check if a label is valid for a given dataset.
 */
export function isValidLabel(datasetId: DatasetId, label: string): boolean {
	const allLabels = getLabelsForDataset(datasetId);
	return allLabels.includes(label);
}

/**
 * Get all available dataset IDs
 */
export function getAvailableDatasets(): DatasetId[] {
	return Object.keys(DATASET_LABELS) as DatasetId[];
}

/**
 * Type for any valid label (specific or shared)
 */
export type AnyLabel =
	| (typeof PLAYSTATION_LABELS)[number]
	| (typeof XBOX_LABELS)[number]
	| (typeof STEAM_LABELS)[number]
	| (typeof SHARED_LABELS)[number];

/**
 * Label categories for UI organization
 */
export type LabelCategory = 'specific' | 'rarity' | 'status' | 'editions' | 'general';

/**
 * Default dataset to use when none is specified
 */
export const DEFAULT_DATASET: DatasetId = 'playstation';
