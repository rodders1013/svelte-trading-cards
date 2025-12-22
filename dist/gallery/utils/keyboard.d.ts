/**
 * Options for keyboard navigation
 */
export interface KeyboardNavigationOptions {
    /** Total number of items */
    itemCount: number;
    /** Number of columns (for grid navigation) */
    columns?: number;
    /** Wrap around at edges (default: true) */
    wrap?: boolean;
    /** Callback when index changes */
    onIndexChange: (index: number) => void;
}
/**
 * Create a keyboard navigation handler for card grids/lists
 *
 * Supports:
 * - Arrow keys for navigation
 * - Home/End for first/last item
 * - Grid navigation (ArrowUp/Down moves by column count)
 *
 * @example
 * ```svelte
 * <script>
 *   const handleKeydown = createKeyboardNavigation({
 *     itemCount: cards.length,
 *     columns: 3,
 *     onIndexChange: (index) => { focusedIndex = index; }
 *   });
 * </script>
 *
 * {#each cards as card, i}
 *   <div onkeydown={(e) => handleKeydown(e, i)}>...</div>
 * {/each}
 * ```
 */
export declare function createKeyboardNavigation(options: KeyboardNavigationOptions): (event: KeyboardEvent, currentIndex: number) => void;
