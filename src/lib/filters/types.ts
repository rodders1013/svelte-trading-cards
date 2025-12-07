import { z } from 'zod';

/**
 * Filter configuration for CSS filter effects.
 * All values are optional and default to their neutral values.
 */
export const FilterConfigSchema = z.object({
	/** Brightness adjustment (0 = black, 1 = normal, 2 = 2x bright) */
	brightness: z.number().min(0).max(3).default(1),
	/** Contrast adjustment (0 = gray, 1 = normal, 2 = high contrast) */
	contrast: z.number().min(0).max(3).default(1),
	/** Saturation (0 = grayscale, 1 = normal, 2 = vivid) */
	saturate: z.number().min(0).max(3).default(1),
	/** Blur amount in pixels */
	blur: z.number().min(0).max(20).default(0),
	/** Grayscale amount (0 = color, 1 = full grayscale) */
	grayscale: z.number().min(0).max(1).default(0),
	/** Sepia tone (0 = none, 1 = full sepia) */
	sepia: z.number().min(0).max(1).default(0),
	/** Hue rotation in degrees (0-360) */
	hueRotate: z.number().min(0).max(360).default(0),
	/** Invert colors (0 = normal, 1 = fully inverted) */
	invert: z.number().min(0).max(1).default(0)
});

export type FilterConfig = z.infer<typeof FilterConfigSchema>;

/**
 * Default filter config (all neutral values)
 */
export const DEFAULT_FILTER_CONFIG: FilterConfig = {
	brightness: 1,
	contrast: 1,
	saturate: 1,
	blur: 0,
	grayscale: 0,
	sepia: 0,
	hueRotate: 0,
	invert: 0
};

/**
 * Check if a filter config has any non-default values
 */
export function hasActiveFilters(config: Partial<FilterConfig> | undefined): boolean {
	if (!config) return false;
	return (
		(config.brightness !== undefined && config.brightness !== 1) ||
		(config.contrast !== undefined && config.contrast !== 1) ||
		(config.saturate !== undefined && config.saturate !== 1) ||
		(config.blur !== undefined && config.blur !== 0) ||
		(config.grayscale !== undefined && config.grayscale !== 0) ||
		(config.sepia !== undefined && config.sepia !== 0) ||
		(config.hueRotate !== undefined && config.hueRotate !== 0) ||
		(config.invert !== undefined && config.invert !== 0)
	);
}

/**
 * Generate CSS filter string from config
 */
export function buildFilterString(config: Partial<FilterConfig> | undefined): string {
	if (!config) return '';

	const filters: string[] = [];

	if (config.brightness !== undefined && config.brightness !== 1) {
		filters.push(`brightness(${config.brightness})`);
	}
	if (config.contrast !== undefined && config.contrast !== 1) {
		filters.push(`contrast(${config.contrast})`);
	}
	if (config.saturate !== undefined && config.saturate !== 1) {
		filters.push(`saturate(${config.saturate})`);
	}
	if (config.blur !== undefined && config.blur > 0) {
		filters.push(`blur(${config.blur}px)`);
	}
	if (config.grayscale !== undefined && config.grayscale > 0) {
		filters.push(`grayscale(${config.grayscale})`);
	}
	if (config.sepia !== undefined && config.sepia > 0) {
		filters.push(`sepia(${config.sepia})`);
	}
	if (config.hueRotate !== undefined && config.hueRotate !== 0) {
		filters.push(`hue-rotate(${config.hueRotate}deg)`);
	}
	if (config.invert !== undefined && config.invert > 0) {
		filters.push(`invert(${config.invert})`);
	}

	return filters.join(' ');
}

/**
 * Image transform configuration for pan, zoom, rotation, and flip.
 * These are image-specific transforms for positioning content within container.
 */
export const ImageTransformConfigSchema = z.object({
	/** Horizontal offset as percentage of container width */
	offsetX: z.number().min(-500).max(500).default(0),
	/** Vertical offset as percentage of container height */
	offsetY: z.number().min(-500).max(500).default(0),
	/** Scale factor (0.1 = 10%, 1 = 100%, 10 = 1000%) */
	scale: z.number().min(0.1).max(10).default(1),
	/** Rotation in degrees (0-360) */
	rotation: z.number().min(0).max(360).default(0),
	/** Flip horizontally */
	flipHorizontal: z.boolean().default(false),
	/** Flip vertically */
	flipVertical: z.boolean().default(false)
});

export type ImageTransformConfig = z.infer<typeof ImageTransformConfigSchema>;

/**
 * Default image transform config (neutral values)
 */
export const DEFAULT_IMAGE_TRANSFORM: ImageTransformConfig = {
	offsetX: 0,
	offsetY: 0,
	scale: 1,
	rotation: 0,
	flipHorizontal: false,
	flipVertical: false
};

/**
 * Check if an image transform config has any non-default values
 */
export function hasActiveTransform(config: Partial<ImageTransformConfig> | undefined): boolean {
	if (!config) return false;
	return (
		(config.offsetX !== undefined && config.offsetX !== 0) ||
		(config.offsetY !== undefined && config.offsetY !== 0) ||
		(config.scale !== undefined && config.scale !== 1) ||
		(config.rotation !== undefined && config.rotation !== 0) ||
		(config.flipHorizontal === true) ||
		(config.flipVertical === true)
	);
}

/**
 * Build SVG transform string from image transform config
 * Returns transform and adjusted viewBox for pan/zoom
 */
export function buildImageTransform(
	config: Partial<ImageTransformConfig> | undefined,
	containerWidth: number,
	containerHeight: number
): {
	transform: string;
	viewBox: string;
} {
	if (!config) {
		return {
			transform: '',
			viewBox: `0 0 ${containerWidth} ${containerHeight}`
		};
	}

	const transforms: string[] = [];
	const centerX = containerWidth / 2;
	const centerY = containerHeight / 2;

	// Calculate viewBox for pan and zoom
	const scale = config.scale ?? 1;
	const offsetX = config.offsetX ?? 0;
	const offsetY = config.offsetY ?? 0;

	// ViewBox dimensions based on scale (smaller viewBox = zoom in)
	const vbWidth = containerWidth / scale;
	const vbHeight = containerHeight / scale;

	// ViewBox position (center + offset)
	// Offset is percentage of container, converted to viewBox coordinates
	const vbX = (containerWidth - vbWidth) / 2 - (offsetX / 100) * vbWidth;
	const vbY = (containerHeight - vbHeight) / 2 - (offsetY / 100) * vbHeight;

	const viewBox = `${vbX} ${vbY} ${vbWidth} ${vbHeight}`;

	// Rotation around center
	if (config.rotation && config.rotation !== 0) {
		transforms.push(`rotate(${config.rotation} ${centerX} ${centerY})`);
	}

	// Flip transforms
	if (config.flipHorizontal) {
		transforms.push(`translate(${containerWidth}, 0) scale(-1, 1)`);
	}
	if (config.flipVertical) {
		transforms.push(`translate(0, ${containerHeight}) scale(1, -1)`);
	}

	return {
		transform: transforms.join(' '),
		viewBox
	};
}
