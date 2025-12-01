# Customer Feedback Analysis: Recipe Trading Cards Use Case

> **Persona:** Senior Architect at "RecipeRealm" - a food recipes website wanting to create collectible recipe trading cards for users.
>
> **Date:** 2024-11-30
>
> **Package Version:** 0.0.1

---

## Overview

This document captures detailed customer feedback for the `svelte-trading-cards` package from the perspective of a non-gaming use case. Each point needs investigation to determine validity and potential solutions.

---

## Critical Blockers

These issues prevent adoption for the recipe cards use case.

### 1. ~~No Multi-Line Text / Description Support~~

**Status:** [ ] Investigating | [ ] Valid | [x] Not Required | [ ] Implemented

**Original Problem:**
The `TextField` component renders single-line auto-fit text. Recipe cards require paragraph text for descriptions.

**Resolution: NOT REQUIRED**

After investigation, this is **working as intended**. The trading card format should enforce brevity:

1. **TextField behavior is correct** - It scales text between `minFontSize` and `maxFontSize` to fit the container. This is auto-fit, not single-line forcing.

2. **SVG text doesn't wrap naturally** - Multi-line would require either:
   - `<tspan>` elements with manual line breaks (user pre-formats data as array)
   - `<foreignObject>` with HTML (breaks PNG export, security concerns)
   - Expensive text measurement for auto-wrapping

3. **Trading cards should be compact** - A Pokemon card doesn't have paragraphs. Recipe cards should show:
   - Hero image
   - Title (TextField works fine)
   - Stats (prep time, servings, etc.)
   - Badges (Vegan, Quick, etc.)
   - The full description lives on the website, not the card

4. **List component (Issue #4)** solves structured content like ingredients

**Conclusion:** The constraint is a feature, not a bug. Cards enforce brevity by design.

---

### 2. StatPanel Label Presets Are Gaming-Focused + 3. Badge Text Presets Miss Recipe Labels

**Status:** [ ] Investigating | [ ] Valid | [ ] Invalid | [x] Implemented

> **Note:** Issues #2 and #3 are combined as they share the same solution: a unified preset system.

**Problem:**
Current presets are hardcoded and gaming-focused. Other domains (recipes, sports, business) need different labels, but free text input is a security risk with end-user card creation.

**Current State:**
- `StatPanel` has gaming labels: `ATTACK`, `DEFENSE`, `HP`, `MANA`, etc.
- `Badge` has rarity labels: `COMMON`, `RARE`, `LEGENDARY`, etc.
- Labels are defined inline in component schemas
- No way to extend without modifying source

**Chosen Solution: Dataset-Based Preset System**

Create a centralized presets system that:
1. Organizes labels by dataset (PlayStation, Xbox, Steam, Recipes, etc.)
2. Has shared categories available to all datasets (Rarity, Status, Editions, General)
3. Is easy to extend (just add to a constants file)
4. Works across ALL text-based components (TextField, Badge, Ribbon, StatPanel, Stamp, etc.)
5. Maintains "no free text" security model

---

#### Implementation Plan

##### File Structure

```
src/lib/presets/
├── index.ts                  # Main exports + helper functions
├── datasets/
│   ├── index.ts              # Re-exports all datasets
│   ├── playstation.ts        # PlayStation-specific labels
│   ├── xbox.ts               # Xbox-specific labels
│   └── steam.ts              # Steam-specific labels
└── shared/
    ├── index.ts              # Re-exports all shared categories
    ├── rarity.ts             # COMMON, RARE, LEGENDARY, etc.
    ├── status.ts             # NEW, HOT, FEATURED, TRENDING, etc.
    ├── editions.ts           # 1ST EDITION, COLLECTOR, etc.
    └── general.ts            # SALE, BEST SELLER, etc.
```

##### Shared Categories (`src/lib/presets/shared/`)

**rarity.ts**
```typescript
export const RARITY_LABELS = [
  'COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY', 'MYTHIC'
] as const;

export type RarityLabel = typeof RARITY_LABELS[number];
```

**status.ts**
```typescript
export const STATUS_LABELS = [
  'NEW', 'HOT', 'FEATURED', 'TRENDING', 'VERIFIED',
  'POPULAR', 'RECOMMENDED', 'TOP RATED', 'EDITORS CHOICE'
] as const;

export type StatusLabel = typeof STATUS_LABELS[number];
```

**editions.ts**
```typescript
export const EDITION_LABELS = [
  '1ST EDITION', 'LIMITED EDITION', 'COLLECTOR', 'SPECIAL',
  'PREMIUM', 'ULTRA', 'DELUXE', 'STANDARD', 'FOUNDERS'
] as const;

export type EditionLabel = typeof EDITION_LABELS[number];
```

**general.ts**
```typescript
export const GENERAL_LABELS = [
  'SALE', 'BEST SELLER', 'STAFF PICK', 'EXCLUSIVE',
  'PROMO', 'LIMITED', 'SOLD OUT', 'COMING SOON', 'PRE-ORDER',
  'NONE'  // Empty/no text option
] as const;

export type GeneralLabel = typeof GENERAL_LABELS[number];
```

**shared/index.ts**
```typescript
export * from './rarity.js';
export * from './status.js';
export * from './editions.js';
export * from './general.js';

import { RARITY_LABELS } from './rarity.js';
import { STATUS_LABELS } from './status.js';
import { EDITION_LABELS } from './editions.js';
import { GENERAL_LABELS } from './general.js';

export const SHARED_LABELS = [
  ...RARITY_LABELS,
  ...STATUS_LABELS,
  ...EDITION_LABELS,
  ...GENERAL_LABELS
] as const;

export type SharedLabel = typeof SHARED_LABELS[number];
```

##### Dataset-Specific Labels (`src/lib/presets/datasets/`)

**playstation.ts**
```typescript
export const PLAYSTATION_LABELS = [
  // Platform identifiers
  'PSN ID', 'PLAYER',

  // Trophy types
  'PLATINUM', 'GOLD', 'SILVER', 'BRONZE', 'TROPHY COUNT', 'TROPHIES',

  // Progress/Stats
  'COMPLETION', 'PLAYTIME', 'HOURS PLAYED', 'LAST SYNCED', 'LAST PLAYED',

  // Platform tags
  'PS5', 'PS4', 'PS VR', 'PS VR2', 'PS PLUS',

  // Game categories
  'EXCLUSIVE', 'INDIE', 'AAA', 'REMASTER', 'REMAKE'
] as const;

export type PlayStationLabel = typeof PLAYSTATION_LABELS[number];
```

**xbox.ts**
```typescript
export const XBOX_LABELS = [
  // Platform identifiers
  'GAMERTAG', 'PLAYER',

  // Achievement system
  'GAMERSCORE', 'ACHIEVEMENTS', 'ACHIEVEMENT COUNT',

  // Progress/Stats
  'HOURS PLAYED', 'PLAYTIME', 'COMPLETION', 'LAST PLAYED',

  // Platform tags
  'XBOX SERIES X', 'XBOX SERIES S', 'XBOX ONE', 'XBOX 360',
  'GAME PASS', 'GAME PASS ULTIMATE', 'BACKWARDS COMPATIBLE',

  // Game categories
  'EXCLUSIVE', 'CONSOLE EXCLUSIVE', 'DAY ONE', 'OPTIMIZED'
] as const;

export type XboxLabel = typeof XBOX_LABELS[number];
```

**steam.ts**
```typescript
export const STEAM_LABELS = [
  // Platform identifiers
  'STEAM ID', 'PLAYER',

  // Achievement system
  'ACHIEVEMENTS', 'ACHIEVEMENT COUNT', 'PERFECT GAME',

  // Progress/Stats
  'HOURS PLAYED', 'PLAYTIME', 'COMPLETION', 'LAST PLAYED',
  'PLAYTIME FOREVER', 'PLAYTIME 2 WEEKS',

  // Platform tags
  'STEAM DECK', 'STEAM DECK VERIFIED', 'STEAM DECK PLAYABLE',
  'VR SUPPORTED', 'VR ONLY', 'CONTROLLER SUPPORT',

  // Game categories
  'EARLY ACCESS', 'FREE TO PLAY', 'INDIE', 'AAA',
  'WORKSHOP', 'TRADING CARDS', 'CLOUD SAVES'
] as const;

export type SteamLabel = typeof STEAM_LABELS[number];
```

**datasets/index.ts**
```typescript
export * from './playstation.js';
export * from './xbox.js';
export * from './steam.js';

import { PLAYSTATION_LABELS } from './playstation.js';
import { XBOX_LABELS } from './xbox.js';
import { STEAM_LABELS } from './steam.js';

export const DATASET_LABELS = {
  playstation: PLAYSTATION_LABELS,
  xbox: XBOX_LABELS,
  steam: STEAM_LABELS
} as const;

export type DatasetId = keyof typeof DATASET_LABELS;
```

##### Main Export (`src/lib/presets/index.ts`)

```typescript
import {
  SHARED_LABELS,
  RARITY_LABELS,
  STATUS_LABELS,
  EDITION_LABELS,
  GENERAL_LABELS
} from './shared/index.js';

import {
  DATASET_LABELS,
  PLAYSTATION_LABELS,
  XBOX_LABELS,
  STEAM_LABELS
} from './datasets/index.js';

import type { DatasetId } from './datasets/index.js';

// Re-export everything
export * from './shared/index.js';
export * from './datasets/index.js';

/**
 * Get all available labels for a dataset.
 * Returns dataset-specific labels + all shared labels.
 */
export function getLabelsForDataset(datasetId: DatasetId): readonly string[] {
  const specific = DATASET_LABELS[datasetId] ?? [];
  return [...specific, ...SHARED_LABELS] as readonly string[];
}

/**
 * Get labels organized by category for UI dropdowns.
 * Enables grouped dropdown display with section headers.
 */
export function getLabelsByCategory(datasetId: DatasetId) {
  return {
    specific: DATASET_LABELS[datasetId] ?? [],
    rarity: RARITY_LABELS,
    status: STATUS_LABELS,
    editions: EDITION_LABELS,
    general: GENERAL_LABELS
  };
}

/**
 * Check if a label is valid for a given dataset.
 */
export function isValidLabel(datasetId: DatasetId, label: string): boolean {
  const allLabels = getLabelsForDataset(datasetId);
  return allLabels.includes(label);
}

/**
 * Type for any valid label (specific or shared)
 */
export type AnyLabel =
  | typeof PLAYSTATION_LABELS[number]
  | typeof XBOX_LABELS[number]
  | typeof STEAM_LABELS[number]
  | typeof SHARED_LABELS[number];
```

##### Usage in Components

**In CardCreator or any component needing labels:**
```typescript
import { getLabelsForDataset, getLabelsByCategory } from '$lib/presets';

// Get flat list for validation
const allLabels = getLabelsForDataset('playstation');
// → ['PSN ID', 'PLATINUM', 'GOLD', ..., 'COMMON', 'RARE', ..., 'NEW', 'HOT', ...]

// Get categorized for dropdown UI
const categorized = getLabelsByCategory('playstation');
// → {
//     specific: ['PSN ID', 'PLATINUM', 'GOLD', ...],
//     rarity: ['COMMON', 'UNCOMMON', 'RARE', ...],
//     status: ['NEW', 'HOT', 'FEATURED', ...],
//     editions: ['1ST EDITION', 'LIMITED EDITION', ...],
//     general: ['SALE', 'BEST SELLER', ...]
//   }
```

**Dropdown UI with grouped options:**
```
┌─────────────────────────────┐
│ Select Label           ▼   │
├─────────────────────────────┤
│ ── PlayStation ──           │  ← Dataset-specific header
│   PSN ID                    │
│   TROPHY COUNT              │
│   PLATINUM                  │
│   GOLD                      │
│   SILVER                    │
│   BRONZE                    │
├─────────────────────────────┤
│ ── Rarity ──                │  ← Shared category header
│   COMMON                    │
│   UNCOMMON                  │
│   RARE                      │
│   EPIC                      │
│   LEGENDARY                 │
│   MYTHIC                    │
├─────────────────────────────┤
│ ── Status ──                │
│   NEW                       │
│   HOT                       │
│   FEATURED                  │
│   TRENDING                  │
├─────────────────────────────┤
│ ── Editions ──              │
│   1ST EDITION               │
│   LIMITED EDITION           │
│   COLLECTOR                 │
├─────────────────────────────┤
│ ── General ──               │
│   SALE                      │
│   BEST SELLER               │
│   NONE                      │
└─────────────────────────────┘
```

##### Adding a New Dataset (Future Example: Recipes)

Create one new file:

**datasets/recipes.ts**
```typescript
export const RECIPE_LABELS = [
  // Time-based
  'PREP TIME', 'COOK TIME', 'TOTAL TIME', 'REST TIME',

  // Nutritional
  'CALORIES', 'PROTEIN', 'CARBS', 'FAT', 'FIBER', 'SODIUM', 'SUGAR',

  // Serving info
  'SERVINGS', 'YIELD', 'PORTION SIZE',

  // Difficulty/Cost
  'DIFFICULTY', 'COST', 'SKILL LEVEL',

  // Dietary (dataset-specific, not shared since other domains don't use these)
  'VEGAN', 'VEGETARIAN', 'GLUTEN-FREE', 'DAIRY-FREE', 'NUT-FREE',
  'KETO', 'PALEO', 'LOW-CARB', 'HIGH-PROTEIN',

  // Time/Ease
  'QUICK', 'EASY', 'UNDER 30 MIN', 'ONE-POT', '5 INGREDIENTS',

  // Occasion
  'BUDGET', 'FAMILY', 'DATE NIGHT', 'MEAL PREP', 'WEEKNIGHT',

  // Features
  'FREEZER-FRIENDLY', 'KID-APPROVED', 'MAKE-AHEAD', 'NO-BAKE'
] as const;

export type RecipeLabel = typeof RECIPE_LABELS[number];
```

Then update the registry:

**datasets/index.ts**
```typescript
import { RECIPE_LABELS } from './recipes.js';

export const DATASET_LABELS = {
  playstation: PLAYSTATION_LABELS,
  xbox: XBOX_LABELS,
  steam: STEAM_LABELS,
  recipes: RECIPE_LABELS  // ← Just add here
} as const;
```

That's it - all components automatically get the new labels.

---

#### Files to Create

| File | Purpose |
|------|---------|
| `src/lib/presets/index.ts` | Main exports and helper functions |
| `src/lib/presets/shared/index.ts` | Re-export all shared categories |
| `src/lib/presets/shared/rarity.ts` | Rarity labels (COMMON, RARE, etc.) |
| `src/lib/presets/shared/status.ts` | Status labels (NEW, HOT, etc.) |
| `src/lib/presets/shared/editions.ts` | Edition labels (1ST EDITION, etc.) |
| `src/lib/presets/shared/general.ts` | General labels (SALE, NONE, etc.) |
| `src/lib/presets/datasets/index.ts` | Re-export all datasets |
| `src/lib/presets/datasets/playstation.ts` | PlayStation-specific labels |
| `src/lib/presets/datasets/xbox.ts` | Xbox-specific labels |
| `src/lib/presets/datasets/steam.ts` | Steam-specific labels |

#### Files to Modify

| File | Changes |
|------|---------|
| `src/lib/index.ts` | Export presets module |
| `src/lib/components/fields/StatPanel.svelte` | Import and use presets instead of inline schema |
| `src/lib/components/decorations/Badge.svelte` | Import and use presets instead of inline schema |
| `src/lib/components/decorations/Ribbon.svelte` | Import and use presets (if applicable) |
| `src/lib/components/decorations/Stamp.svelte` | Import and use presets (if applicable) |
| `src/lib/creator/CardCreator.svelte` | Pass current dataset ID to child components |
| `src/lib/creator/components/panels/StatPanelPanel.svelte` | Use categorized dropdown |
| `src/lib/creator/components/panels/BadgePanel.svelte` | Use categorized dropdown |

---

#### Benefits

| Benefit | Description |
|---------|-------------|
| **Single source of truth** | One place to add/modify labels |
| **Type-safe** | `as const` provides literal types and autocomplete |
| **Easy to extend** | Add dataset = add one file + update registry |
| **No runtime cost** | Constants are compiled away |
| **Secure** | No free text input, only predefined options |
| **Shared across components** | Same labels in Badge, Stat, Ribbon, TextField, etc. |
| **Categorized UI** | Grouped dropdowns improve UX |
| **Future-proof** | Database-driven presets can extend/override later |

---

### 4. List Component for Array Data

**Status:** [ ] Investigating | [ ] Valid | [ ] Invalid | [x] Implemented

**Problem:**
No component renders arrays as formatted lists. Use cases include ingredients, equipment, tags, steps, features, etc.

**Decision: New Component (Option B)**

After analysis, a new `List` component is the correct approach rather than extending `StatPanel`:

| Aspect | StatPanel | List |
|--------|-----------|------|
| Data source | Multiple fields, one per row | Single array field |
| Row config | Manual (each row defined in creator) | Automatic (from data array) |
| Labels | Required (preset per row) | Optional (bullet/number only) |
| Row count | Fixed at design time | Dynamic from data |
| Purpose | Key-value pairs | Single-column items |

StatPanel remains unchanged - no breaking changes.

---

#### Implementation Plan

##### Component Props Schema

**List.svelte**
```typescript
import { z } from 'zod';
import { AnimationConfigSchema } from '$lib/animations/types.js';
import { EffectConfigSchema } from '$lib/effects/types.js';

export const ListStyleSchema = z.enum(['bullet', 'numbered', 'dash', 'arrow', 'none']);
export type ListStyle = z.infer<typeof ListStyleSchema>;

export const ListPropsSchema = z.object({
  // Data binding - accepts array OR delimited string
  dataField: z.string(),
  delimiter: z.string().default(','),  // Split string by this if not array

  // Display style
  style: ListStyleSchema.default('bullet'),

  // Typography
  fontSize: z.number().default(14),
  fontFamily: z.string().default('Arial, sans-serif'),
  fontWeight: z.string().default('normal'),
  color: z.string().default('#ffffff'),
  lineHeight: z.number().default(1.6),

  // Bullet/number styling
  bulletColor: z.string().optional(),      // Defaults to color if not set
  bulletSize: z.number().optional(),       // Defaults to fontSize
  numberPadding: z.number().default(2),    // Space after number/bullet

  // Layout
  alignment: z.enum(['left', 'center', 'right']).default('left'),
  verticalAlign: z.enum(['top', 'center', 'bottom']).default('top'),
  itemSpacing: z.number().default(4),      // Gap between items (px)
  indent: z.number().default(20),          // Bullet/number indent width

  // Overflow handling
  maxItems: z.number().optional(),         // Truncate after N items
  overflowText: z.string().default('+{n} more'),  // {n} = remaining count
  overflowColor: z.string().optional(),    // Defaults to color with opacity

  // General
  opacity: z.number().min(0).max(1).default(1),
  animation: AnimationConfigSchema.optional(),
  effect: EffectConfigSchema.optional()
});

export type ListProps = z.infer<typeof ListPropsSchema>;
```

##### Data Handling

The component accepts two data formats:

**Format 1: Array (preferred)**
```json
{
  "ingredients": [
    "2 cups flour",
    "1 cup sugar",
    "1/2 cup butter"
  ]
}
```

**Format 2: Delimited String**
```json
{
  "ingredients": "2 cups flour, 1 cup sugar, 1/2 cup butter"
}
```

**Resolution logic:**
```typescript
const resolvedItems = $derived.by(() => {
  if (!dataField || !data) return [];

  const rawValue = data[dataField];

  // Already an array
  if (Array.isArray(rawValue)) {
    return rawValue.map(item => String(item));
  }

  // String - split by delimiter
  if (typeof rawValue === 'string') {
    return rawValue
      .split(delimiter)
      .map(item => item.trim())
      .filter(item => item.length > 0);
  }

  return [];
});

// Apply maxItems truncation
const displayItems = $derived.by(() => {
  if (!maxItems || resolvedItems.length <= maxItems) {
    return { items: resolvedItems, overflow: 0 };
  }
  return {
    items: resolvedItems.slice(0, maxItems),
    overflow: resolvedItems.length - maxItems
  };
});
```

##### SVG Rendering

Each list item rendered as SVG `<text>` with calculated Y position:

```svelte
<g opacity={opacity}>
  {#each displayItems.items as item, index (index)}
    {@const y = startY + (index * itemHeight)}

    <!-- Bullet/Number -->
    {#if style === 'bullet'}
      <circle
        cx={bulletX}
        cy={y + fontSize * 0.35}
        r={bulletRadius}
        fill={bulletColor ?? color}
      />
    {:else if style === 'numbered'}
      <text
        x={bulletX}
        y={y}
        font-size={fontSize}
        fill={bulletColor ?? color}
        dominant-baseline="hanging"
      >
        {index + 1}.
      </text>
    {:else if style === 'dash'}
      <text
        x={bulletX}
        y={y}
        font-size={fontSize}
        fill={bulletColor ?? color}
        dominant-baseline="hanging"
      >
        –
      </text>
    {:else if style === 'arrow'}
      <text
        x={bulletX}
        y={y}
        font-size={fontSize}
        fill={bulletColor ?? color}
        dominant-baseline="hanging"
      >
        →
      </text>
    {/if}

    <!-- Item text -->
    <text
      x={textX}
      y={y}
      font-family={fontFamily}
      font-size={fontSize}
      font-weight={fontWeight}
      fill={color}
      dominant-baseline="hanging"
    >
      {item}
    </text>
  {/each}

  <!-- Overflow indicator -->
  {#if displayItems.overflow > 0}
    {@const y = startY + (displayItems.items.length * itemHeight)}
    <text
      x={textX}
      y={y}
      font-family={fontFamily}
      font-size={fontSize * 0.9}
      font-style="italic"
      fill={overflowColor ?? color}
      opacity={0.7}
      dominant-baseline="hanging"
    >
      {overflowText.replace('{n}', String(displayItems.overflow))}
    </text>
  {/if}
</g>
```

##### Visual Examples

**Bullet style (default):**
```
┌─────────────────────────────────┐
│ • 2 cups flour                  │
│ • 1 cup sugar                   │
│ • 1/2 cup butter                │
│ • 2 eggs                        │
└─────────────────────────────────┘
```

**Numbered style:**
```
┌─────────────────────────────────┐
│ 1. Preheat oven to 350°F        │
│ 2. Mix dry ingredients          │
│ 3. Add wet ingredients          │
│ 4. Bake for 25 minutes          │
└─────────────────────────────────┘
```

**Dash style:**
```
┌─────────────────────────────────┐
│ – Mixing bowl                   │
│ – Whisk                         │
│ – Baking sheet                  │
└─────────────────────────────────┘
```

**With overflow (maxItems: 3):**
```
┌─────────────────────────────────┐
│ • 2 cups flour                  │
│ • 1 cup sugar                   │
│ • 1/2 cup butter                │
│ +4 more                         │
└─────────────────────────────────┘
```

##### Creator Panel

**ListPanel.svelte structure:**

```
┌─────────────────────────────────────────┐
│ List                              [x] ▼ │
├─────────────────────────────────────────┤
│ Data Field     [ingredients        ▼]   │
│ Delimiter      [,                   ]   │
├─────────────────────────────────────────┤
│ Style          [● Bullet ○ Numbered    ]│
│                [○ Dash   ○ Arrow ○ None]│
├─────────────────────────────────────────┤
│ Font Size      [14         ] px         │
│ Font Family    [Arial              ▼]   │
│ Text Color     [■ #ffffff          ]    │
│ Bullet Color   [■ #3b82f6          ]    │
├─────────────────────────────────────────┤
│ Line Height    [1.6        ]            │
│ Item Spacing   [4          ] px         │
│ Indent         [20         ] px         │
├─────────────────────────────────────────┤
│ Max Items      [          ] (optional)  │
│ Overflow Text  [+{n} more          ]    │
├─────────────────────────────────────────┤
│ Alignment      [Left ▼]                 │
│ Vertical Align [Top  ▼]                 │
│ Opacity        [━━━━━━━━━●] 100%        │
├─────────────────────────────────────────┤
│ [+ Add Effect]                          │
└─────────────────────────────────────────┘
```

##### Creator Types

**Add to `src/lib/creator/types.ts`:**

```typescript
export interface ListComponent {
  type: 'list';
  id: string;
  visible: boolean;
  dataField: string;
  delimiter: string;
  style: 'bullet' | 'numbered' | 'dash' | 'arrow' | 'none';
  fontSize: number;
  fontFamily: string;
  fontWeight: string;
  color: string;
  lineHeight: number;
  bulletColor?: string;
  bulletSize?: number;
  numberPadding: number;
  alignment: 'left' | 'center' | 'right';
  verticalAlign: 'top' | 'center' | 'bottom';
  itemSpacing: number;
  indent: number;
  maxItems?: number;
  overflowText: string;
  overflowColor?: string;
  opacity: number;
  effect?: EffectConfig;
}

// Add to ComponentItem union
export type ComponentItem =
  | TextComponent
  | ImageComponent
  | BackgroundComponent
  | BorderComponent
  | IconComponent
  | BadgeComponent
  | StatPanelComponent
  | ListComponent           // ← Add here
  | DividerComponent
  | ProgressBarComponent
  | RibbonComponent
  | FrameComponent
  | StampComponent;
```

##### State Factory

**Add to `src/lib/creator/state.svelte.ts`:**

```typescript
export function createListComponent(): ListComponent {
  return {
    type: 'list',
    id: generateId(),
    visible: true,
    dataField: '',
    delimiter: ',',
    style: 'bullet',
    fontSize: 14,
    fontFamily: 'Arial, sans-serif',
    fontWeight: 'normal',
    color: '#ffffff',
    lineHeight: 1.6,
    bulletColor: undefined,
    bulletSize: undefined,
    numberPadding: 2,
    alignment: 'left',
    verticalAlign: 'top',
    itemSpacing: 4,
    indent: 20,
    maxItems: undefined,
    overflowText: '+{n} more',
    overflowColor: undefined,
    opacity: 1,
    effect: undefined
  };
}
```

---

#### Files to Create

| File | Purpose |
|------|---------|
| `src/lib/components/fields/List.svelte` | New List component |
| `src/lib/creator/components/panels/ListPanel.svelte` | Creator UI panel for List |

#### Files to Modify

| File | Changes |
|------|---------|
| `src/lib/components/fields/index.ts` | Export List component |
| `src/lib/index.ts` | Export List from main entry |
| `src/lib/creator/types.ts` | Add ListComponent interface |
| `src/lib/creator/state.svelte.ts` | Add createListComponent factory |
| `src/lib/creator/CardCreator.svelte` | Register List, add handlers |
| `src/lib/creator/components/PropertiesPanel.svelte` | Add ListPanel |
| `src/lib/creator/components/ComponentPanel.svelte` | Add "List" to component menu |

---

#### Compatibility Notes

| Requirement | Status |
|-------------|--------|
| SVG-only rendering | ✓ Uses `<text>` and `<circle>` elements |
| PNG export | ✓ No foreignObject, works with resvg |
| Animation support | ✓ Wrapped in AnimationWrapper |
| Effect support | ✓ Wrapped in EffectWrapper |
| Container-aware | ✓ Uses container context for positioning |
| Data binding | ✓ Uses dataField like other components |
| No breaking changes | ✓ StatPanel unchanged |

---

#### Edge Cases to Handle

| Case | Handling |
|------|----------|
| Empty array | Render nothing (or placeholder if desired) |
| Non-array/non-string data | Convert to string, treat as single item |
| Very long items | Truncate with ellipsis (future: text fitting) |
| Items overflow container | Respect maxItems, show overflow indicator |
| Null/undefined dataField | Render nothing |
| Empty strings after split | Filter out empty strings |

---

## Major Gaps

These can be worked around but cause friction.

### 5. Font Options Are Very Limited

**Status:** [ ] Investigating | [x] Valid | [ ] Invalid | [ ] Implementing

**Problem:**
Only 7 web-safe fonts available. Need more variety without complicating server-side PNG export.

**Chosen Solution: Expanded Web-Safe + Dataset Brand Fonts**

After investigation, Google Fonts integration is too complex for server-side rendering. Each font used would need to be:
1. Tracked per template
2. Font files passed to server
3. Loaded by resvg for PNG generation

Instead: **Expand web-safe fonts** (work everywhere) + **One brand font per dataset** (bundled with package).

---

#### Implementation Plan

##### Part 1: Expanded Web-Safe Fonts

Replace the current 7 fonts with a comprehensive web-safe list:

**`src/lib/fonts/web-safe.ts`**
```typescript
export interface FontOption {
  value: string;      // CSS font-family value
  label: string;      // Display name in UI
  category: 'sans-serif' | 'serif' | 'monospace' | 'display' | 'cursive';
}

export const WEB_SAFE_FONTS: FontOption[] = [
  // ═══════════════════════════════════════════════════════════════════
  // SANS-SERIF (clean, modern, readable)
  // ═══════════════════════════════════════════════════════════════════
  { value: 'Arial, sans-serif', label: 'Arial', category: 'sans-serif' },
  { value: 'Helvetica, Arial, sans-serif', label: 'Helvetica', category: 'sans-serif' },
  { value: 'Verdana, sans-serif', label: 'Verdana', category: 'sans-serif' },
  { value: 'Tahoma, sans-serif', label: 'Tahoma', category: 'sans-serif' },
  { value: 'Trebuchet MS, sans-serif', label: 'Trebuchet MS', category: 'sans-serif' },
  { value: 'Segoe UI, sans-serif', label: 'Segoe UI', category: 'sans-serif' },
  { value: 'Geneva, sans-serif', label: 'Geneva', category: 'sans-serif' },
  { value: 'Optima, sans-serif', label: 'Optima', category: 'sans-serif' },
  { value: 'Avenir, sans-serif', label: 'Avenir', category: 'sans-serif' },
  { value: 'Century Gothic, sans-serif', label: 'Century Gothic', category: 'sans-serif' },
  { value: 'Franklin Gothic Medium, sans-serif', label: 'Franklin Gothic', category: 'sans-serif' },
  { value: 'Futura, sans-serif', label: 'Futura', category: 'sans-serif' },
  { value: 'Gill Sans, sans-serif', label: 'Gill Sans', category: 'sans-serif' },

  // ═══════════════════════════════════════════════════════════════════
  // SERIF (elegant, traditional, editorial)
  // ═══════════════════════════════════════════════════════════════════
  { value: 'Georgia, serif', label: 'Georgia', category: 'serif' },
  { value: 'Times New Roman, serif', label: 'Times New Roman', category: 'serif' },
  { value: 'Palatino Linotype, Palatino, serif', label: 'Palatino', category: 'serif' },
  { value: 'Book Antiqua, Palatino, serif', label: 'Book Antiqua', category: 'serif' },
  { value: 'Garamond, serif', label: 'Garamond', category: 'serif' },
  { value: 'Baskerville, serif', label: 'Baskerville', category: 'serif' },
  { value: 'Didot, serif', label: 'Didot', category: 'serif' },
  { value: 'Bodoni MT, serif', label: 'Bodoni', category: 'serif' },
  { value: 'Cambria, serif', label: 'Cambria', category: 'serif' },
  { value: 'Rockwell, serif', label: 'Rockwell', category: 'serif' },

  // ═══════════════════════════════════════════════════════════════════
  // MONOSPACE (technical, code, retro)
  // ═══════════════════════════════════════════════════════════════════
  { value: 'Courier New, monospace', label: 'Courier New', category: 'monospace' },
  { value: 'Consolas, monospace', label: 'Consolas', category: 'monospace' },
  { value: 'Monaco, monospace', label: 'Monaco', category: 'monospace' },
  { value: 'Lucida Console, monospace', label: 'Lucida Console', category: 'monospace' },
  { value: 'Andale Mono, monospace', label: 'Andale Mono', category: 'monospace' },

  // ═══════════════════════════════════════════════════════════════════
  // DISPLAY (bold, impactful, headlines)
  // ═══════════════════════════════════════════════════════════════════
  { value: 'Impact, sans-serif', label: 'Impact', category: 'display' },
  { value: 'Arial Black, sans-serif', label: 'Arial Black', category: 'display' },
  { value: 'Copperplate, fantasy', label: 'Copperplate', category: 'display' },
  { value: 'Haettenschweiler, sans-serif', label: 'Haettenschweiler', category: 'display' },

  // ═══════════════════════════════════════════════════════════════════
  // CURSIVE/SCRIPT (decorative, handwritten, playful)
  // ═══════════════════════════════════════════════════════════════════
  { value: 'Brush Script MT, cursive', label: 'Brush Script', category: 'cursive' },
  { value: 'Lucida Handwriting, cursive', label: 'Lucida Handwriting', category: 'cursive' },
  { value: 'Comic Sans MS, cursive', label: 'Comic Sans', category: 'cursive' },
  { value: 'Snell Roundhand, cursive', label: 'Snell Roundhand', category: 'cursive' },
  { value: 'Zapfino, cursive', label: 'Zapfino', category: 'cursive' },
] as const;

export type WebSafeFont = typeof WEB_SAFE_FONTS[number];
```

##### Part 2: Dataset Brand Fonts (Custom Fonts)

Each dataset can have ONE brand font that gives it a unique identity. These fonts are bundled with the package.

**File Structure:**
```
src/lib/
├── fonts/
│   ├── index.ts              # Main exports
│   ├── web-safe.ts           # Web-safe fonts list
│   ├── brand-fonts.ts        # Brand font definitions
│   └── files/                # Actual font files (woff2)
│       ├── sst-regular.woff2         # PlayStation SST
│       ├── segoe-ui-bold.woff2       # Xbox (if not system)
│       └── motiva-sans.woff2         # Steam
```

**`src/lib/fonts/brand-fonts.ts`**
```typescript
export interface BrandFont {
  id: string;
  label: string;
  fontFamily: string;
  fileName: string;           // File in fonts/files/
  fallback: string;           // Web-safe fallback
  datasets: string[];         // Which datasets can use this
}

export const BRAND_FONTS: BrandFont[] = [
  {
    id: 'playstation-sst',
    label: 'SST (PlayStation)',
    fontFamily: 'SST, sans-serif',
    fileName: 'sst-regular.woff2',
    fallback: 'Segoe UI, sans-serif',
    datasets: ['playstation']
  },
  {
    id: 'xbox-segoe',
    label: 'Segoe UI Bold',
    fontFamily: 'Segoe UI, sans-serif',
    fileName: null,  // System font, no file needed
    fallback: 'Arial, sans-serif',
    datasets: ['xbox']
  },
  {
    id: 'steam-motiva',
    label: 'Motiva Sans (Steam)',
    fontFamily: 'Motiva Sans, sans-serif',
    fileName: 'motiva-sans.woff2',
    fallback: 'Arial, sans-serif',
    datasets: ['steam']
  },
  // Future: Add recipe brand font, etc.
] as const;

/**
 * Get brand fonts available for a specific dataset
 */
export function getBrandFontsForDataset(datasetId: string): BrandFont[] {
  return BRAND_FONTS.filter(f => f.datasets.includes(datasetId));
}

/**
 * Get all fonts for a dataset (web-safe + brand fonts)
 */
export function getAllFontsForDataset(datasetId: string): FontOption[] {
  const brandFonts = getBrandFontsForDataset(datasetId).map(f => ({
    value: f.fontFamily,
    label: f.label,
    category: 'brand' as const
  }));

  return [...brandFonts, ...WEB_SAFE_FONTS];
}
```

##### Part 3: Font Loading

**Browser (CSS injection):**
```typescript
// src/lib/fonts/loader.ts

/**
 * Generates @font-face CSS for brand fonts
 */
export function generateFontFaceCSS(): string {
  return BRAND_FONTS
    .filter(f => f.fileName)  // Only fonts with files
    .map(f => `
      @font-face {
        font-family: '${f.fontFamily.split(',')[0].trim()}';
        src: url('/fonts/${f.fileName}') format('woff2');
        font-weight: normal;
        font-style: normal;
        font-display: swap;
      }
    `)
    .join('\n');
}

/**
 * Inject font CSS into document head
 * Call this once on app init
 */
export function loadBrandFonts(): void {
  if (typeof document === 'undefined') return;

  const style = document.createElement('style');
  style.id = 'svelte-trading-cards-fonts';
  style.textContent = generateFontFaceCSS();
  document.head.appendChild(style);
}
```

**Server-side (resvg):**
```typescript
// src/lib/server/render.ts

import { BRAND_FONTS } from '$lib/fonts/brand-fonts.js';
import path from 'path';

/**
 * Get font file paths for server-side rendering
 */
export function getFontFilePaths(): string[] {
  const fontsDir = path.join(__dirname, '../fonts/files');

  return BRAND_FONTS
    .filter(f => f.fileName)
    .map(f => path.join(fontsDir, f.fileName));
}

// In svgToPNG:
const resvg = new Resvg(svg, {
  font: {
    fontFiles: getFontFilePaths(),
    loadSystemFonts: true,
  }
});
```

##### Part 4: Creator Integration

**In CardCreator, pass fonts based on current dataset:**
```typescript
// CardCreator.svelte
import { getAllFontsForDataset } from '$lib/fonts';

const availableFonts = $derived(getAllFontsForDataset(selectedDataset));

// Pass to panels
<TextPanel fonts={availableFonts} ... />
<BadgePanel fonts={availableFonts} ... />
```

**Dropdown UI with categories:**
```
┌─────────────────────────────────┐
│ Font Family              ▼     │
├─────────────────────────────────┤
│ ── Brand ──                     │  ← Dataset-specific brand fonts
│   SST (PlayStation)             │
├─────────────────────────────────┤
│ ── Sans-Serif ──                │
│   Arial                         │
│   Helvetica                     │
│   Verdana                       │
│   ...                           │
├─────────────────────────────────┤
│ ── Serif ──                     │
│   Georgia                       │
│   Palatino                      │
│   ...                           │
├─────────────────────────────────┤
│ ── Display ──                   │
│   Impact                        │
│   Arial Black                   │
│   ...                           │
└─────────────────────────────────┘
```

---

#### Adding a New Brand Font (Future)

To add a new brand font (e.g., for recipes):

**1. Add font file:**
```
src/lib/fonts/files/recipe-script.woff2
```

**2. Register in brand-fonts.ts:**
```typescript
{
  id: 'recipe-script',
  label: 'Recipe Script',
  fontFamily: 'Recipe Script, cursive',
  fileName: 'recipe-script.woff2',
  fallback: 'Brush Script MT, cursive',
  datasets: ['recipes']
}
```

That's it - server-side and client-side automatically pick it up.

---

#### Files to Create

| File | Purpose |
|------|---------|
| `src/lib/fonts/index.ts` | Main exports |
| `src/lib/fonts/web-safe.ts` | Web-safe fonts list |
| `src/lib/fonts/brand-fonts.ts` | Brand font definitions |
| `src/lib/fonts/loader.ts` | Browser font loading |
| `src/lib/fonts/files/*.woff2` | Actual font files |

#### Files to Modify

| File | Changes |
|------|---------|
| `src/lib/index.ts` | Export fonts module |
| `src/lib/creator/types.ts` | Remove inline fontFamilies array |
| `src/lib/creator/CardCreator.svelte` | Use dataset-aware fonts |
| `src/lib/creator/components/panels/TextPanel.svelte` | Categorized font dropdown |
| `src/lib/creator/components/panels/BadgePanel.svelte` | Use new fonts |
| `src/lib/server/svgToPNG.ts` | Load brand font files |

---

#### Benefits

| Benefit | Description |
|---------|-------------|
| **Simple** | No Google Fonts API complexity |
| **Reliable** | Web-safe fonts work everywhere |
| **Branded** | Each dataset gets a unique identity |
| **Server-safe** | All fonts available for PNG export |
| **Easy to extend** | Add font file + register = done |
| **Categorized UI** | Organized dropdown improves UX |

---

#### Font File Considerations

| Consideration | Notes |
|---------------|-------|
| **File size** | ~20-50KB per woff2 font, acceptable |
| **Licensing** | Ensure fonts are licensed for distribution |
| **Variants** | Start with Regular only, add Bold/Italic if needed |
| **Fallbacks** | Each brand font has web-safe fallback |

---

### ~~6. Fixed Card Dimensions (2.5" x 3.5")~~

**Status:** [ ] Investigating | [ ] Valid | [x] Not Required | [ ] Implemented

**Resolution: NOT REQUIRED**

This is a **trading card** library. The standard trading card size (2.5" × 3.5" / 750×1050px) is intentional.

- Physical trading cards are this size
- Consistent sizing simplifies template sharing
- Components are designed for this aspect ratio
- Social media sizes are a different product (image generator, not trading cards)

If social media exports are needed in the future, consider a separate export utility that adds padding/backgrounds around the standard card size, rather than changing the card dimensions themselves.

---

### 7. QR Code Component

**Status:** [ ] Investigating | [x] Valid | [ ] Invalid | [x] Future Feature

**Problem:**
QR codes linking to full content online would be valuable for physical cards.

**Decision: FUTURE FEATURE**

This is a cool addition but needs more thought on implementation:

#### Open Questions

**1. Where does the URL come from?**

| Option | Example | Pros | Cons |
|--------|---------|------|------|
| Data field | `{ "gameUrl": "https://..." }` | Simple, flexible | Data must include URLs |
| URL template | `https://psnprofiles.com/game/{gameId}` | Auto-generate from ID | Platform-specific logic |
| Static URL | Hardcoded in template | Simple | Same for all cards |

**2. Platform-specific URL patterns:**
```typescript
// Could define URL templates per dataset
const URL_TEMPLATES = {
  playstation: 'https://psnprofiles.com/game/{id}',
  xbox: 'https://trueachievements.com/game/{id}',
  steam: 'https://store.steampowered.com/app/{id}',
  recipes: 'https://mysite.com/recipes/{id}'
};
```

**3. What if no URL is available?**
- Hide QR code entirely?
- Show placeholder?
- Use a fallback URL?

#### Proposed Feature (When Implemented)

```typescript
{
  type: 'QRCode',
  props: {
    // URL source (one of these)
    dataField: 'gameUrl',              // Option A: From data
    urlTemplate: 'https://site/{id}',  // Option B: Template pattern
    staticUrl: 'https://...',          // Option C: Fixed URL

    // Styling
    size: 80,
    color: '#000000',
    backgroundColor: 'transparent',

    // QR options
    errorCorrection: 'M',  // L, M, Q, H

    // Fallback behavior
    hideIfEmpty: true
  }
}
```

#### Dependencies to Consider
- `qrcode` - Popular, lightweight, SVG output
- `qr-code-styling` - More customizable but larger bundle

#### Why Pause?
1. Need to decide URL strategy per dataset
2. Bundle size consideration (~15-30KB for QR lib)
3. Lower priority than core functionality (presets, list, fonts)
4. Can be added later without breaking changes

**Revisit after core features are implemented.**

---

### 8. IconRating Component (Stars, Hearts, etc.)

**Status:** [ ] Investigating | [ ] Valid | [ ] Invalid | [x] Implemented

**Problem:**
No component for displaying ratings with icons. Need stars for reviews, hearts for favorites, peppers for spiciness, skulls for difficulty, etc.

**Decision: New Separate Component**

Not ProgressBar - different UX patterns:

| Component | Purpose | Visual |
|-----------|---------|--------|
| ProgressBar | Continuous progress | `[████████░░]` |
| IconRating | Discrete icon rating | `★★★★☆` |

---

#### Implementation Plan

##### Preset Rating Icons

Common icons for ratings, with "Custom" option for Iconify picker:

```typescript
// src/lib/components/decorations/IconRating.svelte

export const RATING_ICON_PRESETS = [
  {
    id: 'star',
    label: 'Star',
    iconName: 'mdi:star',
    iconData: { body: '...', width: 24, height: 24 }  // Pre-loaded
  },
  {
    id: 'heart',
    label: 'Heart',
    iconName: 'mdi:heart',
    iconData: { body: '...', width: 24, height: 24 }
  },
  {
    id: 'fire',
    label: 'Fire',
    iconName: 'mdi:fire',
    iconData: { body: '...', width: 24, height: 24 }
  },
  {
    id: 'thumbs-up',
    label: 'Thumbs Up',
    iconName: 'mdi:thumb-up',
    iconData: { body: '...', width: 24, height: 24 }
  },
  {
    id: 'lightning',
    label: 'Lightning',
    iconName: 'mdi:lightning-bolt',
    iconData: { body: '...', width: 24, height: 24 }
  },
  {
    id: 'trophy',
    label: 'Trophy',
    iconName: 'mdi:trophy',
    iconData: { body: '...', width: 24, height: 24 }
  },
  {
    id: 'diamond',
    label: 'Diamond',
    iconName: 'mdi:diamond-stone',
    iconData: { body: '...', width: 24, height: 24 }
  },
  {
    id: 'circle',
    label: 'Circle',
    iconName: 'mdi:circle',
    iconData: { body: '...', width: 24, height: 24 }
  },
  {
    id: 'pepper',
    label: 'Pepper',
    iconName: 'mdi:chili-mild',
    iconData: { body: '...', width: 24, height: 24 }
  },
  {
    id: 'skull',
    label: 'Skull',
    iconName: 'mdi:skull',
    iconData: { body: '...', width: 24, height: 24 }
  },
  {
    id: 'custom',
    label: 'Custom...',
    iconName: null,
    iconData: null  // Opens IconPicker
  }
] as const;

export type RatingIconPreset = typeof RATING_ICON_PRESETS[number]['id'];
```

##### Component Props Schema

```typescript
import { z } from 'zod';
import { IconDataSchema } from '$lib/components/icons/Icon.svelte';
import { AnimationConfigSchema } from '$lib/animations/types.js';
import { EffectConfigSchema } from '$lib/effects/types.js';

export const IconRatingPropsSchema = z.object({
  // Value source (one or the other)
  dataField: z.string().optional(),      // From data (e.g., 4.5)
  value: z.number().optional(),          // Or static value

  // Range
  max: z.number().default(5),            // Total icons to show
  min: z.number().default(0),            // Minimum value

  // Icon selection
  iconPreset: z.enum([
    'star', 'heart', 'fire', 'thumbs-up', 'lightning',
    'trophy', 'diamond', 'circle', 'pepper', 'skull', 'custom'
  ]).default('star'),
  customIcon: IconDataSchema.optional(), // When iconPreset === 'custom'
  customIconName: z.string().optional(),

  // Colors
  filledColor: z.string().default('#fbbf24'),   // Gold
  emptyColor: z.string().default('#374151'),    // Gray
  useEmptyOpacity: z.boolean().default(false),  // Use opacity instead of color
  emptyOpacity: z.number().default(0.3),

  // Layout
  size: z.number().default(24),          // Icon size in px
  gap: z.number().default(4),            // Space between icons

  // Half values
  allowHalf: z.boolean().default(true),  // Show half-filled icons

  // Value display
  showValue: z.boolean().default(false),
  valuePosition: z.enum(['left', 'right']).default('right'),
  valueFormat: z.enum(['decimal', 'fraction', 'percent']).default('decimal'),
  valueFontSize: z.number().default(14),
  valueFontFamily: z.string().default('Arial, sans-serif'),
  valueColor: z.string().default('#ffffff'),

  // General
  opacity: z.number().min(0).max(1).default(1),
  animation: AnimationConfigSchema.optional(),
  effect: EffectConfigSchema.optional()
});

export type IconRatingProps = z.infer<typeof IconRatingPropsSchema>;
```

##### SVG Rendering

```svelte
<script lang="ts">
  // ... props and setup

  // Resolve value from data or static
  const resolvedValue = $derived(
    dataField && data?.[dataField] !== undefined
      ? Number(data[dataField])
      : value ?? 0
  );

  // Calculate filled/half/empty counts
  const iconStates = $derived.by(() => {
    const val = Math.max(min, Math.min(max, resolvedValue));
    const filled = Math.floor(val);
    const hasHalf = allowHalf && (val - filled) >= 0.5;
    const empty = max - filled - (hasHalf ? 1 : 0);

    return { filled, hasHalf, empty };
  });

  // Get icon data (from preset or custom)
  const iconData = $derived(
    iconPreset === 'custom'
      ? customIcon
      : RATING_ICON_PRESETS.find(p => p.id === iconPreset)?.iconData
  );

  // Calculate total width for positioning
  const totalWidth = $derived(max * size + (max - 1) * gap);
</script>

<EffectWrapper {effect}>
  <AnimationWrapper {animation}>
    <g opacity={opacity}>
      <!-- Value display (left) -->
      {#if showValue && valuePosition === 'left'}
        <text
          x={0}
          y={size / 2}
          font-size={valueFontSize}
          font-family={valueFontFamily}
          fill={valueColor}
          dominant-baseline="central"
        >
          {formatValue(resolvedValue, valueFormat, max)}
        </text>
      {/if}

      <!-- Icons -->
      {#each Array(max) as _, index}
        {@const x = (showValue && valuePosition === 'left' ? valueWidth + gap : 0) + index * (size + gap)}
        {@const isFilled = index < iconStates.filled}
        {@const isHalf = !isFilled && index === iconStates.filled && iconStates.hasHalf}
        {@const isEmpty = !isFilled && !isHalf}

        <g transform="translate({x}, 0)">
          {#if isFilled}
            <!-- Fully filled icon -->
            <Icon {iconData} color={filledColor} size={size} />
          {:else if isHalf}
            <!-- Half-filled icon -->
            <defs>
              <clipPath id="half-clip-{index}">
                <rect x="0" y="0" width={size / 2} height={size} />
              </clipPath>
            </defs>
            <!-- Empty background -->
            <Icon
              {iconData}
              color={useEmptyOpacity ? filledColor : emptyColor}
              size={size}
              opacity={useEmptyOpacity ? emptyOpacity : 1}
            />
            <!-- Filled half (clipped) -->
            <g clip-path="url(#half-clip-{index})">
              <Icon {iconData} color={filledColor} size={size} />
            </g>
          {:else}
            <!-- Empty icon -->
            <Icon
              {iconData}
              color={useEmptyOpacity ? filledColor : emptyColor}
              size={size}
              opacity={useEmptyOpacity ? emptyOpacity : 1}
            />
          {/if}
        </g>
      {/each}

      <!-- Value display (right) -->
      {#if showValue && valuePosition === 'right'}
        <text
          x={totalWidth + gap}
          y={size / 2}
          font-size={valueFontSize}
          font-family={valueFontFamily}
          fill={valueColor}
          dominant-baseline="central"
        >
          {formatValue(resolvedValue, valueFormat, max)}
        </text>
      {/if}
    </g>
  </AnimationWrapper>
</EffectWrapper>
```

##### Value Formatting

```typescript
function formatValue(value: number, format: 'decimal' | 'fraction' | 'percent', max: number): string {
  switch (format) {
    case 'decimal':
      return value.toFixed(1);  // "4.5"
    case 'fraction':
      return `${value}/${max}`;  // "4.5/5"
    case 'percent':
      return `${Math.round((value / max) * 100)}%`;  // "90%"
    default:
      return String(value);
  }
}
```

##### Visual Examples

**Stars (default):**
```
★★★★☆  4.0
```

**Stars with half:**
```
★★★★◐  4.5/5
```

**Hearts:**
```
♥♥♥♡♡  3/5
```

**Fire/Hotness:**
```
🔥🔥🔥🔥○  4/5
```

**Peppers (spiciness):**
```
🌶️🌶️🌶️○○  Spicy
```

**Skulls (difficulty):**
```
💀💀💀💀💀  EXTREME
```

**Trophies (achievement level):**
```
🏆🏆🏆○○  Gold
```

##### Creator Panel

```
┌─────────────────────────────────────────┐
│ Icon Rating                       [x] ▼ │
├─────────────────────────────────────────┤
│ Data Field     [rating             ▼]   │
│ -or-                                    │
│ Static Value   [4.5        ]            │
├─────────────────────────────────────────┤
│ Icon                                    │
│ [★ Star] [♥ Heart] [🔥 Fire] [👍]       │
│ [⚡] [🏆] [💎] [●] [🌶️] [💀]           │
│ [📦 Custom...]                          │
├─────────────────────────────────────────┤
│ Max Icons      [5          ]            │
│ Icon Size      [24         ] px         │
│ Gap            [4          ] px         │
├─────────────────────────────────────────┤
│ Filled Color   [■ #fbbf24          ]    │
│ Empty Style    [● Color  ○ Opacity ]    │
│ Empty Color    [■ #374151          ]    │
│ Empty Opacity  [━━━━━━━━━●] 30%         │
├─────────────────────────────────────────┤
│ [x] Allow half icons                    │
├─────────────────────────────────────────┤
│ [ ] Show value                          │
│ Position       [Right ▼]                │
│ Format         [Decimal ▼]              │
│ Font Size      [14         ]            │
│ Color          [■ #ffffff          ]    │
├─────────────────────────────────────────┤
│ Opacity        [━━━━━━━━━●] 100%        │
├─────────────────────────────────────────┤
│ [+ Add Effect]                          │
└─────────────────────────────────────────┘
```

##### Creator Types

**Add to `src/lib/creator/types.ts`:**

```typescript
export interface IconRatingComponent {
  type: 'iconrating';
  id: string;
  visible: boolean;
  dataField?: string;
  value?: number;
  max: number;
  min: number;
  iconPreset: 'star' | 'heart' | 'fire' | 'thumbs-up' | 'lightning' |
              'trophy' | 'diamond' | 'circle' | 'pepper' | 'skull' | 'custom';
  customIcon?: IconData;
  customIconName?: string;
  filledColor: string;
  emptyColor: string;
  useEmptyOpacity: boolean;
  emptyOpacity: number;
  size: number;
  gap: number;
  allowHalf: boolean;
  showValue: boolean;
  valuePosition: 'left' | 'right';
  valueFormat: 'decimal' | 'fraction' | 'percent';
  valueFontSize: number;
  valueFontFamily: string;
  valueColor: string;
  opacity: number;
  effect?: EffectConfig;
}

// Add to ComponentItem union
export type ComponentItem =
  | TextComponent
  | ImageComponent
  | BackgroundComponent
  | BorderComponent
  | IconComponent
  | BadgeComponent
  | StatPanelComponent
  | ListComponent
  | IconRatingComponent    // ← Add here
  | DividerComponent
  | ProgressBarComponent
  | RibbonComponent
  | FrameComponent
  | StampComponent;
```

---

#### Files to Create

| File | Purpose |
|------|---------|
| `src/lib/components/decorations/IconRating.svelte` | New IconRating component |
| `src/lib/creator/components/panels/IconRatingPanel.svelte` | Creator UI panel |

#### Files to Modify

| File | Changes |
|------|---------|
| `src/lib/components/decorations/index.ts` | Export IconRating |
| `src/lib/index.ts` | Export IconRating from main entry |
| `src/lib/creator/types.ts` | Add IconRatingComponent interface |
| `src/lib/creator/state.svelte.ts` | Add createIconRatingComponent factory |
| `src/lib/creator/CardCreator.svelte` | Register component, add handlers |
| `src/lib/creator/components/PropertiesPanel.svelte` | Add IconRatingPanel |
| `src/lib/creator/components/ComponentPanel.svelte` | Add to component menu |

---

#### Benefits

| Benefit | Description |
|---------|-------------|
| **Flexible icons** | Stars, hearts, fire, skulls - any theme |
| **Preset + Custom** | Quick access to common icons, Iconify for custom |
| **Half values** | Accurate ratings with clip-path technique |
| **Data binding** | Works with dataField like other components |
| **Value display** | Optional formatted value (4.5, 4.5/5, 90%) |
| **Reuses Icon** | Leverages existing Icon component infrastructure |

---

## Nice-to-Haves

### ~~9. Template Gallery / Starter Templates~~

**Status:** [x] Removed - Not adding value at this stage.

---

### ~~10. Icon Search Could Be Smarter~~

**Status:** [x] Removed - Current search is sufficient.

---

### 11. Expanded SVG Patterns + Icon Patterns

**Status:** [ ] Investigating | [x] Valid | [ ] Invalid | [ ] Implementing

**Problem:**
PatternBackground only has 4 patterns (dots, grid, diagonal, hexagons). Need more variety.

**Scope Clarification:**
- **In scope:** Pure SVG geometric patterns + Iconify icons as patterns
- **Out of scope (future):** Image-based textures (linen, woodgrain, marble) - these require raster images

---

#### Implementation Plan

##### Current Patterns

```typescript
'dots' | 'grid' | 'diagonal' | 'hexagons'
```

##### Expanded Pattern List

```typescript
export const PatternTypeSchema = z.enum([
  // ═══════════════════════════════════════════════════════════════════
  // EXISTING
  // ═══════════════════════════════════════════════════════════════════
  'dots',           // Polka dots
  'grid',           // Square grid lines
  'diagonal',       // Diagonal lines
  'hexagons',       // Honeycomb

  // ═══════════════════════════════════════════════════════════════════
  // NEW GEOMETRIC PATTERNS
  // ═══════════════════════════════════════════════════════════════════
  'triangles',      // Repeating triangles
  'squares',        // Filled squares grid
  'diamonds',       // Diamond/rhombus pattern
  'chevrons',       // V-shaped zigzag
  'waves',          // Wavy horizontal lines
  'circles',        // Concentric or scattered circles
  'crosses',        // Plus signs / crosses
  'zigzag',         // Sharp zigzag lines
  'checkered',      // Checkerboard pattern
  'stripes-h',      // Horizontal stripes
  'stripes-v',      // Vertical stripes
  'confetti',       // Random small shapes
  'stars',          // Star pattern

  // ═══════════════════════════════════════════════════════════════════
  // BRAND-INSPIRED PATTERNS
  // ═══════════════════════════════════════════════════════════════════
  'playstation',    // PlayStation button symbols (△○✕□)

  // ═══════════════════════════════════════════════════════════════════
  // CUSTOM ICON PATTERN
  // ═══════════════════════════════════════════════════════════════════
  'icon'            // Use any Iconify icon as repeating pattern
]);

export type PatternType = z.infer<typeof PatternTypeSchema>;
```

##### Icon as Pattern Feature

The killer feature: use ANY Iconify icon as a repeating pattern.

**Props for icon pattern:**
```typescript
export const PatternBackgroundPropsSchema = z.object({
  pattern: PatternTypeSchema.default('dots'),

  // Standard pattern options
  color: z.string().default('#ffffff'),
  opacity: z.number().min(0).max(1).default(0.1),
  size: z.number().default(20),          // Pattern cell size
  spacing: z.number().default(10),       // Gap between elements
  rotation: z.number().default(0),       // Rotate entire pattern
  strokeWidth: z.number().default(1),    // For line-based patterns

  // Icon pattern options (when pattern === 'icon')
  icon: IconDataSchema.optional(),
  iconName: z.string().optional(),
  iconRotation: z.number().default(0),   // Rotate each icon
  iconScale: z.number().default(1),      // Scale icons within cell
  alternateRotation: z.boolean().default(false),  // Alternate icon rotation
});
```

**How icon pattern works:**

```svelte
<!-- SVG pattern definition using icon -->
{#if pattern === 'icon' && icon}
  <defs>
    <pattern
      id="icon-pattern-{id}"
      width={size + spacing}
      height={size + spacing}
      patternUnits="userSpaceOnUse"
      patternTransform="rotate({rotation})"
    >
      <g
        transform="translate({spacing/2}, {spacing/2}) rotate({iconRotation}, {size/2}, {size/2}) scale({iconScale})"
        fill={color}
        opacity={opacity}
      >
        <svg viewBox="0 0 {icon.width} {icon.height}" width={size} height={size}>
          {@html sanitizeSvgBody(icon.body)}
        </svg>
      </g>
    </pattern>
  </defs>

  <rect width="100%" height="100%" fill="url(#icon-pattern-{id})" />
{/if}
```

##### Visual Examples

**PlayStation pattern (brand-inspired):**
```
△ ○ ✕ □ △ ○ ✕ □ △ ○
○ ✕ □ △ ○ ✕ □ △ ○ ✕
✕ □ △ ○ ✕ □ △ ○ ✕ □
```

**Hearts icon pattern:**
```
♥   ♥   ♥   ♥   ♥
  ♥   ♥   ♥   ♥
♥   ♥   ♥   ♥   ♥
```

**Stars pattern:**
```
★   ★   ★   ★   ★
  ★   ★   ★   ★
★   ★   ★   ★   ★
```

**Chevrons:**
```
< < < < < < < < < <
< < < < < < < < < <
< < < < < < < < < <
```

**Triangles:**
```
△ ▽ △ ▽ △ ▽ △ ▽ △
▽ △ ▽ △ ▽ △ ▽ △ ▽
```

**Checkered:**
```
■ □ ■ □ ■ □ ■ □
□ ■ □ ■ □ ■ □ ■
■ □ ■ □ ■ □ ■ □
```

##### Pattern Presets with Recommended Settings

```typescript
export const PATTERN_PRESETS = {
  dots: { size: 8, spacing: 16, strokeWidth: 0 },
  grid: { size: 30, spacing: 0, strokeWidth: 1 },
  diagonal: { size: 10, spacing: 5, strokeWidth: 1, rotation: 45 },
  hexagons: { size: 20, spacing: 4, strokeWidth: 1 },
  triangles: { size: 20, spacing: 5, strokeWidth: 1 },
  squares: { size: 15, spacing: 8, strokeWidth: 0 },
  diamonds: { size: 20, spacing: 8, strokeWidth: 1, rotation: 45 },
  chevrons: { size: 16, spacing: 4, strokeWidth: 2 },
  waves: { size: 30, spacing: 10, strokeWidth: 1 },
  circles: { size: 24, spacing: 12, strokeWidth: 1 },
  crosses: { size: 12, spacing: 20, strokeWidth: 2 },
  zigzag: { size: 20, spacing: 0, strokeWidth: 2 },
  checkered: { size: 20, spacing: 0, strokeWidth: 0 },
  'stripes-h': { size: 10, spacing: 10, strokeWidth: 0 },
  'stripes-v': { size: 10, spacing: 10, strokeWidth: 0 },
  confetti: { size: 8, spacing: 20, strokeWidth: 0 },
  stars: { size: 16, spacing: 24, strokeWidth: 0 },
  playstation: { size: 24, spacing: 16, strokeWidth: 0 },
  icon: { size: 24, spacing: 12, strokeWidth: 0 },
} as const;
```

##### SVG Pattern Implementations

**Triangles:**
```svg
<pattern id="triangles" width="20" height="17.32" patternUnits="userSpaceOnUse">
  <polygon points="10,0 20,17.32 0,17.32" fill="{color}" opacity="{opacity}" />
</pattern>
```

**Diamonds:**
```svg
<pattern id="diamonds" width="20" height="20" patternUnits="userSpaceOnUse">
  <polygon points="10,0 20,10 10,20 0,10" fill="{color}" opacity="{opacity}" />
</pattern>
```

**Chevrons:**
```svg
<pattern id="chevrons" width="16" height="8" patternUnits="userSpaceOnUse">
  <polyline points="0,8 8,0 16,8" fill="none" stroke="{color}" stroke-width="{strokeWidth}" opacity="{opacity}" />
</pattern>
```

**Waves:**
```svg
<pattern id="waves" width="40" height="10" patternUnits="userSpaceOnUse">
  <path d="M0,5 Q10,0 20,5 T40,5" fill="none" stroke="{color}" stroke-width="{strokeWidth}" opacity="{opacity}" />
</pattern>
```

**Checkered:**
```svg
<pattern id="checkered" width="40" height="40" patternUnits="userSpaceOnUse">
  <rect x="0" y="0" width="20" height="20" fill="{color}" opacity="{opacity}" />
  <rect x="20" y="20" width="20" height="20" fill="{color}" opacity="{opacity}" />
</pattern>
```

**PlayStation (brand pattern):**
```svg
<pattern id="playstation" width="80" height="20" patternUnits="userSpaceOnUse">
  <!-- Triangle △ -->
  <polygon points="10,2 18,16 2,16" fill="none" stroke="{color}" stroke-width="1.5" opacity="{opacity}" />
  <!-- Circle ○ -->
  <circle cx="30" cy="10" r="7" fill="none" stroke="{color}" stroke-width="1.5" opacity="{opacity}" />
  <!-- Cross ✕ -->
  <path d="M42,3 L58,17 M58,3 L42,17" fill="none" stroke="{color}" stroke-width="1.5" opacity="{opacity}" />
  <!-- Square □ -->
  <rect x="63" y="3" width="14" height="14" fill="none" stroke="{color}" stroke-width="1.5" opacity="{opacity}" />
</pattern>
```

##### Creator Panel Updates

```
┌─────────────────────────────────────────┐
│ Pattern Background                [x] ▼ │
├─────────────────────────────────────────┤
│ Pattern Type                            │
│ ┌─────────────────────────────────────┐ │
│ │[Dots][Grid][Diagonal][Hexagons]     │ │
│ │[Triangles][Squares][Diamonds]       │ │
│ │[Chevrons][Waves][Circles][Crosses]  │ │
│ │[Zigzag][Checkered][Stripes H]       │ │
│ │[Stripes V][Confetti][Stars]         │ │
│ │[PlayStation]                        │ │
│ │[🎨 Custom Icon...]                  │ │
│ └─────────────────────────────────────┘ │
├─────────────────────────────────────────┤
│ Color          [■ #ffffff          ]    │
│ Opacity        [━━━━━━━━━●] 10%         │
│ Size           [20         ] px         │
│ Spacing        [10         ] px         │
│ Rotation       [0          ] deg        │
├─────────────────────────────────────────┤
│ ── Icon Pattern Options ──              │
│ (visible when pattern = 'icon')         │
│ Icon           [★ Select...]            │
│ Icon Rotation  [0          ] deg        │
│ Icon Scale     [1.0        ]            │
│ [ ] Alternate rotation                  │
└─────────────────────────────────────────┘
```

---

#### Future: Image-Based Textures

Not in current scope, but could be added later as separate component or pattern type:

```typescript
// Future: TextureBackground component
{
  type: 'TextureBackground',
  props: {
    texture: 'linen' | 'woodgrain' | 'marble' | 'paper' | 'chalkboard',
    tint: '#ffffff',
    opacity: 0.5
  }
}
```

These would use embedded base64 images or external texture URLs, which is a different complexity level.

---

#### Files to Modify

| File | Changes |
|------|---------|
| `src/lib/components/backgrounds/PatternBackground.svelte` | Add new patterns, icon pattern support |
| `src/lib/creator/components/panels/PatternBackgroundPanel.svelte` | Pattern picker grid, icon options |

---

#### Benefits

| Benefit | Description |
|---------|-------------|
| **Pure SVG** | All patterns are vector, scale perfectly |
| **Lightweight** | No image files, just math |
| **Thematic** | PlayStation pattern, brand-specific options |
| **Infinite variety** | Any Iconify icon as pattern |
| **Customizable** | Size, spacing, rotation, color, opacity |

---

### ~~12. Export to Social Media Sizes~~

**Status:** [x] Removed - Trading cards have fixed size (see #6).

---

### 13. Universal Text Fitting for All Text Components

**Status:** [ ] Investigating | [x] Valid | [ ] Invalid | [ ] Implementing

**Problem:**
Badge and Ribbon components use fixed font sizes (sm=10px, md=14px, lg=18px) regardless of text length. When text comes from dynamic data fields, long strings like "1ST EDITION" or "STEAM DECK VERIFIED" overflow the component bounds.

**Current State:**
- `TextField` uses `FitText` component which auto-scales text between `minFontSize` and `maxFontSize`
- `Badge` uses fixed `sizeConfig` based on `size` prop (sm/md/lg)
- `Ribbon` uses fixed `fontSize` prop
- `StatPanel` uses fixed `labelFontSize` and `valueFontSize` props
- When using dynamic data fields, text can easily overflow containers

**Root Issue:**
The existing `FitText` component works well for `TextField`, but other text-containing components don't use it. This becomes critical when:
1. Data fields bind dynamic text of varying lengths
2. Users choose different fonts (some wider than others)
3. Components have constrained shapes (pill badges, angled ribbons)
4. Borders/padding reduce available text area

---

#### Proposed Solution: Enhanced FitText with Inner Bounds

Rather than each component calculating text fitting independently, enhance `FitText` to accept configurable inner boundaries:

**Enhanced FitText Props:**
```typescript
interface FitTextProps {
  text: string;

  // Container bounds
  width: number;
  height: number;

  // Inner bounds (optional - for shapes with padding/borders)
  innerBounds?: {
    top?: number;      // Padding from top
    right?: number;    // Padding from right
    bottom?: number;   // Padding from bottom
    left?: number;     // Padding from left
    // OR
    padding?: number;  // Uniform padding
    // OR
    shape?: 'rect' | 'ellipse' | 'diamond' | 'hexagon';  // Calculate inscribed rect
  };

  // Font settings
  minSize: number;
  maxSize: number;
  fontFamily: string;
  fontWeight: string;

  // Layout
  horizontalAlign: 'left' | 'center' | 'right';
  verticalAlign: 'top' | 'center' | 'bottom';

  // Single-line mode (for badges/ribbons)
  singleLine?: boolean;  // Prevent wrapping, scale down instead

  // Output
  fill: string;
  opacity: number;
}
```

**Shape-Aware Inner Bounds:**
```typescript
// Calculate inscribed rectangle for different shapes
function getInnerBounds(shape: string, width: number, height: number): Rect {
  switch (shape) {
    case 'rect':
    case 'pill':
      return { x: 0, y: 0, width, height };

    case 'circle':
    case 'ellipse':
      // Inscribed rectangle in ellipse
      const rx = width / 2;
      const ry = height / 2;
      const inscribedW = rx * Math.SQRT2;
      const inscribedH = ry * Math.SQRT2;
      return {
        x: (width - inscribedW) / 2,
        y: (height - inscribedH) / 2,
        width: inscribedW,
        height: inscribedH
      };

    case 'diamond':
      // Diamond inscribed rect is much smaller
      return {
        x: width * 0.25,
        y: height * 0.25,
        width: width * 0.5,
        height: height * 0.5
      };

    case 'hexagon':
      // Hexagon usable area
      return {
        x: width * 0.15,
        y: height * 0.1,
        width: width * 0.7,
        height: height * 0.8
      };

    // ... other shapes
  }
}
```

---

#### Components to Update

| Component | Current Approach | New Approach |
|-----------|------------------|--------------|
| **Badge** | Fixed fontSize from `size` prop | Use FitText with shape-aware bounds, account for icon |
| **Ribbon** | Fixed `fontSize` prop | Use FitText with ribbon-style bounds |
| **StatPanel** | Fixed `labelFontSize`/`valueFontSize` | Consider FitText for value column |
| **ProgressBar** | Fixed `labelFontSize` | Use FitText if label enabled |
| **List** | Fixed `fontSize` | Consider FitText per item |

---

#### Implementation Considerations

**1. Single-Line Mode:**
Badges and ribbons typically want single-line text. FitText currently supports multi-line wrapping. Add `singleLine` mode that scales down instead of wrapping.

**2. Icon Offset:**
Badge can have an icon that reduces text area. FitText needs to accept reduced width when icon is present.

**3. Performance:**
Text measurement is expensive. Cache results by text+font+width combination. Only recalculate when inputs change.

**4. Minimum Readability:**
Set sensible `minSize` defaults (e.g., 8px) to prevent unreadable micro-text. If text can't fit at minimum size, truncate with ellipsis.

**5. Server-Side Rendering:**
Current FitText uses browser font measurement. Ensure approach works with resvg for PNG export (may need font metrics fallback).

---

#### Phased Approach

**Phase 1: Badge Integration (P4)**
- Add `singleLine` mode to FitText
- Calculate inner bounds for each badge shape
- Account for icon offset
- Replace `size` prop with `minFontSize`/`maxFontSize`

**Phase 2: Ribbon Integration**
- Calculate usable text area per ribbon style
- Account for angle and fold areas

**Phase 3: Consider Other Components**
- Evaluate StatPanel, ProgressBar, List
- May be overkill for simple label text

---

#### Files to Modify

| File | Changes |
|------|---------|
| `src/lib/utils/FitText.svelte` | Add `singleLine`, `innerBounds` props |
| `src/lib/utils/textFitting.ts` | Add single-line fitting algorithm |
| `src/lib/components/decorations/Badge.svelte` | Use FitText instead of fixed fontSize |
| `src/lib/components/decorations/Ribbon.svelte` | Use FitText instead of fixed fontSize |
| `src/lib/creator/components/panels/BadgePanel.svelte` | Replace size dropdown with min/max sliders |
| `src/lib/creator/components/panels/RibbonPanel.svelte` | Add min/max font size controls |

---

#### Benefits

| Benefit | Description |
|---------|-------------|
| **Dynamic data support** | Text from data fields always fits |
| **Consistent behavior** | All text components use same fitting logic |
| **Shape-aware** | Respects complex shapes (diamond, hexagon) |
| **DRY** | Single FitText implementation, not per-component |
| **Future-proof** | New text components get fitting "for free" |

---

## Priority Matrix

| # | Issue | Severity | Effort | Priority | Status |
|---|-------|----------|--------|----------|--------|
| 1 | ~~Multi-line text~~ | ~~Critical~~ | ~~High~~ | ~~P0~~ | **Not Required** - Working as intended |
| 2+3 | Preset system (Stats + Badges) | Critical | Medium | P0 | **Implemented** |
| 4 | List component | Critical | Medium | P0 | **Implemented** |
| 5 | Font options | Major | Low | P1 | **Solution designed** - Web-safe + brand fonts |
| 6 | ~~Card dimensions~~ | ~~Major~~ | ~~High~~ | ~~P1~~ | **Not Required** - Trading cards are fixed size |
| 7 | QR code | Major | Medium | P2 | **Future Feature** - Needs URL strategy |
| 8 | IconRating (stars, hearts, etc.) | Major | Medium | P2 | **Implemented** - 10 preset icons + custom + half-value + sourceMax scaling |
| 9 | ~~Starter templates~~ | ~~Nice~~ | ~~Low~~ | ~~P3~~ | **Removed** - Not adding value |
| 10 | ~~Icon collections~~ | ~~Nice~~ | ~~Medium~~ | ~~P3~~ | **Removed** - Current search sufficient |
| 11 | SVG Patterns + Icon Patterns | Nice | Medium | P3 | **Implemented** - 17 geometric + single/multi-icon patterns + row offset |
| 12 | ~~Social export~~ | ~~Nice~~ | ~~Medium~~ | ~~P3~~ | **Removed** - Fixed card size |
| 13 | Universal Text Fitting | Major | Medium | P4 | **Solution designed** - FitText for Badge/Ribbon |

---

## Summary

### Ready to Implement (Solutions Designed)

| # | Feature | Key Points |
|---|---------|------------|
| 2+3 | **Preset System** | Dataset-specific + shared labels, works across all text components - **IMPLEMENTED** |
| 4 | **List Component** | Array data → bullet/numbered list, delimiter parsing - **IMPLEMENTED** |
| 5 | **Fonts** | Expanded web-safe (35+) + dataset brand fonts - **IMPLEMENTED** |
| 8 | **IconRating** | 10 preset icons + custom Iconify, half-value support, sourceMax scaling - **IMPLEMENTED** |
| 11 | **SVG Patterns** | 17 geometric + single/multi-icon patterns + row offset - **IMPLEMENTED** |
| 13 | **Universal Text Fitting** | Enhanced FitText with inner bounds, single-line mode for Badge/Ribbon |

### Not Required / Removed

| # | Issue | Reason |
|---|-------|--------|
| 1 | Multi-line text | Trading cards enforce brevity - working as intended |
| 6 | Card dimensions | Trading cards = fixed size (2.5" × 3.5") |
| 9 | Starter templates | Not adding value at this stage |
| 10 | Icon collections | Current search is sufficient |
| 12 | Social export | Fixed card size, not applicable |

### Future Features

| # | Feature | Blocker |
|---|---------|---------|
| 7 | QR Code | Needs URL strategy per dataset |

---

## Next Steps

1. [x] Review each issue for validity ✓
2. [x] Implement P0: Presets ✓
3. [x] Implement P0: List Component ✓
4. [x] Implement P1: Fonts ✓
5. [x] Implement P2: IconRating ✓
6. [x] Implement P3: SVG Patterns ✓
7. [ ] Implement P4: Universal Text Fitting (FitText for Badge/Ribbon)
8. [x] Update documentation ✓

---

## Notes

_Analysis complete. 6 features ready for implementation, 5 removed as not needed, 1 deferred to future (QR Code)._
