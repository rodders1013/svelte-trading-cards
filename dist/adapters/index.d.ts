export type { DataAdapter, AnyDataAdapter, DataFieldDefinition, DataFieldType, AdapterMetadata } from './types.js';
export { DataFieldTypeSchema, DataFieldDefinitionSchema, createAdapter, getAdapterMetadata, toDataFieldOptions } from './types.js';
export { adapterRegistry, createAdapterRegistry } from './registry.js';
export type { AdapterRegistry } from './registry.js';
export { PlayStationAdapter, XboxAdapter, SteamAdapter, PlayStationGameSchema, XboxGameSchema, SteamGameSchema, BUILTIN_ADAPTERS, GAMING_ADAPTERS } from './builtin/index.js';
export type { PlayStationGame, XboxGame, SteamGame } from './builtin/index.js';
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
export declare function registerBuiltinAdapters(): void;
