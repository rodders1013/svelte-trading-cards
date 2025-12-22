// Text measurement utility
// Browser: Canvas API, Server: character estimation fallback
let canvas = null;
let ctx = null;
export function measureText(text, fontFamily, fontSize, options) {
    const fontWeight = options?.fontWeight || 'normal';
    const fontStyle = options?.fontStyle || 'normal';
    if (typeof document === 'undefined') {
        // Server fallback: estimate based on average character width
        // Bold text is roughly 10% wider
        const boldMultiplier = fontWeight === 'bold' ? 1.1 : 1;
        return text.length * fontSize * 0.6 * boldMultiplier;
    }
    if (!canvas) {
        canvas = document.createElement('canvas');
        ctx = canvas.getContext('2d');
    }
    if (ctx) {
        // CSS font shorthand: font-style font-weight font-size font-family
        ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;
        return ctx.measureText(text).width;
    }
    return 0;
}
