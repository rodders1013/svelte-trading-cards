import type { CardData } from '$lib/types/index.js';
import type { AnyDataAdapter, DataFieldDefinition, AdapterMetadata } from './types.js';
import { getAdapterMetadata, toDataFieldOptions } from './types.js';

// =============================================================================
// ADAPTER REGISTRY
// =============================================================================

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
class AdapterRegistry {
	private adapters: Map<string, AnyDataAdapter> = new Map();

	/**
	 * Register a data adapter.
	 * If an adapter with the same ID already exists, it will be replaced.
	 */
	register(adapter: AnyDataAdapter): void {
		this.adapters.set(adapter.id, adapter);
	}

	/**
	 * Register multiple adapters at once.
	 */
	registerAll(adapters: AnyDataAdapter[]): void {
		for (const adapter of adapters) {
			this.register(adapter);
		}
	}

	/**
	 * Unregister an adapter by ID.
	 * Returns true if the adapter was found and removed.
	 */
	unregister(id: string): boolean {
		return this.adapters.delete(id);
	}

	/**
	 * Get an adapter by ID.
	 * Returns undefined if not found.
	 */
	get(id: string): AnyDataAdapter | undefined {
		return this.adapters.get(id);
	}

	/**
	 * Get an adapter by ID, throwing if not found.
	 */
	getOrThrow(id: string): AnyDataAdapter {
		const adapter = this.adapters.get(id);
		if (!adapter) {
			throw new Error(`Adapter not found: ${id}`);
		}
		return adapter;
	}

	/**
	 * Check if an adapter exists.
	 */
	has(id: string): boolean {
		return this.adapters.has(id);
	}

	/**
	 * Get all registered adapters.
	 */
	getAll(): AnyDataAdapter[] {
		return Array.from(this.adapters.values());
	}

	/**
	 * Get all adapter IDs.
	 */
	getIds(): string[] {
		return Array.from(this.adapters.keys());
	}

	/**
	 * Get metadata for all registered adapters.
	 */
	getAllMetadata(): AdapterMetadata[] {
		return this.getAll().map(getAdapterMetadata);
	}

	/**
	 * Get adapters by category.
	 */
	getByCategory(category: string): AnyDataAdapter[] {
		return this.getAll().filter((adapter) => adapter.category === category);
	}

	/**
	 * Get all unique categories.
	 */
	getCategories(): string[] {
		const categories = new Set<string>();
		for (const adapter of this.adapters.values()) {
			if (adapter.category) {
				categories.add(adapter.category);
			}
		}
		return Array.from(categories);
	}

	/**
	 * Get field definitions for an adapter.
	 * Returns empty array if adapter not found.
	 */
	getFieldsForAdapter(id: string): DataFieldDefinition[] {
		return this.adapters.get(id)?.getFields() ?? [];
	}

	/**
	 * Get fields as DataFieldOption format (for creator compatibility).
	 */
	getFieldOptionsForAdapter(id: string): Array<{ value: string; label: string; type: string }> {
		const fields = this.getFieldsForAdapter(id);
		return toDataFieldOptions(fields);
	}

	/**
	 * Get sample data for an adapter.
	 * Returns empty object if adapter not found.
	 */
	getSampleDataForAdapter(id: string): CardData {
		return this.adapters.get(id)?.getSampleData() ?? {};
	}

	/**
	 * Transform data using an adapter.
	 * Throws if adapter not found.
	 */
	transform(adapterId: string, source: unknown): CardData {
		const adapter = this.getOrThrow(adapterId);
		return adapter.transform(source);
	}

	/**
	 * Validate data using an adapter's validate function.
	 * Returns true if adapter has no validate function.
	 * Throws if adapter not found.
	 */
	validate(adapterId: string, source: unknown): boolean {
		const adapter = this.getOrThrow(adapterId);
		if (!adapter.validate) {
			return true;
		}
		return adapter.validate(source);
	}

	/**
	 * Transform data if valid, otherwise return undefined.
	 */
	transformIfValid(adapterId: string, source: unknown): CardData | undefined {
		const adapter = this.get(adapterId);
		if (!adapter) {
			return undefined;
		}
		if (adapter.validate && !adapter.validate(source)) {
			return undefined;
		}
		return adapter.transform(source);
	}

	/**
	 * Clear all registered adapters.
	 */
	clear(): void {
		this.adapters.clear();
	}

	/**
	 * Get the number of registered adapters.
	 */
	get size(): number {
		return this.adapters.size;
	}
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
export const adapterRegistry = new AdapterRegistry();

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
export function createAdapterRegistry(): AdapterRegistry {
	return new AdapterRegistry();
}

export type { AdapterRegistry };
