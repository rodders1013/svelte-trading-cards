# Getting Started with svelte-trading-cards

This guide walks you through integrating the `svelte-trading-cards` library into your existing SvelteKit project.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Project Setup](#project-setup)
4. [Basic Card Rendering](#basic-card-rendering)
5. [Using the Visual Creator](#using-the-visual-creator)
6. [Display Cards with Effects](#display-cards-with-effects)
7. [Gallery Layouts](#gallery-layouts)
8. [Exporting Cards](#exporting-cards)
9. [Server-Side Rendering](#server-side-rendering)
10. [Database Integration](#database-integration)
11. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before starting, ensure your project has:

| Requirement | Version | Notes |
|-------------|---------|-------|
| Node.js | 18+ | LTS recommended |
| SvelteKit | 2.x | With `@sveltejs/package` |
| Svelte | 5.x | Uses runes (`$state`, `$props`, etc.) |
| Tailwind CSS | 4.x | CSS-first configuration |

---

## Installation

### 1. Install the Package

```bash
# npm
npm install svelte-trading-cards

# pnpm
pnpm add svelte-trading-cards

# yarn
yarn add svelte-trading-cards
```

### 2. Install Peer Dependencies

The library requires Svelte 5:

```bash
npm install svelte@^5.0.0
```

### 3. Optional Dependencies

For server-side PNG export:

```bash
npm install sharp @resvg/resvg-js
```

For the visual creator UI components (if not already installed):

```bash
npm install bits-ui clsx tailwind-merge tailwind-variants
```

---

## Project Setup

### Tailwind CSS Configuration

The library uses Tailwind CSS 4 with Iconify integration. Update your `tailwind.config.ts`:

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/**/*.{html,js,svelte,ts}',
    './node_modules/svelte-trading-cards/**/*.{html,js,svelte,ts}'
  ],
  // ... rest of your config
} satisfies Config;
```

Or with the CSS-first approach in `app.css`:

```css
@import 'tailwindcss';
@source "../node_modules/svelte-trading-cards";
```

### TypeScript Configuration

Ensure your `tsconfig.json` includes the library types:

```json
{
  "compilerOptions": {
    "moduleResolution": "bundler",
    "strict": true
  }
}
```

---

## Basic Card Rendering

### Minimal Example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import { CardCanvas } from 'svelte-trading-cards';
  import type { CardTemplate, CardData } from 'svelte-trading-cards';

  // Define your card template
  const template: CardTemplate = {
    name: 'Simple Card',
    components: [
      {
        id: 'card-base',
        type: 'Group',
        props: {
          x: -35,
          y: -35,
          width: 820,
          height: 1120,
          isCardBase: true
        },
        children: [
          {
            id: 'background',
            type: 'GradientBackground',
            props: {
              colors: ['#1e293b', '#0f172a'],
              direction: 'vertical'
            }
          },
          {
            id: 'border',
            type: 'Border',
            props: {
              color: '#fbbf24',
              width: 43
            }
          }
        ]
      },
      {
        id: 'title-zone',
        type: 'Group',
        props: {
          x: 50,
          y: 50,
          width: 650,
          height: 80
        },
        children: [
          {
            id: 'title',
            type: 'TextField',
            props: {
              dataField: 'title',
              maxFontSize: 48,
              minFontSize: 24,
              color: '#ffffff',
              fontWeight: 'bold',
              alignment: 'center'
            }
          }
        ]
      }
    ]
  };

  // Your card data
  const data: CardData = {
    title: 'My First Card'
  };

  let svgElement: SVGSVGElement;
</script>

<div class="w-[300px]">
  <CardCanvas bind:svgElement {template} {data} />
</div>
```

### Card Dimensions

All cards render at 750x1050 pixels (2.5" x 3.5" at 300 DPI):

```typescript
import { CARD_WIDTH, CARD_HEIGHT, CARD_RADIUS } from 'svelte-trading-cards';

console.log(CARD_WIDTH);  // 750
console.log(CARD_HEIGHT); // 1050
console.log(CARD_RADIUS); // 26
```

### Available Components

| Component | Purpose |
|-----------|---------|
| `Group` | Container for positioning and clipping |
| `TextField` | Auto-fitting text with min/max font sizes |
| `Image` | Image display with fit modes |
| `GradientBackground` | Solid or gradient fills |
| `PatternBackground` | Repeating patterns (dots, grid, etc.) |
| `Border` | Card borders with optional effects |
| `Icon` | Iconify icons with 95k+ options |
| `IconRating` | Star ratings and similar displays |

---

## Using the Visual Creator

The visual creator provides a drag-and-drop interface for designing card templates.

### Basic Setup

```svelte
<!-- src/routes/creator/+page.svelte -->
<script lang="ts">
  import { CardCreator } from 'svelte-trading-cards/creator';
  import type { CardTemplate, ContainerState, Dataset } from 'svelte-trading-cards';

  // Define your data structure
  interface Product {
    id: string;
    name: string;
    price: number;
    image: string;
    description: string;
  }

  // Configure available fields for the creator
  const datasets: Record<string, Dataset<Product>> = {
    products: {
      id: 'products',
      name: 'Products',
      description: 'Product catalog',
      platform: 'ecommerce',
      dataFields: [
        { value: 'name', label: 'Product Name', type: 'text' },
        { value: 'price', label: 'Price', type: 'number' },
        { value: 'image', label: 'Product Image', type: 'image' },
        { value: 'description', label: 'Description', type: 'text' }
      ],
      cards: [
        {
          id: '1',
          name: 'Sample Product',
          price: 29.99,
          image: 'https://example.com/product.jpg',
          description: 'A sample product for preview'
        }
      ]
    }
  };

  // Handle save
  function handleSave(data: {
    template: CardTemplate;
    editorState: ContainerState[];
    name: string;
  }) {
    console.log('Template saved:', data);
    // Save to your database (see Database Integration section)
  }

  // Handle real-time changes (optional)
  function handleChange(data: {
    template: CardTemplate;
    editorState: ContainerState[];
  }) {
    console.log('Template changed');
  }
</script>

<div class="h-screen">
  <CardCreator
    {datasets}
    onSave={handleSave}
    onChange={handleChange}
  />
</div>
```

### Loading an Existing Template

```svelte
<script lang="ts">
  import { CardCreator } from 'svelte-trading-cards/creator';

  // Load from your database
  const savedTemplate = await fetch('/api/templates/123').then(r => r.json());
</script>

<CardCreator
  {datasets}
  initialTemplate={savedTemplate.editorState}
  onSave={handleSave}
/>
```

### Creator Features

- **Zone Hierarchy** - Drag to reorder layers (z-index control)
- **Component Properties** - Full control over text, images, icons, etc.
- **Animation System** - Spin, pulse, bounce, trace, and more
- **Effects System** - Glow, shadow, neon, holographic effects
- **Live Preview** - See changes in real-time
- **Export** - Download as SVG/PNG or JSON template

---

## Display Cards with Effects

The display module provides interactive cards with 3D tilt effects.

### Basic Display Card

```svelte
<script lang="ts">
  import { Card } from 'svelte-trading-cards/display';
  import type { CardTemplate, CardData } from 'svelte-trading-cards';

  export let template: CardTemplate;
  export let data: CardData;
</script>

<div class="w-[300px]">
  <Card {template} {data} rarity="rare" />
</div>
```

### Rarity Presets

Each rarity level has unique visual effects:

```svelte
<Card {template} {data} rarity="common" />     <!-- Subtle glare -->
<Card {template} {data} rarity="uncommon" />   <!-- Light glare -->
<Card {template} {data} rarity="rare" />       <!-- Foil effect -->
<Card {template} {data} rarity="epic" />       <!-- Holographic -->
<Card {template} {data} rarity="legendary" />  <!-- Prism effect -->
```

| Rarity | Glare Intensity | Mask Effect | Shadow |
|--------|-----------------|-------------|--------|
| common | 15% | none | subtle |
| uncommon | 25% | none | medium |
| rare | 40% | foil stripes | strong |
| epic | 60% | holo bands | intense |
| legendary | 80% | prism angular | maximum |

### Flip Animation

```svelte
<script lang="ts">
  import { Card } from 'svelte-trading-cards/display';

  let flipped = $state(false);
</script>

<Card
  template={frontTemplate}
  backTemplate={backTemplate}
  data={cardData}
  bind:flipped
  flipOnClick
  flipDuration={600}
/>

<button onclick={() => flipped = !flipped}>
  Flip Card
</button>
```

### Custom Glare Gradient

Define custom gradients in your template:

```typescript
const template: CardTemplate = {
  name: 'Custom Card',
  display: {
    rarity: 'rare',
    customGradient: 'linear-gradient(135deg, #ff6b6b, #4ecdc4, #45b7d1)'
  },
  components: [...]
};
```

### Disabled Mode (Static)

For static cards without effects (better for lists):

```svelte
<Card {template} {data} disabled />
```

---

## Gallery Layouts

The gallery module provides layouts for displaying card collections.

### CardRow - Overlapping Cards

```svelte
<script lang="ts">
  import { CardRow } from 'svelte-trading-cards/gallery';
  import { Card } from 'svelte-trading-cards/display';
  import type { CardTemplate, CardData } from 'svelte-trading-cards';

  export let template: CardTemplate;
  export let cards: CardData[];
</script>

<CardRow
  cardWidth={280}
  visibleWidth={80}
  hoverScale={1.08}
  transitionDuration={0.5}
>
  {#snippet children(ctx)}
    {#each cards as card, i}
      <div
        class="card-row-item"
        style:transform={ctx.getTransform(i)}
        style:z-index={ctx.getZIndex(i)}
        onmouseenter={() => ctx.onHover(i)}
        onmouseleave={ctx.onLeave}
      >
        <Card {template} data={card} width={280} rarity="rare" />
      </div>
    {/each}
  {/snippet}
</CardRow>
```

### CardRow Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `cardWidth` | number | 280 | Full width of each card |
| `visibleWidth` | number | 80 | Visible portion when stacked |
| `hoverScale` | number | 1.08 | Scale factor on hover |
| `transitionDuration` | number | 0.5 | Animation duration (seconds) |
| `aria-label` | string | 'Card row' | Accessibility label |

### Context Functions

The snippet receives a context object:

```typescript
interface CardRowContext {
  getTransform(index: number): string;  // CSS transform
  getZIndex(index: number): number;     // z-index value
  onHover(index: number): void;         // Call on mouseenter
  onLeave(): void;                      // Call on mouseleave
  hoveredIndex: number | null;          // Currently hovered
}
```

---

## Exporting Cards

### Client-Side Export

```svelte
<script lang="ts">
  import { CardCanvas, downloadSVG, downloadPNGClient } from 'svelte-trading-cards';

  let svgElement: SVGSVGElement;

  async function exportSVG() {
    downloadSVG(svgElement, {
      filename: 'my-card',
      bleedMm: 0  // 0-3mm bleed for printing
    });
  }

  async function exportPNG() {
    await downloadPNGClient(svgElement, {
      filename: 'my-card',
      scale: 2,    // 2x resolution (1500x2100)
      bleedMm: 3   // 3mm bleed for professional print
    });
  }
</script>

<CardCanvas bind:svgElement {template} {data} />

<button onclick={exportSVG}>Download SVG</button>
<button onclick={exportPNG}>Download PNG</button>
```

### Export Options

```typescript
interface DownloadOptions {
  filename?: string;   // Output filename (no extension)
  bleedMm?: number;    // 0, 1, 2, or 3mm bleed
  scale?: number;      // PNG resolution (1, 2, 3)
}
```

### Bleed for Professional Printing

| Use Case | Bleed | Scale | Output Size |
|----------|-------|-------|-------------|
| Digital display | 0mm | 1x | 750x1050 |
| Home printing | 0mm | 2x | 1500x2100 |
| Professional print | 3mm | 2x | 1640x2240 |

---

## Server-Side Rendering

For high-quality, trusted PNG generation.

### API Endpoint Example

```typescript
// src/routes/api/cards/[id]/png/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import {
  renderToSVGString,
  embedImages,
  svgToPNG
} from 'svelte-trading-cards/server';

export const GET: RequestHandler = async ({ params, url }) => {
  // Load template and data from your database
  const template = await db.templates.findById(params.templateId);
  const card = await db.cards.findById(params.id);

  // Get export options from query params
  const scale = Number(url.searchParams.get('scale') ?? 2);
  const bleedMm = Number(url.searchParams.get('bleed') ?? 0);

  // Render SVG string
  const svg = await renderToSVGString(template.template, card.data);

  // Embed external images as base64 (handles CORS, converts WebP)
  const svgWithImages = await embedImages(svg);

  // Convert to PNG
  const { buffer, width, height } = await svgToPNG(svgWithImages, {
    scale,
    bleedMm
  });

  return new Response(buffer, {
    headers: {
      'Content-Type': 'image/png',
      'Content-Disposition': `attachment; filename="${card.name}.png"`,
      'Content-Length': buffer.length.toString()
    }
  });
};
```

### Server Dependencies

The server module requires:

```bash
npm install sharp @resvg/resvg-js
```

- **sharp** - Image processing (WebP to PNG conversion)
- **@resvg/resvg-js** - SVG to PNG rendering (pixel-perfect)

### Batch Export

```typescript
import { renderToSVGString, embedImages, svgToPNG } from 'svelte-trading-cards/server';

async function exportAllCards(template: CardTemplate, cards: CardData[]) {
  const results = await Promise.all(
    cards.map(async (card) => {
      const svg = await renderToSVGString(template, card);
      const svgWithImages = await embedImages(svg);
      const { buffer } = await svgToPNG(svgWithImages, { scale: 2 });
      return { id: card.id, buffer };
    })
  );
  return results;
}
```

---

## Database Integration

### What to Store

| Field | Type | Purpose |
|-------|------|---------|
| `template` | JSON | `CardTemplate` - for rendering |
| `editorState` | JSON | `ContainerState[]` - for editing |

**Important:** Store BOTH values. The `template` is used for rendering cards, while `editorState` is needed to reload the template in the visual creator for editing.

### PostgreSQL / Supabase Schema

```sql
-- Templates table
CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  template JSONB NOT NULL,
  editor_state JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID REFERENCES users(id)
);

-- Cards table (your domain data)
CREATE TABLE cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES templates(id),
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_templates_user ON templates(user_id);
CREATE INDEX idx_cards_template ON cards(template_id);
```

### Save Handler Example

```svelte
<script lang="ts">
  import { CardCreator } from 'svelte-trading-cards/creator';
  import type { CardTemplate, ContainerState } from 'svelte-trading-cards';

  async function handleSave(data: {
    template: CardTemplate;
    editorState: ContainerState[];
    name: string;
  }) {
    const response = await fetch('/api/templates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: data.name,
        template: data.template,
        editorState: data.editorState
      })
    });

    if (response.ok) {
      const saved = await response.json();
      console.log('Saved template:', saved.id);
    }
  }
</script>

<CardCreator {datasets} onSave={handleSave} />
```

### Load and Edit

```svelte
<script lang="ts">
  import { CardCreator } from 'svelte-trading-cards/creator';
  import { page } from '$app/stores';

  // Load existing template
  const templateId = $page.params.id;
  const saved = await fetch(`/api/templates/${templateId}`).then(r => r.json());

  async function handleSave(data) {
    await fetch(`/api/templates/${templateId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  }
</script>

<CardCreator
  {datasets}
  initialTemplate={saved.editorState}
  onSave={handleSave}
/>
```

---

## Troubleshooting

### Common Issues

#### "Cannot find module 'svelte-trading-cards'"

Ensure the package is installed and your bundler is configured:

```bash
npm install svelte-trading-cards
```

Check `vite.config.ts` includes the package:

```typescript
import { sveltekit } from '@sveltejs/kit/vite';

export default {
  plugins: [sveltekit()],
  optimizeDeps: {
    include: ['svelte-trading-cards']
  }
};
```

#### Tailwind styles not applying

Add the package to your Tailwind content paths:

```css
/* app.css */
@import 'tailwindcss';
@source "../node_modules/svelte-trading-cards";
```

#### Images not loading in export

External images may have CORS restrictions. Use `embedImages()` on the server:

```typescript
import { embedImages } from 'svelte-trading-cards/server';

const svgWithImages = await embedImages(svgString);
```

#### Fonts not rendering correctly

Load Google Fonts before rendering:

```typescript
import { loadGoogleFont, getGoogleFontsUrlForCard } from 'svelte-trading-cards';

// Load specific font
await loadGoogleFont('Roboto, sans-serif');

// Or generate URL for all fonts in a card
const fontsUrl = getGoogleFontsUrlForCard(template);
if (fontsUrl) {
  const link = document.createElement('link');
  link.href = fontsUrl;
  link.rel = 'stylesheet';
  document.head.appendChild(link);
}
```

#### Hover-tilt effects not showing

Ensure you're using the display Card component:

```svelte
<!-- Wrong -->
<script>
  import { CardCanvas } from 'svelte-trading-cards';
</script>

<!-- Correct -->
<script>
  import { Card } from 'svelte-trading-cards/display';
</script>

<Card {template} {data} rarity="rare" />
```

#### Cards clipping in CardRow

Ensure cards have the `card-row-item` class:

```svelte
<div
  class="card-row-item"  <!-- Required -->
  style:transform={ctx.getTransform(i)}
  style:z-index={ctx.getZIndex(i)}
>
  <Card {template} data={card} />
</div>
```

### Getting Help

- **GitHub Issues**: Report bugs or request features
- **Documentation**: See SPECIFICATION.md for full component reference
- **Data Flow**: See DATA-FLOW.md for integration patterns

---

## Quick Reference

### Entry Points

```typescript
import { CardCanvas } from 'svelte-trading-cards';
import { CardCreator } from 'svelte-trading-cards/creator';
import { Card } from 'svelte-trading-cards/display';
import { CardRow } from 'svelte-trading-cards/gallery';
import { svgToPNG } from 'svelte-trading-cards/server';
```

### Card Dimensions

- Width: 750px
- Height: 1050px
- Aspect Ratio: 5:7
- Corner Radius: 26px
- Physical: 2.5" x 3.5" at 300 DPI

### Component Types

`Group`, `TextField`, `Image`, `GradientBackground`, `PatternBackground`, `Border`, `Icon`, `IconRating`

### Rarities

`common`, `uncommon`, `rare`, `epic`, `legendary`

---

*End of Getting Started Guide*
