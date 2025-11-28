// Text measurement utility
// Browser: Canvas API, Server: character estimation fallback

let canvas: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;

export function measureText(text: string, fontFamily: string, fontSize: number): number {
	if (typeof document === 'undefined') {
		// Server fallback: estimate based on average character width
		return text.length * fontSize * 0.6;
	}

	if (!canvas) {
		canvas = document.createElement('canvas');
		ctx = canvas.getContext('2d');
	}

	if (ctx) {
		ctx.font = `${fontSize}px ${fontFamily}`;
		return ctx.measureText(text).width;
	}

	return 0;
}
