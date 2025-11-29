# Steering Document: svelte-trading-cards

**Purpose:** Mandatory workflows, version requirements, and quality standards for developing the svelte-trading-cards component library.

**Read this document at the start of every session.**

---

## Required Versions

| Package | Version | Notes |
|---------|---------|-------|
| Svelte | 5.x | Uses runes ($state, $derived, $props, $effect) |
| Tailwind CSS | v4+ | CSS-first configuration |
| Zod | v4+ | z.record requires 2 args |
| SvelteKit | 2.x | Library mode with @sveltejs/package |

---

## Workflow for Code Changes

### Before Writing Code

1. **Check Svelte MCP** - Verify Svelte 5 syntax from official docs
2. **Use svelte-autofixer** - Validate ALL Svelte components
3. **Run svelte-check** - Zero errors before committing

### When to Use MCP Servers

- Writing or modifying Svelte components
- Using runes ($state, $derived, $props, $effect)
- Any time you're unsure about Svelte 5 syntax

---

## Svelte 5 Patterns

**CORRECT Svelte 5:**
```svelte
<script>
  let { count = 0 } = $props();
  let doubled = $derived(count * 2);
</script>
<button onclick={() => count++}>
```

### Runes Reference

| Rune | Purpose |
|------|---------|
| `$state()` | Reactive state |
| `$derived()` | Computed values |
| `$effect()` | Side effects |
| `$props()` | Component props |
| `$bindable()` | Two-way binding props |

---

## Card Dimensions

**All card templates use 750x1050 dimensions.**

| Property | Value |
|----------|-------|
| SVG Width | 750px |
| SVG Height | 1050px |
| ViewBox | `0 0 750 1050` |
| Corner Radius | 26px |
| Physical Size | 2.5" x 3.5" at 300 DPI |

---

## Component Development

### Container-Aware Pattern

All components receive `container: ContainerContext` and fill their parent:

```svelte
<script lang="ts" module>
  import { z } from 'zod';
  export const PropsSchema = z.object({ ... });
  export type Props = z.infer<typeof PropsSchema>;
</script>

<script lang="ts">
  import type { ContainerContext, CardData } from '$lib/types';

  let {
    container,
    data,
    ...props
  }: Props & { container: ContainerContext; data?: CardData } = $props();
</script>

<!-- Use container.width, container.height -->
```

### Registration

```typescript
import { registerComponent } from '$lib/core';
registerComponent('MyComponent', MyComponent);
```

---

## Visual Creator

The creator at `/creator` uses zones (Groups) as the organizing unit.

### File Structure

```
src/routes/creator/
├── +page.svelte        # Main orchestrator (~800 lines)
├── types.ts            # Type definitions
├── state.svelte.ts     # Factory functions & helpers
└── components/         # Modular UI components
    ├── HierarchyPanel.svelte
    ├── CanvasPreview.svelte
    ├── PropertiesPanel.svelte
    ├── AnimationControls.svelte  # Reusable (shared by all panels)
    ├── EffectsControls.svelte    # Reusable (shared by all panels)
    └── panels/*.svelte           # Component property panels
```

### Key Concepts

- **Zones** = Groups with position, size, and optional clipping
- **Z-axis** = Controlled by zone order (drag to reorder)
- **Components** = Added to zones (text, image, background, border, icon)
- **Auto-fit text** = TextField scales between minFontSize and maxFontSize
- **Modular panels** = Each component type has its own property panel

### TextField Properties

```typescript
{
  maxFontSize: 48,      // Maximum size
  minFontSize: 12,      // Minimum (will scale down to fit)
  verticalAlign: 'center'  // top, center, bottom
}
```

---

## Branding

### No Emojis

This library does NOT use emojis anywhere.

### Icons - Iconify Only

```svelte
<span class="icon-[lucide--star] size-6 text-yellow-500"></span>
```

---

## Commands

```bash
npm run dev              # Start dev server
npm run check            # Type check (must pass)
npm run check:watch      # Type check (watch mode)
npm run build            # Build library
npm run test             # Run tests
```

---

## Routes

| Route | Purpose |
|-------|---------|
| `/` | Demo gallery |
| `/creator` | Visual template creator |

---

## Checklist Before Committing

- [ ] svelte-check passes with 0 errors
- [ ] Components validated with svelte-autofixer
- [ ] Card dimensions are 750x1050
- [ ] No emojis
- [ ] Icons use Iconify classes only
- [ ] PROJECT-TRACKER.md updated

---

*End of Steering Document*
