# Card Display & Gallery Implementation

> **Branch:** `feature/card-display-gallery`
> **Status:** Complete - All features working

---

## What Was Implemented

### 1. Display System (`src/lib/display/`)

**Files Created:**
- `types.ts` - Rarity, DisplaySettings, CardProps, FlippableCardProps types
- `presets.ts` - Rarity presets mapping to hover-tilt settings
- `Card.svelte` - Main interactive card component using hover-tilt
- `index.ts` - Exports

**Rarity Presets:**
| Rarity | glareIntensity | shadow | shadowBlur | glareMask | blendMode |
|--------|----------------|--------|------------|-----------|-----------|
| common | 0 | false | - | - | - |
| uncommon | 0 | true | 10 | - | - |
| rare | 0.3 | true | 15 | - | overlay |
| epic | 0.5 | true | 20 | foil | overlay |
| legendary | 0.7 | true | 25 | holo | overlay |
| mythic | 1.0 | true | 30 | rainbow | color-dodge |

**Fixed Settings (all cards):**
```typescript
FIXED_TILT_SETTINGS = {
  tiltFactor: 0.5,
  scaleFactor: 1.02,
  springOptions: { stiffness: 0.15, damping: 0.5 }
}
```

**Glare Masks (CSS Gradients - no external images):**
- `foil` - Diagonal metallic stripes
- `holo` - Horizontal rainbow bands
- `sparkle` - Scattered radial dots
- `prism` - Angular conic gradient
- `rainbow` - No mask (full glare coverage)

### 2. Gallery Components (`src/lib/gallery/`)

**Files Created:**
- `types.ts` - CardGrid, CardCarousel, CardRow, CardModal prop types
- `CardGrid.svelte` - CSS Grid layout with responsive columns
- `CardCarousel.svelte` - Horizontal scroll carousel with navigation
- `CardRow.svelte` - Overlapping card row with hover-to-expand effect
- `CardModal.svelte` - Full-size card modal/lightbox
- `utils/keyboard.ts` - Keyboard navigation helper
- `index.ts` - Exports

**CardRow Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| cardWidth | number | 280 | Width of each card in pixels |
| visibleWidth | number | 80 | Visible width of overlapped cards |
| hoverScale | number | 1.08 | Scale factor on hover |
| transitionDuration | number | 0.5 | Animation duration in seconds |
| onCardHover | function | - | Callback when card is hovered |
| onCardLeave | function | - | Callback when mouse leaves |

### 3. CardTemplate Schema Update

**Modified:** `src/lib/types/CardTemplate.ts`

Added `display` property:
```typescript
interface CardTemplate {
  name: string;
  components: ComponentDefinition[];
  display?: {
    rarity?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';
    customGradient?: string;
  };
}
```

### 4. Creator Integration

**Modified:**
- `src/lib/creator/state.svelte.ts` - Added `buildTemplateWithDisplay()` function
- `src/lib/creator/components/layout/TopBar.svelte` - Added Rarity dropdown, Effects toggle, Glare editor
- `src/lib/creator/CardCreator.svelte` - Added display settings state, passes to TopBar
- `src/lib/creator/components/CanvasPreview.svelte` - Added DisplayCard rendering for effects preview
- `src/lib/creator/components/controls/GlareGradientEditor.svelte` - **NEW** Custom gradient editor

**TopBar now has:**
- Rarity dropdown (sparkles icon) that saves to template JSON
- Effects toggle (eye icon) to preview hover effects in Creator canvas
- Glare Gradient editor (palette icon) with presets and custom color pickers

**GlareGradientEditor Features:**
- 8 presets: Default, Gold, Silver, Rainbow, Emerald, Ruby, Sapphire, Amethyst
- Custom color pickers for Highlight, Mid, and Shadow colors
- Intensity slider (10% - 100%)
- Live preview of the gradient
- Reset to default button

### 5. Package.json Updates

Added exports:
```json
{
  "exports": {
    "./display": {
      "types": "./dist/display/index.d.ts",
      "svelte": "./dist/display/index.js"
    },
    "./gallery": {
      "types": "./dist/gallery/index.d.ts",
      "svelte": "./dist/gallery/index.js"
    }
  }
}
```

Added dependency: `hover-tilt: ^1.0.0`

### 6. CSS Integration

**Modified:** `src/routes/layout.css`

Added hover-tilt styles in `@layer components`:
- Container perspective (600px)
- Tilt transform with CSS variables
- Glare `::before` pseudo-element with gradient
- Shadow with colored glow (works on dark backgrounds)
- Glare mask support via CSS mask-image

**Key Fix:** hover-tilt uses `@layer components` which conflicts with Tailwind v4's layer system. The styles are now manually added to layout.css.

### 7. Test Pages

**Created:** `src/routes/test/display/+page.svelte`
- Template file upload (JSON)
- Single card with selectable rarity
- Grid of all rarity levels
- Card carousel
- Card modal on click
- Flip functionality

**Updated:** `src/routes/gallery/+page.svelte`
- Template file upload
- Data source selection (Xbox, PlayStation, Steam)
- Rarity selection dropdown
- Enable/disable hover effects toggle
- Cards with tilt, glare, shadow, and mask effects
- Overflow-visible containers with hover z-index handling

---

## Issues Resolved

### Issue 1: No Hover Effects Showing
**Cause:** hover-tilt's CSS uses `@layer components` which wasn't being bundled with Tailwind v4.
**Fix:** Added hover-tilt CSS directly to `layout.css` in `@layer components`.

### Issue 2: Shadow Not Visible on Dark Backgrounds
**Cause:** Default shadow used pure black `lch(0% 0 0)`.
**Fix:** Changed to colored glow shadow using `--hover-tilt-glare-hue` variable.

### Issue 3: Glare Masks Not Showing
**Cause:** Template referenced image files (`/masks/*.webp`) that didn't exist.
**Fix:** Replaced with CSS gradient-based masks - no external images needed.

### Issue 4: Glare Visible During Flip Animation
**Cause:** The `::before` glare element doesn't participate in 3D transforms.
**Fix:** Added `isAnimating` state and CSS to hide glare during flip animation.

### Issue 5: Cards Clipped When Hovering
**Cause:** Container had `overflow-hidden` and no padding for scale effect.
**Fix:** Changed to `overflow-visible`, added padding, hover z-index for stacking.

### Issue 6: Creator Preview Effects Not Working
**Cause:** Selection overlay and grid rendering on top of DisplayCard, blocking hover interactions.
**Fix:** Hide grid and selection overlay when effects preview is enabled.

### Issue 7: Card Corners Square When Effects Enabled
**Cause:** Card content not clipped to border-radius.
**Fix:** Added `overflow: hidden` to `.hover-tilt` class.

### Issue 8: Custom Gradient Not Applying
**Cause:** CSS variable `--hover-tilt-custom-gradient` not reaching the HoverTilt component.
**Fix:** Pass the CSS variable via HoverTilt's `style` prop to set it on the container.

---

## Files Changed

| File | Action |
|------|--------|
| `src/lib/display/types.ts` | CREATE |
| `src/lib/display/presets.ts` | CREATE |
| `src/lib/display/Card.svelte` | CREATE |
| `src/lib/display/index.ts` | CREATE |
| `src/lib/gallery/types.ts` | CREATE |
| `src/lib/gallery/CardGrid.svelte` | CREATE |
| `src/lib/gallery/CardCarousel.svelte` | CREATE |
| `src/lib/gallery/CardModal.svelte` | CREATE |
| `src/lib/gallery/utils/keyboard.ts` | CREATE |
| `src/lib/gallery/CardRow.svelte` | CREATE - overlapping card row component |
| `src/lib/gallery/utils/index.ts` | CREATE |
| `src/lib/gallery/index.ts` | CREATE |
| `src/lib/types/CardTemplate.ts` | MODIFY - added display settings |
| `src/lib/creator/state.svelte.ts` | MODIFY - added buildTemplateWithDisplay |
| `src/lib/creator/components/layout/TopBar.svelte` | MODIFY - added rarity dropdown, effects toggle, glare editor |
| `src/lib/creator/components/controls/GlareGradientEditor.svelte` | CREATE - custom gradient editor with presets |
| `src/lib/creator/components/CanvasPreview.svelte` | MODIFY - added DisplayCard for effects preview |
| `src/lib/creator/CardCreator.svelte` | MODIFY - added display state, effects preview |
| `src/routes/test/display/+page.svelte` | CREATE |
| `src/routes/gallery/+page.svelte` | MODIFY - added display effects |
| `src/routes/layout.css` | MODIFY - added hover-tilt CSS |
| `package.json` | MODIFY - added exports + hover-tilt dep |

---

## Usage

```svelte
<script>
  import { Card } from 'svelte-trading-cards/display';
  import { CardGrid } from 'svelte-trading-cards/gallery';
</script>

<!-- Basic card with rarity from template -->
<Card {template} {data} />

<!-- Override rarity -->
<Card {template} {data} rarity="legendary" />

<!-- With flip -->
<Card {template} {data} backTemplate={back} flipOnClick />

<!-- Disable effects (static card) -->
<Card {template} {data} disabled />

<!-- In a grid -->
<CardGrid minCardWidth={280}>
  {#each cards as card}
    <Card {template} data={card} />
  {/each}
</CardGrid>

<!-- Overlapping card row -->
<CardRow cardWidth={250} visibleWidth={70}>
  {#snippet children(ctx)}
    {#each cards as card, i}
      <div
        class="card-row-item"
        style:transform={ctx.getTransform(i)}
        style:z-index={ctx.getZIndex(i)}
        onmouseenter={() => ctx.onHover(i)}
        onmouseleave={ctx.onLeave}
      >
        <div class="w-[250px]">
          <Card {template} data={card} />
        </div>
      </div>
    {/each}
  {/snippet}
</CardRow>

<!-- With custom gradient (set in template.display.customGradient) -->
<!-- The gradient follows hover-tilt's CSS variable format -->
```
Template JSON example with custom gradient:
```json
{
  "name": "My Card",
  "components": [...],
  "display": {
    "rarity": "legendary",
    "customGradient": "radial-gradient(farthest-corner circle at var(--gradient-x) var(--gradient-y), #fff9e6b3 8%, #ffd70086 28%, #8b691447 90%)"
  }
}
```

---

## Test URLs

- **Display Test:** http://localhost:5173/test/display
- **Gallery:** http://localhost:5173/gallery

---

## Reference

**Hover-Tilt Documentation:** https://hover-tilt.simey.me/
**Import Path:** `import HoverTilt from 'hover-tilt/HoverTilt.svelte'` (source import for correct CSS scoping)
