# Known Bugs

## BUG-001: Component panels don't collapse when Components accordion is closed (after first time)

**Status:** RESOLVED

**Component:** `PropertiesPanel.svelte`

**Description:**
When the Components accordion section is collapsed, all component panels inside should also collapse. This works correctly:
- The first time the accordion is closed
- After switching to a different layer and back

But it does NOT work on subsequent closes without switching layers.

**Expected behavior:**
Every time the Components accordion is collapsed, all `comp-*` panels in `expandedPanels` should be cleared.

**Actual behavior:**
Only works once, then stops working until the user clicks on a different layer.

**Root cause (suspected):**
The bits-ui Accordion component's `onValueChange` callback or state binding isn't triggering reliably on subsequent toggles. The `openSections` state may not be updating as expected, or there's a stale closure issue.

**Attempted fixes:**
1. Using `onValueChange` callback with state comparison - didn't work reliably
2. Using `bind:value` with `$effect` watching the state - caused infinite loop
3. Using `bind:value` with `$effect` and plain variable tracking - only worked first time
4. Using `onValueChange` with comparison before state update - only worked first time

**Related files:**
- `src/lib/creator/components/PropertiesPanel.svelte` - Accordion implementation
- `src/lib/creator/CardCreator.svelte` - `collapseAllComponentPanels()` function

**Resolution:**
The fix was to use a "reset key" pattern. When the Components accordion is opened (after being closed), we increment a `componentResetKey` counter. This key is included in the `{#each}` block's key expression (`${component.id}-${componentResetKey}`), which forces Svelte to destroy and re-create all component panel instances with fresh state (collapsed by default).

This works because the component panels use `$bindable` for their `expanded` prop with a default of `false`, so newly created instances start collapsed.
