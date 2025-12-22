// Text fitting algorithm - finds optimal font size via binary search
const DEFAULT_OPTIONS = {
    minSize: 8,
    maxSize: 72,
    inset: 0,
    singleLine: false,
    lineHeightRatio: 1.2,
    fontWeight: 'normal',
    fontStyle: 'normal'
};
export function fitTextToBox(text, boxWidth, boxHeight, fontFamily, minSize, maxSize, measureTextFn, options) {
    const opts = { ...DEFAULT_OPTIONS, ...options, minSize, maxSize };
    const measureOpts = { fontWeight: opts.fontWeight, fontStyle: opts.fontStyle };
    // Apply inset to available space
    const availableWidth = Math.max(1, boxWidth - opts.inset * 2);
    const availableHeight = Math.max(1, boxHeight - opts.inset * 2);
    let bestFit = null;
    let low = opts.minSize;
    let high = opts.maxSize;
    while (low <= high) {
        const testSize = Math.round(((low + high) / 2) * 2) / 2;
        const result = layoutText(text, availableWidth, availableHeight, fontFamily, testSize, measureTextFn, opts.singleLine, opts.lineHeightRatio, measureOpts);
        if (result.fits) {
            bestFit = result;
            low = testSize + 0.5;
        }
        else {
            high = testSize - 0.5;
        }
    }
    // If nothing fits at any size, use the minimum size result
    // Text will be as small as possible but may still overflow
    if (!bestFit) {
        return layoutText(text, availableWidth, availableHeight, fontFamily, opts.minSize, measureTextFn, opts.singleLine, opts.lineHeightRatio, measureOpts);
    }
    return bestFit;
}
/**
 * Simplified version for components that just need auto-fitting
 * Uses a default measure function
 */
export function fitText(text, boxWidth, boxHeight, fontFamily, measureTextFn, options) {
    const opts = { ...DEFAULT_OPTIONS, ...options };
    return fitTextToBox(text, boxWidth, boxHeight, fontFamily, opts.minSize, opts.maxSize, measureTextFn, opts);
}
function layoutText(text, maxWidth, maxHeight, fontFamily, fontSize, measureTextFn, singleLine = false, lineHeightRatio = 1.2, measureOpts) {
    const result = singleLine
        ? { lines: [text], lineWidths: [measureTextFn(text, fontFamily, fontSize, measureOpts)] }
        : breakIntoLines(text, maxWidth, fontFamily, fontSize, measureTextFn, measureOpts);
    const lineHeight = fontSize * lineHeightRatio;
    const totalHeight = result.lines.length * lineHeight;
    // Check both height AND that all lines fit within width
    const allLinesFitWidth = result.lineWidths.every((w) => w <= maxWidth);
    return {
        fontSize,
        lines: result.lines,
        lineWidths: result.lineWidths,
        lineHeight,
        fits: totalHeight <= maxHeight && allLinesFitWidth
    };
}
function breakIntoLines(text, maxWidth, fontFamily, fontSize, measureTextFn, measureOpts) {
    const words = text.split(' ');
    const lines = [];
    const lineWidths = [];
    let currentLine = [];
    for (const word of words) {
        const testLine = [...currentLine, word].join(' ');
        const width = measureTextFn(testLine, fontFamily, fontSize, measureOpts);
        if (width <= maxWidth) {
            currentLine.push(word);
        }
        else {
            if (currentLine.length > 0) {
                const lineText = currentLine.join(' ');
                lines.push(lineText);
                lineWidths.push(measureTextFn(lineText, fontFamily, fontSize, measureOpts));
            }
            currentLine = [word];
        }
    }
    if (currentLine.length > 0) {
        const lineText = currentLine.join(' ');
        lines.push(lineText);
        lineWidths.push(measureTextFn(lineText, fontFamily, fontSize, measureOpts));
    }
    return {
        lines: lines.length > 0 ? lines : [text],
        lineWidths: lineWidths.length > 0 ? lineWidths : [measureTextFn(text, fontFamily, fontSize, measureOpts)]
    };
}
