/**
 * Steam Labels
 * Labels specific to Steam gaming context
 */
export const STEAM_LABELS = [
	// Platform identifiers
	'STEAM ID',
	'PLAYER',

	// Achievement system
	'ACHIEVEMENTS',
	'ACHIEVEMENT COUNT',
	'PERFECT GAME',

	// Progress/Stats
	'HOURS PLAYED',
	'PLAYTIME',
	'COMPLETION',
	'LAST PLAYED',
	'PLAYTIME FOREVER',
	'PLAYTIME 2 WEEKS',

	// Platform tags
	'STEAM DECK',
	'STEAM DECK VERIFIED',
	'STEAM DECK PLAYABLE',
	'VR SUPPORTED',
	'VR ONLY',
	'CONTROLLER SUPPORT',

	// Game categories
	'EARLY ACCESS',
	'FREE TO PLAY',
	'INDIE',
	'AAA',
	'WORKSHOP',
	'TRADING CARDS',
	'CLOUD SAVES'
] as const;

export type SteamLabel = (typeof STEAM_LABELS)[number];
