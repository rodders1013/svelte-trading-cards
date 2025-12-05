<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Select from '$lib/components/ui/select';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import Save from '@lucide/svelte/icons/save';
	import Upload from '@lucide/svelte/icons/upload';
	import Download from '@lucide/svelte/icons/download';
	import CloudOff from '@lucide/svelte/icons/cloud-off';
	import Cloud from '@lucide/svelte/icons/cloud';

	interface DatasetInfo {
		id: string;
		name: string;
	}

	interface CardInfo {
		index: number;
		name: string;
	}

	let {
		templateName = $bindable(''),
		hasDraft = false,
		lastSaved = null as Date | null,
		previewMode = $bindable<'fields' | 'data'>('fields'),
		datasets = [],
		selectedDataset = $bindable(''),
		selectedCardIndex = $bindable(0),
		cards = [],
		onDatasetChange,
		onSaveTemplate,
		onLoadTemplate,
		onExport
	}: {
		templateName: string;
		hasDraft?: boolean;
		lastSaved?: Date | null;
		previewMode: 'fields' | 'data';
		datasets?: DatasetInfo[];
		selectedDataset?: string;
		selectedCardIndex?: number;
		cards?: CardInfo[];
		onDatasetChange?: (datasetId: string) => void;
		onSaveTemplate: () => void;
		onLoadTemplate: (event: Event) => void;
		onExport?: () => void;
	} = $props();

	const currentDatasetName = $derived(datasets.find(d => d.id === selectedDataset)?.name ?? '');
	const currentCardName = $derived(cards.find(c => c.index === selectedCardIndex)?.name ?? '');
	const hasDatasets = $derived(datasets.length > 0);

	// Format last saved time
	const savedTimeAgo = $derived(() => {
		if (!lastSaved) return null;
		const seconds = Math.floor((Date.now() - lastSaved.getTime()) / 1000);
		if (seconds < 60) return 'just now';
		if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
		return `${Math.floor(seconds / 3600)}h ago`;
	});
</script>

<Card.Root class="gap-0 rounded-none border-x-0 border-t-0 py-0">
	<Card.Content class="flex flex-wrap items-center gap-x-2 gap-y-1.5 px-2 py-1.5 sm:gap-x-3 sm:px-4">
		<!-- Template Section -->
		<div class="flex items-center gap-1.5 sm:gap-2">
			<input
				type="text"
				bind:value={templateName}
				class="h-8 w-24 min-w-0 truncate rounded border border-input bg-background px-2 text-sm font-medium sm:w-36 lg:w-44"
				placeholder="Template name"
			/>
			<label class="inline-flex h-8 cursor-pointer items-center justify-center rounded-md border border-input bg-background px-2 text-sm font-medium shadow-xs hover:bg-accent hover:text-accent-foreground sm:gap-1.5 sm:px-3">
				<Upload class="h-4 w-4" />
				<input type="file" accept=".json" class="hidden" onchange={onLoadTemplate} />
				<span class="hidden sm:inline">Load</span>
			</label>
			<Button size="sm" onclick={onSaveTemplate} class="gap-1.5 px-2 sm:px-3">
				<Save class="h-4 w-4" />
				<span class="hidden sm:inline">Save</span>
			</Button>
			{#if onExport}
				<Button size="sm" variant="outline" onclick={onExport} class="gap-1.5 px-2 sm:px-3">
					<Download class="h-4 w-4" />
					<span class="hidden sm:inline">Export</span>
				</Button>
			{/if}
		</div>

		<!-- Auto-save indicator -->
		<div class="hidden items-center gap-1.5 sm:flex" title={hasDraft ? `Draft saved ${savedTimeAgo()}` : 'No draft saved'}>
			{#if hasDraft}
				<Cloud class="h-4 w-4 text-green-500" />
				<span class="hidden text-xs text-muted-foreground lg:inline">Draft saved</span>
			{:else}
				<CloudOff class="h-4 w-4 text-muted-foreground" />
			{/if}
		</div>

		<Separator orientation="vertical" class="hidden h-6 sm:block" />

		<!-- Dataset Section -->
		{#if hasDatasets}
			<div class="flex items-center gap-1.5 sm:gap-2">
				<span class="hidden text-xs text-muted-foreground lg:inline">Dataset:</span>
				<Select.Root type="single" value={selectedDataset} onValueChange={(v) => v && onDatasetChange?.(v)}>
					<Select.Trigger class="h-8 w-28 truncate text-sm sm:w-32 lg:w-40">
						<span class="truncate">{currentDatasetName || 'Select'}</span>
					</Select.Trigger>
					<Select.Content>
						{#each datasets as dataset (dataset.id)}
							<Select.Item value={dataset.id} label={dataset.name} />
						{/each}
					</Select.Content>
				</Select.Root>
			</div>

			<Separator orientation="vertical" class="hidden h-6 sm:block" />
		{/if}

		<!-- Preview Mode -->
		<div class="flex items-center gap-1.5 sm:gap-2">
			<span class="hidden text-xs text-muted-foreground lg:inline">Preview:</span>
			<div class="flex">
				<Button
					variant={previewMode === 'fields' ? 'default' : 'outline'}
					size="sm"
					class="rounded-r-none px-2 sm:px-3"
					onclick={() => (previewMode = 'fields')}
					title="Show field placeholders"
				>
					Fields
				</Button>
				<Button
					variant={previewMode === 'data' ? 'default' : 'outline'}
					size="sm"
					class="rounded-l-none border-l-0 px-2 sm:px-3"
					onclick={() => (previewMode = 'data')}
					title="Show sample data"
				>
					Data
				</Button>
			</div>
		</div>

		<!-- Card selector (only in data mode) -->
		{#if hasDatasets && previewMode === 'data'}
			<div class="flex items-center gap-1.5 sm:gap-2">
				<span class="hidden text-muted-foreground sm:inline">→</span>
				<Select.Root type="single" value={String(selectedCardIndex)} onValueChange={(v) => v && (selectedCardIndex = parseInt(v))}>
					<Select.Trigger class="h-8 w-32 truncate text-sm sm:w-40 lg:w-48">
						<span class="truncate">{currentCardName || 'Select card'}</span>
					</Select.Trigger>
					<Select.Content>
						{#each cards as card (card.index)}
							<Select.Item value={String(card.index)} label={card.name} />
						{/each}
					</Select.Content>
				</Select.Root>
			</div>
		{/if}

	</Card.Content>
</Card.Root>
