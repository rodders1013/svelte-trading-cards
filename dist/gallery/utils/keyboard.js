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
export function createKeyboardNavigation(options) {
    const { itemCount, columns = 1, wrap = true, onIndexChange } = options;
    return function handleKeydown(event, currentIndex) {
        let newIndex = currentIndex;
        switch (event.key) {
            case 'ArrowRight':
                newIndex = currentIndex + 1;
                break;
            case 'ArrowLeft':
                newIndex = currentIndex - 1;
                break;
            case 'ArrowDown':
                newIndex = currentIndex + columns;
                break;
            case 'ArrowUp':
                newIndex = currentIndex - columns;
                break;
            case 'Home':
                newIndex = 0;
                break;
            case 'End':
                newIndex = itemCount - 1;
                break;
            default:
                return; // Don't prevent default for other keys
        }
        event.preventDefault();
        if (wrap) {
            // Wrap around
            newIndex = ((newIndex % itemCount) + itemCount) % itemCount;
        }
        else {
            // Clamp to valid range
            newIndex = Math.max(0, Math.min(itemCount - 1, newIndex));
        }
        if (newIndex !== currentIndex) {
            onIndexChange(newIndex);
        }
    };
}
