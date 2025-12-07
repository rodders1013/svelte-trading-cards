# Shape System Refactor Plan

## Overview

Consolidate shape handling into a unified system that:
1. Provides a shared shape primitive for fills, strokes, and clip paths
2. Supports built-in shapes (optimized, fast)
3. Supports Iconify icons as custom shapes (flexible, thousands of options)

---

## Current State

### Shape Logic Duplication

| Location | Purpose | Shapes Supported |
|----------|---------|------------------|
| `Badge.svelte` | Fill shapes | pill, square, diamond, hexagon, shield, star, circle |
| `Border.svelte` | Stroke paths | rect, circle, ellipse, hexagon, octagon, diamond, shield, star, polygon |
| Container `clipShape` | Clipping | rect, circle, ellipse, hexagon, octagon, diamond, shield, star, polygon |

### Problems
- Duplicate shape generation code
- Inconsistent shape names (e.g., `pill` vs `rect`)
- No way to use custom shapes
- Badge and Border have slightly different implementations

---

## Proposed Architecture

### 1. Shape Utilities (`src/lib/shapes/`)

```
src/lib/shapes/
├── index.ts              # Main exports
├── types.ts              # Shape types and interfaces
├── builtInShapes.ts      # Path generators for built-in shapes
├── iconShape.ts          # Convert Iconify icons to shape paths
└── ShapeClipPath.svelte  # Reusable clip path component
```

### 2. Types

```typescript
// types.ts

export type BuiltInShape =
  | 'rect'      // Rectangle with optional radius
  | 'pill'      // Fully rounded rectangle
  | 'circle'    // Perfect circle
  | 'ellipse'   // Oval
  | 'diamond'   // Rotated square
  | 'hexagon'   // 6-sided
  | 'octagon'   // 8-sided
  | 'shield'    // Shield/badge shape
  | 'star'      // 5-point star
  | 'triangle'  // Equilateral triangle
  | 'pentagon'  // 5-sided

export type ShapeSource =
  | { type: 'builtin'; shape: BuiltInShape }
  | { type: 'icon'; iconData: IconData }

export interface ShapePathData {
  // For simple shapes
  type: 'rect' | 'circle' | 'ellipse' | 'polygon' | 'path';
  // Shape-specific properties
  d?: string;           // For path
  points?: string;      // For polygon
  cx?: number;          // For circle/ellipse
  cy?: number;
  r?: number;           // For circle
  rx?: number;          // For ellipse/rect
  ry?: number;
  x?: number;           // For rect
  y?: number;
  width?: number;
  height?: number;
}

export interface ShapeOptions {
  width: number;
  height: number;
  inset?: number;       // For stroke width compensation
  radius?: number;      // For rect corner radius
}
```

### 3. Shape Generator

```typescript
// builtInShapes.ts

export function getShapePath(
  shape: BuiltInShape,
  options: ShapeOptions
): ShapePathData {
  const { width, height, inset = 0, radius = 0 } = options;
  // ... shape generation logic (extracted from Badge/Border)
}
```

### 4. Icon Shape Converter

```typescript
// iconShape.ts

export function iconToClipPath(
  iconData: IconData,
  width: number,
  height: number
): string {
  // Scale icon viewBox to target dimensions
  // Return SVG content suitable for <clipPath>
}

export function isIconSuitableForClipping(iconData: IconData): boolean {
  // Check if icon has closed paths suitable for clipping
  // Warn about stroke-only icons
}
```

---

## Phase 1: Iconify Icon Clip Path Testing

### Test Objectives
1. Can an Iconify icon SVG be used as a `<clipPath>`?
2. How does viewBox scaling work?
3. Do multi-path icons work correctly?
4. How do icons with holes (evenodd fill) behave?
5. Performance with complex icons?

### Test Cases

| Test | Icon | Expected Result |
|------|------|-----------------|
| Simple filled shape | `mdi:heart` | Should clip cleanly |
| Shape with hole | `mdi:heart-outline` | May need `clip-rule="evenodd"` |
| Multi-path icon | `mdi:cloud` | All paths should contribute to clip |
| Complex icon | `mdi:shield-crown` | Should work but test performance |
| Stroke-only icon | `mdi:close` | May not clip properly (open paths) |

### Test Implementation

Create test page at `/routes/test/icon-shapes/+page.svelte`:
```svelte
<!-- Test various icons as clip paths -->
<svg>
  <defs>
    <clipPath id="icon-clip">
      <!-- Scaled icon content -->
    </clipPath>
  </defs>

  <!-- Test image clipped to icon shape -->
  <image href="test.jpg" clip-path="url(#icon-clip)" />
</svg>
```

### Test Results (2024-12-06)

**Key Finding: Use `<mask>` instead of `<clipPath>` for dynamic icon shapes.**

| Approach | Works? | Notes |
|----------|--------|-------|
| `clipPath` with hardcoded SVG | ✅ | Static shapes work |
| `clipPath` with `{@html}` icon | ❌ | Dynamic content not parsed for clipping |
| `mask` with `{@html}` icon | ✅ | All fill types work |
| Direct fill on icon paths | ✅ | Using `style="color: ..."` for currentColor icons |
| Gradient fill on icon paths | ✅ | Using strippedBody (fill attrs removed) |
| Stroke border on icon paths | ✅ | Using strippedBody |

**Why mask works but clipPath doesn't:**
- `<mask>` renders content as a grayscale image, then uses luminance for alpha
- `<clipPath>` requires parsed vector geometry, which doesn't work with `{@html}`
- Both Svelte's rendering and browser SVG parsing may contribute to this

**Recommended approach for Badge with icon shapes:**
```svelte
<defs>
  <mask id="shape-mask">
    <g transform="..." fill="white">
      {@html strippedBody}
    </g>
  </mask>
</defs>
<!-- Solid/Gradient fill -->
<rect fill="..." mask="url(#shape-mask)" />
<!-- Pattern overlay -->
<rect fill="url(#pattern)" mask="url(#shape-mask)" />
<!-- Border: use direct stroke on shape -->
<g transform="..." fill="none" stroke="..." stroke-width="...">
  {@html strippedBody}
</g>
```

### Success Criteria
- [x] Icons render correctly as shapes
- [x] Icons scale correctly to container dimensions
- [x] Solid fills work
- [x] Gradient fills work
- [x] Pattern overlays work (via mask)
- [x] Stroke borders work
- [ ] Performance acceptable (not yet tested with many icons)

---

## Phase 2: Bundled Shape Icons

### New Approach: Icons as Primitives

Instead of maintaining separate shape generation code, we'll use Iconify icons for ALL shapes:
- **Bundled shapes**: Common shapes stored locally (~2-3KB total)
- **Custom icons**: Fetched from Iconify API on demand

### Benefits
1. **One rendering system** - Same code for built-in and custom shapes
2. **No shape generator code** - Just icon data
3. **Instant rendering** - Bundled shapes have no network delay
4. **Extensible** - Easy to add more default shapes
5. **Tiny footprint** - ~200 bytes per shape

### Directory Structure
```
src/lib/shapes/
├── index.ts              # Main exports
├── types.ts              # Shape types
├── bundledShapes.ts      # Pre-stored icon data for common shapes
├── shapeUtils.ts         # Transform, scale, strip fill utilities
└── ShapePicker.svelte    # UI for selecting shapes (bundled + custom search)
```

### Bundled Shapes (~15 shapes)
```typescript
// Basic geometric
circle, square, rectangle, diamond, hexagon, octagon, triangle, pentagon

// Decorative
star, heart, shield, badge, ribbon, seal, bookmark

// Custom icon option (fetched from API)
```

### Tasks
1. [x] Create `src/lib/shapes/` directory
2. [x] Create `types.ts` with shape types
3. [x] Create `bundledShapes.ts` with icon data from Iconify (22 shapes)
4. [x] Create `shapeUtils.ts` (transform, strippedBody, etc.)
5. [x] Create `ShapePicker.svelte` component
6. [x] Test with existing Badge component

### Files to Update After Implementation

| File | Change Required |
|------|-----------------|
| `Badge.svelte` | Use new shape system, remove old shape code |
| `Border.svelte` | Use shapes for border paths |
| `Container/Group` | Use shapes for clipping (via mask) |
| `ZoneProperties.svelte` | Add shape picker |
| `types.ts` (creator) | Update shape type definitions |

---

## Phase 3: Badge Enhancement

### Prerequisites
- [x] Phase 1 complete (icon clip testing)
- [x] Phase 2 complete (shape primitive)
- [x] Review Badge requirements based on test outcomes

### Implementation Status (2024-12-06)

**Completed:**
- [x] Badge.svelte now uses mask-based rendering with `shapeSource` prop
- [x] Supports all 22 bundled shapes + custom Iconify icons
- [x] BadgePanel.svelte uses ShapePicker component
- [x] creator/types.ts updated with new BadgeComponent interface
- [x] creator/state.svelte.ts updated with new default shape

**Architecture:**
```svelte
<!-- Badge now uses mask-based shape rendering -->
<defs>
  <mask id={maskId}>
    <g transform={shapeRender.transform} fill="white">
      {@html shapeRender.strippedBody}
    </g>
  </mask>
</defs>
<rect fill={bgColor} mask="url(#{maskId})" />
<!-- Border stroke on shape paths -->
<g transform={...} fill="none" stroke={bdrColor}>
  {@html shapeRender.strippedBody}
</g>
```

**Deferred to future iteration:**
- [ ] Gradient fill support
- [ ] Pattern overlay support
- [ ] Enhanced border (glow, holographic)
- [ ] Text integration (use TextField in same zone for now)

### Badge Features (All-in-One)

| Feature | Source | Notes |
|---------|--------|-------|
| Shape | Shape primitive | Built-in or icon |
| Fill (solid) | New | Simple color fill |
| Fill (gradient) | From `GradientBackground` | Linear gradient |
| Pattern overlay | From `PatternBackground` | Clipped to badge shape |
| Border stroke | From `Border` | Basic stroke |
| Border glow | From `Border` | Glow effect |
| Border holographic | From `Border` | Animated gradient |
| Text | From `TextField`/`FitText` | Auto-fit text |
| Icon | Existing | Centered icon |

### Badge Props (Draft)

```typescript
BadgePropsSchema = z.object({
  // Shape (built-in or icon)
  shape: BuiltInShapeSchema.default('pill'),
  customShape: IconDataSchema.optional(),  // If set, overrides shape

  // Fill
  fillType: z.enum(['solid', 'gradient']).default('solid'),
  fillColor: z.string().default('#3b82f6'),
  gradientColors: z.array(z.string()).optional(),
  gradientDirection: z.enum(['vertical', 'horizontal', 'diagonal']).optional(),

  // Pattern overlay
  patternType: PatternTypeSchema.optional(),
  patternColor: z.string().optional(),
  patternOpacity: z.number().optional(),
  patternSize: z.number().optional(),

  // Border
  borderColor: z.string().optional(),
  borderWidth: z.number().default(0),
  borderGlow: z.object({
    enabled: z.boolean(),
    color: z.string().optional(),
    intensity: z.number(),
    blur: z.number(),
    animated: z.boolean().optional(),
  }).optional(),

  // Text
  textPreset: TextPresetSchema.optional(),
  dataField: z.string().optional(),
  fontFamily: z.string().default('Arial, sans-serif'),
  fontWeight: z.string().default('bold'),
  textColor: z.string().default('#ffffff'),

  // Icon (centered)
  icon: IconDataSchema.optional(),
  iconColor: z.string().optional(),

  // General
  opacity: z.number().default(1),
  animation: AnimationConfigSchema.optional(),
  effect: EffectConfigSchema.optional(),
  blendMode: BlendMode.optional()
});
```

### Removed from Badge
- `preset` (color presets like rare, epic, legendary)
- `size` (sm, md, lg - was for old text sizing)

---

## Phase 4: Update Dependent Components

### Components Using Shapes

| Component | Current Shape Usage | Status |
|-----------|--------------------| -------|
| `Badge.svelte` | ~~Local shape generation~~ | ✅ Uses shape primitive with mask |
| `Border.svelte` | ~~Local shape generation~~ | ✅ Uses shape primitive |
| `Group.svelte` (container) | ~~`clipShape` prop~~ | ✅ Uses `shapeSource` with mask |
| `ZoneProperties.svelte` | ~~Shape selector UI~~ | ✅ Uses ShapePicker in collapsible |
| `BadgePanel.svelte` | ~~Shape dropdown~~ | ✅ Uses ShapePicker |

### Types Updated

| Type | Location | Status |
|------|----------|--------|
| `ClipShape` | `creator/types.ts` | ✅ **Removed** - replaced by `ShapeSource` |
| `BadgeComponent` | `creator/types.ts` | ✅ Uses `shapeSource: ShapeSource` |
| `ContainerState` | `creator/types.ts` | ✅ Uses `shapeSource?: ShapeSource` |
| `ContainerContext` | `types/CardTemplate.ts` | ✅ Uses `shapeSource?: ShapeSource` |

---

## Implementation Order

```
1. Phase 1: Icon Clip Path Testing
   └── Create test page
   └── Test various icon types
   └── Document findings
   └── Decision point: proceed or adjust approach

2. Phase 2: Shape Primitive (if Phase 1 successful)
   └── Create shapes/ module
   └── Extract built-in shape generation
   └── Add icon shape support
   └── Update Badge to use primitive
   └── Update Border to use primitive

3. Phase 3: Badge Enhancement
   └── Review requirements based on Phase 1/2
   └── Add gradient fill
   └── Add pattern support
   └── Add enhanced border (glow)
   └── Add text back
   └── Update BadgePanel UI

4. Phase 4: Propagate Changes
   └── Update container clipping
   └── Update all shape selectors in UI
   └── Update types
   └── Full type check and testing
```

---

## Open Questions

1. **Text fitting to non-rectangular shapes**: Park for now, but consider:
   - Calculate inscribed rectangle for shape
   - Use that as text bounds
   - Complex shapes may need manual padding

2. **Icon shape curation**: Should we provide a curated list of "shape-suitable" icons?
   - Hearts, stars, shields, clouds, speech bubbles, etc.
   - Could be a dropdown of recommended shapes

3. **Performance**: Complex icon paths as clip paths - test with many badges on screen

4. **Backward compatibility**: Existing templates use `clipShape: 'rect'` etc.
   - Need migration strategy or keep supporting old format

---

## Notes

- Created: 2024-12-06
- Status: **Phase 4 Complete** ✅ (All components using unified shape system)
- Breaking changes made:
  - Removed `ClipShape` type and `clipShape` property
  - Removed `ClipPoint` type and `clipPoints` property
  - Removed Badge `preset` and `size` properties
  - All shapes now use `ShapeSource` (builtin or custom icon)

### Bundled Shapes (22 total)

**Geometric (9):** circle, square, rectangle, triangle, diamond, hexagon, octagon, pentagon, ellipse

**Decorative (7):** star, heart, shield, bookmark, label, cloud, message

**Awards (5):** crown, trophy, medal, seal, certificate

**Containers (1):** card

### Files Created

```
src/lib/shapes/
├── index.ts           # Exports
├── types.ts           # BuiltInShape, ShapeSource, ShapeData, etc.
├── bundledShapes.ts   # 22 pre-bundled icon shapes (~3KB)
├── shapeUtils.ts      # getShapeRenderData, stripFillAttributes, getShapeTransform
└── ShapePicker.svelte # Visual shape grid + custom icon search
```
