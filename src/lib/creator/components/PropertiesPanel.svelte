<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import * as Tabs from '$lib/components/ui/tabs';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import type { IconData } from '$lib/components/icons';
	import { DEFAULT_DATASET, type DatasetId } from '$lib/presets';
	import ZoneProperties from './ZoneProperties.svelte';
	import AddLayerPopover from './AddLayerPopover.svelte';
	import AddComponentPopover from './AddComponentPopover.svelte';
	import TextPanel from './panels/TextPanel.svelte';
	import ImagePanel from './panels/ImagePanel.svelte';
	import BackgroundPanel from './panels/BackgroundPanel.svelte';
	import BorderPanel from './panels/BorderPanel.svelte';
	import IconPanel from './panels/IconPanel.svelte';
	import BadgePanel from './panels/BadgePanel.svelte';
	import StatPanelPanel from './panels/StatPanelPanel.svelte';
	import DividerPanel from './panels/DividerPanel.svelte';
	import ProgressBarPanel from './panels/ProgressBarPanel.svelte';
	import RibbonPanel from './panels/RibbonPanel.svelte';
	import FramePanel from './panels/FramePanel.svelte';
	import ListPanel from './panels/ListPanel.svelte';
	import IconRatingPanel from './panels/IconRatingPanel.svelte';
	import type {
		ContainerState,
		TextComponent,
		ImageComponent,
		BackgroundComponent,
		BorderComponent,
		IconComponent,
		BadgeComponent,
		StatPanelComponent,
		DividerComponent,
		ProgressBarComponent,
		RibbonComponent,
		FrameComponent,
		ListComponent,
		IconRatingComponent,
		DataFieldOption
	} from '../types';
	import { getAllFontsForDataset } from '$lib/fonts';
	import { getComponentByType } from '../state.svelte';

	let {
		container,
		dataFields,
		datasetId = DEFAULT_DATASET,
		previewData = {},
		expandedPanels,
		activeTab = $bindable('layer'),
		selectedComponentId = null,
		containers,
		canUndo,
		canRedo,
		onAddContainer,
		onAddContainerFromTemplate,
		onDuplicateContainerById,
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
		onAddBadgeComponent,
		onAddStatPanelComponent,
		onAddDividerComponent,
		onAddProgressBarComponent,
		onAddRibbonComponent,
		onAddFrameComponent,
		onAddListComponent,
		onAddIconRatingComponent,
		onUpdateTextComponent,
		onUpdateImageComponent,
		onUpdateBackgroundComponent,
		onUpdateBorderComponent,
		onUpdateBorderGlow,
		onUpdateBorderHolographic,
		onUpdateIconComponent,
		onUpdateIconSelection,
		onUpdateBadgeComponent,
		onUpdateStatPanelComponent,
		onUpdateDividerComponent,
		onUpdateProgressBarComponent,
		onUpdateRibbonComponent,
		onUpdateFrameComponent,
		onUpdateListComponent,
		onUpdateIconRatingComponent,
		onRemoveComponent,
		onMoveComponentUp,
		onMoveComponentDown
	}: {
		container: ContainerState | null;
		dataFields: DataFieldOption[];
		datasetId?: DatasetId;
		previewData?: Record<string, unknown>;
		expandedPanels: Set<string>;
		activeTab?: 'layer' | 'components';
		selectedComponentId?: string | null;
		containers: ContainerState[];
		canUndo: boolean;
		canRedo: boolean;
		onAddContainer: () => void;
		onAddContainerFromTemplate: (templateId: string) => void;
		onDuplicateContainerById: (containerId: string) => void;
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
		onAddBadgeComponent: () => void;
		onAddStatPanelComponent: () => void;
		onAddDividerComponent: () => void;
		onAddProgressBarComponent: () => void;
		onAddRibbonComponent: () => void;
		onAddFrameComponent: () => void;
		onAddListComponent: () => void;
		onAddIconRatingComponent: () => void;
		onUpdateTextComponent: (key: keyof Omit<TextComponent, 'type' | 'id'>, value: unknown) => void;
		onUpdateImageComponent: (key: keyof Omit<ImageComponent, 'type' | 'id'>, value: unknown) => void;
		onUpdateBackgroundComponent: (key: keyof Omit<BackgroundComponent, 'type' | 'id'>, value: unknown) => void;
		onUpdateBorderComponent: (key: keyof Omit<BorderComponent, 'type' | 'id'>, value: unknown) => void;
		onUpdateBorderGlow: (key: string, value: unknown) => void;
		onUpdateBorderHolographic: (key: string, value: unknown) => void;
		onUpdateIconComponent: (key: keyof Omit<IconComponent, 'type' | 'id'>, value: unknown) => void;
		onUpdateIconSelection: (icon: { iconData: IconData; iconName: string }) => void;
		onUpdateBadgeComponent: (key: keyof Omit<BadgeComponent, 'type' | 'id'>, value: unknown) => void;
		onUpdateStatPanelComponent: (key: keyof Omit<StatPanelComponent, 'type' | 'id'>, value: unknown) => void;
		onUpdateDividerComponent: (key: keyof Omit<DividerComponent, 'type' | 'id'>, value: unknown) => void;
		onUpdateProgressBarComponent: (key: keyof Omit<ProgressBarComponent, 'type' | 'id'>, value: unknown) => void;
		onUpdateRibbonComponent: (key: keyof Omit<RibbonComponent, 'type' | 'id'>, value: unknown) => void;
		onUpdateFrameComponent: (key: keyof Omit<FrameComponent, 'type' | 'id'>, value: unknown) => void;
		onUpdateListComponent: (key: keyof Omit<ListComponent, 'type' | 'id'>, value: unknown) => void;
		onUpdateIconRatingComponent: (key: keyof Omit<IconRatingComponent, 'type' | 'id'>, value: unknown) => void;
		onRemoveComponent: (type: 'text' | 'image' | 'background' | 'border' | 'icon' | 'badge' | 'statpanel' | 'divider' | 'progressbar' | 'ribbon' | 'frame' | 'list' | 'iconrating') => void;
		onMoveComponentUp: (componentId: string) => void;
		onMoveComponentDown: (componentId: string) => void;
	} = $props();

	// Component selections
	const selectedText = $derived(container ? getComponentByType(container, 'text') : undefined);
	const selectedImage = $derived(container ? getComponentByType(container, 'image') : undefined);
	const selectedBackground = $derived(container ? getComponentByType(container, 'background') : undefined);
	const selectedBorder = $derived(container ? getComponentByType(container, 'border') : undefined);
	const selectedIcon = $derived(container ? getComponentByType(container, 'icon') : undefined);
	const selectedBadge = $derived(container ? getComponentByType(container, 'badge') : undefined);
	const selectedStatPanel = $derived(container ? getComponentByType(container, 'statpanel') : undefined);
	const selectedDivider = $derived(container ? getComponentByType(container, 'divider') : undefined);
	const selectedProgressBar = $derived(container ? getComponentByType(container, 'progressbar') : undefined);
	const selectedRibbon = $derived(container ? getComponentByType(container, 'ribbon') : undefined);
	const selectedFrame = $derived(container ? getComponentByType(container, 'frame') : undefined);
	const selectedList = $derived(container ? getComponentByType(container, 'list') : undefined);
	const selectedIconRating = $derived(container ? getComponentByType(container, 'iconrating') : undefined);

	// Count of components in container
	const componentCount = $derived(container?.components?.length ?? 0);

	// Check if this is the Card Base layer
	const isCardBase = $derived(container?.isCardBase === true);

	// Fonts for IconRating value display
	const fonts = $derived(getAllFontsForDataset(datasetId));
</script>

<div class="flex h-full w-96 shrink-0 flex-col overflow-hidden">
	<!-- Sticky Header -->
	<Card.Root class="shrink-0 rounded-none border-x-0 border-t-0">
		<Card.Content class="flex items-center gap-2 px-3 py-2">
			<AddLayerPopover
				{containers}
				onAddEmpty={onAddContainer}
				onAddTemplate={onAddContainerFromTemplate}
				onDuplicateLayer={onDuplicateContainerById}
			/>
			{#if container && !isCardBase}
				<AddComponentPopover
					hasText={!!selectedText}
					hasImage={!!selectedImage}
					hasList={!!selectedList}
					hasBackground={!!selectedBackground}
					hasBorder={!!selectedBorder}
					hasFrame={!!selectedFrame}
					hasDivider={!!selectedDivider}
					hasBadge={!!selectedBadge}
					hasStatPanel={!!selectedStatPanel}
					hasProgressBar={!!selectedProgressBar}
					hasIconRating={!!selectedIconRating}
					hasIcon={!!selectedIcon}
					hasRibbon={!!selectedRibbon}
					onAddText={onAddTextComponent}
					onAddImage={onAddImageComponent}
					onAddList={onAddListComponent}
					onAddBackground={onAddBackgroundComponent}
					onAddBorder={onAddBorderComponent}
					onAddFrame={onAddFrameComponent}
					onAddDivider={onAddDividerComponent}
					onAddBadge={onAddBadgeComponent}
					onAddStatPanel={onAddStatPanelComponent}
					onAddProgressBar={onAddProgressBarComponent}
					onAddIconRating={onAddIconRatingComponent}
					onAddIcon={onAddIconComponent}
					onAddRibbon={onAddRibbonComponent}
				/>
			{/if}
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
		<!-- Tabs -->
		<Tabs.Root bind:value={activeTab} class="flex flex-1 flex-col overflow-hidden">
			<Tabs.List class="grid w-full shrink-0 grid-cols-2 rounded-none border-b bg-muted/30">
				<Tabs.Trigger value="layer" class="rounded-none data-[state=active]:bg-background">
					Layer
				</Tabs.Trigger>
				<Tabs.Trigger value="components" class="rounded-none data-[state=active]:bg-background">
					Components
					{#if componentCount > 0}
						<span class="ml-1.5 rounded-full bg-muted px-1.5 py-0.5 text-xs">{componentCount}</span>
					{/if}
				</Tabs.Trigger>
			</Tabs.List>

			<!-- Layer Tab -->
			<Tabs.Content value="layer" class="mt-0 flex-1 overflow-hidden">
				<ScrollArea class="h-full">
					<div class="p-3">
						<ZoneProperties
							{container}
							expanded={expandedPanels.has('container')}
							onUpdate={onUpdateContainer}
							onDuplicate={onDuplicateContainer}
							onDelete={onDeleteContainer}
							onTogglePanel={() => onTogglePanel('container')}
						/>
					</div>
				</ScrollArea>
			</Tabs.Content>

			<!-- Components Tab -->
			<Tabs.Content value="components" class="mt-0 flex-1 overflow-hidden">
				<ScrollArea class="h-full">
					<div class="flex flex-col">
						{#if componentCount === 0}
							<div class="flex flex-col items-center justify-center py-12 text-center">
								<p class="text-muted-foreground">No components</p>
								<p class="mt-1 text-sm text-muted-foreground">Click "+ Component" to add components</p>
							</div>
						{:else}
							<!-- Render components in array order -->
							{#each container.components as component (component.id)}
								{@const isSelected = selectedComponentId === component.id}
								<div class={isSelected ? 'ring-2 ring-blue-500 ring-inset' : ''}>
									{#if component.type === 'background'}
										<BackgroundPanel
											{component}
											expanded={expandedPanels.has('comp-background')}
											{isCardBase}
											onUpdate={onUpdateBackgroundComponent}
											onRemove={() => onRemoveComponent('background')}
											onMoveUp={() => onMoveComponentUp(component.id)}
											onMoveDown={() => onMoveComponentDown(component.id)}
											onToggleVisibility={() => onUpdateBackgroundComponent('visible', !component.visible)}
										/>
									{:else if component.type === 'border'}
										<BorderPanel
											{component}
											expanded={expandedPanels.has('comp-border')}
											{isCardBase}
											onUpdate={onUpdateBorderComponent}
											onUpdateGlow={onUpdateBorderGlow}
											onUpdateHolographic={onUpdateBorderHolographic}
											onRemove={() => onRemoveComponent('border')}
											onMoveUp={() => onMoveComponentUp(component.id)}
											onMoveDown={() => onMoveComponentDown(component.id)}
											onToggleVisibility={() => onUpdateBorderComponent('visible', !component.visible)}
										/>
									{:else if component.type === 'frame'}
										<FramePanel
											{component}
											expanded={expandedPanels.has('comp-frame')}
											onUpdate={onUpdateFrameComponent}
											onRemove={() => onRemoveComponent('frame')}
											onMoveUp={() => onMoveComponentUp(component.id)}
											onMoveDown={() => onMoveComponentDown(component.id)}
										/>
									{:else if component.type === 'image'}
										<ImagePanel
											{component}
											{dataFields}
											expanded={expandedPanels.has('comp-image')}
											{isCardBase}
											onUpdate={onUpdateImageComponent}
											onRemove={() => onRemoveComponent('image')}
											onMoveUp={() => onMoveComponentUp(component.id)}
											onMoveDown={() => onMoveComponentDown(component.id)}
											onToggleVisibility={() => onUpdateImageComponent('visible', !component.visible)}
										/>
									{:else if component.type === 'text'}
										<TextPanel
											{component}
											{dataFields}
											{datasetId}
											expanded={expandedPanels.has('comp-text')}
											onUpdate={onUpdateTextComponent}
											onRemove={() => onRemoveComponent('text')}
											onMoveUp={() => onMoveComponentUp(component.id)}
											onMoveDown={() => onMoveComponentDown(component.id)}
										/>
									{:else if component.type === 'list'}
										<ListPanel
											{component}
											{dataFields}
											{datasetId}
											expanded={expandedPanels.has('comp-list')}
											onUpdate={onUpdateListComponent}
											onRemove={() => onRemoveComponent('list')}
											onMoveUp={() => onMoveComponentUp(component.id)}
											onMoveDown={() => onMoveComponentDown(component.id)}
										/>
									{:else if component.type === 'icon'}
										<IconPanel
											{component}
											expanded={expandedPanels.has('comp-icon')}
											onUpdate={onUpdateIconComponent}
											onUpdateIcon={onUpdateIconSelection}
											onRemove={() => onRemoveComponent('icon')}
											onMoveUp={() => onMoveComponentUp(component.id)}
											onMoveDown={() => onMoveComponentDown(component.id)}
										/>
									{:else if component.type === 'badge'}
										<BadgePanel
											{component}
											{dataFields}
											{datasetId}
											expanded={expandedPanels.has('comp-badge')}
											onUpdate={onUpdateBadgeComponent}
											onRemove={() => onRemoveComponent('badge')}
											onMoveUp={() => onMoveComponentUp(component.id)}
											onMoveDown={() => onMoveComponentDown(component.id)}
										/>
									{:else if component.type === 'statpanel'}
										<StatPanelPanel
											{component}
											{dataFields}
											{datasetId}
											expanded={expandedPanels.has('comp-statpanel')}
											onUpdate={onUpdateStatPanelComponent}
											onRemove={() => onRemoveComponent('statpanel')}
											onMoveUp={() => onMoveComponentUp(component.id)}
											onMoveDown={() => onMoveComponentDown(component.id)}
										/>
									{:else if component.type === 'progressbar'}
										<ProgressBarPanel
											{component}
											{dataFields}
											expanded={expandedPanels.has('comp-progressbar')}
											onUpdate={onUpdateProgressBarComponent}
											onRemove={() => onRemoveComponent('progressbar')}
											onMoveUp={() => onMoveComponentUp(component.id)}
											onMoveDown={() => onMoveComponentDown(component.id)}
										/>
									{:else if component.type === 'iconrating'}
										<IconRatingPanel
											{component}
											{dataFields}
											{fonts}
											{previewData}
											expanded={expandedPanels.has('comp-iconrating')}
											onUpdate={onUpdateIconRatingComponent}
											onRemove={() => onRemoveComponent('iconrating')}
											onMoveUp={() => onMoveComponentUp(component.id)}
											onMoveDown={() => onMoveComponentDown(component.id)}
										/>
									{:else if component.type === 'divider'}
										<DividerPanel
											{component}
											expanded={expandedPanels.has('comp-divider')}
											onUpdate={onUpdateDividerComponent}
											onRemove={() => onRemoveComponent('divider')}
											onMoveUp={() => onMoveComponentUp(component.id)}
											onMoveDown={() => onMoveComponentDown(component.id)}
										/>
									{:else if component.type === 'ribbon'}
										<RibbonPanel
											{component}
											{dataFields}
											{datasetId}
											expanded={expandedPanels.has('comp-ribbon')}
											onUpdate={onUpdateRibbonComponent}
											onRemove={() => onRemoveComponent('ribbon')}
											onMoveUp={() => onMoveComponentUp(component.id)}
											onMoveDown={() => onMoveComponentDown(component.id)}
										/>
									{/if}
								</div>
							{/each}
						{/if}
					</div>
				</ScrollArea>
			</Tabs.Content>
		</Tabs.Root>
	{:else}
		<!-- No selection -->
		<div class="flex flex-1 flex-col items-center justify-center">
			<p class="text-muted-foreground">No layer selected</p>
			<p class="mt-2 text-sm text-muted-foreground">Click "+ Layer" to add a layer or select one from the list</p>
		</div>
	{/if}
</div>
