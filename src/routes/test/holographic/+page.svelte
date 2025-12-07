<script lang="ts">
	import HolographicWrapper from '$lib/styling/HolographicWrapper.svelte';
	import type { HolographicConfig } from '$lib/styling/HolographicWrapper.svelte';

	// Holographic config state
	let color = $state('#3b82f6');
	let secondaryColor = $state('#ec4899');
	let tertiaryColor = $state<string | undefined>(undefined);
	let useTertiaryColor = $state(false);
	let speed = $state(3);
	let angle = $state(45);
	let apply = $state<'fill' | 'stroke' | 'both'>('fill');

	// Computed tertiary color
	const effectiveTertiaryColor = $derived(useTertiaryColor ? tertiaryColor : undefined);

	// Preset color combinations
	const presets = [
		{ name: 'Blue/Pink', color: '#3b82f6', secondary: '#ec4899', tertiary: undefined },
		{ name: 'Rainbow', color: '#ef4444', secondary: '#22c55e', tertiary: '#3b82f6' },
		{ name: 'Gold/Purple', color: '#f59e0b', secondary: '#8b5cf6', tertiary: undefined },
		{ name: 'Cyan/Magenta', color: '#06b6d4', secondary: '#d946ef', tertiary: undefined },
		{ name: 'Neon', color: '#00ff00', secondary: '#ff00ff', tertiary: '#00ffff' },
		{ name: 'Fire', color: '#ef4444', secondary: '#f59e0b', tertiary: '#fbbf24' },
		{ name: 'Ocean', color: '#0ea5e9', secondary: '#06b6d4', tertiary: '#14b8a6' },
		{ name: 'Sunset', color: '#f97316', secondary: '#ec4899', tertiary: '#8b5cf6' }
	];

	function applyPreset(preset: typeof presets[0]) {
		color = preset.color;
		secondaryColor = preset.secondary;
		if (preset.tertiary) {
			useTertiaryColor = true;
			tertiaryColor = preset.tertiary;
		} else {
			useTertiaryColor = false;
			tertiaryColor = undefined;
		}
	}
</script>

<div class="min-h-screen bg-slate-900 p-8 text-white">
	<div class="mx-auto max-w-6xl">
		<h1 class="mb-2 text-2xl font-bold">Holographic Effect Testing</h1>
		<p class="mb-6 text-slate-400">
			Test the animated color-shifting holographic effect on various SVG elements.
		</p>

		<!-- Controls -->
		<div class="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
			<!-- Color Controls -->
			<div class="rounded-lg bg-slate-800 p-4">
				<h2 class="mb-4 text-lg font-semibold">Colors</h2>

				<!-- Presets -->
				<div class="mb-4">
					<label class="mb-2 block text-sm text-slate-400">Presets</label>
					<div class="flex flex-wrap gap-2">
						{#each presets as preset}
							<button
								class="rounded px-3 py-1 text-sm bg-slate-700 hover:bg-slate-600 transition-colors"
								onclick={() => applyPreset(preset)}
							>
								{preset.name}
							</button>
						{/each}
					</div>
				</div>

				<div class="grid grid-cols-2 gap-4">
					<div>
						<label class="mb-1 block text-sm text-slate-400">Primary Color</label>
						<input
							type="color"
							bind:value={color}
							class="h-10 w-full cursor-pointer rounded border border-slate-600"
						/>
					</div>
					<div>
						<label class="mb-1 block text-sm text-slate-400">Secondary Color</label>
						<input
							type="color"
							bind:value={secondaryColor}
							class="h-10 w-full cursor-pointer rounded border border-slate-600"
						/>
					</div>
				</div>

				<div class="mt-4">
					<label class="flex items-center gap-2 text-sm text-slate-400">
						<input type="checkbox" bind:checked={useTertiaryColor} class="rounded" />
						Use Tertiary Color (Rainbow)
					</label>
					{#if useTertiaryColor}
						<input
							type="color"
							bind:value={tertiaryColor}
							class="mt-2 h-10 w-full cursor-pointer rounded border border-slate-600"
						/>
					{/if}
				</div>
			</div>

			<!-- Animation Controls -->
			<div class="rounded-lg bg-slate-800 p-4">
				<h2 class="mb-4 text-lg font-semibold">Animation</h2>

				<div class="space-y-4">
					<div>
						<label class="mb-1 block text-sm text-slate-400">Speed: {speed}s</label>
						<input
							type="range"
							bind:value={speed}
							min="0.5"
							max="10"
							step="0.5"
							class="w-full"
						/>
						<div class="flex justify-between text-xs text-slate-500">
							<span>Fast (0.5s)</span>
							<span>Slow (10s)</span>
						</div>
					</div>

					<div>
						<label class="mb-1 block text-sm text-slate-400">Angle: {angle}°</label>
						<input
							type="range"
							bind:value={angle}
							min="0"
							max="360"
							step="15"
							class="w-full"
						/>
						<div class="flex justify-between text-xs text-slate-500">
							<span>0° (→)</span>
							<span>90° (↓)</span>
							<span>180° (←)</span>
							<span>270° (↑)</span>
							<span>360°</span>
						</div>
					</div>

					<div>
						<label class="mb-1 block text-sm text-slate-400">Apply To</label>
						<div class="flex gap-2">
							{#each ['fill', 'stroke', 'both'] as mode}
								<button
									class="flex-1 rounded px-3 py-2 text-sm transition-colors {apply === mode
										? 'bg-blue-600 text-white'
										: 'bg-slate-700 text-slate-300 hover:bg-slate-600'}"
									onclick={() => (apply = mode as typeof apply)}
								>
									{mode}
								</button>
							{/each}
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Test: Basic Shapes -->
		<div class="mb-8 rounded-lg bg-slate-800 p-4">
			<h2 class="mb-4 text-lg font-semibold">Test 1: Basic Shapes</h2>
			<p class="mb-4 text-sm text-slate-400">
				Holographic effect applied to basic SVG shapes.
			</p>
			<div class="flex flex-wrap gap-6">
				<!-- Rectangle -->
				<div class="text-center">
					<div class="mb-1 text-xs text-slate-500">Rectangle</div>
					<svg width="120" height="80" class="rounded bg-slate-700">
						<HolographicWrapper
							{color}
							{secondaryColor}
							tertiaryColor={effectiveTertiaryColor}
							{speed}
							{angle}
							{apply}
						>
							<rect x="10" y="10" width="100" height="60" rx="8" stroke-width="4" />
						</HolographicWrapper>
					</svg>
				</div>

				<!-- Circle -->
				<div class="text-center">
					<div class="mb-1 text-xs text-slate-500">Circle</div>
					<svg width="100" height="100" class="rounded bg-slate-700">
						<HolographicWrapper
							{color}
							{secondaryColor}
							tertiaryColor={effectiveTertiaryColor}
							{speed}
							{angle}
							{apply}
						>
							<circle cx="50" cy="50" r="40" stroke-width="4" />
						</HolographicWrapper>
					</svg>
				</div>

				<!-- Star -->
				<div class="text-center">
					<div class="mb-1 text-xs text-slate-500">Star</div>
					<svg width="100" height="100" class="rounded bg-slate-700">
						<HolographicWrapper
							{color}
							{secondaryColor}
							tertiaryColor={effectiveTertiaryColor}
							{speed}
							{angle}
							{apply}
						>
							<polygon
								points="50,5 61,40 98,40 68,62 79,97 50,75 21,97 32,62 2,40 39,40"
								stroke-width="3"
							/>
						</HolographicWrapper>
					</svg>
				</div>

				<!-- Hexagon -->
				<div class="text-center">
					<div class="mb-1 text-xs text-slate-500">Hexagon</div>
					<svg width="100" height="100" class="rounded bg-slate-700">
						<HolographicWrapper
							{color}
							{secondaryColor}
							tertiaryColor={effectiveTertiaryColor}
							{speed}
							{angle}
							{apply}
						>
							<polygon
								points="50,5 93,27.5 93,72.5 50,95 7,72.5 7,27.5"
								stroke-width="3"
							/>
						</HolographicWrapper>
					</svg>
				</div>
			</div>
		</div>

		<!-- Test: Text -->
		<div class="mb-8 rounded-lg bg-slate-800 p-4">
			<h2 class="mb-4 text-lg font-semibold">Test 2: Text</h2>
			<p class="mb-4 text-sm text-slate-400">
				Holographic effect applied to SVG text elements.
			</p>
			<div class="flex flex-wrap gap-6">
				<!-- Fill text -->
				<div class="text-center">
					<div class="mb-1 text-xs text-slate-500">Fill Only</div>
					<svg width="200" height="60" class="rounded bg-slate-700">
						<HolographicWrapper
							{color}
							{secondaryColor}
							tertiaryColor={effectiveTertiaryColor}
							{speed}
							{angle}
							apply="fill"
						>
							<text x="100" y="42" text-anchor="middle" font-size="32" font-weight="bold">
								HOLO
							</text>
						</HolographicWrapper>
					</svg>
				</div>

				<!-- Stroke text -->
				<div class="text-center">
					<div class="mb-1 text-xs text-slate-500">Stroke Only</div>
					<svg width="200" height="60" class="rounded bg-slate-700">
						<HolographicWrapper
							{color}
							{secondaryColor}
							tertiaryColor={effectiveTertiaryColor}
							{speed}
							{angle}
							apply="stroke"
						>
							<text
								x="100"
								y="42"
								text-anchor="middle"
								font-size="32"
								font-weight="bold"
								fill="none"
								stroke-width="2"
							>
								HOLO
							</text>
						</HolographicWrapper>
					</svg>
				</div>

				<!-- Both -->
				<div class="text-center">
					<div class="mb-1 text-xs text-slate-500">Both</div>
					<svg width="200" height="60" class="rounded bg-slate-700">
						<HolographicWrapper
							{color}
							{secondaryColor}
							tertiaryColor={effectiveTertiaryColor}
							{speed}
							{angle}
							apply="both"
						>
							<text
								x="100"
								y="42"
								text-anchor="middle"
								font-size="32"
								font-weight="bold"
								stroke-width="1"
							>
								HOLO
							</text>
						</HolographicWrapper>
					</svg>
				</div>
			</div>
		</div>

		<!-- Test: Complex Paths -->
		<div class="mb-8 rounded-lg bg-slate-800 p-4">
			<h2 class="mb-4 text-lg font-semibold">Test 3: Complex Paths</h2>
			<p class="mb-4 text-sm text-slate-400">
				Holographic effect on more complex SVG paths.
			</p>
			<div class="flex flex-wrap gap-6">
				<!-- Heart -->
				<div class="text-center">
					<div class="mb-1 text-xs text-slate-500">Heart</div>
					<svg width="100" height="100" viewBox="0 0 24 24" class="rounded bg-slate-700">
						<HolographicWrapper
							{color}
							{secondaryColor}
							tertiaryColor={effectiveTertiaryColor}
							{speed}
							{angle}
							{apply}
						>
							<path
								d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
								stroke-width="1"
							/>
						</HolographicWrapper>
					</svg>
				</div>

				<!-- Lightning -->
				<div class="text-center">
					<div class="mb-1 text-xs text-slate-500">Lightning</div>
					<svg width="100" height="100" viewBox="0 0 24 24" class="rounded bg-slate-700">
						<HolographicWrapper
							{color}
							{secondaryColor}
							tertiaryColor={effectiveTertiaryColor}
							{speed}
							{angle}
							{apply}
						>
							<path d="M7 2v11h3v9l7-12h-4l4-8z" stroke-width="0.5" />
						</HolographicWrapper>
					</svg>
				</div>

				<!-- Crown -->
				<div class="text-center">
					<div class="mb-1 text-xs text-slate-500">Crown</div>
					<svg width="100" height="100" viewBox="0 0 24 24" class="rounded bg-slate-700">
						<HolographicWrapper
							{color}
							{secondaryColor}
							tertiaryColor={effectiveTertiaryColor}
							{speed}
							{angle}
							{apply}
						>
							<path
								d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z"
								stroke-width="0.5"
							/>
						</HolographicWrapper>
					</svg>
				</div>

				<!-- Shield -->
				<div class="text-center">
					<div class="mb-1 text-xs text-slate-500">Shield</div>
					<svg width="100" height="100" viewBox="0 0 24 24" class="rounded bg-slate-700">
						<HolographicWrapper
							{color}
							{secondaryColor}
							tertiaryColor={effectiveTertiaryColor}
							{speed}
							{angle}
							{apply}
						>
							<path
								d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"
								stroke-width="0.5"
							/>
						</HolographicWrapper>
					</svg>
				</div>
			</div>
		</div>

		<!-- Test: Multiple Elements -->
		<div class="mb-8 rounded-lg bg-slate-800 p-4">
			<h2 class="mb-4 text-lg font-semibold">Test 4: Card-like Layout</h2>
			<p class="mb-4 text-sm text-slate-400">
				Simulating how holographic would look on a trading card element.
			</p>
			<div class="flex flex-wrap gap-6">
				<!-- Card border -->
				<div class="text-center">
					<div class="mb-1 text-xs text-slate-500">Card Border</div>
					<svg width="180" height="250" class="rounded bg-slate-700">
						<!-- Background -->
						<rect x="10" y="10" width="160" height="230" rx="12" fill="#1e293b" />
						<!-- Holographic border -->
						<HolographicWrapper
							{color}
							{secondaryColor}
							tertiaryColor={effectiveTertiaryColor}
							{speed}
							{angle}
							apply="stroke"
						>
							<rect
								x="10"
								y="10"
								width="160"
								height="230"
								rx="12"
								fill="none"
								stroke-width="4"
							/>
						</HolographicWrapper>
						<!-- Content placeholder -->
						<rect x="20" y="20" width="140" height="100" rx="8" fill="#334155" />
						<text x="90" y="150" text-anchor="middle" fill="#94a3b8" font-size="14">
							Card Content
						</text>
					</svg>
				</div>

				<!-- Card with holographic background element -->
				<div class="text-center">
					<div class="mb-1 text-xs text-slate-500">Holographic Badge</div>
					<svg width="180" height="250" class="rounded bg-slate-700">
						<!-- Card background -->
						<rect x="10" y="10" width="160" height="230" rx="12" fill="#1e293b" />
						<rect x="10" y="10" width="160" height="230" rx="12" fill="none" stroke="#334155" stroke-width="2" />
						<!-- Holographic badge -->
						<HolographicWrapper
							{color}
							{secondaryColor}
							tertiaryColor={effectiveTertiaryColor}
							{speed}
							{angle}
							apply="fill"
						>
							<circle cx="90" cy="100" r="50" />
						</HolographicWrapper>
						<!-- Badge icon overlay -->
						<text x="90" y="108" text-anchor="middle" fill="white" font-size="40">★</text>
						<!-- Label -->
						<text x="90" y="180" text-anchor="middle" fill="#94a3b8" font-size="12">
							LEGENDARY
						</text>
					</svg>
				</div>

				<!-- Ribbon with holographic -->
				<div class="text-center">
					<div class="mb-1 text-xs text-slate-500">Holographic Ribbon</div>
					<svg width="180" height="250" class="rounded bg-slate-700">
						<!-- Card background -->
						<rect x="10" y="10" width="160" height="230" rx="12" fill="#1e293b" />
						<!-- Content area -->
						<rect x="20" y="60" width="140" height="120" rx="8" fill="#334155" />
						<!-- Holographic ribbon -->
						<HolographicWrapper
							{color}
							{secondaryColor}
							tertiaryColor={effectiveTertiaryColor}
							{speed}
							{angle}
							apply="fill"
						>
							<polygon points="0,25 180,25 180,55 0,55" />
						</HolographicWrapper>
						<!-- Ribbon text -->
						<text x="90" y="45" text-anchor="middle" fill="white" font-size="14" font-weight="bold">
							HOLOGRAPHIC
						</text>
					</svg>
				</div>
			</div>
		</div>

		<!-- Current Config Display -->
		<div class="rounded-lg bg-slate-800 p-4">
			<h2 class="mb-4 text-lg font-semibold">Current Configuration</h2>
			<pre class="rounded bg-slate-900 p-4 text-sm text-slate-300 overflow-x-auto">{JSON.stringify(
					{
						color,
						secondaryColor,
						tertiaryColor: effectiveTertiaryColor,
						speed,
						angle,
						apply
					},
					null,
					2
				)}</pre>
		</div>
	</div>
</div>
