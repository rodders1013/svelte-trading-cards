import type { CardData } from '../types/index.js';
import type { AnyDataAdapter, DataFieldDefinition, AdapterMetadata } from './types.js';
/**
 * Registry for managing data adapters.
 *
 * The registry provides:
 * - Registration and lookup of adapters by ID
 * - Field access for the visual creator
 * - Sample data generation
 * - Adapter enumeration and filtering
 *
 * @example
 * ```typescript
 * import { adapterRegistry, PlayStationAdapter } from 'svelte-trading-cards/adapters';
 *
 * // Register an adapter
 * adapterRegistry.register(PlayStationAdapter);
 *
 * // Use an adapter
 * const adapter = adapterRegistry.get('playstation');
 * const cardData = adapter.transform(myData);
 *
 * // Get fields for creator dropdown
 * const fields = adapterRegistry.getFieldsForAdapter('playstation');
 * ```
 */
declare class AdapterRegistry {
    private adapters;
    /**
     * Register a data adapter.
     * If an adapter with the same ID already exists, it will be replaced.
     */
    register(adapter: AnyDataAdapter): void;
    /**
     * Register multiple adapters at once.
     */
    registerAll(adapters: AnyDataAdapter[]): void;
    /**
     * Unregister an adapter by ID.
     * Returns true if the adapter was found and removed.
     */
    unregister(id: string): boolean;
    /**
     * Get an adapter by ID.
     * Returns undefined if not found.
     */
    get(id: string): AnyDataAdapter | undefined;
    /**
     * Get an adapter by ID, throwing if not found.
     */
    getOrThrow(id: string): AnyDataAdapter;
    /**
     * Check if an adapter exists.
     */
    has(id: string): boolean;
    /**
     * Get all registered adapters.
     */
    getAll(): AnyDataAdapter[];
    /**
     * Get all adapter IDs.
     */
    getIds(): string[];
    /**
     * Get metadata for all registered adapters.
     */
    getAllMetadata(): AdapterMetadata[];
    /**
     * Get adapters by category.
     */
    getByCategory(category: string): AnyDataAdapter[];
    /**
     * Get all unique categories.
     */
    getCategories(): string[];
    /**
     * Get field definitions for an adapter.
     * Returns empty array if adapter not found.
     */
    getFieldsForAdapter(id: string): DataFieldDefinition[];
    /**
     * Get fields as DataFieldOption format (for creator compatibility).
     */
    getFieldOptionsForAdapter(id: string): Array<{
        value: string;
        label: string;
        type: string;
    }>;
    /**
     * Get sample data for an adapter.
     * Returns empty object if adapter not found.
     */
    getSampleDataForAdapter(id: string): CardData;
    /**
     * Transform data using an adapter.
     * Throws if adapter not found.
     */
    transform(adapterId: string, source: unknown): CardData;
    /**
     * Validate data using an adapter's validate function.
     * Returns true if adapter has no validate function.
     * Throws if adapter not found.
     */
    validate(adapterId: string, source: unknown): boolean;
    /**
     * Transform data if valid, otherwise return undefined.
     */
    transformIfValid(adapterId: string, source: unknown): CardData | undefined;
    /**
     * Clear all registered adapters.
     */
    clear(): void;
    /**
     * Get the number of registered adapters.
     */
    get size(): number;
}
/**
 * Global adapter registry instance.
 * Use this for most cases.
 *
 * @example
 * ```typescript
 * import { adapterRegistry } from 'svelte-trading-cards/adapters';
 *
 * adapterRegistry.register(myAdapter);
 * const data = adapterRegistry.transform('my-adapter', source);
 * ```
 */
export declare const adapterRegistry: AdapterRegistry;
/**
 * Create an isolated adapter registry.
 * Useful for testing or when you need multiple independent registries.
 *
 * @example
 * ```typescript
 * import { createAdapterRegistry } from 'svelte-trading-cards/adapters';
 *
 * const myRegistry = createAdapterRegistry();
 * myRegistry.register(myAdapter);
 * ```
 */
export declare function createAdapterRegistry(): AdapterRegistry;
export type { AdapterRegistry };
