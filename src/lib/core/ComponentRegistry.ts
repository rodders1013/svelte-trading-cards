import type { Component } from 'svelte';
import { getContext, setContext } from 'svelte';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyComponent = Component<any, any, any>;
type ComponentMap = Record<string, AnyComponent>;

// =============================================================================
// CONTEXT-BASED REGISTRY (recommended for isolation)
// =============================================================================

const REGISTRY_KEY = Symbol('component-registry');

export interface ComponentRegistry {
	register(name: string, component: AnyComponent): void;
	get(name: string): AnyComponent | null;
	getAll(): ComponentMap;
}

/**
 * Creates an isolated component registry instance.
 * Use with setComponentRegistry/getComponentRegistry for per-component isolation.
 */
export function createComponentRegistry(): ComponentRegistry {
	// Use Object.create(null) to prevent prototype pollution
	const registry: ComponentMap = Object.create(null);

	return {
		register(name: string, component: AnyComponent) {
			registry[name] = component;
		},
		get(name: string): AnyComponent | null {
			return registry[name] || null;
		},
		getAll(): ComponentMap {
			return { ...registry };
		}
	};
}

/**
 * Sets a component registry in the current Svelte context.
 * Call this in a parent component to provide an isolated registry to children.
 */
export function setComponentRegistry(registry: ComponentRegistry): void {
	setContext(REGISTRY_KEY, registry);
}

/**
 * Gets the component registry from the current Svelte context.
 * Falls back to the default global registry if no context is set.
 */
export function getComponentRegistry(): ComponentRegistry {
	const contextRegistry = getContext<ComponentRegistry | undefined>(REGISTRY_KEY);
	if (contextRegistry) {
		return contextRegistry;
	}
	// Fallback to default registry for backwards compatibility
	return defaultRegistryWrapper;
}

// =============================================================================
// DEFAULT GLOBAL REGISTRY (backwards compatible)
// =============================================================================

// Use Object.create(null) to prevent prototype pollution
const defaultRegistry: ComponentMap = Object.create(null);

// Wrapper to match ComponentRegistry interface
const defaultRegistryWrapper: ComponentRegistry = {
	register(name: string, component: AnyComponent) {
		defaultRegistry[name] = component;
	},
	get(name: string): AnyComponent | null {
		return defaultRegistry[name] || null;
	},
	getAll(): ComponentMap {
		return { ...defaultRegistry };
	}
};

/**
 * Registers a component in the default global registry.
 * For isolation, use createComponentRegistry() + setComponentRegistry() instead.
 */
export function registerComponent(name: string, component: AnyComponent) {
	defaultRegistry[name] = component;
}

/**
 * Gets a component from the default global registry.
 * For isolation, use getComponentRegistry().get() instead.
 */
export function getComponentByName(name: string): AnyComponent | null {
	return defaultRegistry[name] || null;
}

/**
 * Gets all components from the default global registry.
 */
export function getAllComponents(): ComponentMap {
	return { ...defaultRegistry };
}
