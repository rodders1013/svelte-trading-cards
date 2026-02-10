<script lang="ts">
	let { data } = $props();

	function formatDate(value: string): string {
		return new Date(value).toLocaleDateString(undefined, {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}
</script>

<div class="mx-auto max-w-5xl space-y-4 p-6">
	<div>
		<h1 class="text-2xl font-bold">Community Templates</h1>
		<p class="text-sm text-muted-foreground">Public templates saved by creators.</p>
	</div>

	{#if !data.enabled}
		<div class="rounded border border-input bg-muted/20 p-4 text-sm text-muted-foreground">
			Template database is not configured yet. Set `DATABASE_URL` to enable shared templates.
		</div>
	{:else if data.templates.length === 0}
		<div class="rounded border border-input bg-muted/20 p-4 text-sm text-muted-foreground">
			No public templates yet.
		</div>
	{:else}
		<div class="grid gap-3 md:grid-cols-2">
			{#each data.templates as template (template.slug)}
				<a href="/templates/{template.slug}" class="rounded border border-input bg-card p-4 hover:bg-accent/20">
					<div class="flex items-start justify-between gap-3">
						<div>
							<h2 class="font-semibold">{template.name}</h2>
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
				</a>
			{/each}
		</div>
	{/if}
</div>
