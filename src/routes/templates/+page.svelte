<script lang="ts">
	let { data } = $props();

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

	function galleryHref(template: { slug: string; gameKey: string | null }): string {
		const params = new URLSearchParams({ template: template.slug });
		if (template.gameKey) params.set('dataset', template.gameKey);
		return `/gallery?${params.toString()}`;
	}

	function creatorHref(template: { slug: string; gameKey: string | null }): string {
		const params = new URLSearchParams({ template: template.slug });
		if (template.gameKey) params.set('dataset', template.gameKey);
		return `/creator?${params.toString()}`;
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
		<form method="GET" class="grid gap-3 rounded border border-input bg-card p-4 md:grid-cols-5">
			<label class="space-y-1 text-xs text-muted-foreground">
				<span>Search</span>
				<input
					class="w-full rounded border border-input bg-background px-2 py-1.5 text-sm text-foreground"
					type="text"
					name="search"
					value={data.filters.search}
					placeholder="Template name"
				/>
			</label>

			<label class="space-y-1 text-xs text-muted-foreground">
				<span>Author</span>
				<select class="w-full rounded border border-input bg-background px-2 py-1.5 text-sm text-foreground" name="username">
					<option value="">All authors</option>
					{#each data.facets.usernames as username (username)}
						<option value={username} selected={data.filters.username === username}>{username}</option>
					{/each}
				</select>
			</label>

			<label class="space-y-1 text-xs text-muted-foreground">
				<span>Scope</span>
				<select class="w-full rounded border border-input bg-background px-2 py-1.5 text-sm text-foreground" name="scope">
					<option value="">All scopes</option>
					<option value="universal" selected={data.filters.scope === 'universal'}>Universal</option>
					<option value="game" selected={data.filters.scope === 'game'}>Game-specific</option>
				</select>
			</label>

			<label class="space-y-1 text-xs text-muted-foreground">
				<span>Game</span>
				<select class="w-full rounded border border-input bg-background px-2 py-1.5 text-sm text-foreground" name="gameKey">
					<option value="">All games</option>
					{#each data.facets.gameKeys as key (key)}
						<option value={key} selected={data.filters.gameKey === key}>{key}</option>
					{/each}
				</select>
			</label>

			<div class="space-y-1 text-xs text-muted-foreground">
				<span>Sort</span>
				<div class="flex gap-2">
					<select class="w-full rounded border border-input bg-background px-2 py-1.5 text-sm text-foreground" name="sort">
						<option value="recent" selected={data.filters.sort === 'recent'}>Most recent</option>
						<option value="name" selected={data.filters.sort === 'name'}>Name A-Z</option>
					</select>
					<button class="rounded border border-input px-3 py-1.5 text-sm hover:bg-accent/30" type="submit">
						Apply
					</button>
				</div>
			</div>
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
						<div class="flex items-start justify-between gap-3">
							<div>
								<h2 class="font-semibold">{template.name}</h2>
								<p class="text-xs text-muted-foreground">
									by {template.username} • {scopeLabel(template.scope)}
									{#if template.gameKey}
										• {template.gameKey}
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
				{/each}
			</div>
		{/if}
	{/if}
</div>
