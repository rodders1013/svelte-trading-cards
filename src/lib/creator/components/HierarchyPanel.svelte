<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import Eye from '@lucide/svelte/icons/eye';
	import EyeOff from '@lucide/svelte/icons/eye-off';
	import ArrowUp from '@lucide/svelte/icons/arrow-up';
	import ArrowDown from '@lucide/svelte/icons/arrow-down';
	import GripVertical from '@lucide/svelte/icons/grip-vertical';
	import Square from '@lucide/svelte/icons/square';
	import Circle from '@lucide/svelte/icons/circle';
	import Hexagon from '@lucide/svelte/icons/hexagon';
	import Star from '@lucide/svelte/icons/star';
	import Diamond from '@lucide/svelte/icons/diamond';
	import Octagon from '@lucide/svelte/icons/octagon';
	import Shield from '@lucide/svelte/icons/shield';
	import Layers from '@lucide/svelte/icons/layers';
	import Sparkles from '@lucide/svelte/icons/sparkles';
	import CreditCard from '@lucide/svelte/icons/credit-card';
	import Lock from '@lucide/svelte/icons/lock';
	import Type from '@lucide/svelte/icons/type';
	import ImageIcon from '@lucide/svelte/icons/image';
	import PaintBucket from '@lucide/svelte/icons/paint-bucket';
	import SquareDashed from '@lucide/svelte/icons/square-dashed';
	import Smile from '@lucide/svelte/icons/smile';
	import Award from '@lucide/svelte/icons/award';
	import BarChart3 from '@lucide/svelte/icons/bar-chart-3';
	import Minus from '@lucide/svelte/icons/minus';
	import Gauge from '@lucide/svelte/icons/gauge';
	import Ribbon from '@lucide/svelte/icons/ribbon';
	import Frame from '@lucide/svelte/icons/frame';
	import List from '@lucide/svelte/icons/list';
	import StarIcon from '@lucide/svelte/icons/star';
	import HelpTooltip from './HelpTooltip.svelte';
	import type { ContainerState } from '../types';
	import type { Component } from 'svelte';

	let {
		containers,
		selectedContainerId = $bindable<string | null>(null),
		expandedPanels,
		onTogglePanel,
		onToggleVisibility,
		onToggleComponentVisibility,
		onMoveContainerUp,
		onMoveContainerDown,
		onMoveComponentUp,
		onMoveComponentDown,
		onRenameContainer,
		onDragStart,
		onDragOver,
		onDrop,
		onDragEnd,
		dragOverContainerId
	}: {
		containers: ContainerState[];
		selectedContainerId: string | null;
		expandedPanels: Set<string>;
		onTogglePanel: (panelId: string) => void;
		onToggleVisibility: (id: string) => void;
		onToggleComponentVisibility: (componentId: string) => void;
		onMoveContainerUp: (id: string) => void;
		onMoveContainerDown: (id: string) => void;
		onMoveComponentUp: (componentId: string) => void;
		onMoveComponentDown: (componentId: string) => void;
		onRenameContainer: (id: string, name: string) => void;
		onDragStart: (id: string) => void;
		onDragOver: (e: DragEvent, id: string) => void;
		onDrop: (e: DragEvent, targetId: string) => void;
		onDragEnd: () => void;
		dragOverContainerId: string | null;
	} = $props();

	// Track expanded state per layer
	let expandedLayers = $state<Set<string>>(new Set());

	// Track which layer is being edited
	let editingLayerId = $state<string | null>(null);
	let editingName = $state('');

	function toggleLayerExpand(layerId: string) {
		const newSet = new Set(expandedLayers);
		if (newSet.has(layerId)) {
			newSet.delete(layerId);
		} else {
			newSet.add(layerId);
		}
		expandedLayers = newSet;
	}

	function startEditing(container: ContainerState) {
		editingLayerId = container.id;
		editingName = container.name;
	}

	function finishEditing() {
		if (editingLayerId && editingName.trim()) {
			onRenameContainer(editingLayerId, editingName.trim());
		}
		editingLayerId = null;
		editingName = '';
	}

	function cancelEditing() {
		editingLayerId = null;
		editingName = '';
	}

	// Get shape icon component
	function getShapeIcon(shape: string) {
		switch (shape) {
			case 'rect': return Square;
			case 'circle': return Circle;
			case 'ellipse': return Circle;
			case 'hexagon': return Hexagon;
			case 'octagon': return Octagon;
			case 'diamond': return Diamond;
			case 'shield': return Shield;
			case 'star': return Star;
			default: return Layers;
		}
	}

	// Get component icon
	function getCompIcon(type: string) {
		switch (type) {
			case 'text': return Type;
			case 'image': return ImageIcon;
			case 'background': return PaintBucket;
			case 'border': return SquareDashed;
			case 'icon': return Smile;
			case 'badge': return Award;
			case 'statpanel': return BarChart3;
			case 'divider': return Minus;
			case 'progressbar': return Gauge;
			case 'ribbon': return Ribbon;
			case 'frame': return Frame;
			case 'list': return List;
			case 'iconrating': return StarIcon;
			default: return Layers;
		}
	}
</script>

<div class="flex h-full w-full flex-col gap-2">
	<!-- Layers -->
	<Card.Root class="flex-1 overflow-hidden">
		<Collapsible.Root open={expandedPanels.has('hierarchy')} onOpenChange={() => onTogglePanel('hierarchy')}>
			<Collapsible.Trigger class="flex w-full items-center justify-between px-3 py-2 hover:bg-muted/50">
				<span class="flex items-center gap-2 text-sm font-medium">
					<ChevronDown
						class="h-3 w-3 shrink-0 transition-transform duration-200 {expandedPanels.has('hierarchy') ? '' : '-rotate-90'}"
					/>
					Layers
					<HelpTooltip text="Layers group components together. Animation on a layer affects all its components." />
				</span>
				<span class="rounded-full bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">{containers.length}</span>
			</Collapsible.Trigger>

			<Collapsible.Content>
				<ScrollArea class="max-h-[400px]">
					<div class="border-t px-1 py-1">
						{#each [...containers].reverse() as container, i (container.id)}
							{@const realIndex = containers.length - 1 - i}
							{@const isExpanded = expandedLayers.has(container.id)}
							{@const isSelected = selectedContainerId === container.id}
							{@const isCardBase = container.isCardBase === true}
							{@const ShapeIcon = isCardBase ? CreditCard : getShapeIcon(container.clipShape)}

							<!-- Layer Row -->
							<div
								class="group flex items-center gap-1 rounded px-1 py-1 text-sm transition-colors"
								class:bg-primary={isSelected}
								class:text-primary-foreground={isSelected}
								class:hover:bg-muted={!isSelected}
								class:opacity-50={!container.visible}
								class:border-t-2={dragOverContainerId === container.id && !isCardBase}
								class:border-primary={dragOverContainerId === container.id && !isCardBase}
								draggable={!isCardBase}
								ondragstart={() => !isCardBase && onDragStart(container.id)}
								ondragover={(e) => !isCardBase && onDragOver(e, container.id)}
								ondrop={(e) => !isCardBase && onDrop(e, container.id)}
								ondragend={onDragEnd}
								role="listitem"
							>
								<!-- Expand/Collapse Toggle -->
								<button
									class="flex h-5 w-5 shrink-0 items-center justify-center rounded hover:bg-black/10"
									onclick={(e) => {
										e.stopPropagation();
										toggleLayerExpand(container.id);
									}}
									title={isExpanded ? 'Collapse' : 'Expand'}
								>
									{#if container.components.length > 0}
										{#if isExpanded}
											<ChevronDown class="h-3 w-3" />
										{:else}
											<ChevronRight class="h-3 w-3" />
										{/if}
									{/if}
								</button>

								<!-- Drag handle (hidden for Card Base) -->
								{#if isCardBase}
									<span class="opacity-40" title="Card Base layer (fixed)">
										<Lock class="h-3 w-3" />
									</span>
								{:else}
									<span class="cursor-grab opacity-40 hover:opacity-100" title="Drag to reorder">
										<GripVertical class="h-3 w-3" />
									</span>
								{/if}

								<!-- Shape icon (Card icon for Card Base, shape icon for others) -->
								<ShapeIcon
									class="h-3.5 w-3.5 shrink-0 {isCardBase ? 'opacity-100' : container.clipContent ? 'opacity-100' : 'opacity-60'}"
									fill={isCardBase ? 'none' : container.clipContent ? 'currentColor' : 'none'}
								/>

								<!-- Name (editable on double-click, but not for Card Base) -->
								{#if editingLayerId === container.id && !isCardBase}
									<input
										type="text"
										bind:value={editingName}
										class="flex-1 rounded border border-input bg-background px-1 text-xs text-foreground"
										onblur={finishEditing}
										onkeydown={(e) => {
											if (e.key === 'Enter') finishEditing();
											if (e.key === 'Escape') cancelEditing();
										}}
										onclick={(e) => e.stopPropagation()}
										autofocus
									/>
								{:else}
									<button
										class="flex-1 truncate text-left text-xs"
										onclick={() => (selectedContainerId = container.id)}
										ondblclick={(e) => {
											if (isCardBase) return;
											e.stopPropagation();
											startEditing(container);
										}}
										title={isCardBase ? 'Card Base layer (extends to bleed for printing)' : 'Double-click to rename'}
									>
										{container.name}
									</button>
								{/if}

								<!-- Animation indicator -->
								{#if container.animation && container.animation.type !== 'none'}
									<Sparkles class="h-3 w-3 shrink-0 text-blue-400" />
								{/if}

								<!-- Component count -->
								<span
									class="rounded px-1 text-xs"
									class:bg-primary-foreground={isSelected}
									class:text-primary={isSelected}
									class:bg-muted={!isSelected}
									class:text-muted-foreground={!isSelected}
								>
									{container.components.length}
								</span>

								<!-- Actions (limited for Card Base) -->
								<div class="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
									<button
										class="flex h-5 w-5 items-center justify-center rounded hover:bg-black/10"
										onclick={(e) => {
											e.stopPropagation();
											onToggleVisibility(container.id);
										}}
										title={container.visible ? 'Hide layer' : 'Show layer'}
									>
										{#if container.visible}
											<Eye class="h-3 w-3" />
										{:else}
											<EyeOff class="h-3 w-3" />
										{/if}
									</button>
									{#if !isCardBase}
										<button
											class="flex h-5 w-5 items-center justify-center rounded hover:bg-black/10 disabled:opacity-30"
											onclick={(e) => {
												e.stopPropagation();
												onMoveContainerUp(container.id);
											}}
											title="Move up (forward)"
											disabled={realIndex === containers.length - 1}
										>
											<ArrowUp class="h-3 w-3" />
										</button>
										<button
											class="flex h-5 w-5 items-center justify-center rounded hover:bg-black/10 disabled:opacity-30"
											onclick={(e) => {
												e.stopPropagation();
												onMoveContainerDown(container.id);
											}}
											title="Move down (backward)"
											disabled={realIndex === 0}
										>
											<ArrowDown class="h-3 w-3" />
										</button>
									{/if}
								</div>
							</div>

							<!-- Components (expandable) -->
							{#if isExpanded && container.components.length > 0}
								<div class="mb-1 ml-4 border-l border-muted pl-2">
									{#each container.components as comp, idx (comp.id)}
									{@const CompIcon = getCompIcon(comp.type)}
										<div
											class="group/comp flex items-center gap-1.5 rounded px-1 py-0.5 text-xs text-muted-foreground hover:bg-muted/50"
											class:opacity-50={!comp.visible}
										>
											<!-- Index -->
											<span class="w-3 text-right opacity-40">{idx + 1}</span>

											<!-- Component icon -->
											<CompIcon class="h-3 w-3 shrink-0 opacity-60" />

											<!-- Component name -->
											<span class="flex-1 truncate capitalize">{comp.type}</span>

											<!-- Effect indicator -->
											{#if comp.effect && comp.effect.type !== 'none'}
												<Sparkles class="h-2.5 w-2.5 shrink-0 text-purple-400" />
											{/if}

											<!-- Component actions -->
											<div class="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover/comp:opacity-100">
												<button
													class="flex h-4 w-4 items-center justify-center rounded hover:bg-black/10"
													onclick={(e) => {
														e.stopPropagation();
														onToggleComponentVisibility(comp.id);
													}}
													title={comp.visible ? 'Hide' : 'Show'}
												>
													{#if comp.visible}
														<Eye class="h-2.5 w-2.5" />
													{:else}
														<EyeOff class="h-2.5 w-2.5" />
													{/if}
												</button>
												<button
													class="flex h-4 w-4 items-center justify-center rounded hover:bg-black/10 disabled:opacity-30"
													onclick={(e) => {
														e.stopPropagation();
														onMoveComponentUp(comp.id);
													}}
													title="Move up"
													disabled={idx === 0}
												>
													<ArrowUp class="h-2.5 w-2.5" />
												</button>
												<button
													class="flex h-4 w-4 items-center justify-center rounded hover:bg-black/10 disabled:opacity-30"
													onclick={(e) => {
														e.stopPropagation();
														onMoveComponentDown(comp.id);
													}}
													title="Move down"
													disabled={idx === container.components.length - 1}
												>
													<ArrowDown class="h-2.5 w-2.5" />
												</button>
											</div>
										</div>
									{/each}
								</div>
							{/if}
						{/each}

						{#if containers.length === 0}
							<p class="py-4 text-center text-sm text-muted-foreground">Click "+ Layer" to add a layer</p>
						{/if}
					</div>
				</ScrollArea>
			</Collapsible.Content>
		</Collapsible.Root>
	</Card.Root>
</div>
