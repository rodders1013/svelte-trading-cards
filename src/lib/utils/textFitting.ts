// Text fitting algorithm - finds optimal font size via binary search

export interface TextFitResult {
	fontSize: number;
	lines: string[];
	lineWidths: number[];
	lineHeight: number;
	fits: boolean;
}

type MeasureTextFn = (text: string, fontFamily: string, fontSize: number) => number;

export function fitTextToBox(
	text: string,
	boxWidth: number,
	boxHeight: number,
	fontFamily: string,
	minSize: number,
	maxSize: number,
	measureTextFn: MeasureTextFn
): TextFitResult {
	let bestFit: TextFitResult | null = null;
	let low = minSize;
	let high = maxSize;

	while (low <= high) {
		const testSize = Math.round(((low + high) / 2) * 2) / 2;
		const result = layoutText(text, boxWidth, boxHeight, fontFamily, testSize, measureTextFn);

		if (result.fits) {
			bestFit = result;
			low = testSize + 0.5;
		} else {
			high = testSize - 0.5;
		}
	}

	return bestFit || layoutText(text, boxWidth, boxHeight, fontFamily, minSize, measureTextFn);
}

function layoutText(
	text: string,
	maxWidth: number,
	maxHeight: number,
	fontFamily: string,
	fontSize: number,
	measureTextFn: MeasureTextFn
): TextFitResult {
	const result = breakIntoLines(text, maxWidth, fontFamily, fontSize, measureTextFn);
	const lineHeight = fontSize * 1.2;
	const totalHeight = result.lines.length * lineHeight;

	return {
		fontSize,
		lines: result.lines,
		lineWidths: result.lineWidths,
		lineHeight,
		fits: totalHeight <= maxHeight
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
