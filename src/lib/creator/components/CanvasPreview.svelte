<script lang="ts">
	import { CardCanvas } from '$lib';
	import type { CardTemplate } from '$lib/types';
	import type { ContainerState, ResizeHandle } from '../types';
	import { getResizeCursor } from '../state.svelte';

	let {
		template,
		previewData,
		containers,
		selectedContainerId = $bindable<string | null>(null),
		svgElement = $bindable<SVGSVGElement | null>(null),
		zoomLevel,
		showGrid,
		gridSize = 25,
		canvasInteraction,
		interactionContainerId,
		activeResizeHandle,
		isTransitioning,
		canvasScale,
		onStartDrag,
		onStartResize
	}: {
		template: CardTemplate;
		previewData: Record<string, unknown>;
		containers: ContainerState[];
		selectedContainerId: string | null;
		svgElement?: SVGSVGElement | null;
		zoomLevel: number;
		showGrid: boolean;
		gridSize?: number;
		canvasInteraction: 'idle' | 'dragging' | 'resizing';
		interactionContainerId: string | null;
		activeResizeHandle: ResizeHandle | null;
		isTransitioning: boolean;
		canvasScale: number;
		onStartDrag: (e: PointerEvent, containerId: string) => void;
		onStartResize: (e: PointerEvent, containerId: string, handle: ResizeHandle) => void;
	} = $props();

	// Grid sizes: small grid = gridSize, large grid = gridSize * 3
	const largeGridSize = $derived(gridSize * 3);

	const zoomScale = $derived(zoomLevel / 100);
	const canvasWidth = $derived(375 * zoomScale);
</script>

<!-- Canvas Container -->
<div class="rounded-lg border border-border bg-white p-1">
	<div
		class="relative overflow-hidden rounded-xl"
		style="width: {canvasWidth}px; cursor: {canvasInteraction === 'dragging' ? 'grabbing' : canvasInteraction === 'resizing' && activeResizeHandle ? getResizeCursor(activeResizeHandle) : 'default'};"
	>
		<div class="aspect-[750/1050] w-full">
			<CardCanvas {template} data={previewData} bind:svgElement />
		</div>

		<!-- Grid Overlay -->
		{#if showGrid}
			<div class="pointer-events-none absolute inset-0">
				<svg class="h-full w-full" viewBox="0 0 750 1050" preserveAspectRatio="none">
					<defs>
						<!-- Small grid (dynamic size) -->
						<pattern id="grid-small" width={gridSize} height={gridSize} patternUnits="userSpaceOnUse">
							<path d="M {gridSize} 0 L 0 0 0 {gridSize}" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="0.5" />
						</pattern>
						<!-- Large grid (3x small grid) -->
						<pattern id="grid-large" width={largeGridSize} height={largeGridSize} patternUnits="userSpaceOnUse">
							<rect width={largeGridSize} height={largeGridSize} fill="url(#grid-small)" />
							<path d="M {largeGridSize} 0 L 0 0 0 {largeGridSize}" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="1" />
						</pattern>
					</defs>
					<rect width="100%" height="100%" fill="url(#grid-large)" />
					<!-- Center lines (more prominent) -->
					<line x1="375" y1="0" x2="375" y2="1050" stroke="rgba(59,130,246,0.5)" stroke-width="1.5" />
					<line x1="0" y1="525" x2="750" y2="525" stroke="rgba(59,130,246,0.5)" stroke-width="1.5" />
				</svg>
			</div>
		{/if}

		<!-- Selection overlay with drag/resize support -->
		<div class="pointer-events-none absolute inset-0">
			{#each containers as container, index (container.id)}
				{@const scale = canvasScale}
				{@const isSelected = selectedContainerId === container.id}
				{@const isLocked = container.locked || container.isCardBase}
				{@const isCardBase = container.isCardBase === true}
				{@const isDraggingThis = canvasInteraction === 'dragging' && interactionContainerId === container.id}
				{@const layerZIndex = index + 1}
				{#if container.visible}
					<!-- Zone overlay -->
					<div
						class="pointer-events-auto absolute {isSelected ? 'ring-2 ring-blue-500' : 'hover:ring-1 hover:ring-blue-300/40'} {isDraggingThis ? 'opacity-80' : ''}"
						style="
							left: {container.x * scale}px;
							top: {container.y * scale}px;
							width: {container.width * scale}px;
							height: {container.height * scale}px;
							cursor: {isLocked ? 'not-allowed' : isSelected ? 'grab' : 'pointer'};
							z-index: {layerZIndex};
						"
						role="button"
						tabindex="0"
						onpointerdown={(e) => {
							if (isSelected && !isLocked) {
								onStartDrag(e, container.id);
							} else {
								selectedContainerId = container.id;
							}
						}}
						onkeydown={(e) => {
							if (e.key === 'Enter' || e.key === ' ') {
								selectedContainerId = container.id;
							}
						}}
					>
						<!-- Corner indicators for selected container -->
						{#if isSelected}
							<span class="absolute -left-px -top-px h-1.5 w-1.5 border-l border-t border-blue-400/70"></span>
							<span class="absolute -right-px -top-px h-1.5 w-1.5 border-r border-t border-blue-400/70"></span>
							<span class="absolute -bottom-px -left-px h-1.5 w-1.5 border-b border-l border-blue-400/70"></span>
							<span class="absolute -bottom-px -right-px h-1.5 w-1.5 border-b border-r border-blue-400/70"></span>
						{/if}
						<span class="sr-only">Select {container.name}</span>
					</div>

					<!-- Resize handles (only for selected, unlocked containers, hidden while dragging/resizing/transitioning) -->
					{#if isSelected && !isLocked && canvasInteraction === 'idle' && !isTransitioning}
						{@const handleSize = 12}
						{@const halfHandle = handleSize / 2}
						{@const handleZIndex = layerZIndex + 100}
						<!-- Corner handles -->
						<div
							class="pointer-events-auto absolute rounded-full border-2 border-white bg-blue-500 transition-all hover:scale-110 hover:bg-blue-400"
							style="
								left: {container.x * scale - halfHandle}px;
								top: {container.y * scale - halfHandle}px;
								width: {handleSize}px;
								height: {handleSize}px;
								cursor: nwse-resize;
								z-index: {handleZIndex};
							"
							role="slider"
							tabindex="0"
							aria-label="Resize northwest"
							aria-valuenow={container.width}
							onpointerdown={(e) => onStartResize(e, container.id, 'nw')}
						></div>
						<div
							class="pointer-events-auto absolute rounded-full border-2 border-white bg-blue-500 transition-all hover:scale-110 hover:bg-blue-400"
							style="
								left: {(container.x + container.width) * scale - halfHandle}px;
								top: {container.y * scale - halfHandle}px;
								width: {handleSize}px;
								height: {handleSize}px;
								cursor: nesw-resize;
								z-index: {handleZIndex};
							"
							role="slider"
							tabindex="0"
							aria-label="Resize northeast"
							aria-valuenow={container.width}
							onpointerdown={(e) => onStartResize(e, container.id, 'ne')}
						></div>
						<div
							class="pointer-events-auto absolute rounded-full border-2 border-white bg-blue-500 transition-all hover:scale-110 hover:bg-blue-400"
							style="
								left: {container.x * scale - halfHandle}px;
								top: {(container.y + container.height) * scale - halfHandle}px;
								width: {handleSize}px;
								height: {handleSize}px;
								cursor: nesw-resize;
								z-index: {handleZIndex};
							"
							role="slider"
							tabindex="0"
							aria-label="Resize southwest"
							aria-valuenow={container.width}
							onpointerdown={(e) => onStartResize(e, container.id, 'sw')}
						></div>
						<div
							class="pointer-events-auto absolute rounded-full border-2 border-white bg-blue-500 transition-all hover:scale-110 hover:bg-blue-400"
							style="
								left: {(container.x + container.width) * scale - halfHandle}px;
								top: {(container.y + container.height) * scale - halfHandle}px;
								width: {handleSize}px;
								height: {handleSize}px;
								cursor: nwse-resize;
								z-index: {handleZIndex};
							"
							role="slider"
							tabindex="0"
							aria-label="Resize southeast"
							aria-valuenow={container.width}
							onpointerdown={(e) => onStartResize(e, container.id, 'se')}
						></div>
						<!-- Edge handles -->
						<div
							class="pointer-events-auto absolute rounded-full border-2 border-white bg-blue-500 transition-all hover:scale-110 hover:bg-blue-400"
							style="
								left: {(container.x + container.width / 2) * scale - halfHandle}px;
								top: {container.y * scale - halfHandle}px;
								width: {handleSize}px;
								height: {handleSize}px;
								cursor: ns-resize;
								z-index: {handleZIndex};
							"
							role="slider"
							tabindex="0"
							aria-label="Resize north"
							aria-valuenow={container.height}
							onpointerdown={(e) => onStartResize(e, container.id, 'n')}
						></div>
						<div
							class="pointer-events-auto absolute rounded-full border-2 border-white bg-blue-500 transition-all hover:scale-110 hover:bg-blue-400"
							style="
								left: {(container.x + container.width / 2) * scale - halfHandle}px;
								top: {(container.y + container.height) * scale - halfHandle}px;
								width: {handleSize}px;
								height: {handleSize}px;
								cursor: ns-resize;
								z-index: {handleZIndex};
							"
							role="slider"
							tabindex="0"
							aria-label="Resize south"
							aria-valuenow={container.height}
							onpointerdown={(e) => onStartResize(e, container.id, 's')}
						></div>
						<div
							class="pointer-events-auto absolute rounded-full border-2 border-white bg-blue-500 transition-all hover:scale-110 hover:bg-blue-400"
							style="
								left: {container.x * scale - halfHandle}px;
								top: {(container.y + container.height / 2) * scale - halfHandle}px;
								width: {handleSize}px;
								height: {handleSize}px;
								cursor: ew-resize;
								z-index: {handleZIndex};
							"
							role="slider"
							tabindex="0"
							aria-label="Resize west"
							aria-valuenow={container.width}
							onpointerdown={(e) => onStartResize(e, container.id, 'w')}
						></div>
						<div
							class="pointer-events-auto absolute rounded-full border-2 border-white bg-blue-500 transition-all hover:scale-110 hover:bg-blue-400"
							style="
								left: {(container.x + container.width) * scale - halfHandle}px;
								top: {(container.y + container.height / 2) * scale - halfHandle}px;
								width: {handleSize}px;
								height: {handleSize}px;
								cursor: ew-resize;
								z-index: {handleZIndex};
							"
							role="slider"
							tabindex="0"
							aria-label="Resize east"
							aria-valuenow={container.width}
							onpointerdown={(e) => onStartResize(e, container.id, 'e')}
						></div>
					{/if}
				{/if}
			{/each}
		</div>
	</div>
</div>

<style>
	:global(.aspect-\[750\/1050\]) {
		display: block;
	}
	:global(.aspect-\[750\/1050\] svg) {
		display: block;
		width: 100%;
		height: 100%;
	}
</style>
