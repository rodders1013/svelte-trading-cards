<script lang="ts">
	import { CardCreator } from '$lib/creator';
	import { datasets } from '$lib/demo';

	// Convert datasets to the format expected by CardCreator
	const creatorDatasets = Object.fromEntries(
		Object.entries(datasets).map(([key, dataset]) => [
			key,
			{
				id: dataset.id,
				name: dataset.name,
				dataFields: dataset.dataFields,
				cards: dataset.cards as Record<string, unknown>[]
			}
		])
	);

	function handleSave(data: { template: unknown; editorState: unknown; name: string }) {
		// Default behavior: download as JSON
		const savedTemplate = {
			id: `template-${Date.now()}`,
			name: data.name,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			template: data.template,
			editorState: data.editorState
		};
		const blob = new Blob([JSON.stringify(savedTemplate, null, '\t')], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `${data.name.toLowerCase().replace(/\s+/g, '-')}.json`;
		a.click();
		URL.revokeObjectURL(url);
	}
</script>

<CardCreator
	datasets={creatorDatasets}
	initialDataset="xbox"
	onSave={handleSave}
/>
