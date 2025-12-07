# Architecture Refactor Plan

## Executive Summary

This document outlines the findings from a comprehensive architecture review of the svelte-trading-cards library and provides a detailed implementation plan to address identified issues. The primary goals are:

1. Enable consistent modifier support (effects, animations, borders, clipping) across all components
2. Eliminate code duplication
3. Improve user experience by making features work intuitively at both component and layer levels

---

## Part 1: Current Architecture Analysis

### 1.1 Component Inventory

The library contains **13 component types** organized into categories:

| Category | Components | Purpose |
|----------|------------|---------|
| **Text-Based** | TextField, Ribbon, List, IconRating | Display text/data |
| **Visual** | Icon, Badge, Image | Display graphics |
| **Backgrounds** | SolidBackground, GradientBackground, PatternBackground | Layer backgrounds |
| **Decorations** | Border, Frame, Divider, ProgressBar, StatPanel | Visual embellishments |

### 1.2 Current Modifier Support Matrix

| Component | Effect | Animation | BlendMode | Clip Shape | Border | Filters |
|-----------|--------|-----------|-----------|------------|--------|---------|
| TextField | ✅ | ❌* | ✅ | ❌ | ❌ | ❌ |
| Image | ✅ | ❌* | ✅ | ✅ | ❌ | ✅ |
| Icon | ✅ | ❌* | ✅ | ❌ | ❌ | ❌ |
| Badge | ✅ | ❌* | ✅ | ✅ | ❌ | ❌ |
| SolidBackground | ✅ | ❌* | ✅ | ❌ | ❌ | ❌ |
| GradientBackground | ✅ | ❌* | ✅ | ❌ | ❌ | ❌ |
| PatternBackground | ✅ | ❌* | ✅ | ❌ | ❌ | ❌ |
| Border | ✅ | ❌* | ✅ | ✅ | N/A | ❌ |
| Divider | ✅ | ❌* | ✅ | ❌ | ❌ | ❌ |
| ProgressBar | ✅ | ❌* | ✅ | ❌ | ❌ | ❌ |
| Ribbon | ✅ | ❌* | ✅ | ❌ | ❌ | ❌ |
| Frame | ✅ | ❌* | ✅ | ❌ | ❌ | ❌ |
| List | ✅ | ❌* | ✅ | ❌ | ❌ | ❌ |
| IconRating | ✅ | ❌* | ✅ | ❌ | ❌ | ❌ |
| **Container/Zone** | ❌ | ✅ | ✅ | ✅ | ❌ | ❌ |

**Legend:**
- ✅ = Fully working
- ❌ = Not supported
- ❌* = Code exists but broken (animation props exist in Svelte components but aren't wired up in template builder)

### 1.3 Key Architectural Problems

#### Problem 1: Animation is Broken at Component Level

**Location:** `src/lib/creator/state.svelte.ts`

**Issue:** Every card component has an `animation` prop and wraps content in `AnimationWrapper`, but the `componentBuildConfig` object does not include `animation` in its prop mappings.

**Evidence:**
```typescript
// state.svelte.ts - componentBuildConfig for text component (lines 183-197)
text: {
  renderType: 'TextField',
  props: [
    'textPreset', 'dataField', 'maxFontSize', 'minFontSize',
    'fontWeight', 'fontStyle', 'textDecoration', 'textTransform',
    'fontFamily', 'opacity', 'alignment', 'verticalAlign', 'padding',
    { from: 'fill', to: 'color' }
    // NOTE: 'animation' is MISSING
  ]
}
```

**Result:** Animations only work at the container/zone level, not on individual components within a zone.

**Impact:** Users cannot animate a single badge or text field independently - they must animate the entire layer.

---

#### Problem 2: Border is a Separate Component, Not a Modifier

**Current Behavior:**
```
Layer
├── Image (clipped to hexagon shape)
├── Border (applies to full layer rectangle)
└── Text
```

**Expected Behavior:**
```
Layer
├── Image
│   └── border: follows hexagon clip shape
└── Text
```

**Issue:** Border cannot be applied TO another component. It exists as a sibling, unaware of other components' clip shapes.

**Location:** `src/lib/card/borders/Border.svelte`, `src/lib/creator/types.ts`

---

#### Problem 3: Clip Shape Only Available on Some Components

**Current State:**
- Image: Has `shapeSource` prop for clipping ✅
- Badge: Has `shapeSource` prop for shape ✅
- TextField: No clipping support ❌
- Icon: No clipping support ❌
- All others: No clipping support ❌

**Issue:** Cannot clip text to a shape, cannot clip icons to a shape, etc.

---

#### Problem 4: Text Rendering is Duplicated and Inconsistent

Six components render text using different approaches:

| Component | Method | Vertical Align | Code Location |
|-----------|--------|----------------|---------------|
| TextField | FitText | verticalAlign prop | `card/fields/TextField.svelte:99-117` |
| Ribbon | FitText | hardcoded center | `card/decorations/Ribbon.svelte:112-124` |
| List (items) | FitText | verticalAlign prop | `card/fields/List.svelte:215-223` |
| List (markers) | direct `<text>` | dominant-baseline="hanging" | `card/fields/List.svelte:224-234` |
| ProgressBar | direct `<text>` | dominant-baseline="central" | `card/decorations/ProgressBar.svelte:195-205` |
| IconRating | direct `<text>` | dominant-baseline="central" | `card/decorations/IconRating.svelte:298-310` |

**Issues:**
1. Inconsistent vertical baseline handling
2. Duplicated text styling logic
3. Different alignment prop names (`alignment` vs `labelPosition`)

---

#### Problem 5: Duplicated Calculations Across All Components

**Center Point Calculation (duplicated 13 times):**
```typescript
// Found in EVERY card component:
const centerX = $derived(container.width / 2);
const centerY = $derived(container.height / 2);
```

**Container Dimensions (duplicated 13 times):**
```typescript
const width = $derived(container.width);
const height = $derived(container.height);
const cx = $derived(width / 2);
const cy = $derived(height / 2);
```

**Data Resolution Pattern (duplicated 5+ times):**
```typescript
// TextField.svelte
const resolvedText = $derived.by(() => {
  if (dataField && data && data[dataField] !== undefined) {
    return String(data[dataField]);
  }
  return textPreset === 'none' ? '' : textPreset;
});

// Ribbon.svelte - nearly identical
const resolvedText = $derived.by(() => {
  if (dataField && data && data[dataField] !== undefined) {
    return String(data[dataField]);
  }
  return textPreset === 'none' ? 'RIBBON' : textPreset;
});

// Similar in: List, IconRating, ProgressBar
```

---

#### Problem 6: Wrapper Stack is Manually Nested in Every Component

Every component manually nests the same wrapper pattern:

```svelte
<!-- Repeated in ALL 13 components -->
<EffectWrapper {effect} {blendMode} transformOrigin="{centerX}px {centerY}px">
  <AnimationWrapper {animation} transformOrigin="{centerX}px {centerY}px">
    <!-- Content -->
  </AnimationWrapper>
</EffectWrapper>
```

**Exception - Image has an extra wrapper:**
```svelte
<EffectWrapper {effect} {blendMode} transformOrigin="{centerX}px {centerY}px">
  <AnimationWrapper {animation} transformOrigin="{centerX}px {centerY}px">
    <FilterWrapper {filter}>
      <!-- Content -->
    </FilterWrapper>
  </AnimationWrapper>
</EffectWrapper>
```

---

## Part 2: Proposed Architecture

### 2.1 Universal Modifiers System

**Goal:** Every component should support the same set of modifiers.

```typescript
// NEW: Universal modifier interface
interface UniversalModifiers {
  effect?: EffectConfig;       // Glow, shadow, neon, etc.
  animation?: AnimationConfig; // Pulse, float, spin, etc.
  blendMode?: BlendMode;       // Multiply, screen, overlay, etc.
  clip?: ShapeSource;          // Clip to shape
  border?: BorderModifier;     // Border that follows clip
  filter?: FilterConfig;       // Brightness, contrast, etc.
}

// NEW: Border as modifier (not component)
interface BorderModifier {
  color: string;
  width: number;
  opacity?: number;
  glow?: {
    color: string;
    intensity: number;
    blur: number;
    animated?: boolean;
    speed?: AnimationSpeed;
  };
}
```

### 2.2 Target Modifier Support Matrix

| Component | Effect | Animation | BlendMode | Clip | Border | Filters |
|-----------|--------|-----------|-----------|------|--------|---------|
| TextField | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Image | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Icon | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Badge | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| All Backgrounds | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| All Decorations | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Container/Zone | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

### 2.3 Unified Component Wrapper

**NEW:** Create a single wrapper component that handles all modifiers:

```svelte
<!-- src/lib/styling/ComponentWrapper.svelte -->
<script lang="ts">
  import type { UniversalModifiers, ContainerContext } from '$lib/types';

  let {
    container,
    modifiers = {},
    children
  }: {
    container: ContainerContext;
    modifiers: UniversalModifiers;
    children: Snippet;
  } = $props();

  const { effect, animation, blendMode, clip, border, filter } = modifiers;
  const cx = container.width / 2;
  const cy = container.height / 2;
</script>

<EffectWrapper {effect} {blendMode} transformOrigin="{cx}px {cy}px">
  <AnimationWrapper {animation} transformOrigin="{cx}px {cy}px">
    <FilterWrapper {filter}>
      <ClipWrapper {clip} width={container.width} height={container.height}>
        {@render children()}
        {#if border}
          <BorderRenderer {border} {clip} width={container.width} height={container.height} />
        {/if}
      </ClipWrapper>
    </FilterWrapper>
  </AnimationWrapper>
</EffectWrapper>
```

**Benefits:**
1. Single place to manage modifier stack
2. Border automatically follows clip shape
3. Eliminates 13× wrapper duplication
4. Easy to add new modifiers in future

---

## Part 3: Implementation Plan

### Phase 1: Fix Critical Issues (No Breaking Changes)

**Estimated Effort:** 2-4 hours

#### Task 1.1: Enable Component-Level Animations

**File:** `src/lib/creator/state.svelte.ts`

**Change:** Add `animation` to every component in `componentBuildConfig`

```typescript
// BEFORE
text: {
  renderType: 'TextField',
  props: ['textPreset', 'dataField', /* ... */]
}

// AFTER
text: {
  renderType: 'TextField',
  props: ['textPreset', 'dataField', /* ... */, 'animation']
}
```

**Apply to:** All 13 component types in componentBuildConfig

**Why:** Animations already work in the Svelte components; they're just not being passed through during template building.

---

#### Task 1.2: Create Shared Container Utilities

**New File:** `src/lib/utils/container.ts`

```typescript
import type { ContainerContext } from '$lib/types';

/**
 * Pre-computed container metrics to avoid duplication
 */
export interface ContainerMetrics {
  width: number;
  height: number;
  centerX: number;
  centerY: number;
  radius: number;
}

/**
 * Get container metrics (call once per component)
 */
export function getContainerMetrics(container: ContainerContext): ContainerMetrics {
  return {
    width: container.width,
    height: container.height,
    centerX: container.width / 2,
    centerY: container.height / 2,
    radius: container.radius
  };
}

/**
 * Create transform origin string for animations/effects
 */
export function getTransformOrigin(container: ContainerContext): string {
  return `${container.width / 2}px ${container.height / 2}px`;
}
```

**Why:** Eliminates ~52 lines of duplicated code across 13 components.

---

#### Task 1.3: Create Shared Data Resolution Utility

**New File:** `src/lib/utils/data.ts`

```typescript
import type { CardData } from '$lib/types';

/**
 * Resolve a value from card data or fallback
 */
export function resolveDataField<T>(
  dataField: string | undefined,
  data: CardData | undefined,
  fallback: T,
  parser?: (value: unknown) => T
): T {
  if (dataField && data && data[dataField] !== undefined) {
    const value = data[dataField];
    return parser ? parser(value) : (value as T);
  }
  return fallback;
}

/**
 * Common parsers
 */
export const parseString = (v: unknown): string => String(v);
export const parseNumber = (v: unknown): number =>
  typeof v === 'number' ? v : parseFloat(String(v)) || 0;
export const parseArray = (v: unknown, delimiter = ','): string[] =>
  Array.isArray(v) ? v.map(String) : String(v).split(delimiter).map(s => s.trim());
```

**Usage in components:**
```typescript
// BEFORE (TextField.svelte)
const resolvedText = $derived.by(() => {
  if (dataField && data && data[dataField] !== undefined) {
    return String(data[dataField]);
  }
  return textPreset === 'none' ? '' : textPreset;
});

// AFTER
import { resolveDataField, parseString } from '$lib/utils/data';
const resolvedText = $derived(
  resolveDataField(dataField, data, textPreset === 'none' ? '' : textPreset, parseString)
);
```

**Why:** Eliminates ~50 lines of duplicated data resolution logic.

---

#### Task 1.4: Update Utils Index

**File:** `src/lib/utils/index.ts`

```typescript
export { FitText } from './FitText.svelte';
export { fitTextToBox, fitText } from './textFitting.js';
export type { TextFitResult, TextFitOptions } from './textFitting.js';
export { measureText } from './textMeasure.js';

// NEW exports
export { getContainerMetrics, getTransformOrigin } from './container.js';
export type { ContainerMetrics } from './container.js';
export { resolveDataField, parseString, parseNumber, parseArray } from './data.js';
```

---

### Phase 2: Universal Modifiers Architecture

**Estimated Effort:** 8-16 hours

#### Task 2.1: Define Universal Modifier Types

**File:** `src/lib/types/modifiers.ts` (NEW)

```typescript
import type { EffectConfig } from '$lib/styling/effects';
import type { AnimationConfig } from '$lib/styling/animations';
import type { BlendMode } from '$lib/styling/blend';
import type { ShapeSource } from '$lib/styling/shapes';
import type { FilterConfig } from '$lib/styling/filters';

/**
 * Border modifier configuration
 * Can be applied to any component
 */
export interface BorderModifier {
  color: string;
  width: number;
  opacity?: number;
  style?: 'solid' | 'dashed' | 'dotted';
  glow?: {
    color: string;
    intensity: number;
    blur: number;
    animated?: boolean;
  };
}

/**
 * Universal modifiers that can be applied to any component
 */
export interface UniversalModifiers {
  /** Visual effect (glow, shadow, neon, etc.) */
  effect?: EffectConfig;

  /** Animation (pulse, float, spin, etc.) */
  animation?: AnimationConfig;

  /** Blend mode for compositing */
  blendMode?: BlendMode;

  /** Clip content to shape */
  clip?: ShapeSource;

  /** Border that follows clip shape */
  border?: BorderModifier;

  /** Image filters (brightness, contrast, etc.) */
  filter?: FilterConfig;
}

/**
 * Check if any modifiers are active
 */
export function hasActiveModifiers(modifiers?: UniversalModifiers): boolean {
  if (!modifiers) return false;
  return !!(
    modifiers.effect ||
    modifiers.animation ||
    (modifiers.blendMode && modifiers.blendMode !== 'normal') ||
    modifiers.clip ||
    modifiers.border ||
    modifiers.filter
  );
}
```

---

#### Task 2.2: Create Unified ComponentWrapper

**File:** `src/lib/styling/ComponentWrapper.svelte` (NEW)

```svelte
<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { UniversalModifiers } from '$lib/types/modifiers';
  import type { ContainerContext } from '$lib/types';
  import EffectWrapper from './effects/EffectWrapper.svelte';
  import AnimationWrapper from './animations/AnimationWrapper.svelte';
  import FilterWrapper from './filters/FilterWrapper.svelte';
  import ClipWrapper from './ClipWrapper.svelte';
  import BorderRenderer from './BorderRenderer.svelte';

  let {
    container,
    modifiers = {},
    children
  }: {
    container: ContainerContext;
    modifiers?: UniversalModifiers;
    children: Snippet;
  } = $props();

  const { effect, animation, blendMode, clip, border, filter } = modifiers;

  const transformOrigin = $derived(`${container.width / 2}px ${container.height / 2}px`);
</script>

<EffectWrapper {effect} {blendMode} {transformOrigin}>
  <AnimationWrapper {animation} {transformOrigin}>
    <FilterWrapper filter={filter}>
      <ClipWrapper shape={clip} width={container.width} height={container.height}>
        {@render children()}
        {#if border}
          <BorderRenderer
            {border}
            shape={clip}
            width={container.width}
            height={container.height}
          />
        {/if}
      </ClipWrapper>
    </FilterWrapper>
  </AnimationWrapper>
</EffectWrapper>
```

---

#### Task 2.3: Create ClipWrapper Component

**File:** `src/lib/styling/ClipWrapper.svelte` (NEW)

```svelte
<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { ShapeSource } from './shapes';
  import { getShapeRenderData } from './shapes/shapeUtils';

  let {
    shape,
    width,
    height,
    children
  }: {
    shape?: ShapeSource;
    width: number;
    height: number;
    children: Snippet;
  } = $props();

  const clipId = $derived(`clip-${Math.random().toString(36).slice(2, 9)}`);
  const shapeRender = $derived(shape ? getShapeRenderData(shape, width, height, 'contain') : null);
  const hasClip = $derived(!!shapeRender);
</script>

{#if hasClip && shapeRender}
  <defs>
    <clipPath id={clipId}>
      <g transform={shapeRender.transform}>
        {@html shapeRender.strippedBody}
      </g>
    </clipPath>
  </defs>
  <g clip-path="url(#{clipId})">
    {@render children()}
  </g>
{:else}
  {@render children()}
{/if}
```

---

#### Task 2.4: Create BorderRenderer Component

**File:** `src/lib/styling/BorderRenderer.svelte` (NEW)

```svelte
<script lang="ts">
  import type { BorderModifier } from '$lib/types/modifiers';
  import type { ShapeSource } from './shapes';
  import { getShapeRenderData } from './shapes/shapeUtils';

  let {
    border,
    shape,
    width,
    height,
    radius = 0
  }: {
    border: BorderModifier;
    shape?: ShapeSource;
    width: number;
    height: number;
    radius?: number;
  } = $props();

  const shapeRender = $derived(shape ? getShapeRenderData(shape, width, height, 'contain') : null);
  const hasShape = $derived(!!shapeRender);

  // Glow filter
  const glowId = $derived(`border-glow-${Math.random().toString(36).slice(2, 9)}`);
</script>

{#if border.glow}
  <defs>
    <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceGraphic" stdDeviation={border.glow.blur} result="blur" />
      <feFlood flood-color={border.glow.color} flood-opacity={border.glow.intensity} />
      <feComposite in2="blur" operator="in" />
      <feMerge>
        <feMergeNode />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>
{/if}

<g
  opacity={border.opacity ?? 1}
  filter={border.glow ? `url(#${glowId})` : undefined}
>
  {#if hasShape && shapeRender}
    <!-- Shape-aware border -->
    <g transform={shapeRender.transform}>
      <g
        fill="none"
        stroke={border.color}
        stroke-width={border.width * (shapeRender.width / width)}
      >
        {@html shapeRender.strippedBody}
      </g>
    </g>
  {:else}
    <!-- Rectangle border -->
    <rect
      x={border.width / 2}
      y={border.width / 2}
      width={width - border.width}
      height={height - border.width}
      rx={radius}
      ry={radius}
      fill="none"
      stroke={border.color}
      stroke-width={border.width}
    />
  {/if}
</g>
```

---

#### Task 2.5: Update Component Types

**File:** `src/lib/creator/types.ts`

Add universal modifiers to base component interface:

```typescript
// Add to existing types
import type { UniversalModifiers } from '$lib/types/modifiers';

// Base interface for all components
interface BaseComponent {
  id: string;
  type: string;
  visible: boolean;
  locked: boolean;
  name: string;
  // Universal modifiers available on all components
  modifiers?: UniversalModifiers;
}

// Update each component type to extend BaseComponent
export interface TextComponent extends BaseComponent {
  type: 'text';
  textPreset: string;
  dataField: string;
  // ... existing props
}

// ... repeat for all component types
```

---

#### Task 2.6: Migrate Components to Use ComponentWrapper

**Example migration for TextField:**

```svelte
<!-- BEFORE -->
<script lang="ts">
  // ... imports
  const centerX = $derived(container.width / 2);
  const centerY = $derived(container.height / 2);
</script>

<EffectWrapper {effect} {blendMode} transformOrigin="{centerX}px {centerY}px">
  <AnimationWrapper {animation} transformOrigin="{centerX}px {centerY}px">
    <FitText ... />
  </AnimationWrapper>
</EffectWrapper>

<!-- AFTER -->
<script lang="ts">
  import ComponentWrapper from '$lib/styling/ComponentWrapper.svelte';
  import type { UniversalModifiers } from '$lib/types/modifiers';

  // Collect modifiers
  const modifiers: UniversalModifiers = $derived({
    effect,
    animation,
    blendMode,
    clip,
    border,
    filter
  });
</script>

<ComponentWrapper {container} {modifiers}>
  <FitText ... />
</ComponentWrapper>
```

---

### Phase 3: Text Rendering Consolidation

**Estimated Effort:** 4-8 hours

#### Task 3.1: Create TextRenderer Utility Component

**File:** `src/lib/utils/TextRenderer.svelte` (NEW)

```svelte
<script lang="ts">
  import FitText from './FitText.svelte';

  type RenderMode = 'fit' | 'fixed';
  type HorizontalAlign = 'left' | 'center' | 'right';
  type VerticalAlign = 'top' | 'center' | 'bottom';

  let {
    text,
    mode = 'fit',
    x = 0,
    y = 0,
    width,
    height,
    fontSize,
    minFontSize,
    maxFontSize,
    fontFamily = 'sans-serif',
    fontWeight = 'normal',
    fontStyle = 'normal',
    textDecoration = 'none',
    textTransform = 'none',
    color = '#000000',
    opacity = 1,
    horizontalAlign = 'center',
    verticalAlign = 'center',
    padding = 0
  }: {
    text: string;
    mode?: RenderMode;
    x?: number;
    y?: number;
    width: number;
    height: number;
    fontSize?: number;
    minFontSize?: number;
    maxFontSize?: number;
    fontFamily?: string;
    fontWeight?: string | number;
    fontStyle?: string;
    textDecoration?: string;
    textTransform?: string;
    color?: string;
    opacity?: number;
    horizontalAlign?: HorizontalAlign;
    verticalAlign?: VerticalAlign;
    padding?: number;
  } = $props();

  // Calculate text anchor from alignment
  const textAnchor = $derived(
    horizontalAlign === 'left' ? 'start' :
    horizontalAlign === 'right' ? 'end' : 'middle'
  );

  // Calculate dominant baseline from vertical alignment
  const dominantBaseline = $derived(
    verticalAlign === 'top' ? 'hanging' :
    verticalAlign === 'bottom' ? 'auto' : 'central'
  );

  // Calculate position from alignment
  const textX = $derived(
    horizontalAlign === 'left' ? x + padding :
    horizontalAlign === 'right' ? x + width - padding :
    x + width / 2
  );

  const textY = $derived(
    verticalAlign === 'top' ? y + padding :
    verticalAlign === 'bottom' ? y + height - padding :
    y + height / 2
  );
</script>

{#if mode === 'fit'}
  <FitText
    {text}
    {x} {y}
    {width} {height}
    minSize={minFontSize}
    maxSize={maxFontSize}
    inset={padding}
    {fontFamily}
    {fontWeight}
    {fontStyle}
    {textDecoration}
    {textTransform}
    horizontalAlign={horizontalAlign}
    verticalAlign={verticalAlign}
    fill={color}
    {opacity}
  />
{:else}
  <text
    x={textX}
    y={textY}
    font-family={fontFamily}
    font-size={fontSize}
    font-weight={fontWeight}
    font-style={fontStyle}
    text-decoration={textDecoration}
    fill={color}
    opacity={opacity}
    text-anchor={textAnchor}
    dominant-baseline={dominantBaseline}
    style="text-transform: {textTransform}"
  >
    {text}
  </text>
{/if}
```

---

#### Task 3.2: Standardize Alignment Types

**File:** `src/lib/types/alignment.ts` (NEW)

```typescript
export type HorizontalAlign = 'left' | 'center' | 'right';
export type VerticalAlign = 'top' | 'center' | 'bottom';
export type LabelPosition = HorizontalAlign | 'inside' | 'none';

export interface AlignmentProps {
  horizontalAlign?: HorizontalAlign;
  verticalAlign?: VerticalAlign;
}

/**
 * Convert legacy alignment names to standard
 */
export function normalizeHorizontalAlign(
  value: string | undefined
): HorizontalAlign {
  if (value === 'start') return 'left';
  if (value === 'end') return 'right';
  if (value === 'left' || value === 'right' || value === 'center') {
    return value;
  }
  return 'center';
}

export function normalizeVerticalAlign(
  value: string | undefined
): VerticalAlign {
  if (value === 'top' || value === 'bottom' || value === 'center') {
    return value;
  }
  return 'center';
}
```

---

### Phase 4: Update Creator UI

**Estimated Effort:** 4-8 hours

#### Task 4.1: Add Universal Modifiers Panel

Create a reusable panel that can be added to any component's property panel:

**File:** `src/lib/creator/components/panels/ModifiersPanel.svelte` (NEW)

This panel would include:
- Effect controls (existing EffectsControls)
- Animation controls (existing AnimationControls)
- Blend mode controls (existing BlendControls)
- NEW: Clip shape picker
- NEW: Border modifier controls
- NEW: Filter controls (brightness, contrast, etc.)

#### Task 4.2: Update Component Panels

Add the ModifiersPanel to each component's property panel, replacing the individual effect/blend controls.

---

### Phase 5: Deprecate Border Component

**Estimated Effort:** 2-4 hours

#### Task 5.1: Mark Border Component as Deprecated

Add deprecation notice to Border component and creator panel.

#### Task 5.2: Migration Guide

Document how to migrate from Border component to border modifier:

```typescript
// OLD: Border as separate component
{
  type: 'border',
  color: '#ffffff',
  width: 2,
  glow: { color: '#ff0000', intensity: 0.5, blur: 10 }
}

// NEW: Border as modifier on Image component
{
  type: 'image',
  dataField: 'cover',
  clip: { type: 'builtin', shape: 'hexagon' },
  modifiers: {
    border: {
      color: '#ffffff',
      width: 2,
      glow: { color: '#ff0000', intensity: 0.5, blur: 10 }
    }
  }
}
```

---

## Part 4: Migration Strategy

### 4.1 Backwards Compatibility

All changes should be **additive** where possible:

1. **Phase 1** - No breaking changes
2. **Phase 2** - New `modifiers` prop is optional
3. **Phase 3** - TextRenderer is new, existing components unchanged
4. **Phase 4** - UI additions, not removals
5. **Phase 5** - Border component deprecated but still works

### 4.2 Testing Checklist

For each phase:

- [ ] All existing templates still render correctly
- [ ] Creator UI works without errors
- [ ] Server-side rendering produces identical output
- [ ] No TypeScript errors
- [ ] Unit tests pass

### 4.3 Rollback Plan

Each phase is independent. If issues arise:

1. Revert the specific phase's commits
2. Previous phases remain functional
3. No data migration required

---

## Part 5: File Change Summary

### New Files

| File | Phase | Purpose |
|------|-------|---------|
| `src/lib/utils/container.ts` | 1 | Container metrics utilities |
| `src/lib/utils/data.ts` | 1 | Data resolution utilities |
| `src/lib/types/modifiers.ts` | 2 | Universal modifier types |
| `src/lib/styling/ComponentWrapper.svelte` | 2 | Unified modifier wrapper |
| `src/lib/styling/ClipWrapper.svelte` | 2 | Shape clipping wrapper |
| `src/lib/styling/BorderRenderer.svelte` | 2 | Border rendering component |
| `src/lib/utils/TextRenderer.svelte` | 3 | Unified text rendering |
| `src/lib/types/alignment.ts` | 3 | Alignment type definitions |
| `src/lib/creator/components/panels/ModifiersPanel.svelte` | 4 | Universal modifiers UI |

### Modified Files

| File | Phase | Changes |
|------|-------|---------|
| `src/lib/creator/state.svelte.ts` | 1 | Add animation to componentBuildConfig |
| `src/lib/utils/index.ts` | 1-3 | Export new utilities |
| `src/lib/creator/types.ts` | 2 | Add modifiers to component interfaces |
| `src/lib/card/**/*.svelte` | 2 | Use ComponentWrapper |
| `src/lib/types/index.ts` | 2-3 | Export new types |
| Component panels | 4 | Add ModifiersPanel |

---

## Part 6: Success Criteria

After full implementation:

1. **Any component can have any modifier**
   - Add glow effect to text ✓
   - Animate individual icons ✓
   - Clip text to shape ✓
   - Add border to clipped image ✓

2. **Border follows clip shape**
   - Clip image to hexagon → border is hexagon ✓
   - Clip text to circle → border is circle ✓

3. **Animations work at component level**
   - Pulse a single badge ✓
   - Float a single text field ✓

4. **Code is DRY**
   - No duplicate center calculations
   - No duplicate data resolution
   - Single wrapper component

5. **Consistent text rendering**
   - Same alignment behavior everywhere
   - Same baseline handling

---

## Appendix A: Current File Locations

### Card Components
- `src/lib/card/backgrounds/` - SolidBackground, GradientBackground, PatternBackground
- `src/lib/card/borders/` - Border
- `src/lib/card/decorations/` - Badge, Divider, Frame, IconRating, ProgressBar, Ribbon
- `src/lib/card/fields/` - List, StatPanel, TextField
- `src/lib/card/icons/` - Icon, IconPicker

### Styling Systems
- `src/lib/styling/animations/` - AnimationWrapper, presets, types
- `src/lib/styling/effects/` - EffectWrapper, presets, types
- `src/lib/styling/blend/` - Blend mode types and utilities
- `src/lib/styling/filters/` - FilterWrapper, types
- `src/lib/styling/shapes/` - ShapePicker, shapeUtils, bundledShapes

### Creator
- `src/lib/creator/state.svelte.ts` - State management and template building
- `src/lib/creator/types.ts` - Component type definitions
- `src/lib/creator/components/panels/` - Property panels for each component
- `src/lib/creator/components/controls/` - Shared control components

---

## Appendix B: Quick Reference - What's Broken

| Issue | Location | Quick Fix |
|-------|----------|-----------|
| Animation not working on components | `state.svelte.ts` componentBuildConfig | Add 'animation' to each component's props array |
| Center calculation duplicated | All card components | Use `getContainerMetrics()` utility |
| Data resolution duplicated | TextField, Ribbon, List, etc. | Use `resolveDataField()` utility |
| Border doesn't follow clip | Architectural | Implement ComponentWrapper with BorderRenderer |
| Clip only on Image/Badge | Architectural | Add clip support to all components |
| Text baseline inconsistent | Various components | Use TextRenderer or standardize baseline |

---

*Document created: December 2024*
*Last updated: December 2024*
