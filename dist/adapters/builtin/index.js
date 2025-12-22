// =============================================================================
// BUILT-IN DATA ADAPTERS
// =============================================================================
// PlayStation
export { PlayStationAdapter, PlayStationGameSchema } from './playstation.js';
// Xbox
export { XboxAdapter, XboxGameSchema } from './xbox.js';
// Steam
export { SteamAdapter, SteamGameSchema } from './steam.js';
// =============================================================================
// ALL BUILT-IN ADAPTERS
// =============================================================================
import { PlayStationAdapter } from './playstation.js';
import { XboxAdapter } from './xbox.js';
import { SteamAdapter } from './steam.js';
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
export const BUILTIN_ADAPTERS = [PlayStationAdapter, XboxAdapter, SteamAdapter];
/**
 * Gaming adapters subset
 */
export const GAMING_ADAPTERS = [PlayStationAdapter, XboxAdapter, SteamAdapter];
