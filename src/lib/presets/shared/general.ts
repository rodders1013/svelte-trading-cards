/**
 * General Labels
 * Common general-purpose labels
 */
export const GENERAL_LABELS = [
	'SALE',
	'BEST SELLER',
	'STAFF PICK',
	'EXCLUSIVE',
	'PROMO',
	'LIMITED',
	'SOLD OUT',
	'COMING SOON',
	'PRE-ORDER',
	'NONE'
] as const;

export type GeneralLabel = (typeof GENERAL_LABELS)[number];
