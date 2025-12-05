# Runed Implementation Plan

**Package:** `runed`
**Target:** `src/lib/creator/` (Visual Creator only)
**Scope:** UI state management improvements
**Status:** COMPLETED (2025-12-05)

---

## Implementation Summary

This plan integrated [Runed](https://runed.dev) utilities into the CardCreator to simplify state management and add new capabilities (auto-save drafts).

**What was implemented:**
- Icon search debouncing → `useDebounce` (15 lines → 3 lines)
- New auto-save feature → `PersistedState` (new capability)
- RestoreDraftDialog component (new)

**What was NOT changed (intentionally):**
- Undo/Redo system → Kept manual implementation
  - Reason: `StateHistory` lacks pause/resume methods needed for drag operations
  - Without pause/resume, every pixel movement during drag would create a history entry
  - The manual implementation is actually better suited for this use case

**Files changed:**
- `src/lib/components/icons/IconPicker.svelte` - Debounced search migration
- `src/lib/creator/CardCreator.svelte` - PersistedState auto-save
- `src/lib/creator/components/RestoreDraftDialog.svelte` - New component

---

## Original Plan (for reference)

---

## Table of Contents

1. [Current Implementation Analysis](#current-implementation-analysis)
2. [Proposed Changes](#proposed-changes)
3. [Migration Plan](#migration-plan)
4. [File Changes](#file-changes)
5. [Risk Assessment](#risk-assessment)
6. [Testing Plan](#testing-plan)

---

## Current Implementation Analysis

### 1. Undo/Redo System

**Location:** `src/lib/creator/CardCreator.svelte:124-330`

**Current Implementation:**
```typescript
// State (lines 125-128)
let history = $state<ContainerState[][]>([]);
let historyIndex = $state(-1);
const canUndo = $derived(historyIndex > 0);
const canRedo = $derived(historyIndex < history.length - 1);

// Push to history (lines 300-312)
function pushHistory() {
    let newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(structuredClone($state.snapshot(containers)));

    if (newHistory.length > MAX_HISTORY_SIZE) {
        newHistory = newHistory.slice(-MAX_HISTORY_SIZE);
    }

    history = newHistory;
    historyIndex = newHistory.length - 1;
}

// Undo (lines 314-321)
function undo() {
    if (!canUndo) return;
    isTransitioning = true;
    historyIndex--;
    containers = structuredClone($state.snapshot(history)[historyIndex]);
    setTimeout(() => (isTransitioning = false), 50);
}

// Redo (lines 323-330)
function redo() {
    if (!canRedo) return;
    isTransitioning = true;
    historyIndex++;
    containers = structuredClone($state.snapshot(history)[historyIndex]);
    setTimeout(() => (isTransitioning = false), 50);
}
```

**Issues:**
- 40+ lines of manual state management
- History truncation logic is custom
- `$state.snapshot()` wrapping required everywhere
- New developers must read and understand this code

**Usage Count:** `pushHistory()` is called in 25+ places throughout CardCreator.svelte

---

### 2. Keyboard Shortcuts

**Location:** `src/lib/creator/CardCreator.svelte:840-915`

**Current Implementation:**
```typescript
function isInTextInput(): boolean {
    const tag = document.activeElement?.tagName;
    return tag === 'INPUT' || tag === 'TEXTAREA';
}

function handleKeydown(e: KeyboardEvent) {
    if (e.metaKey || e.ctrlKey) {
        if (e.key === 'z' && !e.shiftKey) {
            e.preventDefault();
            undo();
        } else if ((e.key === 'z' && e.shiftKey) || e.key === 'y') {
            e.preventDefault();
            redo();
        } else if (e.key === 'c') {
            e.preventDefault();
            copyContainer();
        }
        // ... 25 more lines of key handling
    }

    if (isInTextInput()) return;

    switch (e.key) {
        case 'g':
            showGrid = !showGrid;
            break;
        // ... 20 more cases
    }
}
```

**Issues:**
- Large switch/case block (75 lines total)
- Manual modifier key checking
- Manual text input detection
- Not declarative

**Assessment:** Current implementation is functional and not overly complex. Runed's `PressedKeys` would provide marginal improvement. **Recommend: Keep as-is** unless team prefers declarative approach.

---

### 3. Debouncing (IconPicker)

**Location:** `src/lib/components/icons/IconPicker.svelte:64-111`

**Current Implementation:**
```typescript
// Timer storage
let debounceTimer: ReturnType<typeof setTimeout> | null = null;

// Cleanup on unmount
$effect(() => {
    return () => {
        if (debounceTimer) {
            clearTimeout(debounceTimer);
            debounceTimer = null;
        }
    };
});

// Debounced search
function handleSearchInput() {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(searchIcons, 300);
}
```

**Issues:**
- Manual timer management
- Manual cleanup required
- Boilerplate code pattern
- 15 lines for simple debounce

---

### 4. State Persistence (Not Yet Implemented)

**Current Behavior:**
- Templates saved manually via JSON export
- No auto-save of work in progress
- Refresh = lose unsaved work

**Opportunity:** Add auto-save drafts using `PersistedState`

---

## Proposed Changes

### Change 1: StateHistory for Undo/Redo

**Before (40+ lines):**
```typescript
let history = $state<ContainerState[][]>([]);
let historyIndex = $state(-1);
const canUndo = $derived(historyIndex > 0);
const canRedo = $derived(historyIndex < history.length - 1);

function pushHistory() { /* 12 lines */ }
function undo() { /* 7 lines */ }
function redo() { /* 7 lines */ }
```

**After (10 lines):**
```typescript
import { StateHistory } from 'runed';

// Reactive history tracking with automatic diffing
const history = new StateHistory(
    () => containers,
    (newContainers) => {
        isTransitioning = true;
        containers = newContainers;
        setTimeout(() => (isTransitioning = false), 50);
    },
    { capacity: 50 }
);

// Expose for UI
const canUndo = $derived(history.canUndo);
const canRedo = $derived(history.canRedo);
```

**Migration Notes:**
- Remove all `pushHistory()` calls - StateHistory auto-tracks changes
- Replace `undo()` → `history.undo()`
- Replace `redo()` → `history.redo()`
- `canUndo`/`canRedo` work the same way

**Caveat:** StateHistory tracks ALL changes automatically. We need to verify this doesn't create excessive history entries during drag operations. May need to use `history.pause()` and `history.resume()` during drag/resize.

---

### Change 2: Debounced for IconPicker Search

**Before (15 lines):**
```typescript
let debounceTimer: ReturnType<typeof setTimeout> | null = null;

$effect(() => {
    return () => {
        if (debounceTimer) {
            clearTimeout(debounceTimer);
            debounceTimer = null;
        }
    };
});

function handleSearchInput() {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(searchIcons, 300);
}
```

**After (3 lines):**
```typescript
import { Debounced } from 'runed';

const debouncedQuery = new Debounced(() => searchQuery, 300);

// React to debounced value changes
$effect(() => {
    if (debouncedQuery.current) {
        searchIcons();
    }
});
```

**Or even simpler with useDebounce:**
```typescript
import { useDebounce } from 'runed';

const debouncedSearch = useDebounce(searchIcons, 300);

// In template: oninput={debouncedSearch}
```

---

### Change 3: PersistedState for Auto-Save (New Feature)

**New Capability:**
```typescript
import { PersistedState } from 'runed';

// Auto-save draft to localStorage
const draft = new PersistedState<{
    containers: ContainerState[];
    templateName: string;
    lastModified: string;
}>('card-creator-draft', {
    containers: [createInitialCardBackground()],
    templateName: 'New Template',
    lastModified: new Date().toISOString()
});

// Sync containers to draft on change
$effect(() => {
    draft.current = {
        containers: $state.snapshot(containers),
        templateName,
        lastModified: new Date().toISOString()
    };
});

// On mount, offer to restore draft if exists
let showRestoreDraftDialog = $state(false);

$effect(() => {
    if (draft.current && draft.current.containers.length > 0) {
        const lastModified = new Date(draft.current.lastModified);
        const isRecent = Date.now() - lastModified.getTime() < 24 * 60 * 60 * 1000; // 24 hours
        if (isRecent && !initialTemplate) {
            showRestoreDraftDialog = true;
        }
    }
});

function restoreDraft() {
    if (draft.current) {
        containers = draft.current.containers;
        templateName = draft.current.templateName;
    }
    showRestoreDraftDialog = false;
}

function discardDraft() {
    draft.current = null;
    showRestoreDraftDialog = false;
}
```

**User Experience:**
1. User works on template
2. Draft auto-saves to localStorage every change
3. User accidentally closes browser
4. User returns → "Restore unsaved work?" dialog appears
5. User clicks "Restore" → continues where they left off

---

## Migration Plan

### Phase 1: Install & Setup

```bash
npm install runed
```

Update `package.json` to include runed in dependencies.

---

### Phase 2: StateHistory Migration

**File:** `src/lib/creator/CardCreator.svelte`

**Steps:**

1. Add import at top:
   ```typescript
   import { StateHistory } from 'runed';
   ```

2. Replace history state (lines 124-128):
   ```typescript
   // REMOVE these lines:
   // let history = $state<ContainerState[][]>([]);
   // let historyIndex = $state(-1);
   // const canUndo = $derived(historyIndex > 0);
   // const canRedo = $derived(historyIndex < history.length - 1);

   // ADD:
   const history = new StateHistory(
       () => $state.snapshot(containers),
       (newContainers) => {
           isTransitioning = true;
           containers = structuredClone(newContainers);
           setTimeout(() => (isTransitioning = false), 50);
       },
       { capacity: 50 }
   );

   const canUndo = $derived(history.canUndo);
   const canRedo = $derived(history.canRedo);
   ```

3. Remove `pushHistory()` function (lines 300-312)

4. Remove `undo()` and `redo()` functions (lines 314-330)

5. Update all call sites:
   - Replace `undo()` → `history.undo()`
   - Replace `redo()` → `history.redo()`
   - Remove ALL `pushHistory()` calls (25+ locations)

6. Handle drag/resize batching:
   ```typescript
   function startDrag(e: PointerEvent, containerId: string) {
       // ... existing code ...
       history.pause(); // Don't record every pixel movement
   }

   function handleCanvasPointerUp() {
       history.resume(); // Resume tracking, this will record final state
       // ... existing code ...
   }
   ```

**Call Sites to Update:**

| Line | Current | After |
|------|---------|-------|
| 339 | `pushHistory()` | Remove |
| 347 | `pushHistory()` | Remove |
| 354 | `pushHistory()` | Remove |
| 371 | `pushHistory()` | Remove |
| 385 | `pushHistory()` | Remove |
| 396-397 | `pushHistory()` | Remove |
| 405-406 | `pushHistory()` | Remove |
| 415 | `pushHistory()` | Remove |
| 448 | `pushHistory()` | Remove |
| 474 | `pushHistory()` | Remove |
| 485 | `pushHistory()` | Remove |
| 510-511 | `pushHistory()` | Remove |
| 528 | `pushHistory()` | Remove |
| 547 | `pushHistory()` | Remove |
| 568 | `pushHistory()` | Remove |
| 580 | `pushHistory()` | Remove |
| 588 | `pushHistory()` | Remove |
| 628 | `pushHistory()` | Remove |
| 650 | `pushHistory()` | `history.pause()` |
| 663 | `pushHistory()` | `history.pause()` |
| 775 | `pushHistory()` | Remove |
| 823 | `pushHistory()` | Remove |
| 848-851 | `undo()` / `redo()` | `history.undo()` / `history.redo()` |
| 988-989 | `onUndo={undo}` / `onRedo={redo}` | `onUndo={() => history.undo()}` / `onRedo={() => history.redo()}` |

---

### Phase 3: Debounced Migration

**File:** `src/lib/components/icons/IconPicker.svelte`

**Steps:**

1. Add import:
   ```typescript
   import { useDebounce } from 'runed';
   ```

2. Remove manual debounce code (lines 64-75):
   ```typescript
   // REMOVE:
   // let debounceTimer: ReturnType<typeof setTimeout> | null = null;
   // $effect(() => { return () => { ... } });
   ```

3. Replace `handleSearchInput` (lines 107-111):
   ```typescript
   // REMOVE:
   // function handleSearchInput() {
   //     if (debounceTimer) clearTimeout(debounceTimer);
   //     debounceTimer = setTimeout(searchIcons, 300);
   // }

   // ADD:
   const debouncedSearch = useDebounce(searchIcons, 300);
   ```

4. Update template (line 199):
   ```svelte
   <!-- BEFORE -->
   <input oninput={handleSearchInput} ... />

   <!-- AFTER -->
   <input oninput={debouncedSearch} ... />
   ```

---

### Phase 4: PersistedState for Auto-Save (New Feature)

**Files:**
- `src/lib/creator/CardCreator.svelte` - Add persistence logic
- `src/lib/creator/components/RestoreDraftDialog.svelte` - New component

**Steps:**

1. Add to CardCreator.svelte imports:
   ```typescript
   import { PersistedState } from 'runed';
   import RestoreDraftDialog from './components/RestoreDraftDialog.svelte';
   ```

2. Add draft state after existing state declarations:
   ```typescript
   // Auto-save draft
   const draft = new PersistedState<{
       containers: ContainerState[];
       templateName: string;
       timestamp: number;
   } | null>('card-creator-draft', null);

   let showRestoreDraftDialog = $state(false);

   // Check for existing draft on mount
   $effect(() => {
       if (draft.current && !initialTemplate) {
           const age = Date.now() - draft.current.timestamp;
           const isRecent = age < 24 * 60 * 60 * 1000; // 24 hours
           if (isRecent) {
               showRestoreDraftDialog = true;
           }
       }
   });

   // Auto-save on change (debounced to avoid excessive writes)
   const saveDraft = useDebounce(() => {
       draft.current = {
           containers: $state.snapshot(containers),
           templateName,
           timestamp: Date.now()
       };
   }, 1000);

   $effect(() => {
       // Track containers changes
       containers;
       templateName;
       saveDraft();
   });

   function restoreDraft() {
       if (draft.current) {
           containers = draft.current.containers;
           templateName = draft.current.templateName;
           history.clear(); // Reset history after restore
       }
       showRestoreDraftDialog = false;
   }

   function discardDraft() {
       draft.current = null;
       showRestoreDraftDialog = false;
   }

   function clearDraft() {
       draft.current = null;
   }
   ```

3. Create RestoreDraftDialog component:
   ```svelte
   <!-- src/lib/creator/components/RestoreDraftDialog.svelte -->
   <script lang="ts">
       import * as Dialog from '$lib/components/ui/dialog';
       import { Button } from '$lib/components/ui/button';

       interface Props {
           show: boolean;
           draftAge: string;
           onRestore: () => void;
           onDiscard: () => void;
       }

       let { show = $bindable(), draftAge, onRestore, onDiscard }: Props = $props();
   </script>

   <Dialog.Root bind:open={show}>
       <Dialog.Content class="sm:max-w-md">
           <Dialog.Header>
               <Dialog.Title>Restore Unsaved Work?</Dialog.Title>
               <Dialog.Description>
                   You have an unsaved draft from {draftAge}. Would you like to restore it?
               </Dialog.Description>
           </Dialog.Header>
           <div class="flex justify-end gap-2 pt-4">
               <Button variant="outline" onclick={onDiscard}>Start Fresh</Button>
               <Button onclick={onRestore}>Restore Draft</Button>
           </div>
       </Dialog.Content>
   </Dialog.Root>
   ```

4. Add dialog to template:
   ```svelte
   <RestoreDraftDialog
       bind:show={showRestoreDraftDialog}
       draftAge={draft.current ? formatTimeAgo(draft.current.timestamp) : ''}
       onRestore={restoreDraft}
       onDiscard={discardDraft}
   />
   ```

5. Clear draft on successful save:
   ```typescript
   function saveTemplate() {
       // ... existing save logic ...
       clearDraft(); // Clear auto-save after explicit save
   }
   ```

---

## File Changes

| File | Change Type | Lines Changed | Complexity |
|------|-------------|---------------|------------|
| `package.json` | Add dependency | +1 | Low |
| `CardCreator.svelte` | Refactor | ~-60, +40 | Medium |
| `IconPicker.svelte` | Simplify | ~-15, +5 | Low |
| `RestoreDraftDialog.svelte` | New file | +35 | Low |

**Total Estimated Changes:**
- Lines removed: ~75
- Lines added: ~80
- Net: +5 lines (but much cleaner, documented code)

---

## Risk Assessment

### Low Risk
- **Debounced migration** - Isolated to IconPicker, easy to test
- **PersistedState** - New feature, doesn't modify existing behavior

### Medium Risk
- **StateHistory migration** - Touches 25+ call sites
  - **Mitigation:** Test each operation (add zone, delete, drag, resize, undo, redo)
  - **Mitigation:** Keep old code commented until verified
  - **Rollback:** Easy to revert by uncommenting old code

### Potential Issues

1. **StateHistory auto-tracking during drag**
   - Risk: Creates history entry for every pixel moved
   - Solution: Use `history.pause()` / `history.resume()` during drag operations

2. **PersistedState storage limits**
   - Risk: Large templates might exceed localStorage limits (~5MB)
   - Solution: Only store essential state, not full IconData bodies
   - Solution: Add try/catch around storage operations

3. **Cross-tab sync conflicts**
   - Risk: PersistedState syncs across tabs by default
   - Solution: This is actually desirable for draft recovery
   - Alternative: Disable sync if problematic: `new PersistedState(key, value, { sync: false })`

---

## Testing Plan

### Unit Tests

1. **StateHistory**
   - [ ] Undo reverts to previous state
   - [ ] Redo restores undone state
   - [ ] canUndo is false when at start of history
   - [ ] canRedo is false when at end of history
   - [ ] History capacity limits to 50 entries
   - [ ] Pause/resume works for drag operations

2. **Debounced**
   - [ ] Search doesn't fire immediately
   - [ ] Search fires after 300ms delay
   - [ ] Rapid typing resets timer
   - [ ] Cleanup happens on unmount

3. **PersistedState**
   - [ ] Draft saves to localStorage
   - [ ] Draft restores on page load
   - [ ] Draft clears after explicit save
   - [ ] Old drafts (>24h) are ignored

### Manual Testing Checklist

**Undo/Redo:**
- [ ] Add zone → Undo → Zone removed
- [ ] Delete zone → Undo → Zone restored
- [ ] Move zone → Undo → Zone back to original position
- [ ] Resize zone → Undo → Zone back to original size
- [ ] Add component → Undo → Component removed
- [ ] Change property → Undo → Property reverted
- [ ] Drag zone (continuous) → Only 1 undo step (not per-pixel)
- [ ] Redo after undo works correctly
- [ ] Undo button disabled when no history
- [ ] Redo button disabled when at end of history
- [ ] Keyboard shortcut Cmd+Z works
- [ ] Keyboard shortcut Cmd+Shift+Z works

**Icon Search:**
- [ ] Type "star" → Results appear after delay
- [ ] Type rapidly → Only one search request
- [ ] Change icon set → Search updates
- [ ] Select icon → Icon loads correctly

**Auto-Save:**
- [ ] Make changes → Close tab → Reopen → "Restore?" dialog appears
- [ ] Click "Restore" → Previous work restored
- [ ] Click "Start Fresh" → Empty template
- [ ] Save template → Draft cleared
- [ ] Old draft (>24h) → No dialog shown

---

## Implementation Order

1. **Install runed** - 5 minutes
2. **Debounced migration** - 30 minutes (isolated, low risk)
3. **StateHistory migration** - 2-3 hours (many call sites)
4. **Testing StateHistory** - 1-2 hours
5. **PersistedState feature** - 1-2 hours
6. **Testing persistence** - 30 minutes
7. **Final QA pass** - 1 hour

**Total: 4-6 focused work sessions**

---

## Success Criteria

1. All existing functionality works identically
2. `npm run check` passes with 0 errors
3. Undo/redo feel snappy (no lag)
4. Icon search works as before
5. New draft auto-save works reliably
6. New developers can understand the code faster (subjective but important)

---

## Appendix: Runed API Reference

### StateHistory

```typescript
import { StateHistory } from 'runed';

const history = new StateHistory(
    getter: () => T,           // Function returning current state
    setter: (value: T) => void, // Function to update state
    options?: {
        capacity?: number       // Max history entries (default: unlimited)
    }
);

history.undo();          // Revert to previous state
history.redo();          // Restore undone state
history.clear();         // Clear all history
history.pause();         // Stop tracking changes
history.resume();        // Resume tracking changes

history.canUndo;         // boolean - derived
history.canRedo;         // boolean - derived
history.log;             // LogEvent<T>[] - history entries with timestamps
```

### Debounced / useDebounce

```typescript
import { Debounced, useDebounce } from 'runed';

// Class-based (for tracking state)
const debounced = new Debounced(() => searchQuery, 300);
debounced.current; // Debounced value

// Function-based (for callbacks)
const debouncedFn = useDebounce(myCallback, 300);
debouncedFn(); // Debounced execution
```

### PersistedState

```typescript
import { PersistedState } from 'runed';

const state = new PersistedState<T>(
    key: string,           // localStorage key
    initialValue: T,       // Default value
    options?: {
        storage?: Storage, // localStorage (default) or sessionStorage
        sync?: boolean     // Cross-tab sync (default: true)
    }
);

state.current;            // Get/set current value
state.current = newValue; // Updates localStorage automatically
```

---

*End of Implementation Plan*
