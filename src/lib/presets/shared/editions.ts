/**
 * Edition Labels
 * Labels for special editions and collector items
 */
export const EDITION_LABELS = [
	'1ST EDITION',
	'LIMITED EDITION',
	'COLLECTOR',
	'SPECIAL',
	'PREMIUM',
	'ULTRA',
	'DELUXE',
	'STANDARD',
	'FOUNDERS'
] as const;

export type EditionLabel = (typeof EDITION_LABELS)[number];
