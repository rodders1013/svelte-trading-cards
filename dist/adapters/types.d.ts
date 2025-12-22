import { z } from 'zod';
import type { CardData } from '../types/index.js';
/**
 * Field type for data adapter fields
 */
export declare const DataFieldTypeSchema: z.ZodEnum<{
    string: "string";
    number: "number";
    boolean: "boolean";
    date: "date";
    array: "array";
    image: "image";
}>;
export type DataFieldType = z.infer<typeof DataFieldTypeSchema>;
/**
 * Definition of a field provided by a data adapter.
 * Used for documentation, creator dropdowns, and validation.
 */
export declare const DataFieldDefinitionSchema: z.ZodObject<{
    key: z.ZodString;
    label: z.ZodString;
    type: z.ZodEnum<{
        string: "string";
        number: "number";
        boolean: "boolean";
        date: "date";
        array: "array";
        image: "image";
    }>;
    description: z.ZodOptional<z.ZodString>;
    example: z.ZodOptional<z.ZodUnknown>;
    required: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export type DataFieldDefinition = z.infer<typeof DataFieldDefinitionSchema>;
/**
 * Data adapter interface for transforming domain-specific data into CardData.
 *
 * Adapters provide:
 * - Type-safe transformation from source format to CardData
 * - Field definitions for the visual creator
 * - Sample data for previews
 * - Optional validation
 *
 * @template TSource - The source data type this adapter transforms
 *
 * @example
 * ```typescript
 * const EmployeeAdapter: DataAdapter<Employee> = {
 *   id: 'employee',
 *   name: 'Employee Badge',
 *   transform(employee) {
 *     return {
 *       title: `${employee.firstName} ${employee.lastName}`,
 *       subtitle: employee.title,
 *       imageUrl: employee.photoUrl
 *     };
 *   },
 *   getFields() {
 *     return [
 *       { key: 'title', label: 'Full Name', type: 'string', required: true },
 *       { key: 'subtitle', label: 'Job Title', type: 'string' },
 *       { key: 'imageUrl', label: 'Photo', type: 'image' }
 *     ];
 *   },
 *   getSampleData() {
 *     return { title: 'Jane Smith', subtitle: 'Engineer', imageUrl: '...' };
 *   }
 * };
 * ```
 */
export interface DataAdapter<TSource = unknown> {
    /** Unique identifier for this adapter */
    id: string;
    /** Human-readable name */
    name: string;
    /** Description of what data this adapter handles */
    description?: string;
    /** Platform or category (e.g., 'gaming', 'hr', 'ecommerce') */
    category?: string;
    /**
     * Transform source data to CardData format.
     * This is the core function that maps domain-specific fields to card fields.
     */
    transform(source: TSource): CardData;
    /**
     * Get the list of fields this adapter provides.
     * Used by the visual creator to populate data field dropdowns.
     */
    getFields(): DataFieldDefinition[];
    /**
     * Generate sample data for preview purposes.
     * Returns CardData that can be used to preview templates.
     */
    getSampleData(): CardData;
    /**
     * Optional: Validate that source data is correct before transformation.
     * Returns true if the data is valid for this adapter.
     */
    validate?(source: unknown): source is TSource;
    /**
     * Optional: Suggested template IDs that work well with this data type.
     * Can be used to recommend templates in the UI.
     */
    suggestedTemplates?: string[];
    /**
     * Optional: Icon identifier for the adapter (Iconify format).
     * Used in UI to visually distinguish adapters.
     */
    icon?: string;
}
/**
 * Type-erased adapter for storing in registries
 */
export type AnyDataAdapter = DataAdapter<unknown>;
/**
 * Metadata about a registered adapter (without the transform function)
 */
export interface AdapterMetadata {
    id: string;
    name: string;
    description?: string;
    category?: string;
    icon?: string;
    fieldCount: number;
    suggestedTemplates?: string[];
}
/**
 * Extract metadata from an adapter
 */
export declare function getAdapterMetadata(adapter: AnyDataAdapter): AdapterMetadata;
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
export declare function createAdapter<TSource>(adapter: DataAdapter<TSource>): DataAdapter<TSource>;
/**
 * Convert DataFieldDefinition array to DataFieldOption array (for creator compatibility)
 */
export declare function toDataFieldOptions(fields: DataFieldDefinition[]): Array<{
    value: string;
    label: string;
    type: string;
}>;
