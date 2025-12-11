// =============================================================================
// DATA ADAPTERS MODULE
// =============================================================================
//
// Data adapters provide a structured way to transform domain-specific data
// into the CardData format used by templates. They document available fields
// and provide sample data for previews.
//
// Usage:
//   import { PlayStationAdapter, adapterRegistry } from 'svelte-trading-cards/adapters';
//
//   // Transform data
//   const cardData = PlayStationAdapter.transform(myPSNData);
//
//   // Or use the registry
//   adapterRegistry.register(PlayStationAdapter);
//   const cardData = adapterRegistry.transform('playstation', myData);
//
// =============================================================================

// Types
export type {
	DataAdapter,
	AnyDataAdapter,
	DataFieldDefinition,
	DataFieldType,
	AdapterMetadata
} from './types.js';

export {
	DataFieldTypeSchema,
	DataFieldDefinitionSchema,
	createAdapter,
	getAdapterMetadata,
	toDataFieldOptions
} from './types.js';

// Registry
export { adapterRegistry, createAdapterRegistry } from './registry.js';
export type { AdapterRegistry } from './registry.js';

// Built-in adapters
export {
	// Individual adapters
	PlayStationAdapter,
	XboxAdapter,
	SteamAdapter,
	// Schemas
	PlayStationGameSchema,
	XboxGameSchema,
	SteamGameSchema,
	// Collections
	BUILTIN_ADAPTERS,
	GAMING_ADAPTERS
} from './builtin/index.js';

export type { PlayStationGame, XboxGame, SteamGame } from './builtin/index.js';

// =============================================================================
// AUTO-REGISTRATION HELPER
// =============================================================================

import { adapterRegistry } from './registry.js';
import { BUILTIN_ADAPTERS } from './builtin/index.js';

/**
 * Register all built-in adapters in the global registry.
 * Call this once during app initialization if you want all built-in adapters available.
 *
 * @example
 * ```typescript
 * import { registerBuiltinAdapters } from 'svelte-trading-cards/adapters';
 *
 * // In your app initialization
 * registerBuiltinAdapters();
 *
 * // Now all built-in adapters are available
 * import { adapterRegistry } from 'svelte-trading-cards/adapters';
 * const psAdapter = adapterRegistry.get('playstation');
 * ```
 */
export function registerBuiltinAdapters(): void {
	adapterRegistry.registerAll(BUILTIN_ADAPTERS);
}
