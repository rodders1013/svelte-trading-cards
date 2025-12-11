<script lang="ts">
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	let { data }: { data: PageData } = $props();

	// Form state
	let selectedPreset = $state(data.preset);
	let showLogo = $state(data.options.showLogo);
	let showWatermark = $state(data.options.showWatermark);
	let showCaption = $state(data.options.showCaption);
	let useGradient = $state($page.url.searchParams.get('gradient') === 'true');
	let background = $state(data.options.background);

	// Update URL when options change
	function updatePreview() {
		const params = new URLSearchParams();
		params.set('preset', selectedPreset);
		params.set('logo', String(showLogo));
		params.set('watermark', String(showWatermark));
		params.set('caption', String(showCaption));
		params.set('gradient', String(useGradient));
		params.set('bg', background);
		goto(`?${params.toString()}`, { invalidateAll: true });
	}

	// Download the image
	function downloadImage() {
		if (!data.imageDataUrl) return;
		const link = document.createElement('a');
		link.href = data.imageDataUrl;
		link.download = `og-image-${selectedPreset}.png`;
		link.click();
	}
</script>

<svelte:head>
	<title>OG Image Test | svelte-trading-cards</title>
</svelte:head>

<div class="min-h-screen bg-slate-900 p-8 text-white">
	<div class="mx-auto max-w-6xl">
		<h1 class="mb-2 text-3xl font-bold">OG Image Generator Test</h1>
		<p class="mb-8 text-slate-400">
			Test the Open Graph image rendering with different presets and branding options.
		</p>

		<div class="grid gap-8 lg:grid-cols-[300px_1fr]">
			<!-- Controls -->
			<div class="space-y-6 rounded-lg bg-slate-800 p-6">
				<h2 class="text-lg font-semibold">Options</h2>

				<!-- Preset Selector -->
				<div>
					<label class="mb-2 block text-sm text-slate-400">Platform Preset</label>
					<select
						bind:value={selectedPreset}
						onchange={updatePreview}
						class="w-full rounded border border-slate-600 bg-slate-700 px-3 py-2"
					>
						{#each data.presets as preset}
							<option value={preset}>{preset}</option>
						{/each}
					</select>
				</div>

				<!-- Background Color -->
				<div>
					<label class="mb-2 block text-sm text-slate-400">Background Color</label>
					<div class="flex gap-2">
						<input
							type="color"
							bind:value={background}
							class="h-10 w-14 cursor-pointer rounded border border-slate-600"
						/>
						<input
							type="text"
							bind:value={background}
							class="flex-1 rounded border border-slate-600 bg-slate-700 px-3 py-2"
						/>
					</div>
				</div>

				<!-- Gradient Toggle -->
				<label class="flex items-center gap-3">
					<input
						type="checkbox"
						bind:checked={useGradient}
						class="h-5 w-5 rounded border-slate-600"
					/>
					<span class="text-sm">Use gradient background</span>
				</label>

				<hr class="border-slate-600" />

				<h3 class="font-medium">Branding</h3>

				<!-- Logo Toggle -->
				<label class="flex items-center gap-3">
					<input type="checkbox" bind:checked={showLogo} class="h-5 w-5 rounded border-slate-600" />
					<span class="text-sm">Show logo (top-left)</span>
				</label>

				<!-- Watermark Toggle -->
				<label class="flex items-center gap-3">
					<input
						type="checkbox"
						bind:checked={showWatermark}
						class="h-5 w-5 rounded border-slate-600"
					/>
					<span class="text-sm">Show watermark (bottom-right)</span>
				</label>

				<!-- Caption Toggle -->
				<label class="flex items-center gap-3">
					<input
						type="checkbox"
						bind:checked={showCaption}
						class="h-5 w-5 rounded border-slate-600"
					/>
					<span class="text-sm">Show caption below card</span>
				</label>

				<hr class="border-slate-600" />

				<!-- Action Buttons -->
				<button
					onclick={updatePreview}
					class="w-full rounded bg-blue-600 px-4 py-2 font-medium transition hover:bg-blue-700"
				>
					Update Preview
				</button>

				<button
					onclick={downloadImage}
					disabled={!data.imageDataUrl}
					class="w-full rounded bg-green-600 px-4 py-2 font-medium transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
				>
					Download PNG
				</button>
			</div>

			<!-- Preview -->
			<div class="space-y-4">
				<div class="flex items-center justify-between">
					<h2 class="text-lg font-semibold">Preview</h2>
					{#if data.width && data.height}
						<span class="text-sm text-slate-400">{data.width} x {data.height}px</span>
					{/if}
				</div>

				{#if data.error}
					<div class="rounded-lg border border-red-500 bg-red-500/10 p-4 text-red-400">
						<strong>Error:</strong>
						{data.error}
					</div>
				{:else if data.imageDataUrl}
					<div class="overflow-hidden rounded-lg border border-slate-600 bg-slate-800">
						<img
							src={data.imageDataUrl}
							alt="OG Image Preview"
							class="h-auto w-full"
							style="max-height: 600px; object-fit: contain;"
						/>
					</div>

					<!-- Size Info -->
					<div class="grid grid-cols-2 gap-4 text-sm text-slate-400 sm:grid-cols-4">
						<div class="rounded bg-slate-800 p-3">
							<div class="font-medium text-white">Preset</div>
							<div>{selectedPreset}</div>
						</div>
						<div class="rounded bg-slate-800 p-3">
							<div class="font-medium text-white">Dimensions</div>
							<div>{data.width} x {data.height}</div>
						</div>
						<div class="rounded bg-slate-800 p-3">
							<div class="font-medium text-white">Aspect Ratio</div>
							<div>{(data.width / data.height).toFixed(2)}:1</div>
						</div>
						<div class="rounded bg-slate-800 p-3">
							<div class="font-medium text-white">Branding</div>
							<div>
								{[showLogo && 'Logo', showWatermark && 'Watermark', showCaption && 'Caption']
									.filter(Boolean)
									.join(', ') || 'None'}
							</div>
						</div>
					</div>
				{:else}
					<div class="rounded-lg border border-slate-600 bg-slate-800 p-8 text-center text-slate-400">
						Loading preview...
					</div>
				{/if}

				<!-- Usage Example -->
				<div class="rounded-lg bg-slate-800 p-4">
					<h3 class="mb-2 font-medium">Usage Example</h3>
					<pre class="overflow-x-auto rounded bg-slate-900 p-4 text-sm text-slate-300"><code
							>{`import { renderOGImage } from 'svelte-trading-cards/server';

const { buffer } = await renderOGImage(template, data, {
  preset: '${selectedPreset}',
  background: '${background}',${useGradient ? `\n  backgroundGradient: { from: '#1e1b4b', to: '#0f172a', direction: 'diagonal' },` : ''}
  branding: {${showLogo ? `\n    logo: { url: 'https://yourapp.com/logo.png', position: 'top-left' },` : ''}${showWatermark ? `\n    watermark: { text: 'yourapp.com', position: 'bottom-right' },` : ''}${showCaption ? `\n    caption: { title: 'Card Title', subtitle: 'by @username' }` : ''}
  }
});`}</code
						></pre>
				</div>
			</div>
		</div>
	</div>
</div>
