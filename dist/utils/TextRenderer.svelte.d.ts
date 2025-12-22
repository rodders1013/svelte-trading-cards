import { type HorizontalAlign, type VerticalAlign } from '../types/alignment';
type RenderMode = 'fit' | 'fixed';
interface Props {
    text: string;
    mode?: RenderMode;
    x?: number;
    y?: number;
    width: number;
    height: number;
    /** Fixed font size (only used when mode='fixed') */
    fontSize?: number;
    /** Minimum font size (only used when mode='fit') */
    minFontSize?: number;
    /** Maximum font size (only used when mode='fit') */
    maxFontSize?: number;
    fontFamily?: string;
    fontWeight?: string | number;
    fontStyle?: 'normal' | 'italic';
    textDecoration?: 'none' | 'underline' | 'line-through';
    textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
    color?: string;
    opacity?: number;
    horizontalAlign?: HorizontalAlign;
    verticalAlign?: VerticalAlign;
    padding?: number;
    /** If true, don't wrap text (only affects mode='fit') */
    singleLine?: boolean;
    /** Line height multiplier (default 1.2) */
    lineHeightRatio?: number;
}
declare const TextRenderer: import("svelte").Component<Props, {}, "">;
type TextRenderer = ReturnType<typeof TextRenderer>;
export default TextRenderer;
