/**
 * Get container metrics with pre-computed center points
 * Call once per component to avoid repeated calculations
 */
export function getContainerMetrics(container) {
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
export function getTransformOrigin(container) {
    return `${container.width / 2}px ${container.height / 2}px`;
}
/**
 * Create transform origin string from explicit dimensions
 */
export function getTransformOriginFromDimensions(width, height) {
    return `${width / 2}px ${height / 2}px`;
}
