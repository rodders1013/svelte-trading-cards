/**
 * Shared utilities for resolving data from card data fields
 * Eliminates duplicated data resolution patterns across components
 */

/**
 * Card data is a record of field names to values
 */
export type CardData = Record<string, unknown>;

/**
 * Resolve a value from card data or use fallback
 * Handles the common pattern of checking dataField -> data[dataField] -> fallback
 *
 * @param dataField - The field name to look up
 * @param data - The card data object
 * @param fallback - Value to use if field not found or empty
 * @param parser - Optional function to transform the value
 */
export function resolveDataField<T>(
	dataField: string | undefined,
	data: CardData | undefined,
	fallback: T,
	parser?: (value: unknown) => T
): T {
	if (dataField && data && data[dataField] !== undefined) {
		const value = data[dataField];
		return parser ? parser(value) : (value as T);
	}
	return fallback;
}

/**
 * Common value parsers
 */

/** Parse any value to string */
export const parseString = (v: unknown): string => String(v);

/** Parse any value to number, defaults to 0 on failure */
export const parseNumber = (v: unknown): number =>
	typeof v === 'number' ? v : parseFloat(String(v)) || 0;

/** Parse a value to array of strings, splitting by delimiter if string */
export const parseArray = (v: unknown, delimiter = ','): string[] =>
	Array.isArray(v) ? v.map(String) : String(v).split(delimiter).map((s) => s.trim());

/**
 * Resolve text content from either a data field or preset value
 * Common pattern used by TextField, Ribbon, List, etc.
 *
 * @param dataField - The field name to look up
 * @param data - The card data object
 * @param preset - The preset/default text value
 * @param emptyPreset - Value that indicates "no preset" (e.g., 'none')
 * @param defaultText - Text to use when preset is empty
 */
export function resolveTextContent(
	dataField: string | undefined,
	data: CardData | undefined,
	preset: string,
	emptyPreset = 'none',
	defaultText = ''
): string {
	// If we have a dataField and data with that field, use it
	if (dataField && data && data[dataField] !== undefined) {
		return String(data[dataField]);
	}
	// Otherwise use preset, unless it's the "empty" marker
	return preset === emptyPreset ? defaultText : preset;
}
