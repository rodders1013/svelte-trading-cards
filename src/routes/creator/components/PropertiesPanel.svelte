<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import type { IconData } from '$lib/components/icons';
	import ZoneProperties from './ZoneProperties.svelte';
	import TextPanel from './panels/TextPanel.svelte';
	import ImagePanel from './panels/ImagePanel.svelte';
	import BackgroundPanel from './panels/BackgroundPanel.svelte';
	import BorderPanel from './panels/BorderPanel.svelte';
	import IconPanel from './panels/IconPanel.svelte';
	import type {
		ContainerState,
		TextComponent,
		ImageComponent,
		BackgroundComponent,
		BorderComponent,
		IconComponent
	} from '../types';
	import { getComponentByType } from '../state.svelte';

	let {
		container,
		expandedPanels,
		canUndo,
		canRedo,
		onAddContainer,
		onUndo,
		onRedo,
		onTogglePanel,
		onUpdateContainer,
		onDuplicateContainer,
		onDeleteContainer,
		onAddTextComponent,
		onAddImageComponent,
		onAddBackgroundComponent,
		onAddBorderComponent,
		onAddIconComponent,
		onUpdateTextComponent,
		onUpdateImageComponent,
		onUpdateBackgroundComponent,
		onUpdateBorderComponent,
		onUpdateBorderGlow,
		onUpdateBorderHolographic,
		onUpdateIconComponent,
		onUpdateIconSelection,
		onRemoveComponent,
		onMoveComponentUp,
		onMoveComponentDown
	}: {
		container: ContainerState | null;
		expandedPanels: Set<string>;
		canUndo: boolean;
		canRedo: boolean;
		onAddContainer: () => void;
		onUndo: () => void;
		onRedo: () => void;
		onTogglePanel: (panelId: string) => void;
		onUpdateContainer: <K extends keyof ContainerState>(key: K, value: ContainerState[K]) => void;
		onDuplicateContainer: () => void;
		onDeleteContainer: () => void;
		onAddTextComponent: () => void;
		onAddImageComponent: () => void;
		onAddBackgroundComponent: () => void;
		onAddBorderComponent: () => void;
		onAddIconComponent: () => void;
		onUpdateTextComponent: (key: keyof Omit<TextComponent, 'type' | 'id'>, value: unknown) => void;
		onUpdateImageComponent: (key: keyof Omit<ImageComponent, 'type' | 'id'>, value: unknown) => void;
		onUpdateBackgroundComponent: (key: keyof Omit<BackgroundComponent, 'type' | 'id'>, value: unknown) => void;
		onUpdateBorderComponent: (key: keyof Omit<BorderComponent, 'type' | 'id'>, value: unknown) => void;
		onUpdateBorderGlow: (key: string, value: unknown) => void;
		onUpdateBorderHolographic: (key: string, value: unknown) => void;
		onUpdateIconComponent: (key: keyof Omit<IconComponent, 'type' | 'id'>, value: unknown) => void;
		onUpdateIconSelection: (icon: { iconData: IconData; iconName: string }) => void;
		onRemoveComponent: (type: 'text' | 'image' | 'background' | 'border' | 'icon') => void;
		onMoveComponentUp: (componentId: string) => void;
		onMoveComponentDown: (componentId: string) => void;
	} = $props();

	const selectedText = $derived(container ? getComponentByType(container, 'text') : undefined);
	const selectedImage = $derived(container ? getComponentByType(container, 'image') : undefined);
	const selectedBackground = $derived(container ? getComponentByType(container, 'background') : undefined);
	const selectedBorder = $derived(container ? getComponentByType(container, 'border') : undefined);
	const selectedIcon = $derived(container ? getComponentByType(container, 'icon') : undefined);
</script>

<div class="flex min-w-80 flex-1 flex-col gap-3 overflow-auto">
	<!-- Zone Actions (sticky) -->
	<Card.Root class="sticky top-0 z-10 bg-background">
		<Card.Content class="flex items-center gap-2 px-3 py-2">
			<Button variant="default" size="sm" onclick={onAddContainer} title="Add Zone" class="bg-green-600 font-medium hover:bg-green-700">
				<span class="text-sm">+ Add Zone</span>
			</Button>
			<Separator orientation="vertical" class="h-6" />
			<Button variant="ghost" size="sm" onclick={onUndo} disabled={!canUndo} title="Undo (Cmd+Z)">
				<span class="text-sm">Undo</span>
			</Button>
			<Button variant="ghost" size="sm" onclick={onRedo} disabled={!canRedo} title="Redo (Cmd+Shift+Z)">
				<span class="text-sm">Redo</span>
			</Button>
		</Card.Content>
	</Card.Root>

	{#if container}
		<!-- Zone Properties -->
		<ZoneProperties
			{container}
			expanded={expandedPanels.has('container')}
			onUpdate={onUpdateContainer}
			onDuplicate={onDuplicateContainer}
			onDelete={onDeleteContainer}
			onTogglePanel={() => onTogglePanel('container')}
		/>

		<!-- Components Section -->
		{#if expandedPanels.has('container')}
			<Card.Root>
				<div class="border-t">
					<!-- Add Component -->
					<div class="border-b">
						<button
							class="flex w-full items-center justify-between px-3 py-2 hover:bg-muted/50"
							onclick={() => onTogglePanel('addcomponent')}
						>
							<span class="flex items-center gap-2 text-sm font-medium">
								<span class="text-sm">{expandedPanels.has('addcomponent') ? '▼' : '▶'}</span>
								Add Component
							</span>
						</button>

						{#if expandedPanels.has('addcomponent')}
							<div class="px-3 pb-3">
								<div class="flex flex-wrap gap-2">
									<Button variant="outline" size="sm" onclick={onAddTextComponent} disabled={!!selectedText}>
										+ Text
									</Button>
									<Button variant="outline" size="sm" onclick={onAddImageComponent} disabled={!!selectedImage}>
										+ Image
									</Button>
									<Button variant="outline" size="sm" onclick={onAddBackgroundComponent} disabled={!!selectedBackground}>
										+ Background
									</Button>
									<Button variant="outline" size="sm" onclick={onAddBorderComponent} disabled={!!selectedBorder}>
										+ Border
									</Button>
									<Button variant="outline" size="sm" onclick={onAddIconComponent} disabled={!!selectedIcon}>
										+ Icon
									</Button>
								</div>
							</div>
						{/if}
					</div>

					<!-- Text Component -->
					{#if selectedText}
						<TextPanel
							component={selectedText}
							expanded={expandedPanels.has('comp-text')}
							onUpdate={onUpdateTextComponent}
							onRemove={() => onRemoveComponent('text')}
							onMoveUp={() => onMoveComponentUp(selectedText.id)}
							onMoveDown={() => onMoveComponentDown(selectedText.id)}
						/>
					{/if}

					<!-- Image Component -->
					{#if selectedImage}
						<ImagePanel
							component={selectedImage}
							expanded={expandedPanels.has('comp-image')}
							onUpdate={onUpdateImageComponent}
							onRemove={() => onRemoveComponent('image')}
							onMoveUp={() => onMoveComponentUp(selectedImage.id)}
							onMoveDown={() => onMoveComponentDown(selectedImage.id)}
						/>
					{/if}

					<!-- Background Component -->
					{#if selectedBackground}
						<BackgroundPanel
							component={selectedBackground}
							expanded={expandedPanels.has('comp-background')}
							onUpdate={onUpdateBackgroundComponent}
							onRemove={() => onRemoveComponent('background')}
							onMoveUp={() => onMoveComponentUp(selectedBackground.id)}
							onMoveDown={() => onMoveComponentDown(selectedBackground.id)}
						/>
					{/if}

					<!-- Border Component -->
					{#if selectedBorder}
						<BorderPanel
							component={selectedBorder}
							expanded={expandedPanels.has('comp-border')}
							onUpdate={onUpdateBorderComponent}
							onUpdateGlow={onUpdateBorderGlow}
							onUpdateHolographic={onUpdateBorderHolographic}
							onRemove={() => onRemoveComponent('border')}
							onMoveUp={() => onMoveComponentUp(selectedBorder.id)}
							onMoveDown={() => onMoveComponentDown(selectedBorder.id)}
						/>
					{/if}

					<!-- Icon Component -->
					{#if selectedIcon}
						<IconPanel
							component={selectedIcon}
							expanded={expandedPanels.has('comp-icon')}
							onUpdate={onUpdateIconComponent}
							onUpdateIcon={onUpdateIconSelection}
							onRemove={() => onRemoveComponent('icon')}
							onMoveUp={() => onMoveComponentUp(selectedIcon.id)}
							onMoveDown={() => onMoveComponentDown(selectedIcon.id)}
						/>
					{/if}
				</div>
			</Card.Root>
		{/if}
	{:else}
		<!-- No selection -->
		<Card.Root class="flex-1">
			<Card.Content class="flex h-full flex-col items-center justify-center py-12">
				<p class="text-muted-foreground">No zone selected</p>
				<p class="mt-2 text-sm text-muted-foreground">Click + to add a zone or select one from the hierarchy</p>
			</Card.Content>
		</Card.Root>
	{/if}
</div>
