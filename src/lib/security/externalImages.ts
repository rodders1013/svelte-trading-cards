/**
 * External image policy controls.
 *
 * External URLs are disabled by default until a backend ingestion/moderation
 * pipeline is available.
 */

let externalImagesEnabled = false;
let externalImageAllowlist: string[] = [
	'picsum.photos',
	'images.igdb.com',
	'playstation.com'
];

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
 * Configure allowlisted hostnames for external image URLs.
 * Matches exact host and subdomains (e.g. cdn.example.com matches example.com).
 */
export function setExternalImageAllowlist(domains: string[]): void {
	externalImageAllowlist = domains
		.map((domain) => domain.trim().toLowerCase())
		.filter(Boolean);
}

/**
 * Returns the current external image hostname allowlist.
 */
export function getExternalImageAllowlist(): string[] {
	return [...externalImageAllowlist];
}

/**
 * True when the URL points to an external HTTP(S) resource.
 */
export function isExternalImageUrl(url: string | undefined | null): boolean {
	if (!url) return false;
	return /^https?:\/\//i.test(url.trim());
}

function getHostname(url: string): string | null {
	try {
		return new URL(url).hostname.toLowerCase();
	} catch {
		return null;
	}
}

/**
 * Returns true when an external image URL is allowed by policy.
 * - Always allowed when external images are globally enabled
 * - Otherwise allowed only when hostname is allowlisted
 */
export function isAllowedExternalImageUrl(url: string | undefined | null): boolean {
	if (!isExternalImageUrl(url)) return true;
	if (externalImagesEnabled) return true;
	if (!url) return false;
	const hostname = getHostname(url);
	if (!hostname) return false;

	return externalImageAllowlist.some(
		(domain) => hostname === domain || hostname.endsWith(`.${domain}`)
	);
}

/**
 * Returns true when an external image URL is blocked by policy.
 */
export function isBlockedExternalImageUrl(url: string | undefined | null): boolean {
	return isExternalImageUrl(url) && !isAllowedExternalImageUrl(url);
}

/**
 * Removes external HTTP(S) image references from SVG markup.
 * This prevents accidental network fetches when the feature is disabled.
 */
export function stripExternalImageReferences(svgString: string): string {
	// Strip blocked URLs from <image href="..."> and <image xlink:href="...">
	let result = svgString.replace(
		/(<image[^>]*(?:href|xlink:href)=["'])(https?:\/\/[^"']+)(["'][^>]*>)/gi,
		(_match, prefix: string, url: string, suffix: string) =>
			isBlockedExternalImageUrl(url) ? `${prefix}${suffix}` : `${prefix}${url}${suffix}`
	);

	// Strip blocked URLs from CSS url(...) usage
	result = result.replace(
		/url\((["']?)(https?:\/\/[^"')]+)\1\)/gi,
		(_match, quote: string, url: string) =>
			isBlockedExternalImageUrl(url) ? 'url("")' : `url(${quote}${url}${quote})`
	);

	return result;
}
