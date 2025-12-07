import { z } from 'zod';
import type { IconData } from '$lib/card/icons/Icon.svelte';

// Built-in shape names
export const BuiltInShapeSchema = z.enum([
	// Basic geometric
	'circle',
	'square',
	'rectangle',
	'triangle',
	'diamond',
	'hexagon',
	'octagon',
	'pentagon',
	'ellipse',
	// Decorative
	'star',
	'heart',
	'shield',
	'bookmark',
	'label',
	'cloud',
	'message',
	'crown',
	'trophy',
	'medal',
	'seal',
	'certificate',
	'card'
]);

export type BuiltInShape = z.infer<typeof BuiltInShapeSchema>;

// Shape data structure (same as IconData)
export interface ShapeData {
	body: string;
	width: number;
	height: number;
}

// Shape source - either built-in or custom icon
export type ShapeSource =
	| { type: 'builtin'; shape: BuiltInShape }
	| { type: 'custom'; iconData: IconData; iconName?: string };

// Shape configuration for components
export interface ShapeConfig {
	source: ShapeSource;
	// Computed shape data (resolved from source)
	data?: ShapeData;
}

// Shape rendering options
export interface ShapeRenderOptions {
	width: number;
	height: number;
	scaleMode?: 'contain' | 'cover' | 'stretch';
}

// List of all built-in shapes for UI
export const BUILT_IN_SHAPES = BuiltInShapeSchema.options;

// Shape categories for organized UI
export const SHAPE_CATEGORIES = {
	geometric: ['circle', 'square', 'rectangle', 'triangle', 'diamond', 'hexagon', 'octagon', 'pentagon', 'ellipse'],
	decorative: ['star', 'heart', 'shield', 'bookmark', 'label', 'cloud', 'message'],
	awards: ['crown', 'trophy', 'medal', 'seal', 'certificate'],
	containers: ['card']
} as const;
