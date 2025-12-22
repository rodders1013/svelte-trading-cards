import { z } from 'zod';
// =============================================================================
// DATA FIELD DEFINITION
// =============================================================================
/**
 * Field type for data adapter fields
 */
export const DataFieldTypeSchema = z.enum([
    'string',
    'number',
    'date',
    'image',
    'array',
    'boolean'
]);
/**
 * Definition of a field provided by a data adapter.
 * Used for documentation, creator dropdowns, and validation.
 */
export const DataFieldDefinitionSchema = z.object({
    /** Field key in CardData */
    key: z.string(),
    /** Human-readable label for UI display */
    label: z.string(),
    /** Data type of the field */
    type: DataFieldTypeSchema,
    /** Optional description for documentation */
    description: z.string().optional(),
    /** Example value for preview/testing */
    example: z.unknown().optional(),
    /** Whether this field is required */
    required: z.boolean().optional()
});
/**
 * Extract metadata from an adapter
 */
export function getAdapterMetadata(adapter) {
    return {
        id: adapter.id,
        name: adapter.name,
        description: adapter.description,
        category: adapter.category,
        icon: adapter.icon,
        fieldCount: adapter.getFields().length,
        suggestedTemplates: adapter.suggestedTemplates
    };
}
// =============================================================================
// HELPER FUNCTIONS
// =============================================================================
/**
 * Create a data adapter with type inference.
 * Helper function that provides better TypeScript inference.
 *
 * @example
 * ```typescript
 * interface MyData { name: string; value: number; }
 *
 * const adapter = createAdapter<MyData>({
 *   id: 'my-adapter',
 *   name: 'My Adapter',
 *   transform(data) {
 *     return { title: data.name, count: data.value };
 *   },
 *   getFields() {
 *     return [
 *       { key: 'title', label: 'Name', type: 'string' },
 *       { key: 'count', label: 'Value', type: 'number' }
 *     ];
 *   },
 *   getSampleData() {
 *     return { title: 'Sample', count: 42 };
 *   }
 * });
 * ```
 */
export function createAdapter(adapter) {
    return adapter;
}
/**
 * Convert DataFieldDefinition array to DataFieldOption array (for creator compatibility)
 */
export function toDataFieldOptions(fields) {
    return fields.map((field) => ({
        value: field.key,
        label: field.label,
        type: field.type
    }));
}
