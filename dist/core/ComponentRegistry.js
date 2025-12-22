import { getContext, setContext } from 'svelte';
// =============================================================================
// CONTEXT-BASED REGISTRY (recommended for isolation)
// =============================================================================
const REGISTRY_KEY = Symbol('component-registry');
/**
 * Creates an isolated component registry instance.
 * Use with setComponentRegistry/getComponentRegistry for per-component isolation.
 */
export function createComponentRegistry() {
    // Use Object.create(null) to prevent prototype pollution
    const registry = Object.create(null);
    return {
        register(name, component) {
            registry[name] = component;
        },
        get(name) {
            return registry[name] || null;
        },
        getAll() {
            return { ...registry };
        }
    };
}
/**
 * Sets a component registry in the current Svelte context.
 * Call this in a parent component to provide an isolated registry to children.
 */
export function setComponentRegistry(registry) {
    setContext(REGISTRY_KEY, registry);
}
/**
 * Gets the component registry from the current Svelte context.
 * Falls back to the default global registry if no context is set.
 */
export function getComponentRegistry() {
    const contextRegistry = getContext(REGISTRY_KEY);
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
const defaultRegistry = Object.create(null);
// Wrapper to match ComponentRegistry interface
const defaultRegistryWrapper = {
    register(name, component) {
        defaultRegistry[name] = component;
    },
    get(name) {
        return defaultRegistry[name] || null;
    },
    getAll() {
        return { ...defaultRegistry };
    }
};
/**
 * Registers a component in the default global registry.
 * For isolation, use createComponentRegistry() + setComponentRegistry() instead.
 */
export function registerComponent(name, component) {
    defaultRegistry[name] = component;
}
/**
 * Gets a component from the default global registry.
 * For isolation, use getComponentRegistry().get() instead.
 */
export function getComponentByName(name) {
    return defaultRegistry[name] || null;
}
/**
 * Gets all components from the default global registry.
 */
export function getAllComponents() {
    return { ...defaultRegistry };
}
