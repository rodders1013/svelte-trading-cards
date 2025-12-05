# svelte-trading-cards Specification

**Package:** `svelte-trading-cards`
**Version:** 0.1.0
**Last Updated:** 2025-12-05
**Status:** In Development (~93% complete)

---

## Table of Contents

1. [Overview](#overview)
2. [Technology Stack](#technology-stack)
3. [Architecture](#architecture)
4. [Components](#components)
5. [Animation System](#animation-system)
6. [Effects System](#effects-system)
7. [Fonts System](#fonts-system)
8. [Visual Creator](#visual-creator)
9. [Type System](#type-system)
10. [Export System](#export-system)
11. [Extensibility](#extensibility)

---

## Overview

A Svelte 5 component library for building animated trading cards with a visual creator interface. Build professional cards by composing pre-built SVG components - like Photoshop layers for cards.

### Key Features

- **Component-Based:** Pre-built, reusable card components (backgrounds, borders, text fields)
- **Group Architecture:** Container-based positioning with shape clipping (circle, hexagon, shield, etc.)
- **Visual Creator:** Zone-based template builder with hierarchy panel and property controls
- **Auto-Fit Text:** Text automatically scales between min/max sizes to fit containers
- **Animation System:** CSS animations including trace (neon sign drawing effect)
- **Effects System:** SVG filter effects (glow, shadow, neon, innerGlow, lift, outline)
- **Generic Data Model:** Domain-agnostic - works for games, employees, products, anything
- **Client-Side Export:** SVG/PNG download directly from browser
- **Server-Side Export:** Trusted PNG rendering with resvg-js (pixel-perfect)
- **Type-Safe:** Full TypeScript + Zod v4 validation

### Card Dimensions

All cards use standard trading card dimensions:

| Property | Value |
|----------|-------|
| Width | 750px |
| Height | 1050px |
| ViewBox | `0 0 750 1050` |
| Corner Radius | 26px |
| Physical | 2.5" x 3.5" at 300 DPI |

### Bleed for Print

For professional printing, cards support bleed areas that extend beyond the trim line:

| Property | Value |
|----------|-------|
| Max Bleed | 3mm (35px at 300 DPI) |
| Bleed Width | 820px (750 + 35*2) |
| Bleed Height | 1120px (1050 + 35*2) |
| Card Base Position | -35, -35 |
| Pixels per mm | 11.811 |

The Card Base layer automatically covers the bleed area. When exporting with bleed, the canvas expands and the Card Base fills the extended area.

---

## Technology Stack

| Package | Version | Purpose |
|---------|---------|---------|
| Svelte | 5.x | UI framework (runes: `$state`, `$derived`, `$props`, `$effect`) |
| SvelteKit | 2.x | Library packaging via `@sveltejs/package` |
| Tailwind CSS | 4.x | CSS-first configuration with `@plugin` directive |
| Zod | 4.x | Runtime validation |
| Iconify | - | Icons via CSS classes (`icon-[set--name]`) |
| shadcn-svelte | - | UI components for creator interface (https://www.shadcn-svelte.com/llms.txt) |

---

## Architecture

```
src/lib/
├── index.ts                 # Main entry point (client exports)
├── animations/              # Animation system (spin, pulse, trace, etc.)
├── effects/                 # Effects system (glow, shadow, neon, etc.)
├── fonts/                   # Fonts system (web-safe + brand fonts)
├── core/
│   ├── CardCanvas.svelte    # Main renderer - creates root container
│   ├── ComponentRenderer.svelte # Renders components from definitions
│   ├── Group.svelte         # Container for nested components
│   └── ComponentRegistry.ts # Maps component names to implementations
├── components/
│   ├── backgrounds/         # GradientBackground, Image, PatternBackground
│   ├── borders/             # Border (unified with composable effects)
│   ├── decorations/         # Badge, Divider, ProgressBar, Ribbon, Frame
│   ├── fields/              # TextField, StatPanel, List
│   └── icons/               # Icon, IconPicker (Iconify integration)
├── presets/                 # Dataset-based label presets
├── export/                  # Client-side export utilities
├── server/                  # Server-side utilities (separate entry point)
├── utils/                   # FitText, text measurement
└── types/                   # TypeScript types

src/routes/
├── +page.svelte             # Demo/gallery page
└── creator/
    ├── +page.svelte         # Main orchestrator (~800 lines)
    ├── types.ts             # Type definitions
    ├── state.svelte.ts      # Factory functions & helpers
    └── components/          # Modular UI components
        ├── HierarchyPanel.svelte
        ├── CanvasControls.svelte
        ├── CanvasPreview.svelte
        ├── PropertiesPanel.svelte
        ├── ZoneProperties.svelte
        ├── AnimationControls.svelte
        ├── EffectsControls.svelte
        ├── HelpModal.svelte
        └── panels/          # Component property panels
            ├── TextPanel.svelte
            ├── ImagePanel.svelte
            ├── BackgroundPanel.svelte
            ├── BorderPanel.svelte
            └── IconPanel.svelte
```

### Design Principles

1. **Group-Based Architecture** - Position and compose elements with Groups
2. **Container-Aware Components** - Components fill their parent container
3. **Zone Hierarchy** - Visual creator uses zones (Groups) as the organizing unit
4. **Auto-Fit Text** - Text scales within min/max bounds to fit containers
5. **Composition over Configuration** - Build cards by nesting Groups
6. **Generic Data Model** - No domain-specific fields, works for any use case

---

## Components

### Core

| Component | Description |
|-----------|-------------|
| CardCanvas | Main renderer, creates 750x1050 SVG canvas |
| ComponentRenderer | Renders components from template definitions |
| Group | Container with position, size, and clipShape support |
| FitText | Universal auto-sizing text with binary search algorithm, inset/padding support, single-line mode |

### Backgrounds

| Component | Props |
|-----------|-------|
| GradientBackground | `colors[]`, `opacity`, `direction` (vertical/horizontal/diagonal) |
| Image | `imageUrl`, `dataField`, `opacity`, `preserveAspectRatio` |
| PatternBackground | `pattern` (dots/grid/diagonal/hexagons), `color`, `opacity`, `size` |

### Border

Single unified border component with composable effects:

```typescript
{
  type: 'Border',
  props: {
    color: '#ffffff',
    width: 8,
    opacity: 1,
    // Optional effects
    glow: {
      enabled: true,
      color: '#3b82f6',
      intensity: 0.5,
      blur: 10,
      animated: true,
      speed: 2
    },
    holographic: {
      enabled: true,
      secondaryColor: '#ec4899',
      speed: 3
    },
    layers: 3,
    layerColors: ['#gold', '#silver', '#bronze'],
    layerSpacing: 4
  }
}
```

### TextField

Auto-fitting text field with min/max size range:

```typescript
{
  type: 'TextField',
  props: {
    dataField: 'title',        // or text: 'Static text'
    maxFontSize: 48,           // Maximum font size
    minFontSize: 12,           // Minimum (text scales to fit)
    fontFamily: 'Arial, sans-serif',
    fontWeight: 'bold',
    color: '#ffffff',
    alignment: 'center',       // left, center, right
    verticalAlign: 'center'    // top, center, bottom
  }
}
```

### Icon

SVG icons from Iconify with ~95,000 icons across 31 curated sets (all free for commercial use, no attribution required):

```typescript
{
  type: 'Icon',
  props: {
    iconData: {
      body: '<path d="M12 2L15.09..." fill="currentColor"/>',
      width: 24,
      height: 24
    },
    iconName: 'mdi:star',      // Reference only
    color: '#fbbf24',
    size: 64,                  // Optional, auto-fits container if omitted
    opacity: 1,
    rotation: 0,               // Degrees (0-360)
    flipHorizontal: false,
    flipVertical: false,
    animation: {               // Optional animation
      type: 'spin',
      speed: 'normal',
      direction: 'clockwise'
    }
  }
}
```

**Icon Sets (Licenses: MIT, Apache 2.0, ISC, CC0 1.0):**

| Category | Sets | Icons |
|----------|------|-------|
| General UI | Fluent, Material, Phosphor, Tabler, etc. | ~75k |
| Brands/Logos | Simple Icons, SVG Logos, CoreUI Brands | ~7k |
| Emoji | Noto Emoji, Fluent Emoji | ~6.7k |
| Flags | Circle Flags, Flag Icons, CoreUI Flags | ~1.4k |
| Crypto | Cryptocurrency Icons (color & mono) | ~960 |
| Maps/Weather | Maki, Temaki, Meteocons | ~1k |

### Group (Container)

Groups position and contain child components:

```typescript
{
  type: 'Group',
  props: {
    x: 100,
    y: 100,
    width: 200,
    height: 200,
    radius: 20,                // Corner radius (rect only)
    clipShape: 'circle',       // rect, circle, ellipse, hexagon, octagon, diamond, shield, star, polygon
    clipContent: true,         // Enable/disable clipping
    clipPoints: [...]          // For custom polygon shapes
  },
  children: [...]
}
```

**Available clipShapes:** rect, circle, ellipse, hexagon, octagon, diamond, shield, star, polygon

### Badge (Planned)

Universal badge component with shapes and style presets:

```typescript
{
  type: 'Badge',
  props: {
    text: 'LEGENDARY',
    shape: 'pill',             // pill, square, diamond, hexagon, shield, star
    preset: 'legendary',       // Rarity: common, rare, epic, legendary, mythic
                               // Status: verified, new, sold, limited, promo
    backgroundColor: '#fbbf24',
    textColor: '#000000',
    borderColor: '#ffffff',
    icon: { ... },             // Optional icon
    size: 'md'                 // sm, md, lg
  }
}
```

### StatPanel (Planned)

Label/value rows for displaying card statistics:

```typescript
{
  type: 'StatPanel',
  props: {
    rows: [
      { label: 'Attack', value: 500, showBar: true, barColor: '#ef4444' },
      { label: 'Defense', value: 350, showBar: true, barColor: '#3b82f6' },
      { label: 'Type', value: 'Fire', showBar: false }
    ],
    labelColor: '#888888',
    valueColor: '#ffffff',
    divider: true,             // Show dividers between rows
    compact: false             // Compact or spacious layout
  }
}
```

### Divider (Planned)

Decorative separators between card sections:

```typescript
{
  type: 'Divider',
  props: {
    style: 'solid',            // solid, dashed, dotted, gradient, ornate
    color: '#ffffff',
    thickness: 2,
    fade: 'both',              // none, left, right, both (gradient fade)
    ornament: 'diamond'        // Optional: diamond, star, circle (center ornament)
  }
}
```

### ProgressBar (Planned)

Visual stat bars and meters:

```typescript
{
  type: 'ProgressBar',
  props: {
    value: 75,                 // Current value (0-100 or custom max)
    max: 100,
    color: '#22c55e',
    backgroundColor: '#374151',
    showLabel: true,           // Show value text
    labelPosition: 'right',    // left, center, right, inside
    style: 'rounded',          // rounded, square, pointed
    animated: true,            // Animate on load
    segments: 0                // 0 = smooth, >0 = segmented bar
  }
}
```

### Ribbon (Planned)

Banner/ribbon text overlays:

```typescript
{
  type: 'Ribbon',
  props: {
    text: 'LIMITED EDITION',
    position: 'top-right',     // top-left, top-right, bottom-left, bottom-right
    color: '#ef4444',
    textColor: '#ffffff',
    style: 'folded',           // flat, folded, bookmark
    angle: 45                  // Rotation angle for corner ribbons
  }
}
```

### Frame (Planned)

Corner and edge decorations:

```typescript
{
  type: 'Frame',
  props: {
    style: 'ornate',           // simple, ornate, art-deco, celtic, tribal
    corners: true,             // Show corner decorations
    edges: false,              // Show edge decorations
    color: '#fbbf24',
    opacity: 1,
    size: 'md'                 // sm, md, lg (decoration size)
  }
}
```

### IconRating

Icon-based rating display with half-value support:

```typescript
{
  type: 'IconRating',
  props: {
    // Value source
    dataField: 'userRating',       // Bind to data field
    value: 4.5,                    // Or static value
    max: 5,                        // Number of icons to show
    sourceMax: 100,                // Optional: scale values (e.g., 47/100 → 2.35/5)

    // Icon selection
    iconPreset: 'star',            // star, heart, fire, thumbs-up, lightning,
                                   // trophy, diamond, circle, pepper, skull, custom
    customIcon: { ... },           // When iconPreset === 'custom'

    // Colors
    filledColor: '#fbbf24',        // Gold
    emptyColor: '#374151',         // Gray
    useEmptyOpacity: false,        // Use opacity instead of color for empty
    emptyOpacity: 0.3,

    // Layout
    size: 24,                      // Icon size in px
    gap: 4,                        // Space between icons
    allowHalf: true,               // Show half-filled icons

    // Value display
    showValue: false,
    valuePosition: 'right',        // left, right
    valueFormat: 'decimal',        // decimal (4.5), fraction (4.5/5), percent (90%)
    valueFontSize: 14,
    valueFontFamily: 'Arial, sans-serif',
    valueColor: '#ffffff',

    opacity: 1,
    effect: { ... }                // Optional effect
  }
}
```

**Preset Icons:**
| Icon | ID | Use Case |
|------|----|----------|
| ★ | star | Ratings, reviews |
| ♥ | heart | Favorites, health |
| 🔥 | fire | Hotness, trending |
| 👍 | thumbs-up | Approval, likes |
| ⚡ | lightning | Speed, power |
| 🏆 | trophy | Achievement level |
| 💎 | diamond | Quality, rarity |
| ● | circle | Generic dots |
| 🌶️ | pepper | Spiciness |
| 💀 | skull | Difficulty |

**Source Max Scaling:**
When data values use a different scale than your icon count, use `sourceMax`:
- Data: 47/100, Icons: 5, sourceMax: 100
- Result: 47/100 × 5 = 2.35 stars (displays ★★☆☆☆ with half)

---

## Animation System

All visual components support CSS animations that are embedded directly in the SVG for portability.

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     CardCanvas                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ <defs>                                               │   │
│  │   <style>                                            │   │
│  │     /* All keyframes and animation classes */        │   │
│  │     @keyframes tc-spin { ... }                       │   │
│  │     @keyframes tc-pulse { ... }                      │   │
│  │     .tc-spin { animation: tc-spin ... }              │   │
│  │   </style>                                           │   │
│  │ </defs>                                              │   │
│  │                                                       │   │
│  │ <AnimationWrapper animation={config}>                 │   │
│  │   <g class="tc-animated tc-spin"                      │   │
│  │      style="--tc-duration: 1.5s; ...">               │   │
│  │     <Component ... />                                 │   │
│  │   </g>                                               │   │
│  │ </AnimationWrapper>                                   │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Animation Config

```typescript
interface AnimationConfig {
  type: 'none' | 'spin' | 'pulse' | 'bounce' | 'shake' | 'float' | 'glow' | 'ping' | 'trace';
  speed: 'slow' | 'normal' | 'fast';      // 3s, 1.5s, 0.75s (trace: 18s, 9s, 4.5s)
  direction: 'clockwise' | 'counterclockwise';  // spin & trace only
  easing: 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';
  delay: number;                           // seconds
  iterationCount: number | 'infinite';
  paused: boolean;
}
```

### Available Animations

| Animation | Description | Best For |
|-----------|-------------|----------|
| `spin` | Continuous rotation | Icons, loading indicators |
| `pulse` | Scale up and down | Attention, heartbeat effects |
| `bounce` | Vertical movement | Playful elements |
| `shake` | Horizontal shake | Alerts, errors |
| `float` | Gentle floating | Dreamy, ambient effects |
| `glow` | Pulsing opacity | Ethereal, mystical elements |
| `ping` | Scale + fade out | Notifications, highlights |
| `trace` | Neon sign drawing effect | Borders, stroked elements |

### Trace Animation

The `trace` animation creates a neon sign drawing effect using stroke-dasharray:

- Renders the solid content underneath
- Adds a larger glowing traced layer on top with blur filter
- Multiple flowing segments animate around the stroke
- Best used on borders and stroked elements
- Slower speeds: slow=18s, normal=9s, fast=4.5s
- Supports direction control (clockwise/counterclockwise)

### Components with Animation Support

All visual components accept the optional `animation` prop:

- **Icon** - Animated icons (spinning stars, pulsing hearts)
- **TextField** - Animated text (bouncing titles)
- **Image** - Animated images (floating portraits)
- **Border** - Animated borders (pulsing frames)
- **GradientBackground** - Animated backgrounds
- **PatternBackground** - Animated patterns

### Export Behavior

| Export Type | Animation Behavior |
|-------------|-------------------|
| Preview (browser) | Animations play |
| SVG export | Animations embedded and play |
| PNG export (client) | Static snapshot |
| PNG export (server) | Static snapshot |

### Key Files

| File | Purpose |
|------|---------|
| `src/lib/animations/types.ts` | Animation types & Zod schemas |
| `src/lib/animations/presets.ts` | Animation options for UI |
| `src/lib/animations/styles.ts` | CSS keyframes & classes |
| `src/lib/animations/AnimationWrapper.svelte` | Wrapper component |
| `src/lib/core/CardCanvas.svelte` | Injects CSS into SVG `<defs>` |

---

## Effects System

All visual components support SVG filter-based effects that can be combined with animations.

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Component                                │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ <EffectWrapper effect={config}>                      │   │
│  │   <defs>                                             │   │
│  │     <filter id="effect-glow-xyz">...</filter>        │   │
│  │   </defs>                                            │   │
│  │   <g filter="url(#effect-glow-xyz)">                 │   │
│  │     <AnimationWrapper>                               │   │
│  │       <Content ... />                                │   │
│  │     </AnimationWrapper>                              │   │
│  │   </g>                                               │   │
│  │ </EffectWrapper>                                     │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Effect Config

```typescript
type EffectConfig =
  | { type: 'glow'; color: string; blur: number; intensity: number; animated?: boolean; speed?: AnimationSpeed }
  | { type: 'shadow'; color: string; blur: number; offsetX: number; offsetY: number; animated?: boolean; speed?: AnimationSpeed }
  | { type: 'neon'; color: string; intensity: number; spread: number; animated?: boolean; speed?: AnimationSpeed }
  | { type: 'innerGlow'; color: string; blur: number; intensity: number; animated?: boolean; speed?: AnimationSpeed }
  | { type: 'lift'; elevation: 'sm' | 'md' | 'lg' | 'xl'; animated?: boolean; speed?: AnimationSpeed }
  | { type: 'outline'; color: string; width: number; animated?: boolean; speed?: AnimationSpeed };
```

### Available Effects

| Effect | Description | Controls |
|--------|-------------|----------|
| `glow` | Soft outer glow | color, blur, intensity |
| `shadow` | Drop shadow | color, blur, offsetX, offsetY |
| `neon` | Multi-layer neon glow (overrides component color) | color, intensity, spread |
| `innerGlow` | Inward glow effect | color, blur, intensity |
| `lift` | Paper elevation shadow | elevation (sm/md/lg/xl) |
| `outline` | Stroke outline around content | color, width |

### Neon Effect

The neon effect creates an intense neon sign look:

- Overrides component color (white core + colored glow)
- Multiple layered blurs for realistic neon tube appearance
- Curated color presets: Hot Pink, Electric Blue, Neon Green, Purple, Orange, Red, Yellow, Cyan

### Components with Effect Support

All visual components accept the optional `effect` prop:

- **Icon** - Glowing icons, neon icons
- **TextField** - Glowing text, neon text
- **Image** - Images with glow, shadow, lift effects
- **Border** - Glowing borders, neon borders
- **GradientBackground** - Backgrounds with effects
- **PatternBackground** - Patterns with effects

### Animation Integration

All effects support pulsing animation via the `animated` and `speed` props:

```typescript
{
  effect: {
    type: 'glow',
    color: '#3b82f6',
    blur: 10,
    intensity: 0.7,
    animated: true,    // Enable pulsing
    speed: 'normal'    // slow, normal, fast
  }
}
```

### Key Files

| File | Purpose |
|------|---------|
| `src/lib/effects/types.ts` | Effect types & Zod schemas |
| `src/lib/effects/presets.ts` | Effect presets & color options |
| `src/lib/effects/EffectWrapper.svelte` | Wrapper component with SVG filters |

---

## Fonts System

The library includes 37+ web-safe fonts organized by category, plus dataset-specific brand fonts.

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Fonts Module                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ web-safe.ts                                          │   │
│  │   WEB_SAFE_FONTS: 37 fonts across 5 categories       │   │
│  │   - Sans-Serif (13): Arial, Helvetica, Verdana...    │   │
│  │   - Serif (10): Georgia, Times New Roman...          │   │
│  │   - Monospace (5): Courier New, Consolas...          │   │
│  │   - Display (4): Impact, Arial Black...              │   │
│  │   - Cursive (5): Brush Script, Comic Sans...         │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ brand-fonts.ts                                       │   │
│  │   BRAND_FONTS: Dataset-specific fonts                │   │
│  │   - PlayStation Style (Segoe UI based)               │   │
│  │   - Xbox Style (Segoe UI based)                      │   │
│  │   - Steam Style (system sans-serif)                  │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ index.ts                                             │   │
│  │   - getAllFontsForDataset(datasetId)                 │   │
│  │   - getFontsByGroupForDataset(datasetId)             │   │
│  │   - getWebSafeFonts()                                │   │
│  │   - fontFamilies (legacy export)                     │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Font Categories

| Category | Count | Examples |
|----------|-------|----------|
| Sans-Serif | 13 | Arial, Helvetica, Verdana, Tahoma, Segoe UI, Futura, Gill Sans |
| Serif | 10 | Georgia, Times New Roman, Palatino, Garamond, Baskerville, Bodoni |
| Monospace | 5 | Courier New, Consolas, Monaco, Lucida Console, Andale Mono |
| Display | 4 | Impact, Arial Black, Copperplate, Haettenschweiler |
| Cursive | 5 | Brush Script, Lucida Handwriting, Comic Sans, Snell Roundhand, Zapfino |

### Font Option Type

```typescript
interface FontOption {
  value: string;       // CSS font-family value (e.g., "Arial, sans-serif")
  label: string;       // Display name (e.g., "Arial")
  category: FontCategory;  // 'sans-serif' | 'serif' | 'monospace' | 'display' | 'cursive'
}

interface FontDropdownOption {
  value: string;
  label: string;
  category?: FontCategory | 'brand';
}
```

### Dataset Brand Fonts

Brand fonts provide dataset-specific styling and appear first in font dropdowns:

```typescript
interface BrandFont {
  id: string;              // Unique identifier
  label: string;           // Display name (e.g., "PlayStation Style")
  fontFamily: string;      // CSS font-family value
  fallback: string;        // Fallback font
  datasets: DatasetId[];   // Which datasets use this font
}
```

### Helper Functions

```typescript
// Get all fonts for a dataset (brand fonts first, then web-safe by category)
getAllFontsForDataset(datasetId: DatasetId): FontDropdownOption[]

// Get fonts organized by category group
getFontsByGroupForDataset(datasetId: DatasetId): {
  brand: FontDropdownOption[];
  'sans-serif': FontDropdownOption[];
  serif: FontDropdownOption[];
  monospace: FontDropdownOption[];
  display: FontDropdownOption[];
  cursive: FontDropdownOption[];
}

// Get flat list of web-safe fonts (no brand fonts)
getWebSafeFonts(): Array<{ value: string; label: string }>

// Get brand fonts for a specific dataset
getBrandFontOptions(datasetId: DatasetId): Array<{ value: string; label: string }>
```

### Integration with Creator

Font dropdowns in creator panels automatically use dataset-aware fonts:

- **TextPanel** - Font family dropdown with brand fonts first
- **BadgePanel** - Font family for badge text
- **RibbonPanel** - Font family for ribbon text
- **ListPanel** - Font family for list items
- **StatPanelPanel** - Font family for stat labels/values

### Key Files

| File | Purpose |
|------|---------|
| `src/lib/fonts/index.ts` | Main exports & helper functions |
| `src/lib/fonts/web-safe.ts` | Web-safe fonts with categories |
| `src/lib/fonts/brand-fonts.ts` | Dataset-specific brand fonts |

---

## Visual Creator

The visual creator (`/creator`) provides a full template editing interface with a modular component architecture.

### Architecture

The creator is built from modular Svelte components for maintainability:

| File | Purpose |
|------|---------|
| `+page.svelte` | Main orchestrator, state management, keyboard shortcuts |
| `types.ts` | Type definitions (ContainerState, ComponentItem, etc.) |
| `state.svelte.ts` | Factory functions, helpers, template building |
| `HierarchyPanel.svelte` | Left sidebar - zone list, drag-reorder |
| `CanvasPreview.svelte` | Center - live preview with selection overlays |
| `PropertiesPanel.svelte` | Right sidebar - zone & component settings |
| `AnimationControls.svelte` | Reusable animation panel (used by all component panels) |
| `EffectsControls.svelte` | Reusable effects panel (used by all component panels) |
| `panels/*.svelte` | Individual property panels for each component type |

### Layout

```
┌─────────────────┬─────────────────────┬──────────────────────┐
│                 │                     │                      │
│  Zone Hierarchy │    Canvas Preview   │   Properties Panel   │
│                 │                     │                      │
│  - Drag reorder │    - Live preview   │   - Zone settings    │
│  - Visibility   │    - Selection      │   - Component props  │
│  - Naming       │    - Corner markers │   - Effects          │
│                 │                     │                      │
└─────────────────┴─────────────────────┴──────────────────────┘
```

### Features

**Zone Hierarchy (Left Panel)**
- Drag-to-reorder zones for z-axis control
- Visibility toggles (show/hide zones)
- Custom zone naming
- Move up/down buttons
- Shape icons indicate zone type
- Component count badges

**Canvas Preview (Center)**
- Live template preview
- Subtle selection overlay with corner indicators
- Click zones to select
- Preview modes: field placeholders or sample data

**Properties Panel (Right)**
- Zone properties: name, position, size, shape, radius
- Component-specific controls with full property access
- Collapsible sections

**Editing Features**
- Undo/Redo with keyboard shortcuts (Cmd+Z, Cmd+Shift+Z)
- Template save/load (JSON export/import)
- Duplicate and delete zones
- Add components: Text, Image, Background, Border, Icon

### Component Property Panels

Each component has a dedicated property panel. All components include an **Animation** section (type, speed, direction, easing, pause) and an **Effects** section (type, color, blur, intensity, etc.).

**Text:** Data field, font family, min/max size range, weight, alignment (H+V), color, animation, effects

**Image:** Data field, fit mode (cover/contain/stretch), opacity, animation, effects

**Background:** Fill type (none/solid/gradient), direction, colors, pattern overlay, opacity, animation, effects

**Border:** Color, width, opacity, glow effect, holographic effect, multi-layer, animation, effects

**Icon:** Icon picker with search, icon set filter, color, size, rotation, flip (H/V), opacity, animation, effects

---

## Type System

### CardTemplate

```typescript
interface CardTemplate {
  name: string;
  components: ComponentDefinition[];
}

interface ComponentDefinition {
  id: string;
  type: string;
  props: Record<string, unknown>;
  children?: ComponentDefinition[];
}
```

### ContainerContext

Provided to all components by their parent:

```typescript
interface ContainerContext {
  width: number;
  height: number;
  radius: number;
  clipShape?: ClipShape;
  clipPoints?: ClipPoint[];
}
```

### CardData

Generic data model - define whatever fields your domain needs:

```typescript
type CardData = Record<string, unknown>;

// Example usage
const data: CardData = {
  title: 'Achievement Unlocked',
  imageUrl: 'https://...',
  category: 'Gaming'
};
```

---

## Card Base Layer

The Card Base layer is a special protected layer that handles bleed for professional printing.

### Properties

| Property | Value |
|----------|-------|
| `isCardBase` | `true` (marks this as the Card Base) |
| Position | (-35, -35) - extends into bleed area |
| Size | 820 x 1120 - covers full bleed |
| Corner Radius | 61px (26 + 35 for bleed) |

### Restrictions

- **Cannot be deleted** - always exists
- **Cannot be moved or resized** - fixed to bleed dimensions
- **Cannot be renamed** - always "Card Base"
- **Cannot be reordered** - always at bottom

### Fixed Components

Card Base has three pre-populated components that cannot be added or removed:

1. **Image** (hidden by default) - for background images
2. **Background** - solid color, gradient, or pattern fill
3. **Border** - card edge border (width includes bleed)

Components can only be toggled visible/hidden via the eye icon.

### Border Width

The Card Base border defaults to 43px (8px visible + 35px bleed). This ensures the border extends to the edge when exported with bleed.

---

## Export System

### Client-Side

```typescript
import {
  downloadSVG,           // Download as .svg file
  downloadPNGClient,     // Download as .png (browser canvas)
  svgToDataURL,          // Get data URL
  svgToBlob,             // Get Blob
  applyBleed             // Apply bleed to SVG element
} from 'svelte-trading-cards';
```

### Export with Bleed

```typescript
// SVG with bleed
downloadSVG(svgElement, {
  filename: 'my-card',
  bleedMm: 3  // 0, 1, 2, or 3mm
});

// PNG with bleed and resolution
downloadPNGClient(svgElement, {
  filename: 'my-card',
  bleedMm: 3,
  scale: 2    // 2x resolution
});
```

### applyBleed Function

The `applyBleed()` function handles bleed extension:

```typescript
const svgWithBleed = applyBleed(svgElement, {
  bleedMm: 3,
  cardBaseId: 'card-base'  // ID of the Card Base layer
});
```

**What it does:**
1. Expands canvas by bleed amount on all sides
2. Updates SVG viewBox and dimensions
3. Extends Card Base background/border to fill bleed
4. Offsets all other layers by bleed amount (preserving positions)

### Server-Side

```typescript
import {
  renderToSVGString,     // Template + data → SVG string
  embedImages,           // Embed external images as base64
  svgToPNG               // SVG → PNG buffer (resvg-js)
} from 'svelte-trading-cards/server';
```

Server-side uses `@resvg/resvg-js` (bundled, no additional install needed).

---

## Extensibility

### Custom Components

```typescript
import { registerComponent } from 'svelte-trading-cards';
import MyComponent from './MyComponent.svelte';

registerComponent('MyComponent', MyComponent);
```

### Component Pattern

All components follow this structure:

```svelte
<script lang="ts" module>
  import { z } from 'zod';
  export const PropsSchema = z.object({ ... });
  export type Props = z.infer<typeof PropsSchema>;
</script>

<script lang="ts">
  import type { ContainerContext, CardData } from '$lib/types';

  let {
    container,  // Always provided
    data,       // Optional CardData
    ...props
  }: Props & { container: ContainerContext; data?: CardData } = $props();
</script>

<!-- SVG elements using container.width, container.height -->
```

---

## Development

```bash
npm run dev          # Start dev server (localhost:5173)
npm run check        # Type check (must pass with 0 errors)
npm run build        # Build library
npm run test         # Run tests
```

### Routes

- `/` - Demo gallery with sample cards
- `/creator` - Visual template creator

---

*End of Specification*
