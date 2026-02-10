<script lang="ts">
	let { data } = $props();
</script>

<div class="mx-auto max-w-5xl space-y-4 p-6">
	<div class="flex items-center justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold">{data.template.name}</h1>
			{#if data.template.description}
				<p class="text-sm text-muted-foreground">{data.template.description}</p>
			{/if}
		</div>
		<a href="/templates" class="text-sm text-primary underline">Back to templates</a>
	</div>

	<div class="rounded border border-input bg-card p-4">
		<h2 class="mb-2 text-sm font-medium">Template JSON</h2>
		<pre class="max-h-[60vh] overflow-auto rounded bg-muted/20 p-3 text-xs">{JSON.stringify(
			data.template.template,
			null,
			2
		)}</pre>
	</div>
</div>
