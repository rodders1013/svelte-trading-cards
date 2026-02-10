<script lang="ts">
	import { CardCanvas } from '$lib';
	import { datasets, type AnyCard } from '$lib/demo';
	import { registerPreviewComponents } from '$lib/demo/registerPreviewComponents.js';

	registerPreviewComponents();

	let { data } = $props();
	let filterForm = $state<HTMLFormElement | null>(null);
	let searchDebounce: ReturnType<typeof setTimeout> | null = null;

	type DatasetKey = 'xbox' | 'playstation' | 'steam';

	function formatDate(value: string): string {
		return new Date(value).toLocaleDateString(undefined, {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}

	function scopeLabel(scope: string): string {
		return scope === 'game' ? 'Game-specific' : 'Universal';
	}

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

	function resolvePreviewData(template: { gameKey: string | null }): Record<string, unknown> {
		const { dataset, title } = splitGameKey(template.gameKey);
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

	function displayGameKey(gameKey: string | null): string | null {
		const parts = splitGameKey(gameKey);
		if (!parts.title && parts.dataset) return parts.dataset;
		return parts.title ?? gameKey;
	}

	function datasetFromGameKey(gameKey: string | null): DatasetKey | null {
		return splitGameKey(gameKey).dataset;
	}

	function galleryHref(template: { slug: string; gameKey: string | null }): string {
		const params = new URLSearchParams({ template: template.slug });
		const dataset = datasetFromGameKey(template.gameKey);
		if (dataset) params.set('dataset', dataset);
		if (template.gameKey) params.set('gameKey', template.gameKey);
		return `/gallery?${params.toString()}`;
	}

	function creatorHref(template: { slug: string; gameKey: string | null }): string {
		const params = new URLSearchParams({ template: template.slug });
		const dataset = datasetFromGameKey(template.gameKey);
		if (dataset) params.set('dataset', dataset);
		if (template.gameKey) params.set('gameKey', template.gameKey);
		return `/creator?${params.toString()}`;
	}

	function submitFiltersNow() {
		filterForm?.requestSubmit();
	}

	function handleSearchInput() {
		if (searchDebounce) clearTimeout(searchDebounce);
		searchDebounce = setTimeout(() => submitFiltersNow(), 250);
	}
</script>

<div class="mx-auto max-w-6xl space-y-4 p-6">
	<div class="space-y-1">
		<h1 class="text-2xl font-bold">Community Templates</h1>
		<p class="text-sm text-muted-foreground">Browse, filter, and load templates into Creator or Gallery.</p>
	</div>

	{#if !data.enabled}
		<div class="rounded border border-input bg-muted/20 p-4 text-sm text-muted-foreground">
			Template database is not configured yet. Set `DATABASE_URL` to enable shared templates.
		</div>
	{:else}
		<form bind:this={filterForm} method="GET" class="grid gap-3 rounded border border-input bg-card p-4 md:grid-cols-5">
			<label class="space-y-1 text-xs text-muted-foreground">
				<span>Search</span>
				<input
					class="w-full rounded border border-input bg-background px-2 py-1.5 text-sm text-foreground"
					type="text"
					name="search"
					value={data.filters.search}
					placeholder="Template name"
					oninput={handleSearchInput}
				/>
			</label>

			<label class="space-y-1 text-xs text-muted-foreground">
				<span>Author</span>
				<select
					class="w-full rounded border border-input bg-background px-2 py-1.5 text-sm text-foreground"
					name="username"
					onchange={submitFiltersNow}
				>
					<option value="">All authors</option>
					{#each data.facets.usernames as username (username)}
						<option value={username} selected={data.filters.username === username}>{username}</option>
					{/each}
				</select>
			</label>

			<label class="space-y-1 text-xs text-muted-foreground">
				<span>Scope</span>
				<select
					class="w-full rounded border border-input bg-background px-2 py-1.5 text-sm text-foreground"
					name="scope"
					onchange={submitFiltersNow}
				>
					<option value="">All scopes</option>
					<option value="universal" selected={data.filters.scope === 'universal'}>Universal</option>
					<option value="game" selected={data.filters.scope === 'game'}>Game-specific</option>
				</select>
			</label>

			<label class="space-y-1 text-xs text-muted-foreground">
				<span>Game</span>
				<select
					class="w-full rounded border border-input bg-background px-2 py-1.5 text-sm text-foreground"
					name="gameKey"
					onchange={submitFiltersNow}
				>
					<option value="">All games</option>
					{#each data.facets.gameKeys as key (key)}
						<option value={key} selected={data.filters.gameKey === key}>{displayGameKey(key)}</option>
					{/each}
				</select>
			</label>

			<label class="space-y-1 text-xs text-muted-foreground">
				<span>Sort</span>
				<select
					class="w-full rounded border border-input bg-background px-2 py-1.5 text-sm text-foreground"
					name="sort"
					onchange={submitFiltersNow}
				>
					<option value="recent" selected={data.filters.sort === 'recent'}>Most recent</option>
					<option value="name" selected={data.filters.sort === 'name'}>Name A-Z</option>
				</select>
			</label>
		</form>

		<p class="text-xs text-muted-foreground">{data.total} templates</p>

		{#if data.templates.length === 0}
			<div class="rounded border border-input bg-muted/20 p-4 text-sm text-muted-foreground">
				No templates match these filters.
			</div>
		{:else}
			<div class="grid gap-3 md:grid-cols-2">
				{#each data.templates as template (template.slug)}
					<div class="rounded border border-input bg-card p-4">
						<div class="grid gap-3 sm:grid-cols-[96px_1fr]">
							<div
								class="flex items-start justify-center rounded border border-input bg-muted/10 p-1 [&_svg]:h-auto [&_svg]:w-full"
							>
								<CardCanvas template={template.template} data={resolvePreviewData(template)} />
							</div>
							<div>
								<div class="flex items-start justify-between gap-3">
									<div>
										<h2 class="font-semibold">{template.name}</h2>
										<p class="text-xs text-muted-foreground">
											by {template.username} • {scopeLabel(template.scope)}
											{#if template.gameKey}
												• {displayGameKey(template.gameKey)}
											{/if}
										</p>
										{#if template.description}
											<p class="mt-1 text-sm text-muted-foreground">{template.description}</p>
										{/if}
									</div>
									<span class="text-xs text-muted-foreground">{formatDate(template.updatedAt)}</span>
								</div>

								{#if template.tags.length > 0}
									<div class="mt-2 flex flex-wrap gap-1">
										{#each template.tags as tag (tag)}
											<span class="rounded bg-muted px-2 py-0.5 text-xs">{tag}</span>
										{/each}
									</div>
								{/if}

								<div class="mt-3 flex flex-wrap gap-2">
									<a class="rounded border border-input px-2 py-1 text-xs hover:bg-accent/20" href={`/templates/${template.slug}`}>
										Details
									</a>
									<a class="rounded border border-input px-2 py-1 text-xs hover:bg-accent/20" href={creatorHref(template)}>
										Use in Creator
									</a>
									<a class="rounded border border-input px-2 py-1 text-xs hover:bg-accent/20" href={galleryHref(template)}>
										View in Gallery
									</a>
									<a class="rounded border border-input px-2 py-1 text-xs hover:bg-accent/20" href={`/api/templates/${template.slug}`}>
										Download JSON
									</a>
								</div>
							</div>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	{/if}
</div>
