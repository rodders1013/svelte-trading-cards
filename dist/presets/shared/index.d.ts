/**
 * Shared Presets Index
 * Re-exports all shared label categories
 */
export * from './rarity.js';
export * from './status.js';
export * from './editions.js';
export * from './general.js';
/**
 * All shared labels combined
 */
export declare const SHARED_LABELS: readonly ["COMMON", "UNCOMMON", "RARE", "EPIC", "LEGENDARY", "MYTHIC", "NEW", "HOT", "FEATURED", "TRENDING", "VERIFIED", "POPULAR", "RECOMMENDED", "TOP RATED", "EDITORS CHOICE", "1ST EDITION", "LIMITED EDITION", "COLLECTOR", "SPECIAL", "PREMIUM", "ULTRA", "DELUXE", "STANDARD", "FOUNDERS", "SALE", "BEST SELLER", "STAFF PICK", "EXCLUSIVE", "PROMO", "LIMITED", "SOLD OUT", "COMING SOON", "PRE-ORDER", "NONE"];
export type SharedLabel = (typeof SHARED_LABELS)[number];
