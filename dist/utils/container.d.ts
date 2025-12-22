import type { ContainerContext } from '../types';
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
export declare function getContainerMetrics(container: ContainerContext): ContainerMetrics;
/**
 * Create transform origin string for animations/effects
 * Uses center of container for natural scaling/rotation
 */
export declare function getTransformOrigin(container: ContainerContext): string;
/**
 * Create transform origin string from explicit dimensions
 */
export declare function getTransformOriginFromDimensions(width: number, height: number): string;
