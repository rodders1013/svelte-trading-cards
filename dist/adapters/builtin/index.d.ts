export { PlayStationAdapter, PlayStationGameSchema } from './playstation.js';
export type { PlayStationGame } from './playstation.js';
export { XboxAdapter, XboxGameSchema } from './xbox.js';
export type { XboxGame } from './xbox.js';
export { SteamAdapter, SteamGameSchema } from './steam.js';
export type { SteamGame } from './steam.js';
import type { AnyDataAdapter } from '../types.js';
/**
 * Array of all built-in adapters.
 * Use this to register all built-in adapters at once.
 *
 * @example
 * ```typescript
 * import { adapterRegistry, BUILTIN_ADAPTERS } from 'svelte-trading-cards/adapters';
 *
 * // Register all built-in adapters
 * adapterRegistry.registerAll(BUILTIN_ADAPTERS);
 * ```
 */
export declare const BUILTIN_ADAPTERS: AnyDataAdapter[];
/**
 * Gaming adapters subset
 */
export declare const GAMING_ADAPTERS: AnyDataAdapter[];
