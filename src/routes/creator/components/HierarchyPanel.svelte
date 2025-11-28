<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import type { ContainerState } from '../types';
	import { getComponentIcon } from '../state.svelte';

	let {
		containers,
		selectedContainerId = $bindable<string | null>(null),
		expandedPanels,
		templateName = $bindable(''),
		template,
		onTogglePanel,
		onToggleVisibility,
		onToggleComponentVisibility,
		onMoveContainerUp,
		onMoveContainerDown,
		onMoveComponentUp,
		onMoveComponentDown,
		onDragStart,
		onDragOver,
		onDrop,
		onDragEnd,
		onSaveTemplate,
		onLoadTemplate,
		dragOverContainerId
	}: {
		containers: ContainerState[];
		selectedContainerId: string | null;
		expandedPanels: Set<string>;
		templateName: string;
		template: unknown;
		onTogglePanel: (panelId: string) => void;
		onToggleVisibility: (id: string) => void;
		onToggleComponentVisibility: (componentId: string) => void;
		onMoveContainerUp: (id: string) => void;
		onMoveContainerDown: (id: string) => void;
		onMoveComponentUp: (componentId: string) => void;
		onMoveComponentDown: (componentId: string) => void;
		onDragStart: (id: string) => void;
		onDragOver: (e: DragEvent, id: string) => void;
		onDrop: (e: DragEvent, targetId: string) => void;
		onDragEnd: () => void;
		onSaveTemplate: () => void;
		onLoadTemplate: (event: Event) => void;
		dragOverContainerId: string | null;
	} = $props();
</script>

<div class="flex w-64 flex-col gap-2">
	<!-- Template Load/Save -->
	<Card.Root>
		<Card.Content class="flex items-center justify-between gap-2 px-2 py-2">
			<input
				type="text"
				bind:value={templateName}
				class="min-w-0 flex-1 rounded border border-input bg-background px-2 py-1 text-sm font-medium"
				placeholder="Template name"
			/>
			<div class="flex gap-1">
				<label class="inline-flex h-8 cursor-pointer items-center justify-center rounded-md border border-input bg-background px-2 text-sm font-medium shadow-xs hover:bg-accent hover:text-accent-foreground">
					<input type="file" accept=".json" class="hidden" onchange={onLoadTemplate} />
					Load
				</label>
				<Button size="sm" onclick={onSaveTemplate}>Save</Button>
			</div>
		</Card.Content>
	</Card.Root>

	<!-- Zone Hierarchy -->
	<Card.Root class="flex-1 overflow-auto">
		<button
			class="flex w-full items-center justify-between px-3 py-2 hover:bg-muted/50"
			onclick={() => onTogglePanel('hierarchy')}
		>
			<span class="flex items-center gap-2 text-sm font-medium">
				<span class="text-sm">{expandedPanels.has('hierarchy') ? '▼' : '▶'}</span>
				Zone Hierarchy
			</span>
			<span class="text-sm text-muted-foreground">{containers.length}</span>
		</button>

		{#if expandedPanels.has('hierarchy')}
			<div class="border-t px-1 py-1">
				{#each [...containers].reverse() as container, i (container.id)}
					{@const realIndex = containers.length - 1 - i}
					<div
						class="group flex items-center gap-1 rounded px-2 py-1.5 text-sm transition-colors"
						class:bg-primary={selectedContainerId === container.id}
						class:text-primary-foreground={selectedContainerId === container.id}
						class:hover:bg-muted={selectedContainerId !== container.id}
						class:opacity-50={!container.visible}
						class:border-t-2={dragOverContainerId === container.id}
						class:border-primary={dragOverContainerId === container.id}
						draggable="true"
						ondragstart={() => onDragStart(container.id)}
						ondragover={(e) => onDragOver(e, container.id)}
						ondrop={(e) => onDrop(e, container.id)}
						ondragend={onDragEnd}
						role="listitem"
					>
						<!-- Drag handle -->
						<span class="cursor-grab opacity-40 hover:opacity-100" title="Drag to reorder">::</span>

						<!-- Container type icon -->
						<span class="w-4 text-center">
							{#if container.clipShape === 'rect'}
								rect
							{:else if container.clipShape === 'circle'}
								circ
							{:else if container.clipShape === 'hexagon'}
								hex
							{:else if container.clipShape === 'star'}
								star
							{:else}
								shp
							{/if}
						</span>

						<!-- Name (editable when selected) -->
						<button
							class="flex-1 truncate text-left"
							onclick={() => (selectedContainerId = container.id)}
						>
							{container.name}
						</button>

						<!-- Component count badge -->
						<span
							class="rounded bg-muted px-1 text-sm text-muted-foreground"
							class:bg-primary-foreground={selectedContainerId === container.id}
							class:text-primary={selectedContainerId === container.id}
						>
							{container.components.length}
						</span>

						<!-- Actions -->
						<div class="flex gap-0.5 opacity-0 group-hover:opacity-100">
							<button
								class="rounded p-0.5 hover:bg-black/10"
								onclick={(e) => {
									e.stopPropagation();
									onToggleVisibility(container.id);
								}}
								title={container.visible ? 'Hide' : 'Show'}
							>
								{container.visible ? 'vis' : 'hid'}
							</button>
							<button
								class="rounded p-0.5 hover:bg-black/10"
								onclick={(e) => {
									e.stopPropagation();
									onMoveContainerUp(container.id);
								}}
								title="Move up (forward)"
								disabled={realIndex === containers.length - 1}
							>
								up
							</button>
							<button
								class="rounded p-0.5 hover:bg-black/10"
								onclick={(e) => {
									e.stopPropagation();
									onMoveContainerDown(container.id);
								}}
								title="Move down (backward)"
								disabled={realIndex === 0}
							>
								dn
							</button>
						</div>
					</div>

					<!-- Show children components in render order -->
					{#if selectedContainerId === container.id && container.components.length > 0}
						<div class="mb-1 ml-6 border-l border-muted pl-2">
							{#each container.components as comp, idx (comp.id)}
								<div
									class="group/comp flex items-center gap-2 py-0.5 text-sm text-muted-foreground"
									class:opacity-50={!comp.visible}
								>
									<span class="w-3 text-right opacity-50">{idx + 1}</span>
									<span>{getComponentIcon(comp.type)}</span>
									<span class="flex-1 capitalize">{comp.type}</span>
									<!-- Component actions -->
									<div class="flex gap-0.5 opacity-0 group-hover/comp:opacity-100">
										<button
											class="rounded p-0.5 hover:bg-black/10"
											onclick={(e) => {
												e.stopPropagation();
												onToggleComponentVisibility(comp.id);
											}}
											title={comp.visible ? 'Hide' : 'Show'}
										>
											{comp.visible ? 'vis' : 'hid'}
										</button>
										<button
											class="rounded p-0.5 hover:bg-black/10"
											onclick={(e) => {
												e.stopPropagation();
												onMoveComponentUp(comp.id);
											}}
											title="Move up"
											disabled={idx === 0}
										>
											up
										</button>
										<button
											class="rounded p-0.5 hover:bg-black/10"
											onclick={(e) => {
												e.stopPropagation();
												onMoveComponentDown(comp.id);
											}}
											title="Move down"
											disabled={idx === container.components.length - 1}
										>
											dn
										</button>
									</div>
								</div>
							{/each}
						</div>
					{/if}
				{/each}

				{#if containers.length === 0}
					<p class="py-4 text-center text-sm text-muted-foreground">Click + to add a zone</p>
				{/if}
			</div>
		{/if}
	</Card.Root>

	<!-- Template JSON Preview (collapsible) -->
	<Card.Root>
		<button
			class="flex w-full items-center justify-between px-3 py-2 hover:bg-muted/50"
			onclick={() => onTogglePanel('json')}
		>
			<span class="flex items-center gap-2 text-sm font-medium">
				<span class="text-sm">{expandedPanels.has('json') ? '▼' : '▶'}</span>
				Template JSON
			</span>
		</button>
		{#if expandedPanels.has('json')}
			<Card.Content class="border-t">
				<pre class="max-h-40 overflow-auto rounded bg-muted p-2 text-sm">{JSON.stringify(template, null, 2)}</pre>
			</Card.Content>
		{/if}
	</Card.Root>
</div>
