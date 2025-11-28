/**
 * Generic card data type.
 *
 * The library is agnostic to what fields you use - define whatever
 * makes sense for your domain (games, employees, products, etc.).
 *
 * Components reference fields via the `dataField` prop:
 * ```typescript
 * { type: 'TextField', props: { dataField: 'title' } }
 * ```
 *
 * @example
 * // Gaming card
 * const data: CardData = {
 *   title: 'Achievement Unlocked',
 *   subtitle: 'First Victory',
 *   playerName: 'Player123',
 *   imageUrl: 'https://...'
 * };
 *
 * @example
 * // Employee badge
 * const data: CardData = {
 *   name: 'John Smith',
 *   department: 'Engineering',
 *   photoUrl: 'https://...'
 * };
 */
export type CardData = Record<string, unknown>;

/**
 * Helper type for components that need specific fields.
 * Use this when you want type-safe access to known fields.
 *
 * @example
 * interface MyCardData extends TypedCardData<{
 *   title: string;
 *   subtitle?: string;
 *   imageUrl: string;
 * }> {}
 */
export type TypedCardData<T extends Record<string, unknown>> = CardData & T;

/**
 * Common field patterns for convenience.
 * These are optional - use whatever field names make sense for your domain.
 */
export interface CommonCardFields {
	// Text fields
	title?: string;
	subtitle?: string;
	description?: string;

	// Images
	imageUrl?: string;
	backgroundUrl?: string;
	iconUrl?: string;

	// Metadata
	category?: string;
	rarity?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic' | string;
	date?: string;
}
