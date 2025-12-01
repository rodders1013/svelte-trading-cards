<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Select from '$lib/components/ui/select';
	import { Button } from '$lib/components/ui/button';

	interface DatasetInfo {
		id: string;
		name: string;
	}

	interface CardInfo {
		index: number;
		name: string;
	}

	let {
		zoomLevel = $bindable(100),
		showGrid = $bindable(false),
		previewMode = $bindable<'fields' | 'data'>('fields'),
		// Dataset props (optional - only needed when datasets are available)
		datasets = [],
		selectedDataset = $bindable(''),
		selectedCardIndex = $bindable(0),
		cards = [],
		onDatasetChange,
		onZoomIn,
		onZoomOut,
		onResetZoom,
		onShowHelp
	}: {
		zoomLevel: number;
		showGrid: boolean;
		previewMode: 'fields' | 'data';
		datasets?: DatasetInfo[];
		selectedDataset?: string;
		selectedCardIndex?: number;
		cards?: CardInfo[];
		onDatasetChange?: (datasetId: string) => void;
		onZoomIn: () => void;
		onZoomOut: () => void;
		onResetZoom: () => void;
		onShowHelp?: () => void;
	} = $props();

	const currentDatasetName = $derived(datasets.find(d => d.id === selectedDataset)?.name ?? '');
	const currentCardName = $derived(cards.find(c => c.index === selectedCardIndex)?.name ?? '');
	const hasDatasets = $derived(datasets.length > 0);
</script>

<Card.Root>
	<Card.Content class="flex flex-col gap-2 px-3 py-2">
		<!-- Top row: Controls -->
		<div class="flex flex-wrap items-center justify-between gap-2">
			<!-- Zoom Controls -->
			<div class="flex items-center gap-1">
				<span class="mr-1 text-sm text-muted-foreground">Zoom:</span>
				<Button variant="outline" size="sm" onclick={onZoomOut} disabled={zoomLevel <= 50} title="Zoom Out (Cmd+-)">
					<span class="text-sm">-</span>
				</Button>
				<button
					class="min-w-[3rem] rounded border border-input bg-background px-2 py-1 text-center text-sm"
					onclick={onResetZoom}
					title="Reset Zoom (Cmd+0)"
				>
					{zoomLevel}%
				</button>
				<Button variant="outline" size="sm" onclick={onZoomIn} disabled={zoomLevel >= 200} title="Zoom In (Cmd++)">
					<span class="text-sm">+</span>
				</Button>
			</div>

			<!-- Grid Toggle -->
			<Button
				variant={showGrid ? 'default' : 'outline'}
				size="sm"
				onclick={() => (showGrid = !showGrid)}
				title="Toggle Grid (G)"
			>
				<span class="text-sm">{showGrid ? 'Grid On' : 'Grid Off'}</span>
			</Button>

			<!-- Preview Mode -->
			<div class="flex items-center gap-1">
				<span class="mr-1 text-sm text-muted-foreground">Preview:</span>
				<Button
					variant={previewMode === 'fields' ? 'default' : 'outline'}
					size="sm"
					onclick={() => (previewMode = 'fields')}
					title="Show field placeholders"
				>
					<span class="text-sm">Fields</span>
				</Button>
				<Button
					variant={previewMode === 'data' ? 'default' : 'outline'}
					size="sm"
					onclick={() => (previewMode = 'data')}
					title="Show sample data"
				>
					<span class="text-sm">Data</span>
				</Button>
			</div>

			<!-- Help -->
			{#if onShowHelp}
				<Button variant="outline" size="sm" onclick={onShowHelp} title="Keyboard Shortcuts (?)">
					<span class="text-sm">Help</span>
				</Button>
			{/if}
		</div>

		<!-- Dataset selector (always visible when datasets available) -->
		{#if hasDatasets}
			<div class="flex items-center gap-2 border-t pt-2">
				<span class="text-xs text-muted-foreground">Dataset:</span>
				<Select.Root type="single" value={selectedDataset} onValueChange={(v) => v && onDatasetChange?.(v)}>
					<Select.Trigger class="h-8 min-w-[160px] text-sm">
						{currentDatasetName || 'Select dataset'}
					</Select.Trigger>
					<Select.Content>
						{#each datasets as dataset (dataset.id)}
							<Select.Item value={dataset.id} label={dataset.name} />
						{/each}
					</Select.Content>
				</Select.Root>

				<!-- Card selector (only in data mode) -->
				{#if previewMode === 'data'}
					<span class="text-muted-foreground">→</span>
					<Select.Root type="single" value={String(selectedCardIndex)} onValueChange={(v) => v && (selectedCardIndex = parseInt(v))}>
						<Select.Trigger class="h-8 min-w-[180px] text-sm">
							{currentCardName || 'Select card'}
						</Select.Trigger>
						<Select.Content>
							{#each cards as card (card.index)}
								<Select.Item value={String(card.index)} label={card.name} />
							{/each}
						</Select.Content>
					</Select.Root>
				{/if}
			</div>
		{/if}
	</Card.Content>
</Card.Root>
