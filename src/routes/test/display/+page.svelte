<script lang="ts">
	import { Card, getRarityOptions, type Rarity } from '$lib/display';
	import { CardGrid, CardCarousel, CardModal } from '$lib/gallery';
	import { datasets } from '$lib/demo';
	import type { CardTemplate, CardData } from '$lib/types';

	// Register all components (required for CardCanvas to render them)
	import { registerComponent, Group } from '$lib/core';
	import { GradientBackground, Image } from '$lib/card/backgrounds';
	import { Border } from '$lib/card/borders';
	import { TextField, StatPanel, List } from '$lib/card/fields';

	registerComponent('Group', Group);
	registerComponent('GradientBackground', GradientBackground);
	registerComponent('Image', Image);
	registerComponent('Border', Border);
	registerComponent('TextField', TextField);
	registerComponent('StatPanel', StatPanel);
	registerComponent('List', List);

	// Try to register additional components if they exist
	// This allows loading templates that use components we may not have imported
	import * as backgrounds from '$lib/card/backgrounds';
	import * as borders from '$lib/card/borders';
	import * as fields from '$lib/card/fields';

	// Register all exports from each module
	Object.entries(backgrounds).forEach(([name, component]) => {
		if (typeof component === 'function' || (component && typeof component === 'object')) {
			registerComponent(name, component as any);
		}
	});
	Object.entries(borders).forEach(([name, component]) => {
		if (typeof component === 'function' || (component && typeof component === 'object')) {
			registerComponent(name, component as any);
		}
	});
	Object.entries(fields).forEach(([name, component]) => {
		if (typeof component === 'function' || (component && typeof component === 'object')) {
			registerComponent(name, component as any);
		}
	});

	// Get demo data - Xbox games
	const cards = datasets.xbox.cards as CardData[];

	// Custom template state
	let customTemplate = $state<CardTemplate | null>(null);
	let customData = $state<CardData>({});
	let loadError = $state<string | null>(null);
	let loadedFileName = $state<string | null>(null);

	// Handle file upload
	async function handleFileUpload(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;

		loadError = null;
		loadedFileName = file.name;

		try {
			const text = await file.text();
			const json = JSON.parse(text);

			// Support both direct template format and saved file format
			if (json.template) {
				// Saved file format: { template, editorState, ... }
				customTemplate = json.template as CardTemplate;
			} else if (json.components) {
				// Direct template format: { name, components, ... }
				customTemplate = json as CardTemplate;
			} else {
				throw new Error('Invalid template format. Expected "template" or "components" property.');
			}

			// If there's sample data in the file, use it
			if (json.sampleData) {
				customData = json.sampleData;
			}
		} catch (err) {
			loadError = err instanceof Error ? err.message : 'Failed to parse JSON';
			customTemplate = null;
		}
	}

	// Clear loaded template
	function clearTemplate() {
		customTemplate = null;
		customData = {};
		loadError = null;
		loadedFileName = null;
	}

	// Create a template that matches Xbox data fields
	const template: CardTemplate = {
		name: 'Xbox Game Card',
		components: [
			{
				id: 'bg',
				type: 'GradientBackground',
				props: {
					colors: ['#107c10', '#0e5c0e', '#054005'],
					direction: 'to-bottom'
				}
			},
			{
				id: 'image-group',
				type: 'Group',
				props: { x: 50, y: 80, width: 650, height: 400 },
				children: [
					{
						id: 'cover',
						type: 'Image',
						props: {
							dataField: 'coverArt',
							fit: 'cover'
						}
					}
				]
			},
			{
				id: 'title-group',
				type: 'Group',
				props: { x: 50, y: 520, width: 650, height: 70 },
				children: [
					{
						id: 'title',
						type: 'TextField',
						props: {
							dataField: 'gameName',
							maxFontSize: 48,
							minFontSize: 24,
							fontWeight: 'bold',
							color: '#ffffff',
							alignment: 'left'
						}
					}
				]
			},
			{
				id: 'gamertag-group',
				type: 'Group',
				props: { x: 50, y: 600, width: 650, height: 40 },
				children: [
					{
						id: 'gamertag',
						type: 'TextField',
						props: {
							dataField: 'gamertag',
							maxFontSize: 24,
							minFontSize: 16,
							color: '#86efac',
							alignment: 'left'
						}
					}
				]
			},
			{
				id: 'stats-group',
				type: 'Group',
				props: { x: 50, y: 680, width: 650, height: 100 },
				children: [
					{
						id: 'stats',
						type: 'StatPanel',
						props: {
							rows: [
								{ label: 'Gamerscore', dataField: 'gamerscore' },
								{ label: 'Achievements', dataField: 'achievements' },
								{ label: 'Hours Played', dataField: 'hoursPlayed' }
							],
							fontSize: 18,
							labelColor: '#9ca3af',
							valueColor: '#ffffff'
						}
					}
				]
			},
			{
				id: 'genre-group',
				type: 'Group',
				props: { x: 50, y: 820, width: 300, height: 40 },
				children: [
					{
						id: 'genre',
						type: 'TextField',
						props: {
							dataField: 'genre',
							maxFontSize: 20,
							minFontSize: 14,
							fontWeight: 'bold',
							color: '#60a5fa',
							alignment: 'left'
						}
					}
				]
			},
			{
				id: 'border',
				type: 'Border',
				props: {
					color: '#22c55e',
					width: 6
				}
			}
		]
	};

	// State
	let selectedRarity = $state<Rarity>('common');
	let selectedCard = $state<CardData | null>(null);
	let modalOpen = $state(false);
	let flipped = $state(false);

	// Simple back template (just solid color)
	const backTemplate: CardTemplate = {
		name: 'card-back',
		components: [
			{
				id: 'back-bg',
				type: 'GradientBackground',
				props: {
					colors: ['#1e3a5f', '#0f172a'],
					angle: 135
				}
			},
			{
				id: 'back-border',
				type: 'Border',
				props: {
					color: '#3b82f6',
					width: 8
				}
			}
		]
	};

	// Rarity options for dropdown
	const rarityOptions = getRarityOptions();

	// Active template (custom or default)
	const activeTemplate = $derived(customTemplate ?? template);
	const activeData = $derived(customTemplate ? customData : cards[0]);
</script>

<svelte:head>
	<title>Card Display Test | svelte-trading-cards</title>
</svelte:head>

<div class="min-h-screen bg-gray-900 text-white p-8">
	<div class="max-w-7xl mx-auto">
		<h1 class="text-3xl font-bold mb-8">Card Display Test</h1>

		<!-- Controls -->
		<div class="mb-8 flex flex-wrap gap-4 items-center">
			<!-- Template Upload -->
			<div class="flex items-center gap-2">
				<label
					class="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded cursor-pointer"
				>
					<span>Load Template</span>
					<input
						type="file"
						accept=".json"
						class="hidden"
						onchange={handleFileUpload}
					/>
				</label>
				{#if loadedFileName}
					<span class="text-sm text-gray-400">
						{loadedFileName}
					</span>
					<button
						class="px-2 py-1 text-sm bg-gray-700 hover:bg-gray-600 rounded"
						onclick={clearTemplate}
					>
						Clear
					</button>
				{/if}
			</div>

			{#if loadError}
				<span class="text-red-400 text-sm">{loadError}</span>
			{/if}

			<div class="w-px h-8 bg-gray-700"></div>

			<label class="flex items-center gap-2">
				<span>Rarity:</span>
				<select
					class="bg-gray-800 border border-gray-600 rounded px-3 py-2"
					bind:value={selectedRarity}
				>
					{#each rarityOptions as option}
						<option value={option.value}>{option.label} - {option.description}</option>
					{/each}
				</select>
			</label>

			<button
				class="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded"
				onclick={() => (flipped = !flipped)}
			>
				Toggle Flip
			</button>
		</div>

		<!-- Section: Single Card -->
		<section class="mb-12">
			<h2 class="text-2xl font-semibold mb-4">
				{#if customTemplate}
					Loaded Template: {customTemplate.name || 'Unnamed'}
				{:else}
					Single Card with Rarity Effects
				{/if}
			</h2>
			<p class="text-gray-400 mb-4">
				Current rarity: <strong class="text-white">{selectedRarity}</strong>
				{#if customTemplate}
					<span class="ml-2 text-purple-400">(using loaded template)</span>
				{/if}
			</p>

			<div class="w-[300px]">
				<Card
					template={activeTemplate}
					data={activeData}
					rarity={selectedRarity}
					{backTemplate}
					flipOnClick
					bind:flipped
				/>
			</div>
		</section>

		<!-- Section: All Rarities -->
		<section class="mb-12">
			<h2 class="text-2xl font-semibold mb-4">All Rarity Levels</h2>
			<p class="text-gray-400 mb-4">Hover to see the different effects</p>

			<CardGrid minCardWidth={200} gap={24}>
				{#each rarityOptions as option, i}
					<div>
						<div class="text-center mb-2 text-sm text-gray-400">{option.label}</div>
						<Card
							template={activeTemplate}
							data={customTemplate ? activeData : cards[i % cards.length]}
							rarity={option.value}
						/>
					</div>
				{/each}
			</CardGrid>
		</section>

		<!-- Section: Carousel (only show if using default template) -->
		{#if !customTemplate}
			<section class="mb-12">
				<h2 class="text-2xl font-semibold mb-4">Card Carousel</h2>

				<CardCarousel gap={24} snapAlign="center">
					{#each cards as card, i}
						<div class="w-[250px]">
							<Card
								template={template}
								data={card}
								rarity={rarityOptions[i % rarityOptions.length].value}
								onclick={() => {
									selectedCard = card;
									modalOpen = true;
								}}
							/>
						</div>
					{/each}
				</CardCarousel>
			</section>

			<!-- Section: Grid Gallery -->
			<section class="mb-12">
				<h2 class="text-2xl font-semibold mb-4">Card Grid Gallery</h2>
				<p class="text-gray-400 mb-4">Click a card to view in modal</p>

				<CardGrid minCardWidth={220} gap={20}>
					{#each cards as card, i}
						<Card
							template={template}
							data={card}
							rarity={rarityOptions[i % rarityOptions.length].value}
							onclick={() => {
								selectedCard = card;
								modalOpen = true;
							}}
						/>
					{/each}
				</CardGrid>
			</section>

			<!-- Modal -->
			<CardModal bind:open={modalOpen}>
				{#if selectedCard}
					<div class="w-[400px] max-w-[90vw]">
						<Card
							template={template}
							data={selectedCard}
							rarity="legendary"
							{backTemplate}
							flipOnClick
						/>
					</div>
				{/if}
			</CardModal>
		{/if}
	</div>
</div>
