<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';

	let {
		zoomLevel = $bindable(100),
		showGrid = $bindable(false),
		previewMode = $bindable<'fields' | 'data'>('fields'),
		onZoomIn,
		onZoomOut,
		onResetZoom,
		onShowHelp
	}: {
		zoomLevel: number;
		showGrid: boolean;
		previewMode: 'fields' | 'data';
		onZoomIn: () => void;
		onZoomOut: () => void;
		onResetZoom: () => void;
		onShowHelp: () => void;
	} = $props();
</script>

<Card.Root>
	<Card.Content class="flex flex-wrap items-center justify-between gap-2 px-3 py-2">
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
		<Button variant="outline" size="sm" onclick={onShowHelp} title="Keyboard Shortcuts (?)">
			<span class="text-sm">Help</span>
		</Button>
	</Card.Content>
</Card.Root>
