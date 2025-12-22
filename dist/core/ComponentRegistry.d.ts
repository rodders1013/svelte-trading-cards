import type { Component } from 'svelte';
type AnyComponent = Component<any, any, any>;
type ComponentMap = Record<string, AnyComponent>;
export interface ComponentRegistry {
    register(name: string, component: AnyComponent): void;
    get(name: string): AnyComponent | null;
    getAll(): ComponentMap;
}
/**
 * Creates an isolated component registry instance.
 * Use with setComponentRegistry/getComponentRegistry for per-component isolation.
 */
export declare function createComponentRegistry(): ComponentRegistry;
/**
 * Sets a component registry in the current Svelte context.
 * Call this in a parent component to provide an isolated registry to children.
 */
export declare function setComponentRegistry(registry: ComponentRegistry): void;
/**
 * Gets the component registry from the current Svelte context.
 * Falls back to the default global registry if no context is set.
 */
export declare function getComponentRegistry(): ComponentRegistry;
/**
 * Registers a component in the default global registry.
 * For isolation, use createComponentRegistry() + setComponentRegistry() instead.
 */
export declare function registerComponent(name: string, component: AnyComponent): void;
/**
 * Gets a component from the default global registry.
 * For isolation, use getComponentRegistry().get() instead.
 */
export declare function getComponentByName(name: string): AnyComponent | null;
/**
 * Gets all components from the default global registry.
 */
export declare function getAllComponents(): ComponentMap;
export {};
