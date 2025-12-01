// Text fitting algorithm - finds optimal font size via binary search

export interface TextFitResult {
	fontSize: number;
	lines: string[];
	lineWidths: number[];
	lineHeight: number;
	fits: boolean;
	truncated?: boolean;
}

export interface TextFitOptions {
	/** Minimum font size */
	minSize?: number;
	/** Maximum font size */
	maxSize?: number;
	/** Inset/padding to subtract from available space */
	inset?: number;
	/** If true, don't wrap text - keep on single line */
	singleLine?: boolean;
	/** Line height multiplier (default 1.2) */
	lineHeightRatio?: number;
}

type MeasureTextFn = (text: string, fontFamily: string, fontSize: number) => number;

const DEFAULT_OPTIONS: Required<TextFitOptions> = {
	minSize: 8,
	maxSize: 72,
	inset: 0,
	singleLine: false,
	lineHeightRatio: 1.2
};

export function fitTextToBox(
	text: string,
	boxWidth: number,
	boxHeight: number,
	fontFamily: string,
	minSize: number,
	maxSize: number,
	measureTextFn: MeasureTextFn,
	options?: Partial<TextFitOptions>
): TextFitResult {
	const opts = { ...DEFAULT_OPTIONS, ...options, minSize, maxSize };

	// Apply inset to available space
	const availableWidth = Math.max(1, boxWidth - opts.inset * 2);
	const availableHeight = Math.max(1, boxHeight - opts.inset * 2);

	let bestFit: TextFitResult | null = null;
	let low = opts.minSize;
	let high = opts.maxSize;

	while (low <= high) {
		const testSize = Math.round(((low + high) / 2) * 2) / 2;
		const result = layoutText(
			text,
			availableWidth,
			availableHeight,
			fontFamily,
			testSize,
			measureTextFn,
			opts.singleLine,
			opts.lineHeightRatio
		);

		if (result.fits) {
			bestFit = result;
			low = testSize + 0.5;
		} else {
			high = testSize - 0.5;
		}
	}

	// If nothing fits at any size, use the minimum size result
	// Text will be as small as possible but may still overflow
	if (!bestFit) {
		return layoutText(
			text,
			availableWidth,
			availableHeight,
			fontFamily,
			opts.minSize,
			measureTextFn,
			opts.singleLine,
			opts.lineHeightRatio
		);
	}

	return bestFit;
}

/**
 * Simplified version for components that just need auto-fitting
 * Uses a default measure function
 */
export function fitText(
	text: string,
	boxWidth: number,
	boxHeight: number,
	fontFamily: string,
	measureTextFn: MeasureTextFn,
	options?: TextFitOptions
): TextFitResult {
	const opts = { ...DEFAULT_OPTIONS, ...options };
	return fitTextToBox(
		text,
		boxWidth,
		boxHeight,
		fontFamily,
		opts.minSize,
		opts.maxSize,
		measureTextFn,
		opts
	);
}

function layoutText(
	text: string,
	maxWidth: number,
	maxHeight: number,
	fontFamily: string,
	fontSize: number,
	measureTextFn: MeasureTextFn,
	singleLine: boolean = false,
	lineHeightRatio: number = 1.2
): TextFitResult {
	const result = singleLine
		? { lines: [text], lineWidths: [measureTextFn(text, fontFamily, fontSize)] }
		: breakIntoLines(text, maxWidth, fontFamily, fontSize, measureTextFn);

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

function breakIntoLines(
	text: string,
	maxWidth: number,
	fontFamily: string,
	fontSize: number,
	measureTextFn: MeasureTextFn
): { lines: string[]; lineWidths: number[] } {
	const words = text.split(' ');
	const lines: string[] = [];
	const lineWidths: number[] = [];
	let currentLine: string[] = [];

	for (const word of words) {
		const testLine = [...currentLine, word].join(' ');
		const width = measureTextFn(testLine, fontFamily, fontSize);

		if (width <= maxWidth) {
			currentLine.push(word);
		} else {
			if (currentLine.length > 0) {
				const lineText = currentLine.join(' ');
				lines.push(lineText);
				lineWidths.push(measureTextFn(lineText, fontFamily, fontSize));
			}
			currentLine = [word];
		}
	}

	if (currentLine.length > 0) {
		const lineText = currentLine.join(' ');
		lines.push(lineText);
		lineWidths.push(measureTextFn(lineText, fontFamily, fontSize));
	}

	return {
		lines: lines.length > 0 ? lines : [text],
		lineWidths: lineWidths.length > 0 ? lineWidths : [measureTextFn(text, fontFamily, fontSize)]
	};
}
