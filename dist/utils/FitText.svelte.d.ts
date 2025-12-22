interface Props {
    text?: string;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    minSize?: number;
    maxSize?: number;
    fontFamily?: string;
    fontWeight?: string;
    fontStyle?: 'normal' | 'italic';
    textDecoration?: 'none' | 'underline' | 'line-through';
    textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
    horizontalAlign?: 'left' | 'center' | 'right';
    verticalAlign?: 'top' | 'center' | 'bottom';
    fill?: string;
    opacity?: number;
    /** Inset/padding to subtract from available space */
    inset?: number;
    /** If true, don't wrap text - keep on single line */
    singleLine?: boolean;
    /** Line height multiplier (default 1.2) */
    lineHeightRatio?: number;
    /** Debug mode - show bounding box */
    debug?: boolean;
}
declare const FitText: import("svelte").Component<Props, {}, "">;
type FitText = ReturnType<typeof FitText>;
export default FitText;
