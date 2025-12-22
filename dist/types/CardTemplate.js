import { z } from 'zod';
import { DisplaySettingsSchema } from '../display/types.js';
// Standard card dimensions (2.5" x 3.5" at 300 DPI)
export const CARD_WIDTH = 750;
export const CARD_HEIGHT = 1050;
export const CARD_RADIUS = 26;
// Base component definition schema (recursive for children)
const BaseComponentDefinitionSchema = z.object({
    id: z.string(),
    type: z.string(),
    props: z.record(z.string(), z.unknown()).default({})
});
// Recursive schema for components with children
export const ComponentDefinitionSchema = BaseComponentDefinitionSchema.extend({
    children: z.lazy(() => z.array(ComponentDefinitionSchema)).optional()
});
// Complete card template
export const CardTemplateSchema = z.object({
    name: z.string(),
    components: z.array(ComponentDefinitionSchema),
    /** Display settings for interactive Card component (rarity, custom gradient) */
    display: DisplaySettingsSchema.optional()
});
