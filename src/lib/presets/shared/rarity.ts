/**
 * Rarity Labels
 * Common labels for card rarity/tier classification
 */
export const RARITY_LABELS = [
	'COMMON',
	'UNCOMMON',
	'RARE',
	'EPIC',
	'LEGENDARY',
	'MYTHIC'
] as const;

export type RarityLabel = (typeof RARITY_LABELS)[number];
