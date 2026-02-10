/**
 * External image policy controls.
 *
 * External URLs are disabled by default until a backend ingestion/moderation
 * pipeline is available.
 */

let externalImagesEnabled = false;

/**
 * Enable or disable external image URLs globally.
 * Defaults to false.
 */
export function setExternalImagesEnabled(enabled: boolean): void {
	externalImagesEnabled = enabled;
}

/**
 * Returns whether external image URLs are currently enabled.
 */
export function isExternalImagesEnabled(): boolean {
	return externalImagesEnabled;
}

/**
 * True when the URL points to an external HTTP(S) resource.
 */
export function isExternalImageUrl(url: string | undefined | null): boolean {
	if (!url) return false;
	return /^https?:\/\//i.test(url.trim());
}

/**
 * Removes external HTTP(S) image references from SVG markup.
 * This prevents accidental network fetches when the feature is disabled.
 */
export function stripExternalImageReferences(svgString: string): string {
	// Strip external URLs from <image href="..."> and <image xlink:href="...">
	let result = svgString.replace(
		/(<image[^>]*(?:href|xlink:href)=["'])https?:\/\/[^"']+(["'][^>]*>)/gi,
		'$1$2'
	);

	// Strip external URLs from CSS url(...) usage
	result = result.replace(/url\((["']?)https?:\/\/[^"')]+\1\)/gi, 'url("")');

	return result;
}
