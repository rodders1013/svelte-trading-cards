<script lang="ts">
	import { CardCanvas } from '$lib';
	import { datasets, type AnyCard } from '$lib/demo';
	import { registerPreviewComponents } from '$lib/demo/registerPreviewComponents.js';

	registerPreviewComponents();

	let { data } = $props();

	type DatasetKey = 'xbox' | 'playstation' | 'steam';

	function splitGameKey(gameKey: string | null): { dataset: DatasetKey | null; title: string | null } {
		if (!gameKey) return { dataset: null, title: null };
		const [left, ...rest] = gameKey.split(':');
		if ((left === 'xbox' || left === 'playstation' || left === 'steam') && rest.length > 0) {
			return { dataset: left, title: rest.join(':') };
		}
		if (left === 'xbox' || left === 'playstation' || left === 'steam') {
			return { dataset: left, title: null };
		}
		return { dataset: null, title: gameKey };
	}

	function getCardTitle(card: AnyCard): string {
		if ('gameName' in card) return card.gameName;
		if ('appName' in card) return card.appName;
		return card.title;
	}

	function resolvePreviewData(): Record<string, unknown> {
		const { dataset, title } = splitGameKey(data.template.gameKey);
		const all = datasets as Record<DatasetKey, { cards: AnyCard[] }>;

		if (dataset) {
			const cards = all[dataset].cards;
			const byName = title ? cards.find((card) => getCardTitle(card).toLowerCase() === title.toLowerCase()) : null;
			return (byName ?? cards[0]) as Record<string, unknown>;
		}

		if (title) {
			for (const key of Object.keys(all) as DatasetKey[]) {
				const match = all[key].cards.find((card) => getCardTitle(card).toLowerCase() === title.toLowerCase());
				if (match) return match as Record<string, unknown>;
			}
		}

		return all.playstation.cards[0] as Record<string, unknown>;
	}

	function creatorHref(): string {
		const params = new URLSearchParams({ template: data.template.slug });
		const dataset = splitGameKey(data.template.gameKey).dataset;
		if (dataset) params.set('dataset', dataset);
		return `/creator?${params.toString()}`;
	}

	function galleryHref(): string {
		const params = new URLSearchParams({ template: data.template.slug });
		const dataset = splitGameKey(data.template.gameKey).dataset;
		if (dataset) params.set('dataset', dataset);
		return `/gallery?${params.toString()}`;
	}

	function displayGameKey(): string | null {
		const parts = splitGameKey(data.template.gameKey);
		return parts.title ?? parts.dataset ?? null;
	}
</script>

<div class="mx-auto max-w-7xl space-y-4 p-6">
	<div class="flex items-center justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold">{data.template.name}</h1>
			{#if data.template.description}
				<p class="text-sm text-muted-foreground">{data.template.description}</p>
			{/if}
			<p class="text-xs text-muted-foreground">
				by {data.template.username} • {data.template.scope}
				{#if displayGameKey()}
					• {displayGameKey()}
				{/if}
			</p>
		</div>
		<div class="flex items-center gap-2">
			<a href={creatorHref()} class="rounded border border-input px-2 py-1 text-xs hover:bg-accent/20">Use in Creator</a>
			<a href={galleryHref()} class="rounded border border-input px-2 py-1 text-xs hover:bg-accent/20">View in Gallery</a>
			<a
				href={`/api/templates/${data.template.slug}`}
				class="rounded border border-input px-2 py-1 text-xs hover:bg-accent/20"
			>
				Download JSON
			</a>
			<a href="/templates" class="text-sm text-primary underline">Back to templates</a>
		</div>
	</div>

	<div class="grid gap-4 lg:grid-cols-[320px_minmax(0,760px)] lg:justify-start">
		<div class="rounded border border-input bg-card p-4">
			<h2 class="mb-2 text-sm font-medium">Preview Card</h2>
			<div
				class="mx-auto w-[200px] rounded border border-input bg-muted/10 p-1 [&_svg]:h-auto [&_svg]:w-full"
			>
				<CardCanvas template={data.template.template} data={resolvePreviewData()} />
			</div>
		</div>

		<div class="rounded border border-input bg-card p-4">
			<h2 class="mb-2 text-sm font-medium">Template JSON</h2>
			<pre class="max-h-[70vh] overflow-auto rounded bg-muted/20 p-3 text-xs">{JSON.stringify(
				data.template.template,
				null,
				2
			)}</pre>
		</div>
	</div>
</div>
