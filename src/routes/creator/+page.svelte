<script lang="ts">
	import type { PageData } from './$types';
	import { CardCreator } from '$lib/creator';
	import type { ContainerState } from '$lib/creator';
	import { FontLoader } from '$lib/fonts';
	import { datasets } from '$lib/demo';

	let { data }: { data: PageData } = $props();

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

	async function handleSave(payloadData: {
		template: unknown;
		editorState: unknown;
		name: string;
		username: string;
		scope: 'universal' | 'game';
		gameKey?: string;
		saveAsNew?: boolean;
	}) {
		const payload = {
			name: payloadData.name,
			description: 'Created in card creator',
			username: payloadData.username,
			scope: payloadData.scope,
			gameKey: payloadData.gameKey,
			template: payloadData.template,
			editorState: payloadData.editorState,
			isPublic: true,
			tags: ['creator']
		};

		try {
			const response = await fetch('/api/templates', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify(payload)
			});

			if (!response.ok) throw new Error('template save failed');
			const created = await response.json();
			if (created.editToken && created.slug) {
				localStorage.setItem(`template-edit-token:${created.slug}`, created.editToken);
			}
			alert(`Saved template "${created.name}" to shared library.`);
		} catch {
			// Fallback behavior: download as JSON
			const savedTemplate = {
				id: `template-${Date.now()}`,
				name: payloadData.name,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
				username: payloadData.username,
				scope: payloadData.scope,
				gameKey: payloadData.gameKey,
				template: payloadData.template,
				editorState: payloadData.editorState
			};
			const blob = new Blob([JSON.stringify(savedTemplate, null, '\t')], { type: 'application/json' });
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = `${payloadData.name.toLowerCase().replace(/\s+/g, '-')}.json`;
			a.click();
			URL.revokeObjectURL(url);
			alert('Database save unavailable, downloaded JSON instead.');
		}
	}
</script>

<!-- Load Google Fonts previews for dropdown display -->
<FontLoader />

<CardCreator
	datasets={creatorDatasets}
	initialDataset={data.initialDataset}
	initialCardIndex={data.initialCardIndex}
	initialTemplate={data.initialTemplate as ContainerState[] | undefined}
	initialTemplateName={data.initialTemplateName}
	onSave={handleSave}
/>
