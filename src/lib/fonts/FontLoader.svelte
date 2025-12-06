<script lang="ts" module>
	/**
	 * FontLoader Component
	 *
	 * Handles Google Fonts loading for the card creator:
	 * 1. Loads lightweight preview fonts on mount (for dropdown display)
	 * 2. Waits for fonts to actually be available before marking as loaded
	 *
	 * Usage:
	 * <FontLoader />
	 *
	 * Then call loadGoogleFont(fontFamily) when a font is selected.
	 */
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	import { getGoogleFontsPreviewUrl } from './loader.js';
	import { GOOGLE_FONTS } from './google-fonts.js';

	let previewLoaded = $state(false);

	onMount(async () => {
		// Load lightweight preview fonts for dropdown
		const previewUrl = getGoogleFontsPreviewUrl();
		if (previewUrl && !document.querySelector(`link[href^="https://fonts.googleapis.com/css2"]`)) {
			const link = document.createElement('link');
			link.href = previewUrl;
			link.rel = 'stylesheet';
			document.head.appendChild(link);

			// Wait for stylesheet to load
			await new Promise<void>((resolve) => {
				link.onload = () => resolve();
				link.onerror = () => resolve(); // Don't block on error
			});

			// Wait for fonts to actually be ready
			try {
				await Promise.all(
					GOOGLE_FONTS.map(font =>
						document.fonts.load(`400 16px "${font.name}"`)
					)
				);
			} catch {
				// Some fonts may fail, that's okay
			}
		}
		previewLoaded = true;
	});
</script>

<!-- This component has no visual output -->
