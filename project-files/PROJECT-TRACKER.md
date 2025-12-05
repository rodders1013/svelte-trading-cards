# svelte-trading-cards Project Tracker

**Last Updated:** 2025-12-05
**Current Progress:** ~93% (Beta ready)

---

## PHASE 1: CORE PACKAGE - COMPLETE

### MVP Foundation
- [x] FitText utilities (textFitting, textMeasure, FitText.svelte)
- [x] Enhanced FitText with inset, singleLine props for universal text fitting
- [x] Type definitions (CardData, CardTemplate, ComponentDefinition, ContainerContext)
- [x] ComponentRegistry with dynamic registration
- [x] CardCanvas renderer
- [x] ComponentRenderer (renders components from definitions)
- [x] Interactive demo page
- [x] svelte-check passing (0 errors)

### Group Architecture
- [x] Group component (container for nested components)
- [x] Container-aware component pattern
- [x] Recursive child rendering via ComponentRenderer
- [x] ContainerContext type (width, height, radius, clipShape, clipPoints)
- [x] CARD_WIDTH, CARD_HEIGHT, CARD_RADIUS constants
- [x] clipShape prop with predefined shapes (rect, circle, ellipse, hexagon, octagon, diamond, shield, star)
- [x] clipPoints support for custom polygons
- [x] clipContent toggle for enabling/disabling clipping

### Background Components
- [x] GradientBackground (container-aware, direction: vertical/horizontal/diagonal)
- [x] Image (container-aware, opacity, preserveAspectRatio modes)
- [x] PatternBackground (container-aware: dots, grid, diagonal, hexagons)

### Border Component
- [x] Border (unified, container-aware, shape-aware)
  - Base: color, width, opacity
  - Shape-aware: renders correct shape based on container.clipShape
  - Glow effect: color, intensity, blur, animated pulse
  - Holographic effect: dual-color animation with speed control
  - Multi-layer (mythic) effect: up to 5 layers with custom colors and spacing

### Data Model
- [x] Generic CardData type (Record<string, unknown>)
- [x] TypedCardData helper for type-safe access
- [x] CommonCardFields interface for convenience
- [x] Domain-agnostic (works for games, employees, products, etc.)

### Export System
- [x] Client-side SVG download (downloadSVG)
- [x] Client-side PNG download (downloadPNGClient)
- [x] SVG utilities (svgToDataURL, svgToBlob, serializeSVG)
- [x] Server-side SVG rendering (renderToSVGString)
- [x] Server-side image embedding (embedImages)
- [x] Server-side PNG conversion (svgToPNG)
- [x] Memory cleanup for high-volume rendering
- [x] Separate /server entry point (tree-shaking friendly)
- [x] Bundled resvg-js for server-side PNG (no peer deps needed)

### Field Components
- [x] TextField (container-aware, auto-fit with min/max range, vertical align)

---

## PHASE 2: VISUAL CREATOR - COMPLETE

### Creator Interface
- [x] Zone Hierarchy panel (left sidebar)
  - [x] Drag-to-reorder for z-axis control
  - [x] Visibility toggles (show/hide zones)
  - [x] Custom zone naming
  - [x] Move up/down buttons
  - [x] Component count badges
  - [x] Shape icons for zone types
  - [x] Collapsible child components view
- [x] Live canvas preview (center)
  - [x] Subtle selection overlay with corner indicators
  - [x] Click-to-select zones
  - [x] Proper SVG scaling
- [x] Properties panel (right sidebar)
  - [x] Zone properties (name, position, size, shape, radius, clipContent)
  - [x] Collapsible sections
- [x] Undo/Redo system
  - [x] Full history tracking
  - [x] Keyboard shortcuts (Cmd+Z, Cmd+Shift+Z)
- [x] Template save/load (JSON export/import)
- [x] Preview modes (field placeholders vs sample data)
- [x] Initial Card Background layer with gradient + border

### Component Property Panels
- [x] Text component
  - [x] Data field binding
  - [x] Font family selector
  - [x] Font size range (min/max with auto-fit)
  - [x] Font weight
  - [x] Horizontal alignment
  - [x] Vertical alignment
  - [x] Color picker
  - [x] Auto-fit info banner
  - [x] Animation panel
- [x] Image component
  - [x] Data field binding
  - [x] Fit mode (cover/contain/stretch)
  - [x] Opacity slider
  - [x] Animation panel
- [x] Background component (combined fill + pattern)
  - [x] Fill type (none/solid/gradient)
  - [x] Solid color picker with fill opacity
  - [x] Gradient direction (vertical/horizontal/diagonal)
  - [x] Two-color gradient picker with fill opacity
  - [x] Pattern overlay (none/dots/grid/diagonal/hexagons)
  - [x] Independent pattern color picker
  - [x] Separate pattern opacity slider
  - [x] Animation panel
- [x] Border component
  - [x] Color, width, opacity
  - [x] Glow effect (enable, color, blur, intensity, animate)
  - [x] Holographic effect (enable, secondary color, speed)
  - [x] Multi-layer borders (layers count, spacing)
  - [x] Animation panel

### Canvas Interaction
- [x] Drag-to-position on canvas
- [x] Resize handles on canvas
- [x] Copy/paste zones (Cmd+C, Cmd+V)
- [x] Grid overlay toggle
- [x] Zoom controls (50-200%)
- [x] Delete/Backspace to remove zones
- [x] Escape to deselect
- [x] Arrow keys to nudge position
- [x] Shift+drag to snap to grid
- [x] L to toggle lock, H to toggle visibility
- [x] Help modal with keyboard shortcuts

### Component Ordering & Visibility
- [x] Components stored as ordered array per zone
- [x] Components rendered in order (first = back, last = front)
- [x] Move up/down buttons on each component
- [x] Reorder for layering (e.g., image behind pattern overlay)
- [x] Individual component visibility toggle
- [x] Visibility controls in hierarchy (hover to show)
- [x] Hidden components skipped during render

### UI Polish
- [x] Sticky Zone Actions bar (Add Zone, Undo, Redo)
- [x] Larger, cleaner resize handles with hover effect
- [x] Resize handles hidden during drag/resize/undo/redo
- [x] Clean visibility icons (●/○) for zones and components
- [x] Improved text sizing throughout UI
- [x] White card canvas background
- [x] Styled Duplicate/Delete buttons

### Card Base Layer System - NEW
- [x] Dedicated Card Base layer (always at bottom, cannot delete/move)
- [x] Card Base covers full bleed area (-35,-35 to 785,1085)
- [x] Pre-populated components: Image (hidden), Background, Border
- [x] Components cannot be added/removed, only visibility toggled
- [x] Card Base locked on canvas (no drag/resize)
- [x] Special UI in hierarchy panel (lock icon, no reorder)
- [x] Info panel in properties (explains Card Base purpose)

### Bleed System for Print Export - NEW
- [x] 3mm bleed support (35px at 300 DPI)
- [x] Card Base layer extends to bleed automatically
- [x] Bleed preview overlay (toggle in canvas controls)
- [x] Export dialog with bleed options (0mm, 1mm, 2mm, 3mm)
- [x] SVG export with bleed support
- [x] PNG export with bleed support (+ resolution options)
- [x] `applyBleed()` function extends Card Base during export

### TopBar UI Reorganization - NEW
- [x] Full-width TopBar component
- [x] Template name input with Load/Save buttons
- [x] Auto-save draft indicator (cloud icon)
- [x] Dataset selector and Preview mode toggle
- [x] Card selector (when in data mode)
- [x] Export button opens export dialog
- [x] Canvas controls moved below TopBar (zoom, grid, bleed)

---

## PHASE 3: ADDITIONAL COMPONENTS

### Icon Component - COMPLETE
- [x] Icon component (container-aware, SVG rendering)
- [x] IconPicker for visual creator (Iconify API search)
- [x] Icon properties panel (color, size, rotation, flip horizontal/vertical)
- [x] 31 curated icon sets (~95k icons) - all free commercial use, no attribution
- [x] Icon sets include: UI icons, brand logos, emoji, flags, crypto, maps, weather
- [x] Licenses: MIT, Apache 2.0, ISC, CC0 1.0 only
- [x] Search persists when changing selection
- [x] Compact icon grid display

### Animation System - COMPLETE
- [x] Reusable CSS animation utility (AnimationWrapper component)
- [x] Animation presets: spin, pulse, bounce, shake, float, glow, ping, trace
- [x] Speed control: slow, normal, fast
- [x] Direction control for rotation animations (clockwise/counterclockwise)
- [x] Direction control for trace animation (clockwise/counterclockwise)
- [x] Easing options: linear, ease, ease-in, ease-out, ease-in-out
- [x] Pause control for animations
- [x] All components with animation support (Icon, TextField, Image, Border, GradientBackground, PatternBackground)
- [x] Animation panel in visual creator for all components (type, speed, direction, easing, pause)
- [x] CSS embedded in SVG `<defs>` for portability
- [x] Animated in preview and SVG export, static on PNG export
- [x] Trace animation: neon sign drawing effect using stroke-dasharray
  - Renders solid content + larger glowing traced layer
  - Multiple flowing segments with blur/glow filter
  - Slower speeds (18s/9s/4.5s for slow/normal/fast)

### Effects System - COMPLETE
- [x] Reusable SVG filter effects utility (EffectWrapper component)
- [x] Effect types: glow, shadow, neon, innerGlow, lift, outline
- [x] All effects support animation (pulsing) via existing animation system
- [x] Speed control for animated effects: slow, normal, fast
- [x] Effect-specific controls (color, blur, intensity, spread, offset, elevation, width)
- [x] All components with effect support (Icon, TextField, Image, Border, GradientBackground, PatternBackground)
- [x] EffectsControls panel for visual creator
- [x] Neon effect: multi-layer glow that overrides component color (white core + colored glow)
- [x] Neon color presets: Hot Pink, Electric Blue, Neon Green, Purple, Orange, Red, Yellow, Cyan
- [x] Real-time color picker updates (oninput instead of onchange)
- [x] Effects embedded in SVG via inline filters

### Presets System - COMPLETE
- [x] Dataset-based label presets (PlayStation, Xbox, Steam)
- [x] Shared label categories (Rarity, Status, Editions, General)
- [x] Helper functions (getLabelsForDataset, getLabelsByCategory, getCategoryDisplayName)
- [x] Integration with BadgePanel, StatPanelPanel, RibbonPanel
- [x] Dataset-aware dropdown menus in creator

### Fonts System - COMPLETE
- [x] 37+ web-safe fonts organized by category (sans-serif, serif, monospace, display, cursive)
- [x] Dataset-specific brand fonts (PlayStation Style, Xbox Style, Steam Style)
- [x] Helper functions (getAllFontsForDataset, getFontsByGroupForDataset, getWebSafeFonts)
- [x] Font dropdown integration in TextPanel, BadgePanel, RibbonPanel, ListPanel, StatPanelPanel
- [x] Legacy fontFamilies export for backwards compatibility
- [x] Fonts module exported from main index.ts

### Data Display Components
- [x] StatPanel (label/value rows with optional bars/icons, uses FitText for auto-scaling)
- [x] List (array data → bullet/numbered/dash/arrow list, uses FitText for items)
- [x] IconRating (star ratings, hearts, fire, skulls, etc. with half-value support and data binding)

### Decoration Components
- [x] Badge (universal badge: shapes, presets for rarity/status/labels, uses FitText)
- [x] Divider (decorative separators: lines, ornate, fading)
- [x] ProgressBar (visual stat bars, HP meters, power gauges)
- [x] Ribbon (banner/ribbon text overlays, uses FitText with corner-aware text area)
- [x] Frame (corner/edge decorations, flourishes)
- [x] GlowEffect (replaced by Effects System with glow, neon, shadow, etc.)

### SVG Patterns System - COMPLETE
- [x] 17 geometric patterns (dots, grid, diagonal, hexagons, triangles, squares, diamonds, chevrons, waves, circles, crosses, zigzag, checkered, stripes-h, stripes-v, confetti, stars)
- [x] Single icon pattern (any Iconify icon as repeating pattern)
- [x] Multi-icon pattern (multiple icons in sequence with row offset/stagger)
- [x] Pattern controls (size, spacing, rotation, stroke width)
- [x] Row offset for brick/staggered effect on multi-icon patterns

### Layer Features
- [ ] Blend modes support (multiply, screen, overlay)

### Removed from Scope
- ~~TitleField~~ - TextField already handles styled text with auto-fit
- ~~Emblem~~ - Icon component covers stars/crowns/shields/diamonds via Iconify
- ~~DetailRow~~ - Merged into StatPanel component
- ~~RarityBadge~~ - Replaced by universal Badge with rarity presets
- ~~Stamp~~ - Removed (poor implementation); Badge + Icon can cover edition marks

---

## PHASE 4: THEMING & STYLES

- [ ] Style preset system (pixel-art, modern, metallic, gothic, sports)
- [ ] applyStylePreset() function
- [ ] registerStylePreset() for custom themes

---

## PHASE 5: TESTING & DOCS

- [ ] Unit tests for components
- [ ] Integration tests for CardCanvas
- [ ] Documentation site (routes/docs/)
- [ ] Example templates gallery

---

## PHASE 6: PUBLISH

- [ ] Package build verification (npm run package)
- [x] README.md with usage examples
- [ ] Publish to npm

---

## Quick Stats

| Phase | Status | Progress |
|-------|--------|----------|
| Phase 1: Core Package | Complete | 28/28 |
| Phase 2: Visual Creator | Complete | 68/68 |
| Phase 3: Additional Components | In Progress | 38/39 |
| Phase 4: Theming | Not Started | 0/3 |
| Phase 5: Testing & Docs | Not Started | 0/4 |
| Phase 6: Publish | In Progress | 1/3 |
| **Total** | | **135/145 (~93%)** |

### Phase 3 Component Priority

| Priority | Component | Description | Complexity | Status |
|----------|-----------|-------------|------------|--------|
| 1 | Badge | Universal badge with shapes & presets | Medium | ✓ |
| 2 | StatPanel | Label/value rows with optional bars | Medium | ✓ |
| 3 | Divider | Decorative separators | Low | ✓ |
| 4 | ProgressBar | Visual stat bars, meters | Medium | ✓ |
| 5 | Ribbon | Banner/ribbon text overlays | Medium | ✓ |
| 6 | Frame | Corner/edge decorations | Medium | ✓ |
| 7 | Blend modes | multiply, screen, overlay support | Low | Pending |

---

## File Structure

```
src/lib/
├── index.ts                 # Main entry point
├── animations/
│   ├── index.ts            # Animation exports
│   ├── types.ts            # Animation types & schemas
│   ├── presets.ts          # Animation presets (spin, pulse, bounce, etc.)
│   ├── styles.ts           # CSS keyframes & classes for SVG injection
│   └── AnimationWrapper.svelte # Wrapper component for animated SVG elements
├── effects/
│   ├── index.ts            # Effect exports
│   ├── types.ts            # Effect types & schemas (glow, shadow, neon, etc.)
│   ├── presets.ts          # Effect presets & color options
│   └── EffectWrapper.svelte # Wrapper component for SVG filter effects
├── fonts/
│   ├── index.ts            # Fonts exports & helpers
│   ├── web-safe.ts         # 37+ web-safe fonts by category
│   └── brand-fonts.ts      # Dataset-specific brand fonts
├── core/
│   ├── index.ts            # Core exports
│   ├── CardCanvas.svelte   # Main renderer
│   ├── ComponentRenderer.svelte # Renders component definitions
│   ├── Group.svelte        # Container with clipShape support
│   └── ComponentRegistry.ts # Dynamic registration
├── components/
│   ├── backgrounds/
│   │   ├── index.ts
│   │   ├── GradientBackground.svelte
│   │   ├── Image.svelte
│   │   └── PatternBackground.svelte
│   ├── borders/
│   │   ├── index.ts
│   │   └── Border.svelte
│   ├── decorations/
│   │   ├── index.ts
│   │   ├── Badge.svelte          # Universal badge with shapes/presets
│   │   ├── Divider.svelte        # Decorative separators
│   │   ├── ProgressBar.svelte    # Visual stat bars
│   │   ├── Ribbon.svelte         # Banner/ribbon overlays
│   │   ├── Frame.svelte          # Corner/edge decorations
│   │   └── IconRating.svelte     # Star ratings, hearts, etc.
│   ├── fields/
│   │   ├── index.ts
│   │   ├── TextField.svelte
│   │   ├── StatPanel.svelte      # Label/value rows with bars
│   │   └── List.svelte           # Array data → bullet/numbered list
│   └── icons/
│       ├── index.ts
│       ├── Icon.svelte           # Iconify SVG icon renderer
│       └── IconPicker.svelte     # Search/browse/select UI
├── export/
│   ├── index.ts
│   └── downloadSVG.ts
├── server/
│   ├── index.ts
│   ├── render.ts
│   ├── embedImages.ts
│   └── svgToPNG.ts
├── types/
│   ├── index.ts
│   ├── CardData.ts
│   └── CardTemplate.ts
└── utils/
    ├── index.ts
    ├── FitText.svelte
    ├── textFitting.ts
    └── textMeasure.ts

src/lib/creator/               # Embeddable CardCreator component
├── index.ts                   # Creator exports
├── types.ts                   # Type definitions (ContainerState, ComponentItem, etc.)
├── state.svelte.ts            # Factory functions & helpers (includes bleed constants)
├── CardCreator.svelte         # Main creator component (~1300 lines)
└── components/
    ├── TopBar.svelte               # Top bar (template name, save/load, export, dataset)
    ├── HierarchyPanel.svelte       # Left sidebar (zone list, drag-reorder)
    ├── CanvasControls.svelte       # Zoom, grid, bleed toggle
    ├── CanvasPreview.svelte        # Live canvas with selection overlays + bleed preview
    ├── PropertiesPanel.svelte      # Right sidebar wrapper
    ├── ComponentPanel.svelte       # Component panel with visibility toggle
    ├── ZoneProperties.svelte       # Zone position/size/shape settings
    ├── AddLayerPopover.svelte      # Add layer popover with templates
    ├── AddComponentPopover.svelte  # Add component popover
    ├── AnimationControls.svelte    # Reusable animation panel
    ├── EffectsControls.svelte      # Reusable effects panel
    ├── HelpModal.svelte            # Keyboard shortcuts modal
    ├── HelpTooltip.svelte          # Help text tooltips
    ├── FieldRemapDialog.svelte     # Dataset field remapping
    ├── RestoreDraftDialog.svelte   # Draft restoration dialog
    ├── ExportDialog.svelte         # Export dialog with bleed options
    ├── form/                       # Reusable form components (shadcn-based)
    │   ├── index.ts               # Form component exports
    │   ├── FormSlider.svelte      # Label + Slider with value display
    │   ├── FormSelect.svelte      # Label + Select
    │   ├── FormCheckbox.svelte    # Label + Checkbox
    │   ├── FormSwitch.svelte      # Label + Switch
    │   ├── FormInput.svelte       # Label + Input (text/number)
    │   ├── FormColorPicker.svelte # Label + color input
    │   ├── FormGrid.svelte        # Grid layout (2/3/4 columns)
    │   └── PanelEffects.svelte    # Shared effects section footer
    └── panels/
        ├── TextPanel.svelte        # Text component properties
        ├── ImagePanel.svelte       # Image component properties
        ├── BackgroundPanel.svelte  # Background component properties
        ├── BorderPanel.svelte      # Border component properties
        ├── IconPanel.svelte        # Icon component properties
        ├── BadgePanel.svelte       # Badge component properties
        ├── DividerPanel.svelte     # Divider component properties
        ├── ProgressBarPanel.svelte # Progress bar component properties
        ├── RibbonPanel.svelte      # Ribbon component properties
        ├── FramePanel.svelte       # Frame component properties
        ├── IconRatingPanel.svelte  # Icon rating component properties
        ├── ListPanel.svelte        # List component properties
        └── StatPanelPanel.svelte   # Stat panel component properties

src/routes/
├── +page.svelte               # Demo/gallery page
├── creator/
│   └── +page.svelte           # Simple wrapper that uses CardCreator
└── test/
    └── text-fitting/
        └── +page.svelte       # Text fitting test page (FitText, StatPanel, List, Badge, Ribbon)
```

---

## Notes

- **Dev server:** `npm run dev` (http://localhost:5173)
- **Creator:** http://localhost:5173/creator
- **Text Fitting Test:** http://localhost:5173/test/text-fitting
- **Type check:** `npm run check` (0 errors)
- **Generic data:** CardData is `Record<string, unknown>` - works for any domain

### shadcn-svelte Components

The creator uses shadcn-svelte components for consistent UI. Reference: https://www.shadcn-svelte.com/llms.txt

**Core Components:**
- `Button`, `Card`, `Separator` - Basic UI building blocks
- `Dialog` - Modals (HelpModal)
- `Tooltip` - Help text tooltips (HelpTooltip)
- `Collapsible` - Expandable panels (HierarchyPanel, PropertiesPanel, ComponentPanel)
- `Select` - Rich dropdowns with animations (replaced all native `<select>`)
- `Checkbox` - Styled checkboxes (replaced all native checkboxes)
- `Switch` - Toggle switches
- `Slider` - Range inputs
- `Input`, `Label` - Form inputs
- `ScrollArea` - Custom scrollbars (PropertiesPanel, JSON preview)
- `Badge` - Count indicators

**Custom form wrapper components** in `src/routes/creator/components/form/`:
- `FormSlider` - Labeled slider with value display (percent or suffix)
- `FormSelect` - Labeled select using shadcn Select component
- `FormCheckbox` - Labeled checkbox
- `FormSwitch` - Labeled toggle switch
- `FormInput` - Labeled text/number input
- `FormColorPicker` - Labeled color picker
- `FormGrid` - 2/3/4 column grid layout
- `PanelEffects` - Shared effects section footer (eliminates 12x duplication)
