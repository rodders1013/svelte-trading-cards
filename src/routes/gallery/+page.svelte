<script lang="ts">
	import {
		CardCanvas,
		registerComponent,
		Group,
		downloadSVG,
		downloadPNGClient,
		serializeSVG
	} from '$lib';
	import { GradientBackground, Image, PatternBackground, SolidBackground } from '$lib/card/backgrounds';
	import { Border } from '$lib/card/borders';
	import { TextField } from '$lib/card/fields';
	import type { CardTemplate } from '$lib/types';
	import { datasets, type AnyCard } from '$lib/demo';
	import * as Card from '$lib/creator/ui/card';
	import { Button } from '$lib/creator/ui/button';
	import * as Select from '$lib/creator/ui/select';
	import * as Tabs from '$lib/creator/ui/tabs';
	import { Separator } from '$lib/creator/ui/separator';

	// Register all components
	registerComponent('Group', Group);
	registerComponent('GradientBackground', GradientBackground);
	registerComponent('SolidBackground', SolidBackground);
	registerComponent('Image', Image);
	registerComponent('PatternBackground', PatternBackground);
	registerComponent('Border', Border);
	registerComponent('TextField', TextField);

	// Data selection
	let selectedDataset = $state<'xbox' | 'playstation' | 'steam'>('playstation');

	const currentDataset = $derived(datasets[selectedDataset]);
	const cards = $derived(currentDataset.cards as AnyCard[]);

	// Template state
	let loadedTemplate = $state<CardTemplate | null>(null);
	let templateName = $state<string>('No template loaded');

	// Use loaded template or show empty state
	const template = $derived(loadedTemplate);

	// Download states
	let downloadingCards = $state<Record<string, string>>({});

	// Helper for platform styling
	function getPlatformClasses(platform: string): string {
		const styles: Record<string, string> = {
			xbox: 'bg-green-500/20 text-green-400',
			playstation: 'bg-blue-500/20 text-blue-400',
			steam: 'bg-gray-500/20 text-gray-300'
		};
		return styles[platform] ?? styles.steam;
	}

	// Helpers to get display values from any card type
	function getCardTitle(card: AnyCard): string {
		if ('gameName' in card) return card.gameName; // Xbox
		if ('appName' in card) return card.appName; // Steam
		return card.title; // PlayStation
	}

	function getCardPlayerId(card: AnyCard): string {
		if ('gamertag' in card) return card.gamertag; // Xbox
		if ('steamUsername' in card) return card.steamUsername; // Steam
		return card.psnId; // PlayStation
	}

	function getCardCategory(card: AnyCard): string {
		if ('genre' in card) return card.genre; // Xbox
		if ('tags' in card) return card.tags[0] ?? 'Game'; // Steam
		return card.category; // PlayStation
	}

	// Load template from file
	function loadTemplate(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = (e) => {
			try {
				const data = JSON.parse(e.target?.result as string);
				if (data.template) {
					loadedTemplate = data.template as CardTemplate;
					templateName = data.name || file.name.replace('.json', '');
				} else {
					alert('Invalid template file - missing template property');
				}
			} catch (err) {
				alert('Invalid JSON file');
			}
		};
		reader.readAsText(file);
		input.value = '';
	}

	// Clear template
	function clearTemplate() {
		loadedTemplate = null;
		templateName = 'No template loaded';
	}

	// Get SVG element by card ID from DOM
	function getSvgElement(cardId: string): SVGSVGElement | null {
		return document.querySelector(`[data-card-id="${cardId}"] svg`) as SVGSVGElement | null;
	}

	async function handleDownloadSVG(card: AnyCard) {
		const svg = getSvgElement(card.id);
		if (!svg) return;

		downloadSVG(svg, { filename: `${getCardTitle(card).toLowerCase().replace(/\s+/g, '-')}` });
	}

	async function handleDownloadPNGClient(card: AnyCard) {
		const svg = getSvgElement(card.id);
		if (!svg) return;

		downloadingCards[card.id] = 'client-png';
		try {
			await downloadPNGClient(svg, {
				filename: `${getCardTitle(card).toLowerCase().replace(/\s+/g, '-')}`,
				scale: 1
			});
		} finally {
			delete downloadingCards[card.id];
		}
	}

	async function handleDownloadPNGServer(card: AnyCard) {
		const svg = getSvgElement(card.id);
		if (!svg) return;

		downloadingCards[card.id] = 'server-png';
		try {
			const svgString = serializeSVG(svg, true);

			const response = await fetch('/api/cards/download', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					svg: svgString,
					filename: getCardTitle(card).toLowerCase().replace(/\s+/g, '-')
				})
			});

			if (!response.ok) {
				throw new Error('Server download failed');
			}

			const blob = await response.blob();
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = `${getCardTitle(card).toLowerCase().replace(/\s+/g, '-')}-server.png`;
			a.click();
			URL.revokeObjectURL(url);
		} catch (error) {
			console.error('Server PNG download failed:', error);
			alert('Server-side PNG generation failed. Check console for details.');
		} finally {
			delete downloadingCards[card.id];
		}
	}
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-bold">Card Gallery</h1>
			<p class="text-sm text-muted-foreground">Load a template and view generated cards</p>
		</div>
	</div>

	<!-- Template & Data Selection -->
	<Card.Root>
		<Card.Content class="space-y-4 pt-6">
			<!-- Template Selection -->
			<div class="flex items-center gap-4">
				<span class="text-sm font-medium">Template:</span>
				<div class="flex items-center gap-2">
					<label class="inline-flex h-8 cursor-pointer items-center justify-center gap-2 rounded-md border border-input bg-background px-3 text-sm font-medium shadow-xs hover:bg-accent hover:text-accent-foreground">
						<input type="file" accept=".json" class="hidden" onchange={loadTemplate} />
						Load Template JSON
					</label>
					{#if loadedTemplate}
						<span class="rounded bg-green-500/20 px-2 py-1 text-xs text-green-400">
							{templateName}
						</span>
						<Button variant="ghost" size="sm" onclick={clearTemplate}>Clear</Button>
					{:else}
						<span class="text-xs text-muted-foreground">No template loaded</span>
					{/if}
				</div>
			</div>

			<Separator />

			<!-- Data Source Selection -->
			<div class="flex items-center gap-4">
				<span class="text-sm font-medium">Data Source:</span>
				<Select.Root type="single" bind:value={selectedDataset}>
					<Select.Trigger class="w-64">
						{currentDataset.name}
					</Select.Trigger>
					<Select.Content>
						<Select.Item value="xbox">Xbox Games</Select.Item>
						<Select.Item value="playstation">PlayStation Games</Select.Item>
						<Select.Item value="steam">Steam Games</Select.Item>
					</Select.Content>
				</Select.Root>
				<span class="text-xs text-muted-foreground">
					{cards.length} cards
				</span>
			</div>
			<p class="text-xs text-muted-foreground">
				{currentDataset.description}
			</p>
		</Card.Content>
	</Card.Root>

	{#if template}
		<!-- Cards Grid -->
		<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{#each cards as card (card.id)}
				<Card.Root class="overflow-hidden">
					<div class="aspect-[750/1050] bg-black/50" data-card-id={card.id}>
						<CardCanvas {template} data={card} />
					</div>
					<Card.Content class="space-y-3 pt-4">
						<div>
							<h3 class="font-semibold">{getCardTitle(card)}</h3>
							<p class="text-xs text-muted-foreground">{getCardPlayerId(card)}</p>
						</div>

						<div class="flex flex-wrap gap-2">
							<span class="rounded bg-blue-500/20 px-2 py-0.5 text-xs text-blue-400">
								{getCardCategory(card)}
							</span>
							<span class="rounded px-2 py-0.5 text-xs capitalize {getPlatformClasses(selectedDataset)}">
								{selectedDataset}
							</span>
						</div>

						<Tabs.Root value="client" class="w-full">
							<Tabs.List class="grid w-full grid-cols-2">
								<Tabs.Trigger value="client">Client</Tabs.Trigger>
								<Tabs.Trigger value="server">Server</Tabs.Trigger>
							</Tabs.List>
							<Tabs.Content value="client" class="space-y-2 pt-2">
								<Button
									variant="outline"
									size="sm"
									class="w-full"
									onclick={() => handleDownloadSVG(card)}
								>
									Download SVG
								</Button>
								<Button
									variant="outline"
									size="sm"
									class="w-full"
									onclick={() => handleDownloadPNGClient(card)}
									disabled={downloadingCards[card.id] === 'client-png'}
								>
									{downloadingCards[card.id] === 'client-png' ? 'Converting...' : 'Download PNG'}
								</Button>
							</Tabs.Content>
							<Tabs.Content value="server" class="space-y-2 pt-2">
								<Button
									variant="default"
									size="sm"
									class="w-full"
									onclick={() => handleDownloadPNGServer(card)}
									disabled={downloadingCards[card.id] === 'server-png'}
								>
									{downloadingCards[card.id] === 'server-png'
										? 'Generating...'
										: 'Server PNG (High Quality)'}
								</Button>
								<p class="text-[10px] text-muted-foreground">
									Uses node-canvas for better font rendering
								</p>
							</Tabs.Content>
						</Tabs.Root>
					</Card.Content>
				</Card.Root>
			{/each}
		</div>

		<!-- Template Debug -->
		<Card.Root>
			<Card.Header>
				<Card.Title class="text-sm">Loaded Template: {templateName}</Card.Title>
			</Card.Header>
			<Card.Content>
				<pre class="max-h-40 overflow-auto rounded bg-muted p-3 text-xs">{JSON.stringify(
						template,
						null,
						2
					)}</pre>
			</Card.Content>
		</Card.Root>
	{:else}
		<!-- No template loaded state -->
		<Card.Root class="py-16">
			<Card.Content class="flex flex-col items-center justify-center text-center">
				<div class="rounded-full bg-muted p-4">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-8 w-8 text-muted-foreground"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
						/>
					</svg>
				</div>
				<h3 class="mt-4 text-lg font-semibold">No Template Loaded</h3>
				<p class="mt-2 max-w-sm text-sm text-muted-foreground">
					Create a template in the Creator, save it as JSON, then load it here to see your cards rendered with different data sets.
				</p>
				<div class="mt-6 flex gap-4">
					<Button href="/creator">Go to Creator</Button>
					<label class="inline-flex h-9 cursor-pointer items-center justify-center gap-2 rounded-md border border-input bg-background px-4 text-sm font-medium shadow-xs hover:bg-accent hover:text-accent-foreground">
						<input type="file" accept=".json" class="hidden" onchange={loadTemplate} />
						Load Template JSON
					</label>
				</div>
			</Card.Content>
		</Card.Root>
	{/if}
</div>

<style>
	:global(.aspect-\[750\/1050\] svg) {
		width: 100%;
		height: 100%;
	}
</style>
