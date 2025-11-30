<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import type { IconData } from '$lib/components/icons';
	import ZoneProperties from './ZoneProperties.svelte';
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
	import StampPanel from './panels/StampPanel.svelte';
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
		StampComponent,
		DataFieldOption
	} from '../types';
	import { getComponentByType } from '../state.svelte';

	let {
		container,
		dataFields,
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
		onAddBadgeComponent,
		onAddStatPanelComponent,
		onAddDividerComponent,
		onAddProgressBarComponent,
		onAddRibbonComponent,
		onAddFrameComponent,
		onAddStampComponent,
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
		onUpdateStampComponent,
		onRemoveComponent,
		onMoveComponentUp,
		onMoveComponentDown
	}: {
		container: ContainerState | null;
		dataFields: DataFieldOption[];
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
		onAddBadgeComponent: () => void;
		onAddStatPanelComponent: () => void;
		onAddDividerComponent: () => void;
		onAddProgressBarComponent: () => void;
		onAddRibbonComponent: () => void;
		onAddFrameComponent: () => void;
		onAddStampComponent: () => void;
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
		onUpdateStampComponent: (key: keyof Omit<StampComponent, 'type' | 'id'>, value: unknown) => void;
		onRemoveComponent: (type: 'text' | 'image' | 'background' | 'border' | 'icon' | 'badge' | 'statpanel' | 'divider' | 'progressbar' | 'ribbon' | 'frame' | 'stamp') => void;
		onMoveComponentUp: (componentId: string) => void;
		onMoveComponentDown: (componentId: string) => void;
	} = $props();

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
	const selectedStamp = $derived(container ? getComponentByType(container, 'stamp') : undefined);
</script>

<div class="min-w-80 flex-1 overflow-hidden">
<ScrollArea class="h-full">
<div class="flex flex-col gap-3 pr-3">
	<!-- Layer Actions (sticky) -->
	<Card.Root class="sticky top-0 z-10 bg-background">
		<Card.Content class="flex items-center gap-2 px-3 py-2">
			<Button variant="default" size="sm" onclick={onAddContainer} title="Add Layer" class="bg-green-600 font-medium hover:bg-green-700">
				<span class="text-sm">+ Add Layer</span>
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
					<Collapsible.Root open={expandedPanels.has('addcomponent')} onOpenChange={() => onTogglePanel('addcomponent')} class="border-b">
						<Collapsible.Trigger class="flex w-full items-center justify-between px-3 py-2 hover:bg-muted/50">
							<span class="flex items-center gap-2 text-sm font-medium">
								<ChevronDown
									class="h-3 w-3 shrink-0 transition-transform duration-200 {expandedPanels.has('addcomponent') ? '' : '-rotate-90'}"
								/>
								Add Component
							</span>
						</Collapsible.Trigger>

						<Collapsible.Content>
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
									<Button variant="outline" size="sm" onclick={onAddBadgeComponent} disabled={!!selectedBadge}>
										+ Badge
									</Button>
									<Button variant="outline" size="sm" onclick={onAddStatPanelComponent} disabled={!!selectedStatPanel}>
										+ Stats
									</Button>
									<Button variant="outline" size="sm" onclick={onAddDividerComponent} disabled={!!selectedDivider}>
										+ Divider
									</Button>
									<Button variant="outline" size="sm" onclick={onAddProgressBarComponent} disabled={!!selectedProgressBar}>
										+ Progress
									</Button>
									<Button variant="outline" size="sm" onclick={onAddRibbonComponent} disabled={!!selectedRibbon}>
										+ Ribbon
									</Button>
									<Button variant="outline" size="sm" onclick={onAddFrameComponent} disabled={!!selectedFrame}>
										+ Frame
									</Button>
									<Button variant="outline" size="sm" onclick={onAddStampComponent} disabled={!!selectedStamp}>
										+ Stamp
									</Button>
								</div>
							</div>
						</Collapsible.Content>
					</Collapsible.Root>

					<!-- Text Component -->
					{#if selectedText}
						<TextPanel
							component={selectedText}
							{dataFields}
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
							{dataFields}
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

					<!-- Badge Component -->
					{#if selectedBadge}
						<BadgePanel
							component={selectedBadge}
							{dataFields}
							expanded={expandedPanels.has('comp-badge')}
							onUpdate={onUpdateBadgeComponent}
							onRemove={() => onRemoveComponent('badge')}
							onMoveUp={() => onMoveComponentUp(selectedBadge.id)}
							onMoveDown={() => onMoveComponentDown(selectedBadge.id)}
						/>
					{/if}

					<!-- StatPanel Component -->
					{#if selectedStatPanel}
						<StatPanelPanel
							component={selectedStatPanel}
							{dataFields}
							expanded={expandedPanels.has('comp-statpanel')}
							onUpdate={onUpdateStatPanelComponent}
							onRemove={() => onRemoveComponent('statpanel')}
							onMoveUp={() => onMoveComponentUp(selectedStatPanel.id)}
							onMoveDown={() => onMoveComponentDown(selectedStatPanel.id)}
						/>
					{/if}

					<!-- Divider Component -->
					{#if selectedDivider}
						<DividerPanel
							component={selectedDivider}
							expanded={expandedPanels.has('comp-divider')}
							onUpdate={onUpdateDividerComponent}
							onRemove={() => onRemoveComponent('divider')}
							onMoveUp={() => onMoveComponentUp(selectedDivider.id)}
							onMoveDown={() => onMoveComponentDown(selectedDivider.id)}
						/>
					{/if}

					<!-- ProgressBar Component -->
					{#if selectedProgressBar}
						<ProgressBarPanel
							component={selectedProgressBar}
							{dataFields}
							expanded={expandedPanels.has('comp-progressbar')}
							onUpdate={onUpdateProgressBarComponent}
							onRemove={() => onRemoveComponent('progressbar')}
							onMoveUp={() => onMoveComponentUp(selectedProgressBar.id)}
							onMoveDown={() => onMoveComponentDown(selectedProgressBar.id)}
						/>
					{/if}

					<!-- Ribbon Component -->
					{#if selectedRibbon}
						<RibbonPanel
							component={selectedRibbon}
							{dataFields}
							expanded={expandedPanels.has('comp-ribbon')}
							onUpdate={onUpdateRibbonComponent}
							onRemove={() => onRemoveComponent('ribbon')}
							onMoveUp={() => onMoveComponentUp(selectedRibbon.id)}
							onMoveDown={() => onMoveComponentDown(selectedRibbon.id)}
						/>
					{/if}

					<!-- Frame Component -->
					{#if selectedFrame}
						<FramePanel
							component={selectedFrame}
							expanded={expandedPanels.has('comp-frame')}
							onUpdate={onUpdateFrameComponent}
							onRemove={() => onRemoveComponent('frame')}
							onMoveUp={() => onMoveComponentUp(selectedFrame.id)}
							onMoveDown={() => onMoveComponentDown(selectedFrame.id)}
						/>
					{/if}

					<!-- Stamp Component -->
					{#if selectedStamp}
						<StampPanel
							component={selectedStamp}
							{dataFields}
							expanded={expandedPanels.has('comp-stamp')}
							onUpdate={onUpdateStampComponent}
							onRemove={() => onRemoveComponent('stamp')}
							onMoveUp={() => onMoveComponentUp(selectedStamp.id)}
							onMoveDown={() => onMoveComponentDown(selectedStamp.id)}
						/>
					{/if}
				</div>
			</Card.Root>
		{/if}
	{:else}
		<!-- No selection -->
		<Card.Root class="flex-1">
			<Card.Content class="flex h-full flex-col items-center justify-center py-12">
				<p class="text-muted-foreground">No layer selected</p>
				<p class="mt-2 text-sm text-muted-foreground">Click + to add a layer or select one from the list</p>
			</Card.Content>
		</Card.Root>
	{/if}
</div>
</ScrollArea>
</div>
