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
| sharp | - | Image processing (WebP→PNG for server export) |
| @resvg/resvg-js | 2.x | Server-side SVG→PNG rendering |

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

### Bleed Constants (for print export)

| Constant | Value | Location |
|----------|-------|----------|
| `MAX_BLEED_MM` | 3 | state.svelte.ts |
| `PX_PER_MM` | 11.811 | state.svelte.ts |
| `MAX_BLEED_PX` | 35 | state.svelte.ts |
| `CARD_BASE_WIDTH` | 820 | state.svelte.ts |
| `CARD_BASE_HEIGHT` | 1120 | state.svelte.ts |

### Card Base Layer

The Card Base layer is a special protected layer:
- Position: (-35, -35) to cover bleed area
- Size: 820 x 1120 (includes bleed)
- `isCardBase: true` flag in ContainerState
- Cannot be deleted, moved, resized, or renamed
- Has 3 fixed components: Image, Background, Border

### Shape System

All shapes use the icon-based `shapeSource` prop:
- `shapeSource?: ShapeSource` (undefined = rect)
- 22 built-in shapes (geometric, decorative, awards, containers)
- Custom shapes via any Iconify icon
- Uses SVG `<mask>` for rendering (works with `{@html}`)
- ShapePicker component for visual selection

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
src/lib/creator/
├── CardCreator.svelte  # Main orchestrator (~1300 lines)
├── types.ts            # Type definitions
├── state.svelte.ts     # Factory functions & helpers
└── components/         # Modular UI components
    ├── layout/
    │   ├── HierarchyPanel.svelte   # Zone hierarchy (left sidebar)
    │   └── PropertiesPanel.svelte  # Properties (right sidebar)
    ├── controls/
    │   ├── AnimationControls.svelte    # Animation settings
    │   ├── EffectsControls.svelte      # Effect settings (includes strokeGlow)
    │   ├── BlendControls.svelte        # Blend mode dropdown
    │   ├── BorderModifierControls.svelte
    │   └── HolographicControls.svelte
    ├── form/*.svelte             # Reusable form components
    └── panels/
        ├── ModifiersPanel.svelte  # Unified modifiers (all panels use this)
        └── *Panel.svelte          # Component property panels
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

## UI Components - shadcn-svelte

**Always prefer shadcn-svelte components for UI elements in the creator interface.**

Documentation entry point for LLMs: https://www.shadcn-svelte.com/llms.txt

### Available Components

The project uses these shadcn-svelte components:

| Component | Usage |
|-----------|-------|
| `Button` | Actions, form submissions |
| `Card` | Content containers |
| `Dialog` | Modals (HelpModal) |
| `Tooltip` | Help text (HelpTooltip) |
| `Collapsible` | Expandable panels |
| `Accordion` | Collapsible sections |
| `Select` | Dropdowns (NOT native `<select>`) |
| `Checkbox` | Boolean toggles |
| `Switch` | On/off toggles |
| `Slider` | Range inputs |
| `Input` | Text/number inputs |
| `Label` | Form labels |
| `Separator` | Visual dividers |
| `ScrollArea` | Custom scrollbars |
| `Badge` | Count indicators |
| `Drawer` | Mobile/tablet side panels |
| `Resizable` | PaneForge-based resizable panels |

### When Adding UI Elements

1. Check if shadcn-svelte has a component: https://www.shadcn-svelte.com/llms.txt
2. Install if needed: `pnpm dlx shadcn-svelte@latest add <component>`
3. Use the shadcn component instead of raw HTML elements

**Do NOT use:**
- Native `<select>` elements → Use `Select` component
- Native `<input type="checkbox">` → Use `Checkbox` component
- `overflow-auto` for scrolling → Use `ScrollArea` component
- Custom tooltip CSS → Use `Tooltip` component
- Custom modal/dialog CSS → Use `Dialog` component

### Form Wrapper Components

Located in `src/lib/creator/components/form/`:

| Component | Purpose |
|-----------|---------|
| `FormSlider` | Labeled slider with value display |
| `FormSelect` | Labeled select with shadcn Select |
| `FormCheckbox` | Labeled checkbox |
| `FormSwitch` | Labeled toggle switch |
| `FormInput` | Labeled text/number input |
| `FormColorPicker` | Labeled color picker |
| `FormFontSelect` | Font dropdown with live preview and on-demand loading |
| `FormGrid` | 2/3/4 column grid layout |

### Unified ModifiersPanel

All component panels use a single `ModifiersPanel` component that provides:
- **Clip Shape** - Mask component to any shape (universal)
- **Effect** - glow, strokeGlow, shadow, neon, innerGlow, lift, outline
- **Animation** - spin, pulse, bounce, shake, float, glow, ping, trace
- **Border** - Color, width, opacity, style modifier
- **Holographic** - Animated color-shift effect
- **Blend Mode** - multiply, screen, overlay, etc.

Use `showClipShape={false}`, `showBorder={false}`, etc. to hide specific sections.

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
| `/test/text-fitting` | Text fitting test page (FitText, components) |

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
