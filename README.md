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
| shadcn-svelte | - | Creator UI components |

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

The `CardCreator` component is a full-featured template designer you can embed in your app:

```svelte
<script lang="ts">
  import { CardCreator } from 'svelte-trading-cards';
  import type { CardTemplate } from 'svelte-trading-cards';

  // Define your data shape
  const datasets = {
    players: {
      id: 'players',
      name: 'Player Cards',
      dataFields: [
        { value: 'name', label: 'Player Name', type: 'text' },
        { value: 'team', label: 'Team', type: 'text' },
        { value: 'photo', label: 'Photo', type: 'image' },
        { value: 'rating', label: 'Rating', type: 'number' }
      ],
      cards: [
        { name: 'John Doe', team: 'Red Team', photo: '/players/john.jpg', rating: 85 }
      ]
    }
  };

  function handleSave(data: { template: CardTemplate; editorState: unknown; name: string }) {
    // Save to your database
    console.log('Template saved:', data);
  }
</script>

<CardCreator
  {datasets}
  initialDataset="players"
  onSave={handleSave}
/>
```

**Features:**
- Zone hierarchy with drag-to-reorder
- Property panels for all component settings
- Per-dataset data fields (different data shapes for different use cases)
- Field remapping when switching datasets
- Undo/Redo with keyboard shortcuts (Cmd/Ctrl+Z)
- Save/Load templates as JSON
- 50-entry history limit to prevent memory bloat

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

## Fonts System

The library includes 37+ web-safe fonts organized by category, plus dataset-specific brand fonts.

### Font Categories

| Category | Fonts | Examples |
|----------|-------|----------|
| Sans-Serif | 13 | Arial, Helvetica, Verdana, Segoe UI, Futura |
| Serif | 10 | Georgia, Times New Roman, Palatino, Garamond |
| Monospace | 5 | Courier New, Consolas, Monaco |
| Display | 4 | Impact, Arial Black, Copperplate |
| Cursive | 5 | Brush Script, Lucida Handwriting, Comic Sans |

### Dataset Brand Fonts

Each dataset can have brand-specific fonts that appear first in the dropdown:

```typescript
import { getAllFontsForDataset, getBrandFontOptions } from 'svelte-trading-cards';

// Get all fonts for PlayStation dataset (brand fonts first)
const fonts = getAllFontsForDataset('playstation');

// Get only brand fonts
const brandFonts = getBrandFontOptions('playstation');
```

### Font Utilities

```typescript
import {
  getAllFontsForDataset,      // Brand + web-safe fonts for a dataset
  getFontsByGroupForDataset,  // Fonts organized by category
  getWebSafeFonts,            // Just web-safe fonts
  WEB_SAFE_FONTS,             // Full font list with metadata
  FONT_GROUP_LABELS           // Display names for categories
} from 'svelte-trading-cards';
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

### IconRating (Stars, Hearts, etc.)

Display ratings with icons - supports 10 presets plus custom Iconify icons:

```typescript
{
  type: 'IconRating',
  props: {
    dataField: 'userRating',    // Bind to data field
    value: 4.5,                 // Or static value
    max: 5,                     // Number of icons
    sourceMax: 100,             // Optional: scale values (47/100 → 2.35/5)
    iconPreset: 'star',         // star, heart, fire, thumbs-up, lightning,
                                // trophy, diamond, circle, pepper, skull, custom
    filledColor: '#fbbf24',
    emptyColor: '#374151',
    size: 24,
    gap: 4,
    allowHalf: true,            // Half-filled icons (★★★☆☆ for 3.5)
    showValue: true,            // Display value text
    valueFormat: 'decimal'      // decimal (4.5), fraction (4.5/5), percent (90%)
  }
}
```

**Use cases:** User ratings, difficulty levels, spiciness meters, health bars, achievement tiers.

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

### SVG Validation

Server-side PNG conversion includes built-in protection against oversized or malicious SVG inputs:

```typescript
import { svgToPNG, SVGValidationError } from 'svelte-trading-cards/server';

try {
  const { buffer } = await svgToPNG(svg);
} catch (error) {
  if (error instanceof SVGValidationError) {
    // SVG exceeds size (5MB) or complexity (1000 groups) limits
    console.error('Invalid SVG:', error.message);
  }
}

// Skip validation for trusted sources
const { buffer } = await svgToPNG(trustedSvg, { skipValidation: true });
```

## Advanced Usage

### Component Registry Isolation

By default, components are registered globally. For multiple independent card instances, use isolated registries:

```svelte
<script lang="ts">
  import {
    CardCanvas,
    createComponentRegistry,
    setComponentRegistry,
    Group,
    GradientBackground
  } from 'svelte-trading-cards';

  // Create isolated registry for this component tree
  const registry = createComponentRegistry();
  registry.register('Group', Group);
  registry.register('GradientBackground', GradientBackground);

  // Set in context (children will use this registry)
  setComponentRegistry(registry);
</script>

<CardCanvas {template} {data} />
```

### Filename Sanitization

Download utilities automatically sanitize filenames to prevent path traversal:

```typescript
import { downloadSVG, sanitizeFilename } from 'svelte-trading-cards';

// Automatically sanitized
downloadSVG(svg, { filename: '../../../etc/passwd' }); // Downloads as "etcpasswd.svg"

// Manual sanitization
const safe = sanitizeFilename(userInput); // "My Card!" → "My Card"
```

## Package Exports

| Import Path | Contents |
|-------------|----------|
| `svelte-trading-cards` | All components, CardCreator, types, client utilities |
| `svelte-trading-cards/creator` | CardCreator component and creator types only |
| `svelte-trading-cards/server` | Server-side rendering, image embedding, PNG conversion |

## License

MIT
