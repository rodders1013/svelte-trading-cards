// =============================================================================
// BUILT-IN DATA ADAPTERS
// =============================================================================

// PlayStation
export { PlayStationAdapter, PlayStationGameSchema } from './playstation.js';
export type { PlayStationGame } from './playstation.js';

// Xbox
export { XboxAdapter, XboxGameSchema } from './xbox.js';
export type { XboxGame } from './xbox.js';

// Steam
export { SteamAdapter, SteamGameSchema } from './steam.js';
export type { SteamGame } from './steam.js';

// =============================================================================
// ALL BUILT-IN ADAPTERS
// =============================================================================

import { PlayStationAdapter } from './playstation.js';
import { XboxAdapter } from './xbox.js';
import { SteamAdapter } from './steam.js';
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
export const BUILTIN_ADAPTERS: AnyDataAdapter[] = [PlayStationAdapter, XboxAdapter, SteamAdapter];

/**
 * Gaming adapters subset
 */
export const GAMING_ADAPTERS: AnyDataAdapter[] = [PlayStationAdapter, XboxAdapter, SteamAdapter];
