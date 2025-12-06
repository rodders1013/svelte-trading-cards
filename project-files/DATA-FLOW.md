# Svelte Trading Cards - Data Flow Documentation

This document describes the complete data flow for the `svelte-trading-cards` library, including what data external projects need to provide, what the library outputs, and how to integrate with databases and print workflows.

## Table of Contents

- [Package Entry Points](#package-entry-points)
- [Data Input](#data-input)
- [Data Output](#data-output)
- [Complete Flow Diagram](#complete-flow-diagram)
- [Type Reference](#type-reference)
- [Usage Examples](#usage-examples)
- [Database Schema Suggestions](#database-schema-suggestions)
- [Print & Export Flow](#print--export-flow)

---

## Package Entry Points

The library exposes three entry points:

| Entry Point | Purpose | Environment |
|-------------|---------|-------------|
| `svelte-trading-cards` | Main rendering, components, types, export utilities | Client |
| `svelte-trading-cards/creator` | Visual card designer component | Client |
| `svelte-trading-cards/server` | Server-side SVG rendering and PNG conversion | Server |

---

## Data Input

### What External Projects Must Provide

#### 1. Card Data (`CardData`)

The library is **data-agnostic**. You define whatever fields make sense for your domain:

```typescript
import type { CardData } from 'svelte-trading-cards';

// Gaming example
const gameCard: CardData = {
  title: "Halo Infinite",
  coverArt: "https://example.com/halo.jpg",
  achievements: 47,
  gamerscore: 1250,
  genre: "FPS"
};

// Employee badge example
const employeeCard: CardData = {
  name: "John Smith",
  department: "Engineering",
  photoUrl: "https://example.com/photo.jpg",
  employeeId: "EMP-123"
};

// Product card example
const productCard: CardData = {
  productName: "Widget Pro",
  price: 29.99,
  image: "https://example.com/widget.jpg",
  features: ["Durable", "Lightweight", "Eco-friendly"]
};
```

**Image Data Binding:** The Image component resolves `dataField` by checking:
1. `data.images[dataField]` (nested images object)
2. `data[dataField]` (top-level field)
3. Falls back to `imageUrl` prop

This allows flexible data structures - images can be at the top level or nested.

#### 2. Card Template (`CardTemplate`)

Templates define the visual layout. They're created via the `CardCreator` UI or programmatically:

```typescript
import type { CardTemplate } from 'svelte-trading-cards';

const template: CardTemplate = {
  name: "Gaming Card",
  components: [
    {
      id: "card-base",
      type: "Group",
      props: {
        x: -35, y: -35,
        width: 820, height: 1120,
        clipShape: "rect"
      },
      children: [
        {
          id: "bg-1",
          type: "GradientBackground",
          props: {
            colors: ["#1e293b", "#0f172a"],
            direction: "vertical"
          }
        },
        {
          id: "title-1",
          type: "TextField",
          props: {
            dataField: "title",  // References CardData.title
            maxFontSize: 48,
            fill: "#ffffff"
          }
        }
      ]
    }
  ]
};
```

#### 3. Dataset Configuration (for CardCreator)

When using the visual designer, provide datasets that define available fields:

```typescript
import type { Dataset, DataFieldOption } from 'svelte-trading-cards';

interface MyCard {
  id: string;
  title: string;
  image: string;
  score: number;
  tags: string[];
}

const myDataFields: DataFieldOption[] = [
  { value: 'title', label: 'Title', type: 'text' },
  { value: 'image', label: 'Image', type: 'image' },
  { value: 'score', label: 'Score', type: 'number' },
  { value: 'tags', label: 'Tags', type: 'array' }
];

const datasets: Record<string, Dataset<MyCard>> = {
  myData: {
    id: 'myData',
    name: 'My Cards',
    description: 'Custom card data',
    platform: 'custom',
    dataFields: myDataFields,
    cards: [
      { id: '1', title: 'Card One', image: 'https://...', score: 85, tags: ['featured'] }
    ]
  }
};
```

---

## Data Output

### What the Library Exports

#### 1. From `CardCreator.onSave` Callback

When a user saves a template in the creator:

```typescript
interface SavePayload {
  template: CardTemplate;        // JSON structure for rendering cards
  editorState: ContainerState[]; // Full editor state (needed to reload in creator)
  name: string;                  // Template name
}
```

**Important**: Store BOTH `template` and `editorState`:
- `template` - Used by `CardCanvas` to render cards
- `editorState` - Used by `CardCreator` to reload and edit the template

#### 2. From `CardCreator.onChange` Callback

Real-time updates as the user edits:

```typescript
interface ChangePayload {
  template: CardTemplate;
  editorState: ContainerState[];
}
```

#### 3. Default JSON Export Structure

If no `onSave` callback is provided, the creator downloads a JSON file:

```typescript
interface SavedTemplateFile {
  id: string;           // Generated ID
  name: string;         // Template name
  createdAt: string;    // ISO timestamp
  updatedAt: string;    // ISO timestamp
  template: CardTemplate;
  editorState: ContainerState[];
}
```

---

## Complete Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    EXTERNAL PROJECT                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. DEFINE YOUR DATA SHAPE                                       │
│     ┌──────────────────────────────────┐                        │
│     │ interface MyCard {               │                        │
│     │   id: string;                    │                        │
│     │   title: string;                 │                        │
│     │   image: string;                 │                        │
│     │   stats: Record<string, number>; │                        │
│     │ }                                │                        │
│     └──────────────────────────────────┘                        │
│                      │                                          │
│                      ▼                                          │
│  2. CREATE DATASET FOR CREATOR                                  │
│     ┌──────────────────────────────────┐                        │
│     │ const datasets = {               │                        │
│     │   myData: {                      │                        │
│     │     id, name, dataFields, cards  │                        │
│     │   }                              │                        │
│     │ }                                │                        │
│     └──────────────────────────────────┘                        │
│                      │                                          │
└──────────────────────┼──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                 SVELTE-TRADING-CARDS                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  3. CARD CREATOR (Visual Designer)                              │
│     ┌──────────────────────────────────┐                        │
│     │ <CardCreator                     │                        │
│     │   {datasets}                     │                        │
│     │   onSave={handleSave}            │                        │
│     │   onChange={handleChange}        │                        │
│     │   initialTemplate={editorState}  │ ← Load from DB         │
│     │ />                               │                        │
│     └──────────────────────────────────┘                        │
│                      │                                          │
│                      │ onSave callback                          │
│                      ▼                                          │
│     ┌──────────────────────────────────┐                        │
│     │ { template, editorState, name }  │ ← SAVE THIS TO DB      │
│     └──────────────────────────────────┘                        │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                    YOUR DATABASE                                 │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ templates table                                          │   │
│  │ ├── id: uuid                                             │   │
│  │ ├── name: string                                         │   │
│  │ ├── template: jsonb      ← CardTemplate (for rendering)  │   │
│  │ ├── editorState: jsonb   ← ContainerState[] (for editing)│   │
│  │ ├── createdAt: timestamp                                 │   │
│  │ └── updatedAt: timestamp                                 │   │
│  └─────────────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ cards table (your domain data)                           │   │
│  │ ├── id: uuid                                             │   │
│  │ ├── title: string                                        │   │
│  │ ├── image: string                                        │   │
│  │ ├── ... (your fields)                                    │   │
│  │ └── templateId: uuid (optional FK)                       │   │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                    RENDERING & EXPORT                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  4. CLIENT RENDERING                                            │
│     ┌──────────────────────────────────┐                        │
│     │ <CardCanvas                      │                        │
│     │   bind:svgElement                │                        │
│     │   template={loadedTemplate}      │ ← From DB              │
│     │   data={cardData}                │ ← From DB              │
│     │ />                               │                        │
│     └──────────────────────────────────┘                        │
│                      │                                          │
│  5. EXPORT OPTIONS                                              │
│     ┌──────────────────────────────────┐                        │
│     │ // Client-side download          │                        │
│     │ downloadSVG(svgElement, opts)    │                        │
│     │ downloadPNGClient(svgElement)    │                        │
│     │                                  │                        │
│     │ // Server-side (high quality)    │                        │
│     │ import { svgToPNG } from         │                        │
│     │   'svelte-trading-cards/server'  │                        │
│     └──────────────────────────────────┘                        │
│                      │                                          │
│                      ▼                                          │
│     ┌──────────────────────────────────┐                        │
│     │ PNG/SVG File                     │                        │
│     │ • 750x1050px (2.5" x 3.5")       │                        │
│     │ • 300 DPI print quality          │                        │
│     │ • Optional 0-3mm bleed           │                        │
│     └──────────────────────────────────┘                        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Type Reference

### Core Types

```typescript
// Main package exports
import {
  // Components
  CardCanvas,
  CardCreator,

  // Core types
  type CardTemplate,
  type ComponentDefinition,
  type CardData,
  type TypedCardData,
  type CommonCardFields,
  type ContainerContext,
  type BlendMode,

  // Creator types
  type ContainerState,
  type ComponentItem,
  type DataFieldOption,
  type Dataset,

  // Export utilities
  downloadSVG,
  downloadPNGClient,
  svgToDataURL,
  svgToBlob,
  type DownloadOptions,

  // Font utilities
  extractFontName,
  isWebSafeFont,
  isGoogleFont,
  loadGoogleFont,
  loadGoogleFonts,
  getGoogleFontsUrl,
  getGoogleFontsUrlForCard,
  getGoogleFontsPreviewUrl,
  waitForFonts,
  isGoogleFontLoaded,
  GOOGLE_FONTS,

  // Blend modes
  BLEND_MODE_OPTIONS,

  // Constants
  CARD_WIDTH,   // 750
  CARD_HEIGHT,  // 1050
  CARD_RADIUS,  // 26

  // Demo data (reference examples)
  demoDatasets,
  xboxDataFields,
  playstationDataFields,
  steamDataFields,
} from 'svelte-trading-cards';

// Server-side exports
import {
  renderToSVGString,
  renderToSVGStringWithImages,
  embedImages,
  hasExternalImages,
  svgToPNG,
  svgToPNGDataURL,
  type RenderOptions,
  type PNGOptions,
  type PNGResult,
} from 'svelte-trading-cards/server';
```

### Key Interfaces

```typescript
// Template structure (save to database)
interface CardTemplate {
  name: string;
  components: ComponentDefinition[];
}

interface ComponentDefinition {
  id: string;
  type: string;  // 'TextField', 'Image', 'Group', etc.
  props: Record<string, unknown>;
  children?: ComponentDefinition[];
}

// Generic card data (your domain data)
type CardData = Record<string, unknown>;

// Dataset for CardCreator
interface Dataset<T> {
  id: string;
  name: string;
  description: string;
  platform: string;
  dataFields: DataFieldOption[];
  cards: T[];
}

// Field definition for creator dropdowns
interface DataFieldOption {
  value: string;  // Field key (e.g., 'gameName')
  label: string;  // Display name (e.g., 'Game Name')
  type?: 'text' | 'number' | 'image' | 'date' | 'array';
}

// Editor state (save to database for editing)
interface ContainerState {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
  clipShape: ClipShape;
  radius: number;
  clipContent: boolean;
  animation?: AnimationConfig;
  components: ComponentItem[];
  isCardBase?: boolean;
}
```

---

## Usage Examples

### Basic Rendering

```svelte
<script lang="ts">
  import { CardCanvas, type CardTemplate, type CardData } from 'svelte-trading-cards';

  // Load from your database
  export let template: CardTemplate;
  export let data: CardData;

  let svgElement: SVGSVGElement;
</script>

<CardCanvas bind:svgElement {template} {data} />
```

### Using the Creator

```svelte
<script lang="ts">
  import { CardCreator, type Dataset, type CardTemplate, type ContainerState } from 'svelte-trading-cards';

  interface Product {
    id: string;
    name: string;
    price: number;
    image: string;
  }

  const datasets: Record<string, Dataset<Product>> = {
    products: {
      id: 'products',
      name: 'Products',
      description: 'Product catalog',
      platform: 'ecommerce',
      dataFields: [
        { value: 'name', label: 'Product Name', type: 'text' },
        { value: 'price', label: 'Price', type: 'number' },
        { value: 'image', label: 'Image', type: 'image' }
      ],
      cards: [
        { id: '1', name: 'Widget', price: 29.99, image: 'https://...' }
      ]
    }
  };

  async function handleSave(data: {
    template: CardTemplate;
    editorState: ContainerState[];
    name: string
  }) {
    await fetch('/api/templates', {
      method: 'POST',
      body: JSON.stringify({
        name: data.name,
        template: data.template,
        editorState: data.editorState
      })
    });
  }
</script>

<CardCreator {datasets} onSave={handleSave} />
```

### Server-Side PNG Generation

```typescript
// src/routes/api/cards/[id]/png/+server.ts
import { json } from '@sveltejs/kit';
import { renderToSVGString, embedImages, svgToPNG } from 'svelte-trading-cards/server';

export async function GET({ params, locals }) {
  // Load template and card data from database
  const template = await db.templates.findById(params.templateId);
  const card = await db.cards.findById(params.id);

  // Render SVG
  const svg = await renderToSVGString(template.template, card);

  // Embed external images as base64
  const svgWithImages = await embedImages(svg);

  // Convert to PNG
  const { buffer } = await svgToPNG(svgWithImages, {
    scale: 2,  // 2x resolution
    bleedMm: 3 // 3mm bleed for print
  });

  return new Response(buffer, {
    headers: {
      'Content-Type': 'image/png',
      'Content-Disposition': `attachment; filename="${card.name}.png"`
    }
  });
}
```

### Client-Side Export

```svelte
<script lang="ts">
  import { CardCanvas, downloadSVG, downloadPNGClient } from 'svelte-trading-cards';

  let svgElement: SVGSVGElement;

  async function exportSVG() {
    downloadSVG(svgElement, {
      filename: 'my-card',
      bleedMm: 3  // Add 3mm bleed for print
    });
  }

  async function exportPNG() {
    await downloadPNGClient(svgElement, {
      filename: 'my-card',
      scale: 2,   // 2x resolution
      bleedMm: 3  // Add 3mm bleed for print
    });
  }
</script>

<CardCanvas bind:svgElement {template} {data} />

<button onclick={exportSVG}>Download SVG</button>
<button onclick={exportPNG}>Download PNG</button>
```

---

## Database Schema Suggestions

### PostgreSQL / Supabase

```sql
-- Templates table
CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  template JSONB NOT NULL,        -- CardTemplate
  editor_state JSONB NOT NULL,    -- ContainerState[]
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID REFERENCES users(id)
);

-- Cards table (your domain data)
CREATE TABLE cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES templates(id),
  data JSONB NOT NULL,            -- Your card data
  created_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID REFERENCES users(id)
);

-- Index for fast template lookups
CREATE INDEX idx_templates_user ON templates(user_id);
CREATE INDEX idx_cards_template ON cards(template_id);
```

### MongoDB

```typescript
// Templates collection
interface TemplateDocument {
  _id: ObjectId;
  name: string;
  template: CardTemplate;
  editorState: ContainerState[];
  createdAt: Date;
  updatedAt: Date;
  userId: ObjectId;
}

// Cards collection
interface CardDocument {
  _id: ObjectId;
  templateId: ObjectId;
  data: Record<string, unknown>;
  createdAt: Date;
  userId: ObjectId;
}
```

---

## Print & Export Flow

### Card Dimensions

| Property | Value | Notes |
|----------|-------|-------|
| Width | 750px | 2.5 inches at 300 DPI |
| Height | 1050px | 3.5 inches at 300 DPI |
| Corner Radius | 26px | Standard trading card radius |
| Bleed | 0-3mm | Optional, for professional printing |

### Bleed System

The library includes a "Card Base" layer system for print bleed:

1. **Card Base Layer** - Positioned at (-35, -35) with size 820x1120
2. **Export with Bleed** - `downloadSVG(svg, { bleedMm: 3 })` extends the card base to the bleed edge
3. **Print-Ready Output** - Includes crop marks area for professional printing

### Export Options

```typescript
interface DownloadOptions {
  filename?: string;      // Output filename (without extension)
  bleedMm?: number;       // 0-3mm bleed for print
  scale?: number;         // PNG resolution multiplier (1, 2, 3)
  includeDeclaration?: boolean; // Include XML declaration in SVG
}
```

### Quality Recommendations

| Use Case | Format | Scale | Bleed |
|----------|--------|-------|-------|
| Screen preview | SVG | - | 0mm |
| Digital sharing | PNG | 1x | 0mm |
| Home printing | PNG | 2x | 0mm |
| Professional print | PNG | 2-3x | 3mm |
| Print-on-demand | SVG | - | 3mm |

---

## Summary

### Data IN

| What | Type | Purpose |
|------|------|---------|
| Card Data | `CardData` | Your domain data (any shape) |
| Template | `CardTemplate` | Layout definition (from creator or DB) |
| Editor State | `ContainerState[]` | For reloading in creator |
| Dataset | `Dataset<T>` | Field definitions for creator |

### Data OUT

| What | Type | When |
|------|------|------|
| Template | `CardTemplate` | `onSave` callback |
| Editor State | `ContainerState[]` | `onSave` callback |
| SVG Element | `SVGSVGElement` | `bind:svgElement` |
| PNG Buffer | `Uint8Array` | Server-side `svgToPNG()` |
| File Download | `.svg` / `.png` | Client-side export functions |

### Integration Checklist

- [ ] Define your card data interface
- [ ] Create `DataFieldOption[]` for your fields
- [ ] Set up `Dataset` object for CardCreator
- [ ] Implement `onSave` callback to persist templates
- [ ] Store both `template` and `editorState` in database
- [ ] Use `CardCanvas` for rendering with loaded templates
- [ ] Implement export endpoints (client or server)
- [ ] Add bleed settings for print workflows
- [ ] Load Google Fonts before rendering (use `getGoogleFontsUrlForCard`)
