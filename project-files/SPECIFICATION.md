# svelte-trading-cards Specification

**Package:** `svelte-trading-cards`
**Version:** 0.1.0
**Last Updated:** 2025-11-28
**Status:** In Development (~89% complete)

---

## Table of Contents

1. [Overview](#overview)
2. [Technology Stack](#technology-stack)
3. [Architecture](#architecture)
4. [Components](#components)
5. [Animation System](#animation-system)
6. [Effects System](#effects-system)
7. [Visual Creator](#visual-creator)
8. [Type System](#type-system)
9. [Export System](#export-system)
10. [Extensibility](#extensibility)

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

---

## Technology Stack

| Package | Version | Purpose |
|---------|---------|---------|
| Svelte | 5.x | UI framework (runes: `$state`, `$derived`, `$props`, `$effect`) |
| SvelteKit | 2.x | Library packaging via `@sveltejs/package` |
| Tailwind CSS | 4.x | CSS-first configuration with `@plugin` directive |
| Zod | 4.x | Runtime validation |
| Iconify | - | Icons via CSS classes (`icon-[set--name]`) |
| shadcn-svelte | - | UI components for creator interface |

---

## Architecture

```
src/lib/
├── index.ts                 # Main entry point (client exports)
├── core/
│   ├── CardCanvas.svelte    # Main renderer - creates root container
│   ├── ComponentRenderer.svelte # Renders components from definitions
│   ├── Group.svelte         # Container for nested components
│   └── ComponentRegistry.ts # Maps component names to implementations
├── components/
│   ├── backgrounds/         # GradientBackground, Image, PatternBackground
│   ├── borders/             # Border (unified with composable effects)
│   ├── fields/              # TextField
│   └── icons/               # Icon, IconPicker (Iconify integration)
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
| FitText | Auto-sizing text with binary search algorithm |

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

## Export System

### Client-Side

```typescript
import {
  downloadSVG,           // Download as .svg file
  downloadPNGClient,     // Download as .png (browser canvas)
  svgToDataURL,          // Get data URL
  svgToBlob              // Get Blob
} from 'svelte-trading-cards';
```

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
