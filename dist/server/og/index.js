// =============================================================================
// OG IMAGE MODULE
// =============================================================================
//
// Utilities for generating Open Graph images optimized for social media sharing.
//
// Usage:
//   import { renderOGImage, OG_IMAGE_PRESETS } from 'svelte-trading-cards/server';
//
//   const { buffer } = await renderOGImage(template, data, {
//     preset: 'twitter',
//     background: '#1a1a2e',
//     branding: {
//       logo: { url: 'https://myapp.com/logo.png' },
//       watermark: { text: 'myapp.com' }
//     }
//   });
//
// =============================================================================
export { OG_IMAGE_PRESETS, PositionSchema, LogoConfigSchema, WatermarkConfigSchema, CaptionConfigSchema, BrandingConfigSchema, CustomSizeSchema, OGImageOptionsSchema, getOGImageSize, getPositionCoords, getTextAnchor } from './types.js';
// Renderer
export { renderOGImage } from './render.js';
