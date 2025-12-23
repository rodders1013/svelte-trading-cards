import type { AnimationConfig } from '../styling/animations';
import type { EffectConfig } from '../styling/effects';
import type { BlendMode } from '../styling/blend';
import type { IconData } from '../card/icons';
import type { StatRow, ListStyle, TextPreset, TextBoundsConfig } from '../card/fields';
import type { DividerStyle, DividerFade, DividerIconPreset } from '../card/decorations';
import type { ProgressBarStyle, LabelPosition } from '../card/decorations';
import type { RibbonPosition, RibbonStyle, RibbonTextPreset } from '../card/decorations';
import type { FrameStyle, FrameSize } from '../card/decorations';
import type { RatingIconPreset, ValueFormat } from '../card/decorations';
import type { ShapeSource } from '../styling/shapes';
import type { FilterConfig, ImageTransformConfig } from '../styling/filters';
import type { BorderModifier, HolographicConfig } from '../types/modifiers';
import type { IconTransformConfig } from '../styling/IconRenderer.svelte';
export interface TextComponent {
    type: 'text';
    id: string;
    visible: boolean;
    textPreset?: TextPreset;
    dataField?: string;
    maxFontSize: number;
    minFontSize: number;
    fontWeight: string;
    fontStyle: 'normal' | 'italic';
    textDecoration: 'none' | 'underline' | 'line-through';
    textTransform: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
    fontFamily: string;
    fill: string;
    opacity: number;
    alignment: 'left' | 'center' | 'right';
    verticalAlign: 'top' | 'center' | 'bottom';
    padding: number;
    /** Text bounds - constrain text to a safe zone (useful with clip shapes) */
    bounds?: TextBoundsConfig;
    shapeSource?: ShapeSource;
    effect?: EffectConfig;
    blendMode?: BlendMode;
    animation?: AnimationConfig;
    border?: BorderModifier;
    holographic?: HolographicConfig;
}
export interface ImageComponent {
    type: 'image';
    id: string;
    visible: boolean;
    /** Data field to get image URL from (e.g., 'imageUrl', 'coverArt') */
    dataField: string;
    /** Custom URL - used instead of dataField when provided */
    customUrl?: string;
    opacity: number;
    preserveAspectRatio: string;
    /** Shape to clip the image to (e.g., circle, star) */
    shapeSource?: ShapeSource;
    /** CSS filter adjustments (brightness, contrast, etc.) */
    filter?: FilterConfig;
    /** Image transform (pan, zoom, rotation, flip) */
    transform?: ImageTransformConfig;
    effect?: EffectConfig;
    blendMode?: BlendMode;
    animation?: AnimationConfig;
    /** Border that follows clip shape */
    border?: BorderModifier;
    /** Holographic color-shifting effect */
    holographic?: HolographicConfig;
}
export interface BackgroundComponent {
    type: 'background';
    id: string;
    visible: boolean;
    fillType: 'none' | 'solid' | 'gradient';
    solidColor?: string;
    gradientColors?: string[];
    gradientDirection?: 'vertical' | 'horizontal' | 'diagonal';
    fillOpacity?: number;
    patternType: 'none' | 'dots' | 'grid' | 'diagonal' | 'hexagons' | 'triangles' | 'squares' | 'diamonds' | 'chevrons' | 'waves' | 'circles' | 'crosses' | 'zigzag' | 'checkered' | 'stripes-h' | 'stripes-v' | 'confetti' | 'stars' | 'icon' | 'icons';
    patternColor?: string;
    patternOpacity?: number;
    patternSize?: number;
    patternSpacing?: number;
    patternRotation?: number;
    patternStrokeWidth?: number;
    patternIcon?: IconData;
    patternIconName?: string;
    patternIconRotation?: number;
    patternIconScale?: number;
    patternIcons?: Array<{
        iconData: IconData;
        iconName?: string;
        rotation?: number;
    }>;
    patternRowOffset?: number;
    effect?: EffectConfig;
    blendMode?: BlendMode;
    animation?: AnimationConfig;
    border?: BorderModifier;
    holographic?: HolographicConfig;
}
export interface BorderComponent {
    type: 'border';
    id: string;
    visible: boolean;
    color: string;
    width: number;
    opacity: number;
    layers?: number;
    layerColors?: string[];
    layerSpacing?: number;
    /** Use effect→strokeGlow for glow effects on borders */
    effect?: EffectConfig;
    blendMode?: BlendMode;
    animation?: AnimationConfig;
    /** Standard holographic config (same as other components) */
    holographic?: HolographicConfig;
}
export interface IconComponent {
    type: 'icon';
    id: string;
    visible: boolean;
    iconData?: IconData;
    iconName?: string;
    color: string;
    stroke?: string;
    strokeWidth: number;
    opacity: number;
    rotation: number;
    flipHorizontal: boolean;
    flipVertical: boolean;
    transform?: Partial<IconTransformConfig>;
    shapeSource?: ShapeSource;
    effect?: EffectConfig;
    blendMode?: BlendMode;
    animation?: AnimationConfig;
    border?: BorderModifier;
    holographic?: HolographicConfig;
}
export interface StatPanelComponent {
    type: 'statpanel';
    id: string;
    visible: boolean;
    rows: StatRow[];
    labelColor: string;
    valueColor: string;
    divider: boolean;
    dividerColor: string;
    compact: boolean;
    fontFamily: string;
    labelFontSize: number;
    valueFontSize: number;
    barHeight: number;
    barBackgroundColor: string;
    barBorderRadius: number;
    opacity: number;
    shapeSource?: ShapeSource;
    effect?: EffectConfig;
    blendMode?: BlendMode;
    animation?: AnimationConfig;
    border?: BorderModifier;
    holographic?: HolographicConfig;
}
export interface DividerComponent {
    type: 'divider';
    id: string;
    visible: boolean;
    style: DividerStyle;
    color: string;
    secondaryColor?: string;
    thickness: number;
    fade: DividerFade;
    iconPreset: DividerIconPreset;
    customIcon?: IconData;
    customIconName?: string;
    iconSize: number;
    iconColor?: string;
    iconStroke?: string;
    iconStrokeWidth: number;
    iconTransform?: Partial<IconTransformConfig>;
    dashLength: number;
    gapLength: number;
    opacity: number;
    shapeSource?: ShapeSource;
    effect?: EffectConfig;
    blendMode?: BlendMode;
    animation?: AnimationConfig;
    border?: BorderModifier;
    holographic?: HolographicConfig;
}
export interface ProgressBarComponent {
    type: 'progressbar';
    id: string;
    visible: boolean;
    value: number;
    max: number;
    dataField?: string;
    color: string;
    backgroundColor: string;
    borderColor?: string;
    borderWidth: number;
    showLabel: boolean;
    labelPosition: LabelPosition;
    labelColor: string;
    labelFontSize: number;
    labelFontFamily: string;
    labelFormat: 'value' | 'percent' | 'fraction';
    style: ProgressBarStyle;
    segments: number;
    segmentGap: number;
    opacity: number;
    shapeSource?: ShapeSource;
    effect?: EffectConfig;
    blendMode?: BlendMode;
    animation?: AnimationConfig;
    border?: BorderModifier;
    holographic?: HolographicConfig;
}
export interface RibbonComponent {
    type: 'ribbon';
    id: string;
    visible: boolean;
    textPreset: RibbonTextPreset;
    dataField?: string;
    position: RibbonPosition;
    style: RibbonStyle;
    color: string;
    textColor: string;
    shadowColor: string;
    fontSize: number;
    fontFamily: string;
    fontWeight: string;
    angle: number;
    ribbonWidth?: number;
    opacity: number;
    shapeSource?: ShapeSource;
    effect?: EffectConfig;
    blendMode?: BlendMode;
    animation?: AnimationConfig;
    border?: BorderModifier;
    holographic?: HolographicConfig;
}
export interface FrameComponent {
    type: 'frame';
    id: string;
    visible: boolean;
    style: FrameStyle;
    corners: boolean;
    edges: boolean;
    color: string;
    secondaryColor?: string;
    size: FrameSize;
    strokeWidth: number;
    opacity: number;
    shapeSource?: ShapeSource;
    effect?: EffectConfig;
    blendMode?: BlendMode;
    animation?: AnimationConfig;
    border?: BorderModifier;
    holographic?: HolographicConfig;
}
export interface ListComponent {
    type: 'list';
    id: string;
    visible: boolean;
    dataField: string;
    delimiter: string;
    style: ListStyle;
    fontSize: number;
    fontFamily: string;
    fontWeight: string;
    color: string;
    lineHeight: number;
    bulletColor?: string;
    bulletSize?: number;
    numberPadding: number;
    alignment: 'left' | 'center' | 'right';
    verticalAlign: 'top' | 'center' | 'bottom';
    itemSpacing: number;
    indent: number;
    maxItems?: number;
    overflowText: string;
    overflowColor?: string;
    opacity: number;
    shapeSource?: ShapeSource;
    effect?: EffectConfig;
    blendMode?: BlendMode;
    animation?: AnimationConfig;
    border?: BorderModifier;
    holographic?: HolographicConfig;
}
export interface IconRatingComponent {
    type: 'iconrating';
    id: string;
    visible: boolean;
    dataField?: string;
    value: number;
    max: number;
    min: number;
    sourceMax?: number;
    iconPreset: RatingIconPreset;
    customIcon?: IconData;
    customIconName?: string;
    filledColor: string;
    emptyColor: string;
    useEmptyOpacity: boolean;
    emptyOpacity: number;
    size: number;
    gap: number;
    allowHalf: boolean;
    showValue: boolean;
    valuePosition: 'left' | 'right';
    valueFormat: ValueFormat;
    valueFontSize: number;
    valueFontFamily: string;
    valueColor: string;
    valueGap: number;
    opacity: number;
    shapeSource?: ShapeSource;
    effect?: EffectConfig;
    blendMode?: BlendMode;
    animation?: AnimationConfig;
    border?: BorderModifier;
    holographic?: HolographicConfig;
}
export type ComponentItem = TextComponent | ImageComponent | BackgroundComponent | BorderComponent | IconComponent | StatPanelComponent | DividerComponent | ProgressBarComponent | RibbonComponent | FrameComponent | ListComponent | IconRatingComponent;
export interface ContainerState {
    id: string;
    name: string;
    visible: boolean;
    locked: boolean;
    x: number;
    y: number;
    width: number;
    height: number;
    /** Shape for clipping - uses icon-based shape system. Undefined = rect */
    shapeSource?: ShapeSource;
    radius: number;
    clipContent: boolean;
    animation?: AnimationConfig;
    blendMode?: BlendMode;
    components: ComponentItem[];
    /** If true, this is the Card Base layer - cannot be deleted/moved and extends to bleed during export */
    isCardBase?: boolean;
}
export type ResizeHandle = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w';
/**
 * Describes a data field that can be bound to card components.
 * Used by the creator UI to populate field selection dropdowns.
 */
export interface DataFieldOption {
    /** The field key used to access data (e.g., 'gameName', 'coverArt') */
    value: string;
    /** Human-readable label for the field */
    label: string;
    /** Field type hint for UI rendering */
    type?: 'text' | 'number' | 'image' | 'date' | 'array';
}
export { fontFamilies, getAllFontsForDataset, type FontDropdownOption } from '../fonts';
