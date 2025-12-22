import { z } from 'zod';
// Built-in shape names
export const BuiltInShapeSchema = z.enum([
    // Basic geometric
    'circle',
    'square',
    'rectangle',
    'triangle',
    'diamond',
    'hexagon',
    'octagon',
    'pentagon',
    'ellipse',
    // Decorative
    'star',
    'heart',
    'shield',
    'bookmark',
    'label',
    'cloud',
    'message',
    'crown',
    'trophy',
    'medal',
    'seal',
    'certificate',
    'card'
]);
// List of all built-in shapes for UI
export const BUILT_IN_SHAPES = BuiltInShapeSchema.options;
// Shape categories for organized UI
export const SHAPE_CATEGORIES = {
    geometric: ['circle', 'square', 'rectangle', 'triangle', 'diamond', 'hexagon', 'octagon', 'pentagon', 'ellipse'],
    decorative: ['star', 'heart', 'shield', 'bookmark', 'label', 'cloud', 'message'],
    awards: ['crown', 'trophy', 'medal', 'seal', 'certificate'],
    containers: ['card']
};
