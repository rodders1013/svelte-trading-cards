import { z } from 'zod';
import type { ShapeSource } from '$lib/shapes';

// Standard card dimensions (2.5" x 3.5" at 300 DPI)
export const CARD_WIDTH = 750;
export const CARD_HEIGHT = 1050;
export const CARD_RADIUS = 26;

// Container context passed to all components
export interface ContainerContext {
	width: number;
	height: number;
	radius: number;
	/** Shape for clipping/borders - uses icon-based shape system */
	shapeSource?: ShapeSource;
}

// Base component definition schema (recursive for children)
const BaseComponentDefinitionSchema = z.object({
	id: z.string(),
	type: z.string(),
	props: z.record(z.string(), z.unknown()).default({})
});

// Recursive schema for components with children
export const ComponentDefinitionSchema: z.ZodType<ComponentDefinition> = BaseComponentDefinitionSchema.extend({
	children: z.lazy(() => z.array(ComponentDefinitionSchema)).optional()
});

export interface ComponentDefinition {
	id: string;
	type: string;
	props: Record<string, unknown>;
	children?: ComponentDefinition[];
}

// Complete card template
export const CardTemplateSchema = z.object({
	name: z.string(),
	components: z.array(ComponentDefinitionSchema)
});

export type CardTemplate = z.infer<typeof CardTemplateSchema>;
