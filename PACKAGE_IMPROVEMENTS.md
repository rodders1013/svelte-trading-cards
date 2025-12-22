# 🚀 Svelte Trading Cards - Package Improvement Recommendations

> **Document Version:** 1.0
> **Created:** December 2024
> **Purpose:** Recommendations for improving the `svelte-trading-cards` package to make it more versatile, easier to integrate, and suitable for a wider range of use cases.

---

## 📋 Table of Contents

1. [Executive Summary](#executive-summary)
2. [Current State Analysis](#current-state-analysis)
3. [Recommended Improvements](#recommended-improvements)
   - [1. Multi-Face Card System](#1-multi-face-card-system-frontbackmulti)
   - [2. Data Adapter System](#2-pluginadapter-system-for-data-sources)
   - [3. Template Package Format](#3-template-importexport--sharing)
   - [4. Theme/Style System](#4-themestyle-presets-system)
   - [5. Component Composition](#5-component-slots--composition)
   - [6. Data Transforms](#6-data-transformation-pipeline)
   - [7. Image Handling](#7-image-handling-improvements)
   - [8. Debug Tools](#8-analytics--debugging-tools)
   - [9. TypeScript Experience](#9-better-typescript-experience)
   - [10. Starter Templates](#10-preset-templates--starter-kits)
4. [Implementation Priority](#implementation-priority)
5. [Use Case Examples](#use-case-examples)

---

## Executive Summary

The `svelte-trading-cards` package is a powerful JSON-template-driven card creation system with a visual editor. To maximize its appeal and ease of integration across different domains, this document proposes **10 key improvements** that:

1. **Lower the barrier to adoption** - Clear patterns, starter templates, better TypeScript support
2. **Handle edge cases gracefully** - Image fallbacks, data transforms, debug tools
3. **Enable extensibility** - Adapters, themes, multi-face cards, template sharing

**Top 3 Priority Recommendations:**
- Multi-Face Card System (front/back support)
- Data Adapter Interface (clear integration contract)
- Template Package Format (sharing ecosystem)

---

## Current State Analysis

### Strengths ✅
- Visual card creator with drag-and-drop editing
- JSON-based templates (data, not code)
- Rich component library (17+ components)
- Visual effects (glow, holographic, animations)
- SVG-based with PNG export
- Standard card dimensions (750×1050 at 300 DPI)

### Gaps to Address ⚠️
| Gap | Impact |
|-----|--------|
| No front/back card concept | Blocks trading card use cases |
| Generic `CardData` type | No guidance for data integration |
| No template sharing format | Can't distribute templates |
| Inline styles only | No theming/branding consistency |
| Raw field values only | Can't format dates/numbers |
| No image fallbacks | Broken images break cards |
| `Record<string, unknown>` props | Poor TypeScript DX |
| No starter templates | Steep learning curve |

---

## Recommended Improvements

---

### 1. Multi-Face Card System (Front/Back/Multi)

**Problem:** The package has no native concept of card "faces". Trading cards universally have fronts and backs, and some (like MTG transform cards) have multiple states.

**Solution:** Add types and components for multi-face cards.

#### Type Definitions

```typescript
// src/lib/types/CardFaces.ts

import type { CardTemplate, DisplaySettings } from './CardTemplate.js';

/**
 * A single face of a card (front, back, transformed, etc.)
 */
export interface CardFace {
  /** Unique identifier for this face */
  id: string;

  /** The template to render for this face */
  template: CardTemplate;

  /** Optional transition animation when revealing this face */
  revealAnimation?: 'flip' | 'fade' | 'slide' | 'none';
}

/**
 * A card with multiple faces/sides
 */
export interface MultiTemplateCard {
  /** Unique identifier for this card definition */
  id: string;

  /** Human-readable name */
  name: string;

  /** Which face to show by default */
  defaultFace: string;

  /** All available faces */
  faces: CardFace[];

  /** Shared display settings (rarity effects apply to all faces) */
  display?: DisplaySettings;
}

/**
 * Helper type for standard two-sided cards
 */
export interface TwoSidedCard extends MultiTemplateCard {
  faces: [
    CardFace & { id: 'front' },
    CardFace & { id: 'back' }
  ];
  defaultFace: 'front';
}

/**
 * Create a simple two-sided card
 */
export function createTwoSidedCard(
  id: string,
  name: string,
  front: CardTemplate,
  back: CardTemplate,
  display?: DisplaySettings
): TwoSidedCard {
  return {
    id,
    name,
    defaultFace: 'front',
    faces: [
      { id: 'front', template: front, revealAnimation: 'flip' },
      { id: 'back', template: back, revealAnimation: 'flip' }
    ],
    display
  };
}
```

#### FlippableCard Component

```svelte
<!-- src/lib/display/FlippableCard.svelte -->
<script lang="ts">
  import type { MultiTemplateCard, CardData } from '$lib/types';
  import Card from './Card.svelte';
  import { CARD_WIDTH, CARD_HEIGHT } from '$lib/types';

  let {
    card,
    data,
    activeFace = $bindable(card.defaultFace),
    flipOnClick = true,
    flipOnHover = false,
    flipDuration = 600,
    width = CARD_WIDTH,
    height = CARD_HEIGHT,
    disabled = false,
    class: className = ''
  }: {
    card: MultiTemplateCard;
    data: CardData;
    activeFace?: string;
    flipOnClick?: boolean;
    flipOnHover?: boolean;
    flipDuration?: number;
    width?: number;
    height?: number;
    disabled?: boolean;
    class?: string;
  } = $props();

  // Build face lookup map
  const faceMap = $derived(new Map(card.faces.map(f => [f.id, f])));

  // Get current and next face
  const currentFace = $derived(faceMap.get(activeFace) ?? card.faces[0]);
  const faceIds = $derived(card.faces.map(f => f.id));

  // Flip state
  let isFlipping = $state(false);

  function flip() {
    if (disabled || isFlipping) return;

    const currentIndex = faceIds.indexOf(activeFace);
    const nextIndex = (currentIndex + 1) % faceIds.length;

    isFlipping = true;
    activeFace = faceIds[nextIndex];

    setTimeout(() => {
      isFlipping = false;
    }, flipDuration);
  }

  function handleClick() {
    if (flipOnClick) flip();
  }

  function handleMouseEnter() {
    if (flipOnHover && activeFace === card.defaultFace) flip();
  }

  function handleMouseLeave() {
    if (flipOnHover && activeFace !== card.defaultFace) flip();
  }

  // CSS custom properties for animation
  const cssVars = $derived(`--flip-duration: ${flipDuration}ms`);
</script>

<div
  class="flippable-card {className}"
  class:flipping={isFlipping}
  style="{cssVars}; width: {width}px; height: {height}px;"
  onclick={handleClick}
  onmouseenter={handleMouseEnter}
  onmouseleave={handleMouseLeave}
  role={flipOnClick ? 'button' : undefined}
  tabindex={flipOnClick ? 0 : undefined}
  onkeydown={(e) => e.key === 'Enter' && flipOnClick && flip()}
>
  <div class="card-inner" class:flipped={activeFace !== card.defaultFace}>
    {#each card.faces as face, index (face.id)}
      <div
        class="card-face"
        class:face-front={index === 0}
        class:face-back={index === 1}
        style="--face-index: {index}"
      >
        <Card
          template={face.template}
          {data}
          {width}
          {height}
          rarity={card.display?.rarity}
          disabled={disabled || activeFace !== face.id}
        />
      </div>
    {/each}
  </div>
</div>

<style>
  .flippable-card {
    perspective: 1000px;
    cursor: pointer;
  }

  .card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    transition: transform var(--flip-duration) ease-in-out;
    transform-style: preserve-3d;
  }

  .card-inner.flipped {
    transform: rotateY(180deg);
  }

  .card-face {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
  }

  .face-front {
    z-index: 2;
  }

  .face-back {
    transform: rotateY(180deg);
  }
</style>
```

#### Use Cases Enabled
| Domain | Front | Back |
|--------|-------|------|
| Gaming cards | Trophy/achievement art | Stats, description, lore |
| Employee badges | Photo, name, title | Emergency contacts, QR code |
| Product cards | Product image, price | Specifications, barcode |
| Event tickets | Event details, seat | QR code, terms |
| Business cards | Name, contact | Services, social links |

---

### 2. Plugin/Adapter System for Data Sources

**Problem:** `CardData` is `Record<string, unknown>`, which is flexible but provides no guidance on how to transform domain data into card-ready format.

**Solution:** Define a `DataAdapter` interface that transforms domain-specific data into `CardData`.

#### Type Definitions

```typescript
// src/lib/adapters/types.ts

import type { CardData } from '$lib/types';

/**
 * Definition of a data field provided by an adapter
 */
export interface DataFieldDefinition {
  /** Field key in CardData */
  key: string;

  /** Human-readable label */
  label: string;

  /** Data type */
  type: 'string' | 'number' | 'date' | 'image' | 'array' | 'boolean';

  /** Description for documentation */
  description?: string;

  /** Example value for preview/testing */
  example?: unknown;

  /** Whether this field is required */
  required?: boolean;
}

/**
 * Transforms domain-specific data into CardData.
 * Each domain (gaming, HR, retail) can have its own adapter.
 *
 * @template TSource - The source data type from your domain
 */
export interface DataAdapter<TSource = unknown> {
  /** Unique identifier for this adapter */
  id: string;

  /** Human-readable name */
  name: string;

  /** Description of what data this adapter handles */
  description?: string;

  /** Icon identifier (for UI) */
  icon?: string;

  /** Transform source data to CardData */
  transform(source: TSource): CardData;

  /** Available fields this adapter provides */
  getFields(): DataFieldDefinition[];

  /** Generate sample data for preview */
  getSampleData(): CardData;

  /** Optional: Validate source data before transform */
  validate?(source: unknown): source is TSource;

  /** Optional: Suggested template IDs for this data type */
  suggestedTemplates?: string[];
}

/**
 * Registry for managing multiple adapters
 */
export interface AdapterRegistry {
  register(adapter: DataAdapter): void;
  get(id: string): DataAdapter | undefined;
  getAll(): DataAdapter[];
  getFieldsForAdapter(id: string): DataFieldDefinition[];
}
```

#### Example Adapters

```typescript
// src/lib/adapters/presets/gaming.ts

import type { DataAdapter, DataFieldDefinition } from '../types.js';

// PlayStation Trophy Adapter
interface PSNTrophyData {
  gameTitle: string;
  npCommunicationId: string;
  platform: string;
  trophyName: string;
  trophyDescription: string;
  trophyType: 'bronze' | 'silver' | 'gold' | 'platinum';
  trophyIconUrl: string;
  psnTrophyRarity: string;
  psnTrophyEarnedRate: string;
  earnedDate: string;
  username: string;
  images?: {
    cover?: string;
    background?: string;
    artwork?: string;
  };
}

export const PlayStationAdapter: DataAdapter<PSNTrophyData> = {
  id: 'playstation',
  name: 'PlayStation Trophies',
  description: 'Transform PSN trophy data into card format',
  icon: 'game-icons:playstation',

  transform(trophy) {
    return {
      // Primary content
      title: trophy.gameTitle,
      subtitle: trophy.trophyName,
      description: trophy.trophyDescription,

      // Images
      imageUrl: trophy.trophyIconUrl,
      coverImage: trophy.images?.cover,
      backgroundImage: trophy.images?.background,
      artworkImage: trophy.images?.artwork,

      // Trophy metadata
      trophyType: trophy.trophyType,
      rarityLabel: trophy.psnTrophyRarity,
      rarityPercent: trophy.psnTrophyEarnedRate,

      // User/game info
      username: trophy.username,
      platform: trophy.platform,
      gameId: trophy.npCommunicationId,
      earnedDate: trophy.earnedDate,
    };
  },

  getFields(): DataFieldDefinition[] {
    return [
      { key: 'title', label: 'Game Title', type: 'string', required: true, example: 'Elden Ring' },
      { key: 'subtitle', label: 'Trophy Name', type: 'string', required: true, example: 'Elden Lord' },
      { key: 'description', label: 'Trophy Description', type: 'string', example: 'Achieved all endings' },
      { key: 'imageUrl', label: 'Trophy Icon', type: 'image', required: true },
      { key: 'coverImage', label: 'Game Cover', type: 'image' },
      { key: 'backgroundImage', label: 'Background Image', type: 'image' },
      { key: 'trophyType', label: 'Trophy Type', type: 'string', example: 'platinum' },
      { key: 'rarityLabel', label: 'Rarity Label', type: 'string', example: 'Ultra Rare' },
      { key: 'rarityPercent', label: 'Rarity Percent', type: 'string', example: '0.1%' },
      { key: 'username', label: 'Player Username', type: 'string', example: 'Player123' },
      { key: 'platform', label: 'Platform', type: 'string', example: 'PS5' },
      { key: 'earnedDate', label: 'Date Earned', type: 'date', example: '2024-01-15' },
    ];
  },

  getSampleData() {
    return {
      title: 'Elden Ring',
      subtitle: 'Elden Lord',
      description: 'Achieved all endings and became the Elden Lord.',
      imageUrl: 'https://example.com/trophy.png',
      coverImage: 'https://example.com/cover.jpg',
      trophyType: 'platinum',
      rarityLabel: 'Ultra Rare',
      rarityPercent: '0.1%',
      username: 'TrophyHunter',
      platform: 'PS5',
      earnedDate: '2024-01-15T12:00:00Z',
    };
  },

  suggestedTemplates: ['trophy-card', 'achievement-badge'],
};


// Steam Achievement Adapter
interface SteamAchievementData {
  appName: string;
  appId: number;
  achievementName: string;
  achievementDescription: string;
  iconUrl: string;
  iconGrayUrl: string;
  unlockTime: number;
  globalPercent: number;
  steamUsername: string;
  headerImage: string;
}

export const SteamAdapter: DataAdapter<SteamAchievementData> = {
  id: 'steam',
  name: 'Steam Achievements',
  description: 'Transform Steam achievement data into card format',
  icon: 'mdi:steam',

  transform(achievement) {
    return {
      title: achievement.appName,
      subtitle: achievement.achievementName,
      description: achievement.achievementDescription,
      imageUrl: achievement.iconUrl,
      coverImage: achievement.headerImage,
      rarityPercent: `${achievement.globalPercent.toFixed(1)}%`,
      username: achievement.steamUsername,
      platform: 'Steam',
      earnedDate: new Date(achievement.unlockTime * 1000).toISOString(),
    };
  },

  getFields(): DataFieldDefinition[] {
    return [
      { key: 'title', label: 'Game Name', type: 'string', required: true },
      { key: 'subtitle', label: 'Achievement Name', type: 'string', required: true },
      { key: 'description', label: 'Achievement Description', type: 'string' },
      { key: 'imageUrl', label: 'Achievement Icon', type: 'image', required: true },
      { key: 'coverImage', label: 'Game Header', type: 'image' },
      { key: 'rarityPercent', label: 'Global Unlock %', type: 'string' },
      { key: 'username', label: 'Steam Username', type: 'string' },
      { key: 'earnedDate', label: 'Unlock Date', type: 'date' },
    ];
  },

  getSampleData() {
    return {
      title: 'Half-Life 2',
      subtitle: 'Lambda Locator',
      description: 'Find all lambda caches in the game.',
      imageUrl: 'https://example.com/achievement.png',
      coverImage: 'https://example.com/header.jpg',
      rarityPercent: '2.3%',
      username: 'GamerTag',
      platform: 'Steam',
      earnedDate: '2024-02-20T18:30:00Z',
    };
  },
};


// Generic Employee Badge Adapter
interface EmployeeData {
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  title: string;
  photoUrl: string;
  employeeId: string;
  startDate: string;
  office: string;
  emergencyContact?: string;
  emergencyPhone?: string;
}

export const EmployeeAdapter: DataAdapter<EmployeeData> = {
  id: 'employee',
  name: 'Employee Badge',
  description: 'Transform HR employee data into badge format',
  icon: 'mdi:badge-account',

  transform(employee) {
    return {
      title: `${employee.firstName} ${employee.lastName}`,
      subtitle: employee.title,
      description: employee.department,
      imageUrl: employee.photoUrl,
      employeeId: employee.employeeId,
      email: employee.email,
      office: employee.office,
      startDate: employee.startDate,
      emergencyContact: employee.emergencyContact,
      emergencyPhone: employee.emergencyPhone,
    };
  },

  getFields(): DataFieldDefinition[] {
    return [
      { key: 'title', label: 'Full Name', type: 'string', required: true },
      { key: 'subtitle', label: 'Job Title', type: 'string', required: true },
      { key: 'description', label: 'Department', type: 'string' },
      { key: 'imageUrl', label: 'Photo', type: 'image', required: true },
      { key: 'employeeId', label: 'Employee ID', type: 'string' },
      { key: 'email', label: 'Email', type: 'string' },
      { key: 'office', label: 'Office Location', type: 'string' },
      { key: 'startDate', label: 'Start Date', type: 'date' },
      { key: 'emergencyContact', label: 'Emergency Contact', type: 'string' },
      { key: 'emergencyPhone', label: 'Emergency Phone', type: 'string' },
    ];
  },

  getSampleData() {
    return {
      title: 'Jane Smith',
      subtitle: 'Senior Engineer',
      description: 'Engineering',
      imageUrl: 'https://example.com/photo.jpg',
      employeeId: 'EMP-12345',
      email: 'jane.smith@company.com',
      office: 'San Francisco',
      startDate: '2022-03-15',
      emergencyContact: 'John Smith',
      emergencyPhone: '+1 (555) 123-4567',
    };
  },

  suggestedTemplates: ['employee-badge', 'business-card'],
};
```

#### Adapter Registry Implementation

```typescript
// src/lib/adapters/registry.ts

import type { DataAdapter, AdapterRegistry, DataFieldDefinition } from './types.js';

class AdapterRegistryImpl implements AdapterRegistry {
  private adapters = new Map<string, DataAdapter>();

  register(adapter: DataAdapter): void {
    if (this.adapters.has(adapter.id)) {
      console.warn(`Adapter "${adapter.id}" is being overwritten`);
    }
    this.adapters.set(adapter.id, adapter);
  }

  get(id: string): DataAdapter | undefined {
    return this.adapters.get(id);
  }

  getAll(): DataAdapter[] {
    return Array.from(this.adapters.values());
  }

  getFieldsForAdapter(id: string): DataFieldDefinition[] {
    const adapter = this.adapters.get(id);
    return adapter?.getFields() ?? [];
  }
}

// Singleton instance
export const adapterRegistry = new AdapterRegistryImpl();

// Register built-in adapters
import { PlayStationAdapter, SteamAdapter, EmployeeAdapter } from './presets/index.js';

adapterRegistry.register(PlayStationAdapter);
adapterRegistry.register(SteamAdapter);
adapterRegistry.register(EmployeeAdapter);
```

---

### 3. Template Import/Export & Sharing

**Problem:** Templates are JSON but there's no standard format for sharing, no versioning, and no way to bundle assets.

**Solution:** Define a `TemplatePackage` format for distribution.

#### Type Definitions

```typescript
// src/lib/types/TemplatePackage.ts

import type { CardTemplate, CardData } from './index.js';
import type { DataFieldDefinition } from '$lib/adapters/types.js';

/**
 * A shareable template package containing one or more templates
 * with metadata, assets, and sample data
 */
export interface TemplatePackage {
  /** Package format version for compatibility */
  version: '1.0';

  /** Package metadata */
  meta: TemplatePackageMeta;

  /** The card template(s) */
  templates: {
    /** Front face template */
    front?: CardTemplate;
    /** Back face template */
    back?: CardTemplate;
    /** Additional named templates */
    [key: string]: CardTemplate | undefined;
  };

  /** Embedded assets */
  assets?: TemplateAssets;

  /** Sample data for preview */
  sampleData?: CardData;

  /** Required data fields */
  requiredFields?: DataFieldDefinition[];

  /** Suggested adapter ID */
  suggestedAdapter?: string;
}

export interface TemplatePackageMeta {
  /** Unique package identifier */
  id: string;

  /** Human-readable name */
  name: string;

  /** Package description */
  description?: string;

  /** Author name or organization */
  author?: string;

  /** License (e.g., "MIT", "CC-BY-4.0") */
  license?: string;

  /** Searchable tags */
  tags?: string[];

  /** Package creation date */
  createdAt: string;

  /** Last update date */
  updatedAt: string;

  /** Preview image URL or base64 */
  previewImage?: string;

  /** Package homepage/repo URL */
  homepage?: string;
}

export interface TemplateAssets {
  /** Embedded images (name → base64 data URI or URL) */
  images?: Record<string, string>;

  /** Google Fonts to load */
  googleFonts?: string[];

  /** Custom font files (name → base64) */
  customFonts?: Record<string, string>;
}
```

#### Package Utilities

```typescript
// src/lib/export/templatePackage.ts

import type { TemplatePackage, TemplatePackageMeta } from '$lib/types/TemplatePackage.js';
import type { CardTemplate } from '$lib/types';
import type { ContainerState } from '$lib/creator/types.js';
import { buildTemplate } from '$lib/creator/state.svelte.js';

/**
 * Create a template package from templates
 */
export function createTemplatePackage(
  meta: Omit<TemplatePackageMeta, 'createdAt' | 'updatedAt'>,
  templates: { front?: CardTemplate; back?: CardTemplate },
  options?: {
    sampleData?: Record<string, unknown>;
    suggestedAdapter?: string;
    embedImages?: boolean;
  }
): TemplatePackage {
  const now = new Date().toISOString();

  return {
    version: '1.0',
    meta: {
      ...meta,
      createdAt: now,
      updatedAt: now,
    },
    templates,
    sampleData: options?.sampleData,
    suggestedAdapter: options?.suggestedAdapter,
  };
}

/**
 * Export package from CardCreator state
 */
export function exportFromCreator(
  name: string,
  containers: ContainerState[],
  meta?: Partial<TemplatePackageMeta>
): TemplatePackage {
  const template = buildTemplate(name, containers);

  return createTemplatePackage(
    {
      id: slugify(name),
      name,
      ...meta,
    },
    { front: template }
  );
}

/**
 * Validate and parse a template package
 */
export function parseTemplatePackage(input: unknown):
  | { success: true; package: TemplatePackage }
  | { success: false; errors: string[] }
{
  const errors: string[] = [];

  if (!input || typeof input !== 'object') {
    return { success: false, errors: ['Input must be an object'] };
  }

  const pkg = input as Record<string, unknown>;

  // Validate version
  if (pkg.version !== '1.0') {
    errors.push(`Unsupported package version: ${pkg.version}`);
  }

  // Validate meta
  if (!pkg.meta || typeof pkg.meta !== 'object') {
    errors.push('Missing or invalid meta field');
  } else {
    const meta = pkg.meta as Record<string, unknown>;
    if (!meta.id) errors.push('Missing meta.id');
    if (!meta.name) errors.push('Missing meta.name');
  }

  // Validate templates
  if (!pkg.templates || typeof pkg.templates !== 'object') {
    errors.push('Missing or invalid templates field');
  }

  if (errors.length > 0) {
    return { success: false, errors };
  }

  return { success: true, package: pkg as TemplatePackage };
}

/**
 * Download package as JSON file
 */
export function downloadPackage(pkg: TemplatePackage, filename?: string): void {
  const json = JSON.stringify(pkg, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename ?? `${pkg.meta.id}.tcpkg.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

/**
 * Load package from file
 */
export async function loadPackageFromFile(file: File): Promise<TemplatePackage> {
  const text = await file.text();
  const parsed = JSON.parse(text);

  const result = parseTemplatePackage(parsed);
  if (!result.success) {
    throw new Error(`Invalid package: ${result.errors.join(', ')}`);
  }

  return result.package;
}

// Helper
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
```

---

### 4. Theme/Style Presets System

**Problem:** Templates define all styles inline. There's no way to apply consistent branding across multiple templates.

**Solution:** Add a `CardTheme` type and theme-aware component props.

#### Type Definitions

```typescript
// src/lib/types/Theme.ts

import type { Rarity, RarityPreset } from '$lib/display/types.js';

/**
 * A color palette for cards
 */
export interface ThemeColors {
  /** Primary brand color */
  primary: string;
  /** Secondary brand color */
  secondary: string;
  /** Accent color for highlights */
  accent: string;
  /** Background color */
  background: string;
  /** Surface color (cards, panels) */
  surface: string;
  /** Primary text color */
  text: string;
  /** Muted/secondary text color */
  textMuted: string;
  /** Border color */
  border: string;
  /** Success state */
  success?: string;
  /** Warning state */
  warning?: string;
  /** Error state */
  error?: string;
}

/**
 * Typography settings
 */
export interface ThemeTypography {
  /** Heading font */
  heading: {
    fontFamily: string;
    fontWeight: string | number;
  };
  /** Body text font */
  body: {
    fontFamily: string;
    fontWeight: string | number;
  };
  /** Accent/display font (optional) */
  accent?: {
    fontFamily: string;
    fontWeight: string | number;
  };
}

/**
 * Border radius scale
 */
export interface ThemeRadius {
  /** Small radius (buttons, inputs) */
  sm: number;
  /** Medium radius (panels) */
  md: number;
  /** Large radius (modals) */
  lg: number;
  /** Card corner radius */
  card: number;
}

/**
 * Complete theme definition
 */
export interface CardTheme {
  /** Theme identifier */
  id: string;
  /** Theme name */
  name: string;
  /** Theme description */
  description?: string;

  /** Color palette */
  colors: ThemeColors;

  /** Rarity-specific colors (optional overrides) */
  rarityColors?: {
    common?: string;
    uncommon?: string;
    rare?: string;
    epic?: string;
    legendary?: string;
    mythic?: string;
  };

  /** Typography settings */
  typography: ThemeTypography;

  /** Border radius scale */
  radius: ThemeRadius;

  /** Rarity effect overrides */
  rarityEffects?: Partial<Record<Rarity, Partial<RarityPreset>>>;
}

/**
 * Theme reference in component props
 * Format: "theme:colorKey" or "theme:typography.heading"
 */
export type ThemeReference = `theme:${string}`;

/**
 * Check if a value is a theme reference
 */
export function isThemeReference(value: unknown): value is ThemeReference {
  return typeof value === 'string' && value.startsWith('theme:');
}

/**
 * Resolve a theme reference to its actual value
 */
export function resolveThemeValue(ref: ThemeReference, theme: CardTheme): string | number | undefined {
  const path = ref.slice(6); // Remove "theme:" prefix
  const parts = path.split('.');

  let value: unknown = theme;
  for (const part of parts) {
    if (value && typeof value === 'object' && part in value) {
      value = (value as Record<string, unknown>)[part];
    } else {
      return undefined;
    }
  }

  return typeof value === 'string' || typeof value === 'number' ? value : undefined;
}
```

#### Preset Themes

```typescript
// src/lib/themes/presets.ts

import type { CardTheme } from '$lib/types/Theme.js';

export const darkTheme: CardTheme = {
  id: 'dark',
  name: 'Dark',
  description: 'Dark mode theme with high contrast',
  colors: {
    primary: '#3b82f6',
    secondary: '#8b5cf6',
    accent: '#f59e0b',
    background: '#0f172a',
    surface: '#1e293b',
    text: '#f8fafc',
    textMuted: '#94a3b8',
    border: '#334155',
  },
  typography: {
    heading: { fontFamily: 'Inter, sans-serif', fontWeight: 700 },
    body: { fontFamily: 'Inter, sans-serif', fontWeight: 400 },
  },
  radius: { sm: 4, md: 8, lg: 12, card: 26 },
};

export const lightTheme: CardTheme = {
  id: 'light',
  name: 'Light',
  description: 'Light mode theme',
  colors: {
    primary: '#2563eb',
    secondary: '#7c3aed',
    accent: '#d97706',
    background: '#ffffff',
    surface: '#f8fafc',
    text: '#0f172a',
    textMuted: '#64748b',
    border: '#e2e8f0',
  },
  typography: {
    heading: { fontFamily: 'Inter, sans-serif', fontWeight: 700 },
    body: { fontFamily: 'Inter, sans-serif', fontWeight: 400 },
  },
  radius: { sm: 4, md: 8, lg: 12, card: 26 },
};

export const gamingTheme: CardTheme = {
  id: 'gaming',
  name: 'Gaming',
  description: 'Neon-accented theme for gaming cards',
  colors: {
    primary: '#00ff88',
    secondary: '#ff00ff',
    accent: '#00ffff',
    background: '#0a0a0a',
    surface: '#1a1a2e',
    text: '#ffffff',
    textMuted: '#888888',
    border: '#333366',
  },
  rarityColors: {
    common: '#9ca3af',
    uncommon: '#22c55e',
    rare: '#3b82f6',
    epic: '#a855f7',
    legendary: '#f59e0b',
    mythic: '#ef4444',
  },
  typography: {
    heading: { fontFamily: 'Orbitron, sans-serif', fontWeight: 700 },
    body: { fontFamily: 'Rajdhani, sans-serif', fontWeight: 400 },
    accent: { fontFamily: 'Press Start 2P, cursive', fontWeight: 400 },
  },
  radius: { sm: 2, md: 4, lg: 8, card: 16 },
};

export const corporateTheme: CardTheme = {
  id: 'corporate',
  name: 'Corporate',
  description: 'Professional theme for business cards and badges',
  colors: {
    primary: '#1e40af',
    secondary: '#475569',
    accent: '#0891b2',
    background: '#f8fafc',
    surface: '#ffffff',
    text: '#1e293b',
    textMuted: '#64748b',
    border: '#cbd5e1',
  },
  typography: {
    heading: { fontFamily: 'Montserrat, sans-serif', fontWeight: 600 },
    body: { fontFamily: 'Open Sans, sans-serif', fontWeight: 400 },
  },
  radius: { sm: 4, md: 8, lg: 12, card: 20 },
};

export const retroTheme: CardTheme = {
  id: 'retro',
  name: 'Retro',
  description: 'Vintage-inspired warm theme',
  colors: {
    primary: '#dc2626',
    secondary: '#ca8a04',
    accent: '#16a34a',
    background: '#fef3c7',
    surface: '#fffbeb',
    text: '#451a03',
    textMuted: '#78350f',
    border: '#d97706',
  },
  typography: {
    heading: { fontFamily: 'Playfair Display, serif', fontWeight: 700 },
    body: { fontFamily: 'Lora, serif', fontWeight: 400 },
  },
  radius: { sm: 0, md: 0, lg: 0, card: 12 },
};

/** All preset themes */
export const themes = {
  dark: darkTheme,
  light: lightTheme,
  gaming: gamingTheme,
  corporate: corporateTheme,
  retro: retroTheme,
} as const;

export type PresetThemeId = keyof typeof themes;
```

---

### 5. Component Slots & Composition

**Problem:** Components are atomic. There's no way to create reusable "chunks" of components or define slot-based layouts.

**Solution:** Add layout components and component fragments.

#### Layout Component

```typescript
// src/lib/types/Layout.ts

import type { ComponentDefinition } from './CardTemplate.js';

export type LayoutDirection = 'column' | 'row';
export type LayoutAlign = 'start' | 'center' | 'end' | 'stretch';
export type LayoutJustify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';

export interface LayoutProps {
  /** Layout direction */
  direction?: LayoutDirection;
  /** Gap between children */
  gap?: number;
  /** Padding inside layout */
  padding?: number;
  /** Cross-axis alignment */
  align?: LayoutAlign;
  /** Main-axis justification */
  justify?: LayoutJustify;
  /** Whether to wrap children */
  wrap?: boolean;
}

/**
 * A Layout component that arranges children in a flex-like manner
 */
export interface LayoutDefinition extends ComponentDefinition {
  type: 'Layout';
  props: LayoutProps;
  children: ComponentDefinition[];
}
```

#### Component Fragments

```typescript
// src/lib/types/Fragment.ts

import type { ComponentDefinition } from './CardTemplate.js';
import type { DataFieldDefinition } from '$lib/adapters/types.js';

/**
 * A reusable group of components that can be inserted into templates
 */
export interface ComponentFragment {
  /** Unique identifier */
  id: string;

  /** Human-readable name */
  name: string;

  /** Description */
  description?: string;

  /** Category for organization */
  category?: 'header' | 'content' | 'footer' | 'badge' | 'stats' | 'other';

  /** Preview image */
  previewImage?: string;

  /** The component tree */
  components: ComponentDefinition[];

  /** Minimum container width required */
  minWidth?: number;

  /** Minimum container height required */
  minHeight?: number;

  /** Data fields this fragment expects */
  requiredFields?: DataFieldDefinition[];
}

// Example fragments
export const builtInFragments: ComponentFragment[] = [
  {
    id: 'trophy-badge',
    name: 'Trophy Badge',
    description: 'Icon with name and rarity label',
    category: 'badge',
    minWidth: 200,
    minHeight: 100,
    components: [
      {
        id: 'trophy-icon',
        type: 'Image',
        props: { dataField: 'imageUrl', width: 60, height: 60, fit: 'contain' }
      },
      {
        id: 'trophy-name',
        type: 'TextField',
        props: { dataField: 'subtitle', fontSize: 16, fontWeight: 'bold' }
      },
      {
        id: 'trophy-rarity',
        type: 'TextField',
        props: { dataField: 'rarityLabel', fontSize: 12, fill: '#888888' }
      },
    ],
    requiredFields: [
      { key: 'imageUrl', label: 'Icon', type: 'image', required: true },
      { key: 'subtitle', label: 'Name', type: 'string', required: true },
      { key: 'rarityLabel', label: 'Rarity', type: 'string' },
    ],
  },
  {
    id: 'stat-row',
    name: 'Stat Row',
    description: 'Label and value pair',
    category: 'stats',
    minWidth: 150,
    minHeight: 30,
    components: [
      {
        id: 'stat-label',
        type: 'TextField',
        props: { text: 'STAT', fontSize: 12, fill: '#888888', horizontalAlign: 'left' }
      },
      {
        id: 'stat-value',
        type: 'TextField',
        props: { dataField: 'statValue', fontSize: 14, fontWeight: 'bold', horizontalAlign: 'right' }
      },
    ],
  },
  {
    id: 'header-with-image',
    name: 'Header with Image',
    description: 'Full-width image with gradient overlay and title',
    category: 'header',
    minWidth: 300,
    minHeight: 200,
    components: [
      {
        id: 'bg-image',
        type: 'Image',
        props: { dataField: 'coverImage', fit: 'cover' }
      },
      {
        id: 'gradient-overlay',
        type: 'GradientBackground',
        props: { colors: ['transparent', 'rgba(0,0,0,0.8)'], direction: 'to-bottom' }
      },
      {
        id: 'title',
        type: 'TextField',
        props: { dataField: 'title', fontSize: 32, fontWeight: 'bold', fill: '#ffffff' }
      },
    ],
  },
];
```

---

### 6. Data Transformation Pipeline

**Problem:** Components can only display raw field values. No way to format, compute, or transform data.

**Solution:** Add transform functions that run before rendering.

#### Type Definitions

```typescript
// src/lib/types/Transforms.ts

import type { CardData } from './CardData.js';

/**
 * Built-in transform presets
 */
export type TransformPreset =
  | { type: 'uppercase' }
  | { type: 'lowercase' }
  | { type: 'capitalize' }
  | { type: 'trim' }
  | { type: 'date'; format: string }  // e.g., "MMM D, YYYY"
  | { type: 'number'; decimals?: number; locale?: string }
  | { type: 'currency'; currency?: string; locale?: string }
  | { type: 'percent'; decimals?: number }
  | { type: 'truncate'; length: number; suffix?: string }
  | { type: 'default'; fallback: unknown }
  | { type: 'map'; mapping: Record<string, string> }
  | { type: 'template'; template: string }  // "Earned: {value}"
  | { type: 'join'; separator?: string }  // For arrays
  | { type: 'first' }  // First item of array
  | { type: 'count' }  // Array length
  | { type: 'boolean'; trueText?: string; falseText?: string };

/**
 * Custom transform function
 */
export type TransformFn = (value: unknown, data: CardData) => unknown;

/**
 * A single field transform
 */
export interface FieldTransform {
  /** The field to read from */
  source: string;

  /** Transform to apply (preset or chain of presets) */
  transform: TransformPreset | TransformPreset[];

  /** Where to store result (defaults to source field) */
  target?: string;
}

/**
 * Apply transforms to card data
 */
export function applyTransforms(data: CardData, transforms: FieldTransform[]): CardData {
  const result = { ...data };

  for (const t of transforms) {
    const sourceValue = result[t.source];
    const targetField = t.target ?? t.source;

    const presets = Array.isArray(t.transform) ? t.transform : [t.transform];
    let value = sourceValue;

    for (const preset of presets) {
      value = applyPreset(value, preset, result);
    }

    result[targetField] = value;
  }

  return result;
}

function applyPreset(value: unknown, preset: TransformPreset, data: CardData): unknown {
  const str = value != null ? String(value) : '';

  switch (preset.type) {
    case 'uppercase':
      return str.toUpperCase();

    case 'lowercase':
      return str.toLowerCase();

    case 'capitalize':
      return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

    case 'trim':
      return str.trim();

    case 'date': {
      const date = new Date(str);
      // Simple format - in production, use a library like date-fns
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    }

    case 'number': {
      const num = typeof value === 'number' ? value : parseFloat(str);
      if (isNaN(num)) return str;
      return num.toLocaleString(preset.locale, {
        minimumFractionDigits: preset.decimals,
        maximumFractionDigits: preset.decimals,
      });
    }

    case 'currency': {
      const num = typeof value === 'number' ? value : parseFloat(str);
      if (isNaN(num)) return str;
      return num.toLocaleString(preset.locale ?? 'en-US', {
        style: 'currency',
        currency: preset.currency ?? 'USD',
      });
    }

    case 'percent': {
      const num = typeof value === 'number' ? value : parseFloat(str);
      if (isNaN(num)) return str;
      return `${num.toFixed(preset.decimals ?? 0)}%`;
    }

    case 'truncate': {
      if (str.length <= preset.length) return str;
      return str.slice(0, preset.length) + (preset.suffix ?? '...');
    }

    case 'default':
      return value ?? preset.fallback;

    case 'map':
      return preset.mapping[str] ?? str;

    case 'template':
      return preset.template.replace('{value}', str);

    case 'join':
      return Array.isArray(value) ? value.join(preset.separator ?? ', ') : str;

    case 'first':
      return Array.isArray(value) ? value[0] : value;

    case 'count':
      return Array.isArray(value) ? value.length : 0;

    case 'boolean': {
      const bool = value === true || value === 'true' || value === 1;
      return bool ? (preset.trueText ?? 'Yes') : (preset.falseText ?? 'No');
    }

    default:
      return value;
  }
}
```

#### Usage in Template

```json
{
  "name": "Trophy Card",
  "transforms": [
    {
      "source": "earnedDate",
      "transform": { "type": "date", "format": "MMM D, YYYY" },
      "target": "earnedDateFormatted"
    },
    {
      "source": "rarityPercent",
      "transform": { "type": "template", "template": "{value} of players" }
    },
    {
      "source": "title",
      "transform": [
        { "type": "trim" },
        { "type": "truncate", "length": 25 }
      ]
    },
    {
      "source": "trophyType",
      "transform": {
        "type": "map",
        "mapping": {
          "bronze": "🥉 Bronze",
          "silver": "🥈 Silver",
          "gold": "🥇 Gold",
          "platinum": "💎 Platinum"
        }
      },
      "target": "trophyTypeDisplay"
    }
  ],
  "components": [...]
}
```

---

### 7. Image Handling Improvements

**Problem:** Images are URLs that must be accessible. No fallbacks, no loading states.

**Solution:** Enhanced Image component with fallback chains and error handling.

#### Enhanced Image Props

```typescript
// Enhanced Image component props (additions)
export interface ImageProps {
  // ... existing props ...

  /** Fallback field chain - try each until one works */
  fallbackFields?: string[];

  /** Ultimate fallback if all sources fail */
  fallbackSrc?: string;

  /** Fallback solid color */
  fallbackColor?: string;

  /** Show placeholder while loading */
  loadingPlaceholder?: 'blur' | 'skeleton' | 'color' | 'none';

  /** Loading placeholder color */
  loadingColor?: string;

  /** Show icon when image fails to load */
  showErrorIcon?: boolean;

  /** Custom error message */
  errorMessage?: string;

  /** Retry failed images */
  retryCount?: number;

  /** Image filters */
  filters?: {
    grayscale?: boolean;
    blur?: number;
    brightness?: number;
    contrast?: number;
    saturate?: number;
    sepia?: boolean;
  };
}
```

#### Image Registry for Server-Side Rendering

```typescript
// src/lib/server/imageRegistry.ts

export interface ImageRegistryOptions {
  /** Maximum images to cache */
  maxSize?: number;
  /** Timeout for fetching images (ms) */
  fetchTimeout?: number;
  /** Retry failed fetches */
  retryCount?: number;
}

export interface ImageEntry {
  url: string;
  dataUri: string | null;
  error?: string;
  fetchedAt: number;
}

/**
 * Registry for caching images as base64 for server-side rendering
 */
export class ImageRegistry {
  private cache = new Map<string, ImageEntry>();
  private options: Required<ImageRegistryOptions>;

  constructor(options?: ImageRegistryOptions) {
    this.options = {
      maxSize: options?.maxSize ?? 100,
      fetchTimeout: options?.fetchTimeout ?? 10000,
      retryCount: options?.retryCount ?? 2,
    };
  }

  /**
   * Register an image URL, returns data URI
   */
  async register(url: string): Promise<string | null> {
    // Check cache
    const cached = this.cache.get(url);
    if (cached) {
      return cached.dataUri;
    }

    // Fetch and convert
    try {
      const response = await fetch(url, {
        signal: AbortSignal.timeout(this.options.fetchTimeout),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const buffer = await response.arrayBuffer();
      const base64 = Buffer.from(buffer).toString('base64');
      const contentType = response.headers.get('content-type') ?? 'image/png';
      const dataUri = `data:${contentType};base64,${base64}`;

      // Cache result
      this.cache.set(url, {
        url,
        dataUri,
        fetchedAt: Date.now(),
      });

      // Evict if over max size
      if (this.cache.size > this.options.maxSize) {
        const oldest = [...this.cache.entries()]
          .sort((a, b) => a[1].fetchedAt - b[1].fetchedAt)[0];
        if (oldest) this.cache.delete(oldest[0]);
      }

      return dataUri;
    } catch (error) {
      // Cache failure to avoid repeated attempts
      this.cache.set(url, {
        url,
        dataUri: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        fetchedAt: Date.now(),
      });
      return null;
    }
  }

  /**
   * Batch register images from CardData
   */
  async registerFromData(
    data: Record<string, unknown>,
    imageFields: string[]
  ): Promise<Map<string, string | null>> {
    const results = new Map<string, string | null>();

    const urls = imageFields
      .map(field => data[field])
      .filter((url): url is string => typeof url === 'string' && url.startsWith('http'));

    await Promise.all(
      urls.map(async (url) => {
        const dataUri = await this.register(url);
        results.set(url, dataUri);
      })
    );

    return results;
  }

  /**
   * Get registered image or null
   */
  get(url: string): string | null {
    return this.cache.get(url)?.dataUri ?? null;
  }

  /**
   * Clear cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache stats
   */
  getStats(): { size: number; hits: number; misses: number } {
    const entries = [...this.cache.values()];
    return {
      size: this.cache.size,
      hits: entries.filter(e => e.dataUri !== null).length,
      misses: entries.filter(e => e.dataUri === null).length,
    };
  }
}

// Singleton instance
export const imageRegistry = new ImageRegistry();
```

---

### 8. Analytics & Debugging Tools

**Problem:** No visibility into render performance, template errors, or missing data.

**Solution:** Add debug mode and diagnostics.

#### Types

```typescript
// src/lib/debug/types.ts

export interface RenderDiagnostics {
  /** Total render time in ms */
  renderTimeMs: number;

  /** Per-component timing */
  componentTiming: Array<{
    id: string;
    type: string;
    timeMs: number;
  }>;

  /** Data fields referenced but not found */
  missingFields: Array<{
    componentId: string;
    field: string;
  }>;

  /** Images that failed to load */
  failedImages: Array<{
    componentId: string;
    url: string;
    error?: string;
  }>;

  /** Warnings and suggestions */
  warnings: DiagnosticWarning[];
}

export interface DiagnosticWarning {
  /** Component that triggered the warning */
  componentId: string;

  /** Warning type */
  type:
    | 'text-overflow'
    | 'image-missing'
    | 'font-unavailable'
    | 'invalid-prop'
    | 'performance'
    | 'accessibility';

  /** Human-readable message */
  message: string;

  /** Suggested fix */
  suggestion?: string;

  /** Severity */
  severity: 'info' | 'warning' | 'error';
}

export interface DebugOptions {
  /** Show component boundaries */
  showBounds?: boolean;

  /** Show component IDs */
  showIds?: boolean;

  /** Highlight missing data fields */
  highlightMissing?: boolean;

  /** Show render timing */
  showTiming?: boolean;

  /** Log to console */
  logToConsole?: boolean;

  /** Callback with diagnostics */
  onDiagnostics?: (diagnostics: RenderDiagnostics) => void;
}
```

#### Debug Overlay Component

```svelte
<!-- src/lib/debug/DebugOverlay.svelte -->
<script lang="ts">
  import type { RenderDiagnostics, DebugOptions } from './types.js';

  let {
    diagnostics,
    options = {},
    visible = true,
  }: {
    diagnostics: RenderDiagnostics;
    options?: DebugOptions;
    visible?: boolean;
  } = $props();

  const totalWarnings = $derived(diagnostics.warnings.length);
  const errorCount = $derived(diagnostics.warnings.filter(w => w.severity === 'error').length);
  const missingCount = $derived(diagnostics.missingFields.length);
</script>

{#if visible}
  <div class="debug-overlay">
    <div class="debug-header">
      <span class="debug-title">🔍 Debug</span>
      <span class="debug-time">{diagnostics.renderTimeMs.toFixed(1)}ms</span>
    </div>

    {#if missingCount > 0}
      <div class="debug-section debug-missing">
        <strong>Missing Fields ({missingCount})</strong>
        <ul>
          {#each diagnostics.missingFields as field}
            <li>{field.componentId}: <code>{field.field}</code></li>
          {/each}
        </ul>
      </div>
    {/if}

    {#if diagnostics.failedImages.length > 0}
      <div class="debug-section debug-images">
        <strong>Failed Images ({diagnostics.failedImages.length})</strong>
        <ul>
          {#each diagnostics.failedImages as img}
            <li>{img.componentId}: {img.error ?? 'Failed'}</li>
          {/each}
        </ul>
      </div>
    {/if}

    {#if totalWarnings > 0}
      <div class="debug-section debug-warnings">
        <strong>Warnings ({totalWarnings})</strong>
        <ul>
          {#each diagnostics.warnings as warning}
            <li class="warning-{warning.severity}">
              [{warning.type}] {warning.message}
            </li>
          {/each}
        </ul>
      </div>
    {/if}
  </div>
{/if}

<style>
  .debug-overlay {
    position: absolute;
    top: 4px;
    right: 4px;
    background: rgba(0, 0, 0, 0.85);
    color: #fff;
    font-size: 10px;
    padding: 8px;
    border-radius: 4px;
    max-width: 250px;
    max-height: 300px;
    overflow: auto;
    font-family: monospace;
    z-index: 1000;
  }

  .debug-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    padding-bottom: 4px;
    border-bottom: 1px solid #444;
  }

  .debug-time {
    color: #4ade80;
  }

  .debug-section {
    margin-bottom: 8px;
  }

  .debug-section ul {
    margin: 4px 0 0 0;
    padding-left: 16px;
  }

  .debug-missing { color: #fbbf24; }
  .debug-images { color: #f87171; }
  .debug-warnings { color: #fb923c; }

  .warning-error { color: #f87171; }
  .warning-warning { color: #fbbf24; }
  .warning-info { color: #60a5fa; }

  code {
    background: #333;
    padding: 1px 4px;
    border-radius: 2px;
  }
</style>
```

---

### 9. Better TypeScript Experience

**Problem:** Props use `Record<string, unknown>` which loses type safety.

**Solution:** Add typed component props and builder functions.

#### Typed Props

```typescript
// src/lib/types/ComponentProps.ts

import type { AnimationConfig } from '$lib/styling/animations';
import type { EffectConfig } from '$lib/styling/effects';
import type { BlendMode } from '$lib/styling/blend';
import type { HolographicConfig } from '$lib/styling/HolographicWrapper.svelte';
import type { ShapeSource } from '$lib/styling/shapes';
import type { HorizontalAlign, VerticalAlign } from './alignment.js';

// Base props shared by all components
export interface BaseComponentProps {
  opacity?: number;
  animation?: AnimationConfig;
  effect?: EffectConfig;
  blendMode?: BlendMode;
  holographic?: HolographicConfig;
}

// TextField
export interface TextFieldProps extends BaseComponentProps {
  /** Data field to read text from */
  dataField?: string;
  /** Static text (used if dataField not provided) */
  text?: string;
  /** Font size in pixels */
  fontSize?: number;
  /** Minimum font size for auto-fit */
  minFontSize?: number;
  /** Maximum font size for auto-fit */
  maxFontSize?: number;
  /** Font family */
  fontFamily?: string;
  /** Font weight */
  fontWeight?: 'normal' | 'bold' | 'light' | number;
  /** Font style */
  fontStyle?: 'normal' | 'italic';
  /** Text color */
  fill?: string;
  /** Horizontal alignment */
  horizontalAlign?: HorizontalAlign;
  /** Vertical alignment */
  verticalAlign?: VerticalAlign;
  /** Text transform */
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  /** Single line (no wrap) */
  singleLine?: boolean;
}

// Image
export interface ImageProps extends BaseComponentProps {
  /** Data field to read URL from */
  dataField?: string;
  /** Static URL */
  src?: string;
  /** Image fit mode */
  fit?: 'cover' | 'contain' | 'fill' | 'none';
  /** Border radius */
  clipRadius?: number;
  /** Clip to shape */
  shapeSource?: ShapeSource;
  /** Fallback fields */
  fallbackFields?: string[];
  /** Fallback URL */
  fallbackSrc?: string;
  /** Fallback color */
  fallbackColor?: string;
}

// GradientBackground
export interface GradientBackgroundProps extends BaseComponentProps {
  /** Gradient colors */
  colors: string[];
  /** Gradient direction */
  direction?: 'to-top' | 'to-bottom' | 'to-left' | 'to-right' | 'to-top-right' | 'to-top-left' | 'to-bottom-right' | 'to-bottom-left';
  /** Radial gradient */
  radial?: boolean;
}

// ... more typed props for each component

// Union type for all component definitions
export type TypedComponentDefinition =
  | { type: 'TextField'; id: string; props: TextFieldProps }
  | { type: 'Image'; id: string; props: ImageProps }
  | { type: 'GradientBackground'; id: string; props: GradientBackgroundProps }
  | { type: 'SolidBackground'; id: string; props: { color: string } & BaseComponentProps }
  | { type: 'Border'; id: string; props: { stroke: string; strokeWidth: number; radius?: number } }
  // ... etc
;
```

#### Builder Functions

```typescript
// src/lib/builders/index.ts

import type {
  TextFieldProps,
  ImageProps,
  GradientBackgroundProps,
  TypedComponentDefinition
} from '$lib/types/ComponentProps.js';
import type { CardTemplate } from '$lib/types';

let idCounter = 0;
function generateId(prefix: string): string {
  return `${prefix}-${++idCounter}`;
}

/**
 * Create a TextField component
 */
export function textField(props: TextFieldProps): TypedComponentDefinition {
  return {
    type: 'TextField',
    id: generateId('text'),
    props,
  };
}

/**
 * Create an Image component
 */
export function image(props: ImageProps): TypedComponentDefinition {
  return {
    type: 'Image',
    id: generateId('img'),
    props,
  };
}

/**
 * Create a GradientBackground component
 */
export function gradientBackground(props: GradientBackgroundProps): TypedComponentDefinition {
  return {
    type: 'GradientBackground',
    id: generateId('gradient'),
    props,
  };
}

/**
 * Create a template from components
 */
export function template(
  name: string,
  components: TypedComponentDefinition[]
): CardTemplate {
  return {
    name,
    components: components as CardTemplate['components'],
  };
}

// Usage example:
// const myTemplate = template('My Card', [
//   gradientBackground({ colors: ['#1a1a2e', '#16213e'] }),
//   image({ dataField: 'coverImage', fit: 'cover' }),
//   textField({ dataField: 'title', fontSize: 32, fontWeight: 'bold', fill: '#fff' }),
// ]);
```

---

### 10. Preset Templates & Starter Kits

**Problem:** No ready-to-use templates. Users start from scratch.

**Solution:** Bundle starter templates for common use cases.

#### Template Registry

```typescript
// src/lib/presets/templates/index.ts

import type { TemplatePackage } from '$lib/types/TemplatePackage.js';

export const starterTemplates: Record<string, TemplatePackage> = {
  // Gaming
  'trophy-card': {
    version: '1.0',
    meta: {
      id: 'trophy-card',
      name: 'Trophy Card',
      description: 'Achievement/trophy card with image and stats',
      tags: ['gaming', 'achievements', 'playstation', 'xbox', 'steam'],
      author: 'svelte-trading-cards',
      license: 'MIT',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
    templates: {
      front: {
        name: 'Trophy Card Front',
        components: [
          { id: 'bg', type: 'GradientBackground', props: { colors: ['#1a1a2e', '#16213e', '#0f3460'], direction: 'to-bottom' } },
          { id: 'cover', type: 'Image', props: { dataField: 'coverImage', fit: 'cover', opacity: 0.3 } },
          { id: 'icon', type: 'Image', props: { dataField: 'imageUrl', x: 50, y: 100, width: 150, height: 150, fit: 'contain' } },
          { id: 'title', type: 'TextField', props: { dataField: 'title', x: 220, y: 120, fontSize: 28, fontWeight: 'bold', fill: '#ffffff' } },
          { id: 'subtitle', type: 'TextField', props: { dataField: 'subtitle', x: 220, y: 160, fontSize: 18, fill: '#94a3b8' } },
          { id: 'rarity', type: 'Ribbon', props: { dataField: 'rarityLabel', position: 'top-right', color: '#f59e0b' } },
          { id: 'border', type: 'Border', props: { stroke: '#3b82f6', strokeWidth: 4, radius: 26 } },
        ],
      },
      back: {
        name: 'Trophy Card Back',
        components: [
          { id: 'bg', type: 'SolidBackground', props: { color: '#1e293b' } },
          { id: 'desc', type: 'TextField', props: { dataField: 'description', x: 50, y: 100, width: 650, height: 400, fontSize: 16, fill: '#cbd5e1' } },
          { id: 'date', type: 'TextField', props: { dataField: 'earnedDate', x: 50, y: 900, fontSize: 14, fill: '#64748b' } },
        ],
      },
    },
    sampleData: {
      title: 'Elden Ring',
      subtitle: 'Elden Lord',
      description: 'Achieved all endings and became the true Elden Lord.',
      imageUrl: 'https://via.placeholder.com/150',
      coverImage: 'https://via.placeholder.com/750x1050',
      rarityLabel: 'Ultra Rare',
      earnedDate: 'January 15, 2024',
    },
    suggestedAdapter: 'playstation',
  },

  // Professional
  'employee-badge': {
    version: '1.0',
    meta: {
      id: 'employee-badge',
      name: 'Employee Badge',
      description: 'Professional ID badge with photo and details',
      tags: ['business', 'hr', 'badge', 'professional'],
      author: 'svelte-trading-cards',
      license: 'MIT',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
    templates: {
      front: {
        name: 'Employee Badge Front',
        components: [
          { id: 'bg', type: 'SolidBackground', props: { color: '#ffffff' } },
          { id: 'header', type: 'GradientBackground', props: { colors: ['#1e40af', '#3b82f6'], height: 200 } },
          { id: 'photo', type: 'Image', props: { dataField: 'imageUrl', x: 250, y: 80, width: 250, height: 300, fit: 'cover', clipRadius: 8 } },
          { id: 'name', type: 'TextField', props: { dataField: 'title', x: 375, y: 420, fontSize: 32, fontWeight: 'bold', fill: '#1e293b', horizontalAlign: 'center' } },
          { id: 'jobtitle', type: 'TextField', props: { dataField: 'subtitle', x: 375, y: 470, fontSize: 18, fill: '#64748b', horizontalAlign: 'center' } },
          { id: 'dept', type: 'TextField', props: { dataField: 'description', x: 375, y: 510, fontSize: 16, fill: '#94a3b8', horizontalAlign: 'center' } },
          { id: 'id', type: 'TextField', props: { dataField: 'employeeId', x: 375, y: 900, fontSize: 14, fill: '#94a3b8', horizontalAlign: 'center' } },
        ],
      },
      back: {
        name: 'Employee Badge Back',
        components: [
          { id: 'bg', type: 'SolidBackground', props: { color: '#f8fafc' } },
          { id: 'emergency-title', type: 'TextField', props: { text: 'EMERGENCY CONTACT', x: 375, y: 100, fontSize: 14, fontWeight: 'bold', fill: '#dc2626', horizontalAlign: 'center' } },
          { id: 'emergency-name', type: 'TextField', props: { dataField: 'emergencyContact', x: 375, y: 150, fontSize: 18, fill: '#1e293b', horizontalAlign: 'center' } },
          { id: 'emergency-phone', type: 'TextField', props: { dataField: 'emergencyPhone', x: 375, y: 190, fontSize: 16, fill: '#64748b', horizontalAlign: 'center' } },
        ],
      },
    },
    sampleData: {
      title: 'Jane Smith',
      subtitle: 'Senior Engineer',
      description: 'Engineering Department',
      imageUrl: 'https://via.placeholder.com/250x300',
      employeeId: 'EMP-12345',
      emergencyContact: 'John Smith',
      emergencyPhone: '+1 (555) 123-4567',
    },
    suggestedAdapter: 'employee',
  },

  // Add more templates...
  'minimal': { /* ... */ },
  'product-card': { /* ... */ },
  'event-ticket': { /* ... */ },
} as Record<string, TemplatePackage>;

/**
 * Get all available starter templates
 */
export function getStarterTemplates(): TemplatePackage[] {
  return Object.values(starterTemplates);
}

/**
 * Get templates by tag
 */
export function getTemplatesByTag(tag: string): TemplatePackage[] {
  return Object.values(starterTemplates).filter(
    t => t.meta.tags?.includes(tag)
  );
}

/**
 * Get template by ID
 */
export function getTemplateById(id: string): TemplatePackage | undefined {
  return starterTemplates[id];
}
```

---

## Implementation Priority

| Priority | Feature | Impact | Effort | Dependencies |
|----------|---------|--------|--------|--------------|
| 🔴 **P0** | Multi-Face Card System | High - Unlocks trading card use cases | Medium | None |
| 🔴 **P0** | Data Adapter Interface | High - Clear integration pattern | Low | None |
| 🔴 **P0** | Template Package Format | High - Enables sharing ecosystem | Medium | None |
| 🟡 **P1** | Theme System | Medium - Brand consistency | Medium | None |
| 🟡 **P1** | Data Transforms | Medium - No-code data formatting | Medium | None |
| 🟡 **P1** | Image Fallbacks | Medium - Better reliability | Low | None |
| 🟡 **P1** | Starter Templates | Medium - Faster adoption | Low | Template Package |
| 🟢 **P2** | Debug Tools | Low - Developer experience | Medium | None |
| 🟢 **P2** | TypeScript Improvements | Low - Better DX | Medium | None |
| 🟢 **P2** | Layout Components | Low - Easier composition | High | None |

### Recommended Implementation Order

1. **Phase 1: Core Integration (Week 1-2)**
   - Multi-Face Card System
   - Data Adapter Interface
   - Template Package Format

2. **Phase 2: Data & Styling (Week 3-4)**
   - Data Transforms
   - Theme System
   - Image Fallbacks

3. **Phase 3: DX & Content (Week 5-6)**
   - Starter Templates
   - TypeScript Improvements
   - Debug Tools

4. **Phase 4: Advanced (Future)**
   - Layout Components
   - Component Fragments
   - Visual theme editor

---

## Use Case Examples

### Gaming Cards (PlayStation/Xbox/Steam)
```typescript
// Using the PlayStation adapter
import { PlayStationAdapter } from 'svelte-trading-cards/adapters';
import { getTemplateById } from 'svelte-trading-cards/presets';

const trophyData = await fetchTrophy(userId, trophyId);
const cardData = PlayStationAdapter.transform(trophyData);
const template = getTemplateById('trophy-card');

<FlippableCard card={template} data={cardData} />
```

### Employee Badges
```typescript
import { EmployeeAdapter } from 'svelte-trading-cards/adapters';

const employee = await hrSystem.getEmployee(id);
const cardData = EmployeeAdapter.transform(employee);

<FlippableCard card={badgeTemplate} data={cardData} />
```

### Product Cards (E-commerce)
```typescript
const productAdapter: DataAdapter<Product> = {
  id: 'product',
  name: 'Product Card',
  transform: (product) => ({
    title: product.name,
    subtitle: formatCurrency(product.price),
    imageUrl: product.images[0],
    description: product.shortDescription,
    category: product.category,
    rating: `${product.rating} ★`,
    inStock: product.inventory > 0,
  }),
  // ...
};
```

---

## Conclusion

These improvements transform `svelte-trading-cards` from a specialized card library into a **universal card creation platform**. By adding:

- **Multi-face support** → Trading cards, badges, tickets
- **Data adapters** → Any data source, clear contracts
- **Template packages** → Sharing, versioning, bundled assets
- **Themes** → Brand consistency across templates
- **Transforms** → No-code data formatting
- **Starter templates** → Immediate productivity

The package becomes suitable for:
- 🎮 Gaming achievements
- 👔 HR/employee systems
- 🛒 E-commerce products
- 🎫 Event ticketing
- 🃏 Custom card games
- 📇 Business cards
- And more...

---

*Document generated for svelte-trading-cards package improvement planning.*
