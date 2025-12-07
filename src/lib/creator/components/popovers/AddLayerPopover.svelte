<script lang="ts">
	import { Button } from '$lib/creator/ui/button';
	import * as Popover from '$lib/creator/ui/popover';
	import Plus from '@lucide/svelte/icons/plus';
	import Square from '@lucide/svelte/icons/square';
	import Copy from '@lucide/svelte/icons/copy';
	import Type from '@lucide/svelte/icons/type';
	import ImageIcon from '@lucide/svelte/icons/image';
	import Layers from '@lucide/svelte/icons/layers';
	import type { ContainerState } from '../../types';

	let {
		containers,
		onAddEmpty,
		onAddTemplate,
		onDuplicateLayer
	}: {
		containers: ContainerState[];
		onAddEmpty: () => void;
		onAddTemplate: (template: string) => void;
		onDuplicateLayer: (layerId: string) => void;
	} = $props();

	let open = $state(false);

	const templates = [
		{ id: 'title', label: 'Title Block', description: 'Text with background', icon: Type },
		{ id: 'image-frame', label: 'Image Frame', description: 'Image with border', icon: ImageIcon },
		{ id: 'stats-block', label: 'Stats Block', description: 'Stats panel with background', icon: Layers }
	];

	// Filter out Card Base from duplication options
	const duplicatableContainers = $derived(containers.filter(c => !c.isCardBase));

	function handleAddEmpty() {
		onAddEmpty();
		open = false;
	}

	function handleAddTemplate(templateId: string) {
		onAddTemplate(templateId);
		open = false;
	}

	function handleDuplicate(layerId: string) {
		onDuplicateLayer(layerId);
		open = false;
	}
</script>

<Popover.Root bind:open>
	<Popover.Trigger>
		{#snippet child({ props })}
			<Button {...props} variant="default" size="sm" class="gap-1.5 bg-green-600 hover:bg-green-700">
				<Plus class="h-4 w-4" />
				<span>Layer</span>
			</Button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content class="w-72 p-2" align="start">
		<div class="space-y-2">
			<!-- Empty Layer -->
			<div>
				<button
					type="button"
					class="flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm transition-colors hover:bg-muted"
					onclick={handleAddEmpty}
				>
					<Square class="h-4 w-4 shrink-0 text-muted-foreground" />
					<div class="text-left">
						<div class="font-medium">Empty Layer</div>
						<div class="text-xs text-muted-foreground">Blank layer with no components</div>
					</div>
				</button>
			</div>

			<!-- Templates -->
			<div>
				<div class="px-2 py-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
					Templates
				</div>
				{#each templates as template}
					<button
						type="button"
						class="flex w-full items-center gap-3 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-muted"
						onclick={() => handleAddTemplate(template.id)}
					>
						<template.icon class="h-4 w-4 shrink-0 text-muted-foreground" />
						<div class="text-left">
							<div class="font-medium">{template.label}</div>
							<div class="text-xs text-muted-foreground">{template.description}</div>
						</div>
					</button>
				{/each}
			</div>

			<!-- Duplicate Existing (excludes Card Base) -->
			{#if duplicatableContainers.length > 0}
				<div>
					<div class="px-2 py-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
						Duplicate Existing
					</div>
					<div class="max-h-32 overflow-y-auto">
						{#each duplicatableContainers as container}
							<button
								type="button"
								class="flex w-full items-center gap-3 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-muted"
								onclick={() => handleDuplicate(container.id)}
							>
								<Copy class="h-4 w-4 shrink-0 text-muted-foreground" />
								<div class="truncate text-left">
									<div class="font-medium truncate">{container.name}</div>
									<div class="text-xs text-muted-foreground">{container.components.length} components</div>
								</div>
							</button>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	</Popover.Content>
</Popover.Root>
