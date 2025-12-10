# svelte-trading-cards

A Svelte 5 component library for building animated trading cards with a visual creator interface.

## What This Package Does

Build professional trading cards by composing pre-built SVG components. Think of it like Photoshop layers for cards - stack backgrounds, borders, frames, text fields, and decorations to create unique designs.

**Key capabilities:**
- Visual template creator with zone hierarchy and property panels
- Group-based architecture for composable, nestable components
- **Shape system** with 22 built-in shapes + custom Iconify icons via `shapeSource`
- Auto-fit text that scales between min/max sizes to fit containers
- Container-aware components that fill their parent by default
- CSS animations that auto-strip for static PNG export
- Client-side SVG/PNG download (no server required)
- Server-side PNG rendering (pixel-perfect, trusted source)
- Generic data model - works for any domain (games, employees, products)
- Gallery components (Grid, Carousel, Row, Modal) for displaying card collections
- Interactive card display with hover-tilt effects and rarity presets

## Getting Started

For a comprehensive step-by-step integration guide, see **[GETTING-STARTED.md](project-files/GETTING-STARTED.md)**.

## Tech Stack

| Package | Version | Purpose |
|---------|---------|---------|
| Svelte | 5.x | UI framework (runes) |
| SvelteKit | 2.x | Library packaging |
| Tailwind CSS | 4.x | Styling |
| Zod | 4.x | Runtime validation |
| shadcn-svelte | - | Creator UI components |
| hover-tilt | - | 3D tilt effects for card display |
| sharp | - | Image processing (WebP→PNG for server export) |
| @resvg/resvg-js | 2.x | Server-side SVG→PNG rendering |

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
- **Unified ModifiersPanel** - All components share consistent modifier controls:
  - Clip Shape (mask any component to a shape)
  - Effect (glow, strokeGlow, shadow, neon, innerGlow, lift, outline)
  - Animation (spin, pulse, bounce, shake, float, glow, ping, trace)
  - Border (color, width, opacity, style)
  - Holographic (animated color-shift effect)
  - Blend Mode (multiply, screen, overlay, etc.)
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

**Note:** Client-side PNG export automatically embeds external images as base64 before rendering to canvas, avoiding CORS issues.

### 4. Export with Bleed (for Print)

```typescript
// SVG with 3mm bleed
downloadSVG(svgElement, { filename: 'my-card', bleedMm: 3 });

// PNG at 2x resolution with 3mm bleed
downloadPNGClient(svgElement, { filename: 'my-card', bleedMm: 3, scale: 2 });
```

The visual creator includes an **Export** button that opens a dialog with:
- Format selection (PNG/SVG)
- Bleed options (0mm, 1mm, 2mm, 3mm)
- Resolution options for PNG (1x, 2x, 3x)

## Fonts System

The library includes 37+ web-safe fonts and 40+ Google Fonts organized by category, plus dataset-specific brand fonts.

### Font Categories

**Web-Safe Fonts (no loading required):**

| Category | Fonts | Examples |
|----------|-------|----------|
| Sans-Serif | 13 | Arial, Helvetica, Verdana, Segoe UI, Futura |
| Serif | 10 | Georgia, Times New Roman, Palatino, Garamond |
| Monospace | 5 | Courier New, Consolas, Monaco |
| Display | 4 | Impact, Arial Black, Copperplate |
| Cursive | 5 | Brush Script, Lucida Handwriting, Comic Sans |

**Google Fonts (loaded on demand):**

| Category | Fonts | Examples |
|----------|-------|----------|
| Sans-Serif | 11 | Roboto, Open Sans, Montserrat, Poppins, Nunito |
| Serif | 4 | Playfair Display, Merriweather, Lora, Crimson Text |
| Display | 17 | Oswald, Bangers, Orbitron, Press Start 2P, Bebas Neue |
| Monospace | 3 | Source Code Pro, Fira Code, JetBrains Mono |
| Cursive | 4 | Pacifico, Dancing Script, Caveat, Satisfy |

### Font Loading

Google Fonts are loaded on demand when selected in the creator:

```typescript
import {
  loadGoogleFont,           // Load single font on demand
  getGoogleFontsUrlForCard, // Generate URL for all fonts in a card
  isWebSafeFont,            // Check if font needs loading
  isGoogleFont,             // Check if it's a known Google Font
  waitForFonts              // Wait for fonts to be ready
} from 'svelte-trading-cards';

// Load font when user selects it
await loadGoogleFont('Roboto, sans-serif');

// Preload all fonts for a card configuration
const url = getGoogleFontsUrlForCard(cardConfig);
if (url) {
  const link = document.createElement('link');
  link.href = url;
  link.rel = 'stylesheet';
  document.head.appendChild(link);
  await waitForFonts(['Roboto', 'Oswald']);
}
```

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
  getGoogleFontOptions,       // Google Fonts for dropdowns
  WEB_SAFE_FONTS,             // Full font list with metadata
  GOOGLE_FONTS,               // Full Google Fonts list
  FONT_GROUP_LABELS           // Display names for categories
} from 'svelte-trading-cards';
```

## Components

### TextField (Auto-Fit)

Text automatically scales between min and max sizes to fit the container. All text-rendering components (TextField, StatPanel, List, Badge, Ribbon) use the same FitText algorithm ensuring text never overflows.

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
    layers: 3,
    layerColors: ['#gold', '#silver', '#bronze'],
    // Use standard effect system for glow (strokeGlow for border blur)
    effect: { type: 'strokeGlow', blur: 10, intensity: 0.5, animated: true },
    // Standard holographic config
    holographic: {
      color: '#fbbf24',
      secondaryColor: '#06b6d4',
      speed: 3,
      apply: 'stroke'
    }
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

### PatternBackground (17 Patterns + Icon Patterns)

Repeating patterns for backgrounds with 17 geometric options plus custom icon patterns:

```typescript
{
  type: 'PatternBackground',
  props: {
    pattern: 'hexagons',     // 17 geometric: dots, grid, diagonal, hexagons,
                             // triangles, squares, diamonds, chevrons, waves,
                             // circles, crosses, zigzag, checkered, stripes-h,
                             // stripes-v, confetti, stars
                             // Icon: 'icon' (single), 'icons' (multiple)
    color: '#ffffff',
    opacity: 0.1,
    size: 32,
    spacing: 0,              // Gap between elements
    rotation: 0,             // Rotate entire pattern
    strokeWidth: 1,          // Line thickness

    // For 'icons' pattern - multiple icons in sequence
    icons: [
      { iconData: {...}, iconName: 'mdi:star', rotation: 0 },
      { iconData: {...}, iconName: 'mdi:heart', rotation: 15 }
    ],
    rowOffset: 25            // Stagger rows for brick effect
  }
}
```

**Multi-icon pattern example:** With icons [★, ♥, ◆] and rowOffset of 25:
```
★  ♥  ◆  ★  ♥  ◆
   ★  ♥  ◆  ★  ♥  ◆   (offset 25px)
★  ♥  ◆  ★  ♥  ◆
```

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
    type: 'glow',          // glow, strokeGlow, shadow, neon, innerGlow, lift, outline
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
| `glow` | Soft outer glow (drop shadow style) | color, blur, intensity |
| `strokeGlow` | Blur glow on strokes/borders | color (optional), blur, intensity |
| `shadow` | Drop shadow | color, blur, offsetX, offsetY |
| `neon` | Neon sign effect (overrides color) | color, intensity, spread |
| `innerGlow` | Inward glow | color, blur, intensity |
| `lift` | Paper elevation shadow | elevation (sm/md/lg/xl) |
| `outline` | Stroke outline | color, width |

### Stroke Glow vs Glow

- **`glow`** - Creates a drop shadow around the entire element
- **`strokeGlow`** - Creates a blur glow specifically on strokes/borders (uses element's stroke color if no color specified)

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

## Blend Modes

Layer blend modes enable Photoshop-like compositing effects. Applied via CSS `mix-blend-mode` on Groups.

### Available Blend Modes

| Mode | Category | Description |
|------|----------|-------------|
| `normal` | Basic | No blending effect (default) |
| `multiply` | Darken | Darkens layers together - great for textures |
| `screen` | Lighten | Lightens layers together - great for glows |
| `overlay` | Contrast | Boosts contrast - multiply + screen combined |
| `darken` | Darken | Keeps the darker pixels |
| `lighten` | Lighten | Keeps the lighter pixels |
| `color-dodge` | Lighten | Intense brightening effect |
| `color-burn` | Darken | Intense darkening effect |
| `soft-light` | Contrast | Subtle contrast adjustment |
| `hard-light` | Contrast | Intense contrast effect |
| `difference` | Inversion | Creates color inversions |
| `exclusion` | Inversion | Softer inversion effect |

### Usage

```typescript
{
  type: 'Group',
  props: {
    x: 100, y: 100,
    width: 200, height: 200,
    blendMode: 'multiply'  // Apply blend mode to this layer
  },
  children: [...]
}
```

### Group (Container)

```typescript
{
  type: 'Group',
  props: {
    x: 100, y: 100,
    width: 200, height: 200,
    shapeSource: { type: 'builtin', shape: 'circle' },  // 22 built-in shapes
    // Or custom: { type: 'custom', iconData: {...}, iconName: 'mdi:heart' }
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

### Bleed for Print

For professional printing, cards support bleed areas:

| Property | Value |
|----------|-------|
| Max Bleed | 3mm (35px) |
| Bleed Width | 820px |
| Bleed Height | 1120px |

The **Card Base layer** automatically covers the bleed area. When you add a background image, it fills the bleed from the start - no manual adjustment needed.

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
- `/test/text-fitting` - Text fitting test page

## Server-Side Export

```typescript
import { renderToSVGString, embedImages, svgToPNG } from 'svelte-trading-cards/server';

const svg = renderToSVGString(template, data);
const svgWithImages = await embedImages(svg);  // Embeds external images as base64, converts webp→png
const { buffer } = await svgToPNG(svgWithImages);
```

**Note:** Server-side export uses `sharp` to convert WebP images to PNG (resvg-js doesn't support WebP). This is handled automatically by `embedImages()`.

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
| `svelte-trading-cards/display` | Interactive Card with hover-tilt effects and rarity presets |
| `svelte-trading-cards/gallery` | CardRow and gallery layout components |
| `svelte-trading-cards/server` | Server-side rendering, image embedding, PNG conversion |

## License

MIT
