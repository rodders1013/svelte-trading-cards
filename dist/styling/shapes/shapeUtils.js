import { BUNDLED_SHAPES, isBuiltInShape } from './bundledShapes';
import { sanitizeSvgBody } from '../../card/icons/Icon.svelte';
/**
 * Resolve shape source to shape data
 */
export function resolveShapeData(source) {
    if (source.type === 'builtin') {
        return BUNDLED_SHAPES[source.shape] ?? null;
    }
    else if (source.type === 'custom' && source.iconData) {
        return {
            body: source.iconData.body,
            width: source.iconData.width ?? 24,
            height: source.iconData.height ?? 24
        };
    }
    return null;
}
/**
 * Get shape data from either a built-in shape name or custom icon
 */
export function getShapeDataFromAny(shape, customIconData) {
    // Custom icon takes priority
    if (customIconData?.body) {
        return {
            body: customIconData.body,
            width: customIconData.width ?? 24,
            height: customIconData.height ?? 24
        };
    }
    // Check built-in shapes
    if (shape && isBuiltInShape(shape)) {
        return BUNDLED_SHAPES[shape];
    }
    // Default to circle
    return BUNDLED_SHAPES.circle;
}
/**
 * Sanitize shape body for safe rendering
 */
export function sanitizeShapeBody(body) {
    return sanitizeSvgBody(body);
}
/**
 * Strip fill attributes from shape body
 * This allows parent element's fill to be inherited
 */
export function stripFillAttributes(body) {
    return body
        .replace(/fill="[^"]*"/gi, '')
        .replace(/fill='[^']*'/gi, '');
}
/**
 * Calculate transform to scale shape to container
 */
export function getShapeTransform(shapeData, options) {
    const { width: containerW, height: containerH, scaleMode = 'contain' } = options;
    const { width: shapeW, height: shapeH } = shapeData;
    let scaleX;
    let scaleY;
    let offsetX = 0;
    let offsetY = 0;
    switch (scaleMode) {
        case 'contain': {
            const scale = Math.min(containerW / shapeW, containerH / shapeH);
            scaleX = scaleY = scale;
            offsetX = (containerW - shapeW * scale) / 2;
            offsetY = (containerH - shapeH * scale) / 2;
            break;
        }
        case 'cover': {
            const scale = Math.max(containerW / shapeW, containerH / shapeH);
            scaleX = scaleY = scale;
            offsetX = (containerW - shapeW * scale) / 2;
            offsetY = (containerH - shapeH * scale) / 2;
            break;
        }
        case 'stretch':
            scaleX = containerW / shapeW;
            scaleY = containerH / shapeH;
            break;
    }
    return `translate(${offsetX}, ${offsetY}) scale(${scaleX}, ${scaleY})`;
}
/**
 * Prepare shape body for rendering
 * - Sanitizes for security
 * - Optionally strips fill attributes
 */
export function prepareShapeBody(body, options) {
    let result = sanitizeShapeBody(body);
    if (options?.stripFill) {
        result = stripFillAttributes(result);
    }
    return result;
}
/**
 * Get all data needed to render a shape
 */
export function getShapeRenderData(source, containerWidth, containerHeight, scaleMode = 'contain') {
    const shapeData = resolveShapeData(source);
    if (!shapeData)
        return null;
    const body = sanitizeShapeBody(shapeData.body);
    const strippedBody = stripFillAttributes(body);
    const transform = getShapeTransform(shapeData, {
        width: containerWidth,
        height: containerHeight,
        scaleMode
    });
    return {
        body,
        strippedBody,
        transform,
        width: shapeData.width,
        height: shapeData.height
    };
}
