import type { ContainerContext } from '$lib/types';

/**
 * Pre-computed container metrics to avoid duplication across components
 */
export interface ContainerMetrics {
	width: number;
	height: number;
	centerX: number;
	centerY: number;
	radius: number;
}

/**
 * Get container metrics with pre-computed center points
 * Call once per component to avoid repeated calculations
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
 * Uses center of container for natural scaling/rotation
 */
export function getTransformOrigin(container: ContainerContext): string {
	return `${container.width / 2}px ${container.height / 2}px`;
}

/**
 * Create transform origin string from explicit dimensions
 */
export function getTransformOriginFromDimensions(width: number, height: number): string {
	return `${width / 2}px ${height / 2}px`;
}
