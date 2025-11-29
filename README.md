# svelte-trading-cards

A Svelte 5 component library for building animated trading cards with a visual creator interface.

## What This Package Does

Build professional trading cards by composing pre-built SVG components. Think of it like Photoshop layers for cards - stack backgrounds, borders, frames, text fields, and decorations to create unique designs.

**Key capabilities:**
- Visual template creator with zone hierarchy and property panels
- Group-based architecture for composable, nestable components
- Shape clipping via `clipShape` (circle, hexagon, shield, star, custom polygons)
- Auto-fit text that scales between min/max sizes to fit containers
- Container-aware components that fill their parent by default
- CSS animations that auto-strip for static PNG export
- Client-side SVG/PNG download (no server required)
- Server-side PNG rendering (pixel-perfect, trusted source)
- Generic data model - works for any domain (games, employees, products)

## Tech Stack

| Package | Version | Purpose |
|---------|---------|---------|
| Svelte | 5.x | UI framework (runes) |
| SvelteKit | 2.x | Library packaging |
| Tailwind CSS | 4.x | Styling |
| Zod | 4.x | Runtime validation |

## Quick Start

### 1. Render a Card

```svelte
<script lang="ts">
  import { CardCanvas, registerComponent, Group } from 'svelte-trading-cards';
  import { GradientBackground, Image, Border, TextField, Icon } from 'svelte-trading-cards';
  import type { CardTemplate, CardData } from 'svelte-trading-cards';

  // Register components
  registerComponent('Group', Group);
  registerComponent('GradientBackground', GradientBackground);
  registerComponent('Image', Image);
  registerComponent('Border', Border);
  registerComponent('TextField', TextField);
  registerComponent('Icon', Icon);

  const template: CardTemplate = {
    name: 'my-card',
    components: [
      { id: '1', type: 'GradientBackground', props: { colors: ['#1e293b', '#0f172a'] } },
      { id: '2', type: 'Border', props: { color: '#fbbf24', width: 8 } },
      {
        id: '3',
        type: 'Group',
        props: { x: 50, y: 400, width: 650, height: 80 },
        children: [
          { id: '3a', type: 'TextField', props: {
            dataField: 'title',
            maxFontSize: 48,
            minFontSize: 16,
            alignment: 'center'
          }}
        ]
      }
    ]
  };

  const data: CardData = { title: 'My Card Title' };
</script>

<CardCanvas {template} {data} />
```

### 2. Use the Visual Creator

Visit `/creator` to build templates visually:
- Zone hierarchy with drag-to-reorder
- Property panels for all component settings
- Undo/Redo with keyboard shortcuts
- Save/Load templates as JSON

### 3. Export Cards

```svelte
<script>
  import { CardCanvas, downloadSVG, downloadPNGClient } from 'svelte-trading-cards';
  let svgElement;
</script>

<CardCanvas bind:svgElement {template} {data} />
<button onclick={() => downloadSVG(svgElement)}>Download SVG</button>
<button onclick={() => downloadPNGClient(svgElement)}>Download PNG</button>
```

## Components

### TextField (Auto-Fit)

Text automatically scales between min and max sizes to fit the container:

```typescript
{
  type: 'TextField',
  props: {
    dataField: 'title',      // Bind to data field
    maxFontSize: 48,         // Maximum size
    minFontSize: 12,         // Minimum (scales to fit)
    fontFamily: 'Arial',
    fontWeight: 'bold',
    color: '#ffffff',
    alignment: 'center',     // left, center, right
    verticalAlign: 'center'  // top, center, bottom
  }
}
```

### Border (with Effects)

```typescript
{
  type: 'Border',
  props: {
    color: '#fbbf24',
    width: 8,
    glow: { enabled: true, color: '#fbbf24', blur: 10, animated: true },
    holographic: { enabled: true, secondaryColor: '#06b6d4', speed: 3 },
    layers: 3,
    layerColors: ['#gold', '#silver', '#bronze']
  }
}
```

### Icon (95k+ icons)

Icons via Iconify API - 31 curated sets, all free for commercial use, no attribution required:

```typescript
{
  type: 'Icon',
  props: {
    iconData: { body: '<path d="M12 2L15.09..." fill="currentColor"/>', width: 24, height: 24 },
    iconName: 'mdi:star',       // Reference only
    color: '#fbbf24',
    size: 64,                   // Auto-fits container if omitted
    rotation: 0,                // 0-360 degrees
    flipHorizontal: false,
    flipVertical: false,
    opacity: 1,
    animation: {                // Optional animation
      type: 'spin',
      speed: 'normal',
      direction: 'clockwise'
    }
  }
}
```

**Available icon sets:** Material Design, Fluent UI, Phosphor, Tabler, Lucide, Simple Icons (brands), Noto Emoji, Circle Flags, Crypto Icons, and 22 more.

## Animation System

All components support CSS animations that are embedded in the SVG for portability. Animations work in preview and SVG exports, but are automatically static in PNG exports.

### Animation Config

```typescript
{
  animation: {
    type: 'spin',              // spin, pulse, bounce, shake, float, glow, ping, trace
    speed: 'normal',           // slow (3s), normal (1.5s), fast (0.75s)
    direction: 'clockwise',    // clockwise, counterclockwise (spin & trace)
    easing: 'ease-in-out',     // linear, ease, ease-in, ease-out, ease-in-out
    delay: 0,                  // Delay in seconds
    iterationCount: 'infinite', // Number or 'infinite'
    paused: false              // Pause the animation
  }
}
```

### Available Animations

| Type | Description |
|------|-------------|
| `spin` | Continuous rotation (supports direction) |
| `pulse` | Scale up and down |
| `bounce` | Vertical bouncing |
| `shake` | Horizontal shake |
| `float` | Gentle floating motion |
| `glow` | Pulsing opacity |
| `ping` | Attention-grabbing scale + fade |
| `trace` | Neon sign drawing effect (best for borders) |

### Trace Animation

The `trace` animation creates a neon sign drawing effect:
- Renders solid content + larger glowing traced layer
- Multiple flowing segments animate around the stroke
- Best used on borders and stroked elements
- Slower speeds: slow=18s, normal=9s, fast=4.5s

## Effects System

All components support SVG filter-based effects that can be combined with animations.

### Effect Config

```typescript
{
  effect: {
    type: 'glow',          // glow, shadow, neon, innerGlow, lift, outline
    color: '#3b82f6',
    blur: 10,
    intensity: 0.7,
    animated: true,        // Optional: enable pulsing
    speed: 'normal'        // slow, normal, fast
  }
}
```

### Available Effects

| Type | Description | Controls |
|------|-------------|----------|
| `glow` | Soft outer glow | color, blur, intensity |
| `shadow` | Drop shadow | color, blur, offsetX, offsetY |
| `neon` | Neon sign effect (overrides color) | color, intensity, spread |
| `innerGlow` | Inward glow | color, blur, intensity |
| `lift` | Paper elevation shadow | elevation (sm/md/lg/xl) |
| `outline` | Stroke outline | color, width |

### Neon Effect

The neon effect creates an intense neon sign look:
- Overrides component color (white core + colored glow)
- Curated presets: Hot Pink, Electric Blue, Neon Green, Purple, Orange, Red, Yellow, Cyan

### Components with Animation & Effect Support

All visual components support both `animation` and `effect` props:
- Icon
- TextField
- Image
- Border
- GradientBackground
- PatternBackground

### Group (Container)

```typescript
{
  type: 'Group',
  props: {
    x: 100, y: 100,
    width: 200, height: 200,
    clipShape: 'circle',  // rect, circle, hexagon, shield, star, etc.
    clipContent: true
  },
  children: [...]
}
```

## Card Dimensions

| Property | Value |
|----------|-------|
| Width | 750px |
| Height | 1050px |
| Corner Radius | 26px |
| Physical | 2.5" x 3.5" at 300 DPI |

## Development

```bash
npm install
npm run dev          # Start dev server (localhost:5173)
npm run check        # Type check
npm run build        # Build library
```

### Routes

- `/` - Demo gallery
- `/creator` - Visual template creator

## Server-Side Export

```typescript
import { renderToSVGString, embedImages, svgToPNG } from 'svelte-trading-cards/server';

const svg = renderToSVGString(template, data);
const svgWithImages = await embedImages(svg);
const { buffer } = await svgToPNG(svgWithImages);
```

## License

MIT
