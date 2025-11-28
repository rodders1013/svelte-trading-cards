import type { Component } from 'svelte';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyComponent = Component<any, any, any>;
type ComponentMap = Record<string, AnyComponent>;

const registry: ComponentMap = {};

export function registerComponent(name: string, component: AnyComponent) {
	registry[name] = component;
}

export function getComponentByName(name: string): AnyComponent | null {
	return registry[name] || null;
}

export function getAllComponents(): ComponentMap {
	return { ...registry };
}
