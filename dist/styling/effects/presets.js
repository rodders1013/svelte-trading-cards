/**
 * Effect Presets
 *
 * Definitions and UI options for all available effects.
 */
export const EFFECT_PRESETS = {
    glow: {
        type: 'glow',
        label: 'Glow',
        description: 'Soft outer glow effect',
        icon: 'lucide--sparkles'
    },
    strokeGlow: {
        type: 'strokeGlow',
        label: 'Stroke Glow',
        description: 'Blur glow on strokes and borders',
        icon: 'lucide--circle-dot'
    },
    shadow: {
        type: 'shadow',
        label: 'Drop Shadow',
        description: 'Classic drop shadow for depth',
        icon: 'lucide--layers'
    },
    neon: {
        type: 'neon',
        label: 'Neon',
        description: 'Intense multi-layer neon glow',
        icon: 'lucide--zap'
    },
    innerGlow: {
        type: 'innerGlow',
        label: 'Inner Glow',
        description: 'Inward glow effect',
        icon: 'lucide--sun'
    },
    lift: {
        type: 'lift',
        label: 'Lift',
        description: 'Subtle lifted paper shadow',
        icon: 'lucide--square-stack'
    },
    outline: {
        type: 'outline',
        label: 'Outline',
        description: 'Stroke outline around content',
        icon: 'lucide--square'
    }
};
/**
 * Get effect options for UI dropdown
 */
export function getEffectOptions() {
    return [
        { value: 'none', label: 'None', description: 'No effect' },
        ...Object.values(EFFECT_PRESETS).map((preset) => ({
            value: preset.type,
            label: preset.label,
            description: preset.description
        }))
    ];
}
/**
 * Get default configuration for an effect type
 */
export function getDefaultEffectConfig(type) {
    switch (type) {
        case 'glow':
            return {
                type: 'glow',
                color: '#3b82f6',
                blur: 10,
                intensity: 0.7,
                animated: false,
                animationDuration: 1.5
            };
        case 'strokeGlow':
            return {
                type: 'strokeGlow',
                color: undefined, // Uses stroke color by default
                blur: 10,
                intensity: 0.5,
                animated: false,
                animationDuration: 1.5
            };
        case 'shadow':
            return {
                type: 'shadow',
                color: 'rgba(0, 0, 0, 0.5)',
                blur: 8,
                offsetX: 4,
                offsetY: 4,
                animated: false,
                animationDuration: 1.5
            };
        case 'neon':
            return {
                type: 'neon',
                color: '#ff00ff',
                intensity: 0.9,
                spread: 2,
                animated: false,
                animationDuration: 1.5
            };
        case 'innerGlow':
            return {
                type: 'innerGlow',
                color: '#ffffff',
                blur: 8,
                intensity: 0.5,
                animated: false,
                animationDuration: 1.5
            };
        case 'lift':
            return {
                type: 'lift',
                elevation: 'md',
                animated: false,
                animationDuration: 1.5
            };
        case 'outline':
            return {
                type: 'outline',
                color: '#ffffff',
                width: 2,
                animated: false,
                animationDuration: 1.5
            };
        default:
            return undefined;
    }
}
/**
 * Curated color presets for effects
 */
export const EFFECT_COLOR_PRESETS = {
    glow: [
        { label: 'Blue', value: '#3b82f6' },
        { label: 'Purple', value: '#8b5cf6' },
        { label: 'Pink', value: '#ec4899' },
        { label: 'Cyan', value: '#06b6d4' },
        { label: 'Green', value: '#22c55e' },
        { label: 'Gold', value: '#f59e0b' },
        { label: 'Red', value: '#ef4444' },
        { label: 'White', value: '#ffffff' }
    ],
    neon: [
        { label: 'Magenta', value: '#ff00ff' },
        { label: 'Cyan', value: '#00ffff' },
        { label: 'Lime', value: '#00ff00' },
        { label: 'Orange', value: '#ff6600' },
        { label: 'Pink', value: '#ff1493' },
        { label: 'Blue', value: '#0066ff' },
        { label: 'Purple', value: '#9900ff' },
        { label: 'Yellow', value: '#ffff00' }
    ],
    shadow: [
        { label: 'Dark', value: 'rgba(0, 0, 0, 0.5)' },
        { label: 'Soft', value: 'rgba(0, 0, 0, 0.25)' },
        { label: 'Blue', value: 'rgba(59, 130, 246, 0.5)' },
        { label: 'Purple', value: 'rgba(139, 92, 246, 0.5)' }
    ]
};
