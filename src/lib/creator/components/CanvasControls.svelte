<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import ZoomIn from '@lucide/svelte/icons/zoom-in';
	import ZoomOut from '@lucide/svelte/icons/zoom-out';
	import Grid3x3 from '@lucide/svelte/icons/grid-3x3';
	import Scan from '@lucide/svelte/icons/scan';

	let {
		zoomLevel = $bindable(100),
		showGrid = $bindable(false),
		showBleed = $bindable(false),
		onZoomIn,
		onZoomOut,
		onResetZoom
	}: {
		zoomLevel: number;
		showGrid: boolean;
		showBleed: boolean;
		onZoomIn: () => void;
		onZoomOut: () => void;
		onResetZoom: () => void;
	} = $props();
</script>

<div class="flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5">
	<!-- Zoom Controls -->
	<div class="flex items-center gap-1">
		<Button variant="ghost" size="sm" class="h-7 w-7 p-0" onclick={onZoomOut} disabled={zoomLevel <= 50} title="Zoom Out (Cmd+-)">
			<ZoomOut class="h-4 w-4" />
		</Button>
		<button
			class="min-w-[3.5rem] rounded border border-input bg-background px-2 py-0.5 text-center text-sm"
			onclick={onResetZoom}
			title="Reset Zoom (Cmd+0)"
		>
			{zoomLevel}%
		</button>
		<Button variant="ghost" size="sm" class="h-7 w-7 p-0" onclick={onZoomIn} disabled={zoomLevel >= 200} title="Zoom In (Cmd++)">
			<ZoomIn class="h-4 w-4" />
		</Button>
	</div>

	<div class="h-4 w-px bg-border"></div>

	<!-- Grid Toggle -->
	<Button
		variant={showGrid ? 'default' : 'ghost'}
		size="sm"
		class="h-7 gap-1.5 px-2"
		onclick={() => (showGrid = !showGrid)}
		title="Toggle Grid (G)"
	>
		<Grid3x3 class="h-4 w-4" />
		<span class="text-xs">Grid</span>
	</Button>

	<!-- Bleed Toggle -->
	<Button
		variant={showBleed ? 'default' : 'ghost'}
		size="sm"
		class="h-7 gap-1.5 px-2"
		onclick={() => (showBleed = !showBleed)}
		title="Show Bleed Area"
	>
		<Scan class="h-4 w-4" />
		<span class="text-xs">Bleed</span>
	</Button>
</div>
