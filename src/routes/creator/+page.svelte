<script lang="ts">
	import { registerComponent, Group } from '$lib';
	import { GradientBackground, Image, PatternBackground } from '$lib/components/backgrounds';
	import { Border } from '$lib/components/borders';
	import { TextField, StatPanel } from '$lib/components/fields';
	import { Icon } from '$lib/components/icons';
	import type { IconData } from '$lib/components/icons';
	import { Badge, Divider, ProgressBar, Ribbon, Frame, Stamp } from '$lib/components/decorations';
	import { CARD_WIDTH, CARD_HEIGHT } from '$lib/types';
	import { datasets, type AnyCard } from '$lib/demo';
	import * as Card from '$lib/components/ui/card';
	import * as Select from '$lib/components/ui/select';

	import HierarchyPanel from './components/HierarchyPanel.svelte';
	import CanvasControls from './components/CanvasControls.svelte';
	import CanvasPreview from './components/CanvasPreview.svelte';
	import PropertiesPanel from './components/PropertiesPanel.svelte';
	import HelpModal from './components/HelpModal.svelte';
	import FieldRemapDialog from './components/FieldRemapDialog.svelte';

	import type {
		ContainerState,
		ComponentItem,
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
		ResizeHandle
	} from './types';

	import {
		createInitialCardBackground,
		createContainer,
		createTextComponent,
		createImageComponent,
		createBackgroundComponent,
		createBorderComponent,
		createIconComponent,
		createBadgeComponent,
		createStatPanelComponent,
		createDividerComponent,
		createProgressBarComponent,
		createRibbonComponent,
		createFrameComponent,
		createStampComponent,
		generateId,
		getComponentByType,
		hasComponentType,
		buildTemplate,
		buildPreviewData,
		GRID_SIZE
	} from './state.svelte';

	// Register all components
	registerComponent('Group', Group);
	registerComponent('GradientBackground', GradientBackground);
	registerComponent('Image', Image);
	registerComponent('PatternBackground', PatternBackground);
	registerComponent('Border', Border);
	registerComponent('TextField', TextField);
	registerComponent('Icon', Icon);
	registerComponent('Badge', Badge);
	registerComponent('StatPanel', StatPanel);
	registerComponent('Divider', Divider);
	registerComponent('ProgressBar', ProgressBar);
	registerComponent('Ribbon', Ribbon);
	registerComponent('Frame', Frame);
	registerComponent('Stamp', Stamp);

	// Template state
	let templateName = $state('New Template');
	let containers = $state<ContainerState[]>([createInitialCardBackground()]);
	let selectedContainerId = $state<string | null>('card-base');
	let previewMode = $state<'fields' | 'data'>('fields');

	// Undo/Redo history
	let history = $state<ContainerState[][]>([]);
	let historyIndex = $state(-1);
	const canUndo = $derived(historyIndex > 0);
	const canRedo = $derived(historyIndex < history.length - 1);

	// Hierarchy panel state
	let draggedContainerId = $state<string | null>(null);
	let dragOverContainerId = $state<string | null>(null);
	let expandedPanels = $state<Set<string>>(
		new Set([
			'hierarchy',
			'container',
			'addcomponent',
			'comp-text',
			'comp-image',
			'comp-background',
			'comp-border',
			'comp-icon',
			'comp-badge',
			'comp-statpanel',
			'comp-divider',
			'comp-progressbar',
			'comp-ribbon',
			'comp-frame',
			'comp-stamp'
		])
	);

	// Preview data
	let selectedDataset = $state<'xbox' | 'playstation' | 'steam'>('xbox');
	let selectedCardIndex = $state(0);
	const currentDataset = $derived(datasets[selectedDataset]);
	const currentCard = $derived(currentDataset.cards[selectedCardIndex] as AnyCard);
	const currentDataFields = $derived(currentDataset.dataFields);

	// Helper to get display name from any card type
	function getCardDisplayName(card: AnyCard): string {
		if ('gameName' in card) return card.gameName; // Xbox
		if ('appName' in card) return card.appName; // Steam
		return card.title; // PlayStation
	}

	// Field remapping state
	let showRemapDialog = $state(false);
	let pendingDataset = $state<'xbox' | 'playstation' | 'steam' | null>(null);
	let unmappedFields = $state<string[]>([]);

	// Extract all dataField bindings from current containers
	function extractBoundFields(): string[] {
		const fields = new Set<string>();
		for (const container of containers) {
			for (const component of container.components) {
				if ('dataField' in component && component.dataField) {
					fields.add(component.dataField as string);
				}
			}
		}
		return Array.from(fields);
	}

	// Find fields that don't exist in target dataset
	function findUnmappedFields(targetDatasetId: string): string[] {
		const boundFields = extractBoundFields();
		const targetFields = datasets[targetDatasetId]?.dataFields || [];
		const targetFieldValues = new Set(targetFields.map(f => f.value));

		return boundFields.filter(field => !targetFieldValues.has(field));
	}

	// Handle dataset change with remapping check
	function handleDatasetChange(newDataset: 'xbox' | 'playstation' | 'steam') {
		if (newDataset === selectedDataset) return;

		const unmapped = findUnmappedFields(newDataset);

		if (unmapped.length > 0) {
			// Show remap dialog
			pendingDataset = newDataset;
			unmappedFields = unmapped;
			showRemapDialog = true;
		} else {
			// No remapping needed, just switch
			selectedDataset = newDataset;
			selectedCardIndex = 0;
		}
	}

	// Apply field remapping to all containers
	function applyRemapping(mapping: Record<string, string>) {
		if (!pendingDataset) return;

		// Update all component dataField bindings
		containers = containers.map(container => ({
			...container,
			components: container.components.map(component => {
				if ('dataField' in component && component.dataField) {
					const newField = mapping[component.dataField as string];
					if (newField) {
						return { ...component, dataField: newField };
					}
				}
				return component;
			})
		}));

		// Switch to new dataset
		selectedDataset = pendingDataset;
		selectedCardIndex = 0;
		pendingDataset = null;
		unmappedFields = [];
	}

	// Skip remapping and switch anyway
	function skipRemapping() {
		if (!pendingDataset) return;
		selectedDataset = pendingDataset;
		selectedCardIndex = 0;
		pendingDataset = null;
		unmappedFields = [];
	}

	// Selected container
	const selectedContainer = $derived(containers.find((c) => c.id === selectedContainerId) ?? null);

	// Canvas interaction state (drag/resize)
	let canvasInteraction = $state<'idle' | 'dragging' | 'resizing'>('idle');
	let interactionContainerId = $state<string | null>(null);
	let interactionStart = $state<{ x: number; y: number } | null>(null);
	let containerStart = $state<{ x: number; y: number; width: number; height: number } | null>(null);
	let activeResizeHandle = $state<ResizeHandle | null>(null);
	let isTransitioning = $state(false);

	// Canvas view controls
	let showGrid = $state(false);
	let zoomLevel = $state(150);
	const zoomScale = $derived(zoomLevel / 100);
	const CANVAS_SCALE = $derived((375 * zoomScale) / CARD_WIDTH);

	// Snap to grid
	let snapToGrid = $state(false);

	// Clipboard for copy/paste
	let clipboard = $state<ContainerState | null>(null);

	// Help modal
	let showHelp = $state(false);

	// Build template and preview data
	const template = $derived(buildTemplate(templateName, containers));
	const previewData = $derived(buildPreviewData(previewMode, currentCard, currentDataFields));

	// History functions
	function pushHistory() {
		const newHistory = history.slice(0, historyIndex + 1);
		newHistory.push(JSON.parse(JSON.stringify(containers)));
		history = newHistory;
		historyIndex = newHistory.length - 1;
	}

	function undo() {
		if (!canUndo) return;
		isTransitioning = true;
		historyIndex--;
		containers = JSON.parse(JSON.stringify(history[historyIndex]));
		setTimeout(() => (isTransitioning = false), 50);
	}

	function redo() {
		if (!canRedo) return;
		isTransitioning = true;
		historyIndex++;
		containers = JSON.parse(JSON.stringify(history[historyIndex]));
		setTimeout(() => (isTransitioning = false), 50);
	}

	// Container management
	function addContainer() {
		const containerNumber = containers.length + 1;
		const newContainer = createContainer(containerNumber);
		pushHistory();
		containers = [...containers, newContainer];
		selectedContainerId = newContainer.id;
	}

	function deleteContainer() {
		if (!selectedContainerId) return;
		pushHistory();
		containers = containers.filter((c) => c.id !== selectedContainerId);
		selectedContainerId = containers.length > 0 ? containers[containers.length - 1].id : null;
	}

	function duplicateContainer() {
		if (!selectedContainer) return;
		pushHistory();
		const newContainer: ContainerState = {
			...JSON.parse(JSON.stringify(selectedContainer)),
			id: generateId(),
			name: `${selectedContainer.name} (copy)`,
			y: selectedContainer.y + 20,
			x: selectedContainer.x + 20
		};
		containers = [...containers, newContainer];
		selectedContainerId = newContainer.id;
	}

	function copyContainer() {
		if (!selectedContainer) return;
		clipboard = JSON.parse(JSON.stringify(selectedContainer));
	}

	function pasteContainer() {
		if (!clipboard) return;
		pushHistory();
		const newContainer: ContainerState = {
			...JSON.parse(JSON.stringify(clipboard)),
			id: generateId(),
			name: `${clipboard.name} (paste)`,
			x: Math.min(clipboard.x + 30, CARD_WIDTH - clipboard.width),
			y: Math.min(clipboard.y + 30, CARD_HEIGHT - clipboard.height)
		};
		containers = [...containers, newContainer];
		selectedContainerId = newContainer.id;
	}

	function toggleVisibility(id: string) {
		pushHistory();
		containers = containers.map((c) => (c.id === id ? { ...c, visible: !c.visible } : c));
	}

	function toggleLock(id: string) {
		containers = containers.map((c) => (c.id === id ? { ...c, locked: !c.locked } : c));
	}

	function moveContainerUp(id: string) {
		const index = containers.findIndex((c) => c.id === id);
		if (index < containers.length - 1) {
			pushHistory();
			const newContainers = [...containers];
			[newContainers[index], newContainers[index + 1]] = [newContainers[index + 1], newContainers[index]];
			containers = newContainers;
		}
	}

	function moveContainerDown(id: string) {
		const index = containers.findIndex((c) => c.id === id);
		if (index > 0) {
			pushHistory();
			const newContainers = [...containers];
			[newContainers[index], newContainers[index - 1]] = [newContainers[index - 1], newContainers[index]];
			containers = newContainers;
		}
	}

	function updateContainer<K extends keyof ContainerState>(key: K, value: ContainerState[K]) {
		if (!selectedContainerId) return;
		pushHistory();
		containers = containers.map((c) => (c.id === selectedContainerId ? { ...c, [key]: value } : c));
	}

	// Component management
	function addTextComponent() {
		if (!selectedContainerId) return;
		const container = containers.find((c) => c.id === selectedContainerId);
		if (!container || hasComponentType(container, 'text')) return;
		pushHistory();
		containers = containers.map((c) =>
			c.id === selectedContainerId ? { ...c, components: [...c.components, createTextComponent()] } : c
		);
	}

	function addImageComponent() {
		if (!selectedContainerId) return;
		const container = containers.find((c) => c.id === selectedContainerId);
		if (!container || hasComponentType(container, 'image')) return;
		pushHistory();
		containers = containers.map((c) =>
			c.id === selectedContainerId ? { ...c, components: [...c.components, createImageComponent()] } : c
		);
	}

	function addBackgroundComponent() {
		if (!selectedContainerId) return;
		const container = containers.find((c) => c.id === selectedContainerId);
		if (!container || hasComponentType(container, 'background')) return;
		pushHistory();
		containers = containers.map((c) =>
			c.id === selectedContainerId ? { ...c, components: [...c.components, createBackgroundComponent()] } : c
		);
	}

	function addBorderComponent() {
		if (!selectedContainerId) return;
		const container = containers.find((c) => c.id === selectedContainerId);
		if (!container || hasComponentType(container, 'border')) return;
		pushHistory();
		containers = containers.map((c) =>
			c.id === selectedContainerId ? { ...c, components: [...c.components, createBorderComponent()] } : c
		);
	}

	function addIconComponent() {
		if (!selectedContainerId) return;
		const container = containers.find((c) => c.id === selectedContainerId);
		if (!container || hasComponentType(container, 'icon')) return;
		pushHistory();
		containers = containers.map((c) =>
			c.id === selectedContainerId ? { ...c, components: [...c.components, createIconComponent()] } : c
		);
	}

	function addBadgeComponent() {
		if (!selectedContainerId) return;
		const container = containers.find((c) => c.id === selectedContainerId);
		if (!container || hasComponentType(container, 'badge')) return;
		pushHistory();
		containers = containers.map((c) =>
			c.id === selectedContainerId ? { ...c, components: [...c.components, createBadgeComponent()] } : c
		);
	}

	function addStatPanelComponent() {
		if (!selectedContainerId) return;
		const container = containers.find((c) => c.id === selectedContainerId);
		if (!container || hasComponentType(container, 'statpanel')) return;
		pushHistory();
		containers = containers.map((c) =>
			c.id === selectedContainerId ? { ...c, components: [...c.components, createStatPanelComponent()] } : c
		);
	}

	function addDividerComponent() {
		if (!selectedContainerId) return;
		const container = containers.find((c) => c.id === selectedContainerId);
		if (!container || hasComponentType(container, 'divider')) return;
		pushHistory();
		containers = containers.map((c) =>
			c.id === selectedContainerId ? { ...c, components: [...c.components, createDividerComponent()] } : c
		);
	}

	function addProgressBarComponent() {
		if (!selectedContainerId) return;
		const container = containers.find((c) => c.id === selectedContainerId);
		if (!container || hasComponentType(container, 'progressbar')) return;
		pushHistory();
		containers = containers.map((c) =>
			c.id === selectedContainerId ? { ...c, components: [...c.components, createProgressBarComponent()] } : c
		);
	}

	function addRibbonComponent() {
		if (!selectedContainerId) return;
		const container = containers.find((c) => c.id === selectedContainerId);
		if (!container || hasComponentType(container, 'ribbon')) return;
		pushHistory();
		containers = containers.map((c) =>
			c.id === selectedContainerId ? { ...c, components: [...c.components, createRibbonComponent()] } : c
		);
	}

	function addFrameComponent() {
		if (!selectedContainerId) return;
		const container = containers.find((c) => c.id === selectedContainerId);
		if (!container || hasComponentType(container, 'frame')) return;
		pushHistory();
		containers = containers.map((c) =>
			c.id === selectedContainerId ? { ...c, components: [...c.components, createFrameComponent()] } : c
		);
	}

	function addStampComponent() {
		if (!selectedContainerId) return;
		const container = containers.find((c) => c.id === selectedContainerId);
		if (!container || hasComponentType(container, 'stamp')) return;
		pushHistory();
		containers = containers.map((c) =>
			c.id === selectedContainerId ? { ...c, components: [...c.components, createStampComponent()] } : c
		);
	}

	function removeComponent(type: 'text' | 'image' | 'background' | 'border' | 'icon' | 'badge' | 'statpanel' | 'divider' | 'progressbar' | 'ribbon' | 'frame' | 'stamp') {
		if (!selectedContainerId) return;
		pushHistory();
		containers = containers.map((c) => {
			if (c.id !== selectedContainerId) return c;
			return { ...c, components: c.components.filter((comp) => comp.type !== type) };
		});
	}

	function updateComponent<T extends ComponentItem>(type: T['type'], key: keyof Omit<T, 'type' | 'id'>, value: unknown) {
		if (!selectedContainerId) return;
		pushHistory();
		containers = containers.map((c) =>
			c.id === selectedContainerId
				? { ...c, components: c.components.map((comp) => (comp.type === type ? { ...comp, [key]: value } : comp)) }
				: c
		);
	}

	function updateTextComponent(key: keyof Omit<TextComponent, 'type' | 'id'>, value: unknown) {
		updateComponent<TextComponent>('text', key, value);
	}

	function updateImageComponent(key: keyof Omit<ImageComponent, 'type' | 'id'>, value: unknown) {
		updateComponent<ImageComponent>('image', key, value);
	}

	function updateBackgroundComponent(key: keyof Omit<BackgroundComponent, 'type' | 'id'>, value: unknown) {
		updateComponent<BackgroundComponent>('background', key, value);
	}

	function updateBorderComponent(key: keyof Omit<BorderComponent, 'type' | 'id'>, value: unknown) {
		updateComponent<BorderComponent>('border', key, value);
	}

	function updateIconComponent(key: keyof Omit<IconComponent, 'type' | 'id'>, value: unknown) {
		updateComponent<IconComponent>('icon', key, value);
	}

	function updateBadgeComponent(key: keyof Omit<BadgeComponent, 'type' | 'id'>, value: unknown) {
		updateComponent<BadgeComponent>('badge', key, value);
	}

	function updateStatPanelComponent(key: keyof Omit<StatPanelComponent, 'type' | 'id'>, value: unknown) {
		updateComponent<StatPanelComponent>('statpanel', key, value);
	}

	function updateDividerComponent(key: keyof Omit<DividerComponent, 'type' | 'id'>, value: unknown) {
		updateComponent<DividerComponent>('divider', key, value);
	}

	function updateProgressBarComponent(key: keyof Omit<ProgressBarComponent, 'type' | 'id'>, value: unknown) {
		updateComponent<ProgressBarComponent>('progressbar', key, value);
	}

	function updateRibbonComponent(key: keyof Omit<RibbonComponent, 'type' | 'id'>, value: unknown) {
		updateComponent<RibbonComponent>('ribbon', key, value);
	}

	function updateFrameComponent(key: keyof Omit<FrameComponent, 'type' | 'id'>, value: unknown) {
		updateComponent<FrameComponent>('frame', key, value);
	}

	function updateStampComponent(key: keyof Omit<StampComponent, 'type' | 'id'>, value: unknown) {
		updateComponent<StampComponent>('stamp', key, value);
	}

	function updateIconSelection(icon: { iconData: IconData; iconName: string }) {
		if (!selectedContainerId) return;
		pushHistory();
		containers = containers.map((c) => {
			if (c.id !== selectedContainerId) return c;
			return {
				...c,
				components: c.components.map((comp) =>
					comp.type === 'icon' ? { ...comp, iconData: icon.iconData, iconName: icon.iconName } : comp
				)
			};
		});
	}

	function updateBorderGlow(key: string, value: unknown) {
		if (!selectedContainerId) return;
		const container = containers.find((c) => c.id === selectedContainerId);
		if (!container) return;
		const border = getComponentByType(container, 'border');
		if (!border?.glow) return;
		pushHistory();
		containers = containers.map((c) =>
			c.id === selectedContainerId
				? {
						...c,
						components: c.components.map((comp) =>
							comp.type === 'border' && comp.glow ? { ...comp, glow: { ...comp.glow, [key]: value } } : comp
						)
					}
				: c
		);
	}

	function updateBorderHolographic(key: string, value: unknown) {
		if (!selectedContainerId) return;
		const container = containers.find((c) => c.id === selectedContainerId);
		if (!container) return;
		const border = getComponentByType(container, 'border');
		if (!border?.holographic) return;
		pushHistory();
		containers = containers.map((c) =>
			c.id === selectedContainerId
				? {
						...c,
						components: c.components.map((comp) =>
							comp.type === 'border' && comp.holographic
								? { ...comp, holographic: { ...comp.holographic, [key]: value } }
								: comp
						)
					}
				: c
		);
	}

	function moveComponentUp(componentId: string) {
		if (!selectedContainerId) return;
		const container = containers.find((c) => c.id === selectedContainerId);
		if (!container) return;
		const index = container.components.findIndex((c) => c.id === componentId);
		if (index <= 0) return;
		pushHistory();
		const newComponents = [...container.components];
		[newComponents[index - 1], newComponents[index]] = [newComponents[index], newComponents[index - 1]];
		containers = containers.map((c) => (c.id === selectedContainerId ? { ...c, components: newComponents } : c));
	}

	function moveComponentDown(componentId: string) {
		if (!selectedContainerId) return;
		const container = containers.find((c) => c.id === selectedContainerId);
		if (!container) return;
		const index = container.components.findIndex((c) => c.id === componentId);
		if (index < 0 || index >= container.components.length - 1) return;
		pushHistory();
		const newComponents = [...container.components];
		[newComponents[index], newComponents[index + 1]] = [newComponents[index + 1], newComponents[index]];
		containers = containers.map((c) => (c.id === selectedContainerId ? { ...c, components: newComponents } : c));
	}

	function toggleComponentVisibility(componentId: string) {
		if (!selectedContainerId) return;
		pushHistory();
		containers = containers.map((c) =>
			c.id === selectedContainerId
				? { ...c, components: c.components.map((comp) => (comp.id === componentId ? { ...comp, visible: !comp.visible } : comp)) }
				: c
		);
	}

	// Panel toggle
	function togglePanel(panelId: string) {
		const newSet = new Set(expandedPanels);
		if (newSet.has(panelId)) {
			newSet.delete(panelId);
		} else {
			newSet.add(panelId);
		}
		expandedPanels = newSet;
	}

	// Drag and drop for hierarchy
	function handleDragStart(id: string) {
		draggedContainerId = id;
	}

	function handleDragOver(e: DragEvent, id: string) {
		e.preventDefault();
		dragOverContainerId = id;
	}

	function handleDrop(e: DragEvent, targetId: string) {
		e.preventDefault();
		if (!draggedContainerId || draggedContainerId === targetId) {
			draggedContainerId = null;
			dragOverContainerId = null;
			return;
		}
		pushHistory();
		const draggedIndex = containers.findIndex((c) => c.id === draggedContainerId);
		const targetIndex = containers.findIndex((c) => c.id === targetId);
		const newContainers = [...containers];
		const [draggedItem] = newContainers.splice(draggedIndex, 1);
		newContainers.splice(targetIndex, 0, draggedItem);
		containers = newContainers;
		draggedContainerId = null;
		dragOverContainerId = null;
	}

	function handleDragEnd() {
		draggedContainerId = null;
		dragOverContainerId = null;
	}

	// Canvas drag/resize
	function startDrag(e: PointerEvent, containerId: string) {
		const container = containers.find((c) => c.id === containerId);
		if (!container || container.locked) return;
		e.preventDefault();
		e.stopPropagation();
		selectedContainerId = containerId;
		canvasInteraction = 'dragging';
		interactionContainerId = containerId;
		interactionStart = { x: e.clientX, y: e.clientY };
		containerStart = { x: container.x, y: container.y, width: container.width, height: container.height };
	}

	function startResize(e: PointerEvent, containerId: string, handle: ResizeHandle) {
		const container = containers.find((c) => c.id === containerId);
		if (!container || container.locked) return;
		e.preventDefault();
		e.stopPropagation();
		canvasInteraction = 'resizing';
		interactionContainerId = containerId;
		activeResizeHandle = handle;
		interactionStart = { x: e.clientX, y: e.clientY };
		containerStart = { x: container.x, y: container.y, width: container.width, height: container.height };
	}

	function handleCanvasPointerMove(e: PointerEvent) {
		if (canvasInteraction === 'idle' || !interactionStart || !containerStart || !interactionContainerId) return;
		snapToGrid = e.shiftKey;
		const dx = (e.clientX - interactionStart.x) / CANVAS_SCALE;
		const dy = (e.clientY - interactionStart.y) / CANVAS_SCALE;

		if (canvasInteraction === 'dragging') {
			let newX = Math.round(containerStart.x + dx);
			let newY = Math.round(containerStart.y + dy);
			if (snapToGrid) {
				newX = Math.round(newX / GRID_SIZE) * GRID_SIZE;
				newY = Math.round(newY / GRID_SIZE) * GRID_SIZE;
			}
			newX = Math.max(0, Math.min(CARD_WIDTH - containerStart.width, newX));
			newY = Math.max(0, Math.min(CARD_HEIGHT - containerStart.height, newY));
			containers = containers.map((c) => (c.id === interactionContainerId ? { ...c, x: newX, y: newY } : c));
		} else if (canvasInteraction === 'resizing' && activeResizeHandle) {
			let newX = containerStart.x;
			let newY = containerStart.y;
			let newWidth = containerStart.width;
			let newHeight = containerStart.height;
			const minSize = 20;

			if (activeResizeHandle.includes('w')) {
				newX = Math.round(containerStart.x + dx);
				newWidth = Math.round(containerStart.width - dx);
				if (snapToGrid) {
					newX = Math.round(newX / GRID_SIZE) * GRID_SIZE;
					newWidth = containerStart.x + containerStart.width - newX;
				}
				if (newWidth < minSize) {
					newWidth = minSize;
					newX = containerStart.x + containerStart.width - minSize;
				}
				if (newX < 0) {
					newWidth += newX;
					newX = 0;
				}
			} else if (activeResizeHandle.includes('e')) {
				newWidth = Math.round(containerStart.width + dx);
				if (snapToGrid) {
					const newRight = Math.round((containerStart.x + newWidth) / GRID_SIZE) * GRID_SIZE;
					newWidth = newRight - containerStart.x;
				}
				if (newWidth < minSize) newWidth = minSize;
				if (newX + newWidth > CARD_WIDTH) newWidth = CARD_WIDTH - newX;
			}

			if (activeResizeHandle.includes('n')) {
				newY = Math.round(containerStart.y + dy);
				newHeight = Math.round(containerStart.height - dy);
				if (snapToGrid) {
					newY = Math.round(newY / GRID_SIZE) * GRID_SIZE;
					newHeight = containerStart.y + containerStart.height - newY;
				}
				if (newHeight < minSize) {
					newHeight = minSize;
					newY = containerStart.y + containerStart.height - minSize;
				}
				if (newY < 0) {
					newHeight += newY;
					newY = 0;
				}
			} else if (activeResizeHandle.includes('s')) {
				newHeight = Math.round(containerStart.height + dy);
				if (snapToGrid) {
					const newBottom = Math.round((containerStart.y + newHeight) / GRID_SIZE) * GRID_SIZE;
					newHeight = newBottom - containerStart.y;
				}
				if (newHeight < minSize) newHeight = minSize;
				if (newY + newHeight > CARD_HEIGHT) newHeight = CARD_HEIGHT - newY;
			}

			containers = containers.map((c) =>
				c.id === interactionContainerId ? { ...c, x: newX, y: newY, width: newWidth, height: newHeight } : c
			);
		}
	}

	function handleCanvasPointerUp() {
		if (canvasInteraction !== 'idle' && interactionContainerId) {
			pushHistory();
		}
		canvasInteraction = 'idle';
		interactionContainerId = null;
		interactionStart = null;
		containerStart = null;
		activeResizeHandle = null;
	}

	// Zoom controls
	function zoomIn() {
		zoomLevel = Math.min(200, zoomLevel + 25);
	}

	function zoomOut() {
		zoomLevel = Math.max(50, zoomLevel - 25);
	}

	function resetZoom() {
		zoomLevel = 100;
	}

	// Nudge with arrow keys
	function nudgeContainer(dx: number, dy: number) {
		if (!selectedContainer || selectedContainer.locked) return;
		pushHistory();
		let newX = selectedContainer.x + dx;
		let newY = selectedContainer.y + dy;
		newX = Math.max(0, Math.min(CARD_WIDTH - selectedContainer.width, newX));
		newY = Math.max(0, Math.min(CARD_HEIGHT - selectedContainer.height, newY));
		containers = containers.map((c) => (c.id === selectedContainerId ? { ...c, x: newX, y: newY } : c));
	}

	// Save/load template
	function saveTemplate() {
		const savedTemplate = {
			id: `template-${Date.now()}`,
			name: templateName,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			template,
			editorState: containers
		};
		const blob = new Blob([JSON.stringify(savedTemplate, null, '\t')], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `${templateName.toLowerCase().replace(/\s+/g, '-')}.json`;
		a.click();
		URL.revokeObjectURL(url);
	}

	function loadTemplate(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onload = (e) => {
			try {
				const data = JSON.parse(e.target?.result as string);
				if (data.editorState) {
					pushHistory();
					containers = data.editorState;
					templateName = data.name || 'Loaded Template';
					selectedContainerId = containers.length > 0 ? containers[0].id : null;
				}
			} catch {
				alert('Invalid template file');
			}
		};
		reader.readAsText(file);
		input.value = '';
	}

	// Check if in text input
	function isInTextInput(): boolean {
		const tag = document.activeElement?.tagName;
		return tag === 'INPUT' || tag === 'TEXTAREA';
	}

	// Keyboard shortcuts
	function handleKeydown(e: KeyboardEvent) {
		if (e.metaKey || e.ctrlKey) {
			if (e.key === 'z' && !e.shiftKey) {
				e.preventDefault();
				undo();
			} else if ((e.key === 'z' && e.shiftKey) || e.key === 'y') {
				e.preventDefault();
				redo();
			} else if (e.key === 'c') {
				e.preventDefault();
				copyContainer();
			} else if (e.key === 'v') {
				e.preventDefault();
				pasteContainer();
			} else if (e.key === '=' || e.key === '+') {
				e.preventDefault();
				zoomIn();
			} else if (e.key === '-') {
				e.preventDefault();
				zoomOut();
			} else if (e.key === '0') {
				e.preventDefault();
				resetZoom();
			} else if (e.key === '/') {
				e.preventDefault();
				showHelp = !showHelp;
			}
			return;
		}

		if (isInTextInput()) return;

		switch (e.key) {
			case 'g':
				showGrid = !showGrid;
				break;
			case 'h':
				if (selectedContainerId) toggleVisibility(selectedContainerId);
				break;
			case 'l':
				if (selectedContainerId) toggleLock(selectedContainerId);
				break;
			case 'Escape':
				selectedContainerId = null;
				break;
			case 'Delete':
			case 'Backspace':
				if (selectedContainer && !selectedContainer.locked) deleteContainer();
				break;
			case '?':
				showHelp = !showHelp;
				break;
			case 'ArrowUp':
				e.preventDefault();
				nudgeContainer(0, e.shiftKey ? -10 : -1);
				break;
			case 'ArrowDown':
				e.preventDefault();
				nudgeContainer(0, e.shiftKey ? 10 : 1);
				break;
			case 'ArrowLeft':
				e.preventDefault();
				nudgeContainer(e.shiftKey ? -10 : -1, 0);
				break;
			case 'ArrowRight':
				e.preventDefault();
				nudgeContainer(e.shiftKey ? 10 : 1, 0);
				break;
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} onpointermove={handleCanvasPointerMove} onpointerup={handleCanvasPointerUp} />

<div class="flex h-[calc(100vh-100px)] gap-4">
	<!-- Left: Hierarchy Panel -->
	<HierarchyPanel
		{containers}
		bind:selectedContainerId
		{expandedPanels}
		bind:templateName
		{template}
		onTogglePanel={togglePanel}
		onToggleVisibility={toggleVisibility}
		onToggleComponentVisibility={toggleComponentVisibility}
		onMoveContainerUp={moveContainerUp}
		onMoveContainerDown={moveContainerDown}
		onMoveComponentUp={moveComponentUp}
		onMoveComponentDown={moveComponentDown}
		onDragStart={handleDragStart}
		onDragOver={handleDragOver}
		onDrop={handleDrop}
		onDragEnd={handleDragEnd}
		onSaveTemplate={saveTemplate}
		onLoadTemplate={loadTemplate}
		{dragOverContainerId}
	/>

	<!-- Center: Canvas -->
	<div class="flex flex-col gap-4">
		<CanvasControls
			bind:zoomLevel
			bind:showGrid
			bind:previewMode
			onZoomIn={zoomIn}
			onZoomOut={zoomOut}
			onResetZoom={resetZoom}
			onShowHelp={() => (showHelp = true)}
		/>

		<CanvasPreview
			{template}
			{previewData}
			{containers}
			bind:selectedContainerId
			{zoomLevel}
			{showGrid}
			{canvasInteraction}
			{interactionContainerId}
			{activeResizeHandle}
			{isTransitioning}
			canvasScale={CANVAS_SCALE}
			onStartDrag={startDrag}
			onStartResize={startResize}
		/>

		<!-- Preview Data Selector (when in data mode) -->
		{#if previewMode === 'data'}
			<Card.Root>
				<Card.Content class="space-y-2 px-3 py-2">
					<div class="flex gap-2">
						<Select.Root type="single" value={selectedDataset} onValueChange={(v) => v && handleDatasetChange(v as 'xbox' | 'playstation' | 'steam')}>
							<Select.Trigger class="flex-1">
								{datasets[selectedDataset].name}
							</Select.Trigger>
							<Select.Content>
								<Select.Item value="xbox" label="Xbox Games" />
								<Select.Item value="playstation" label="PlayStation Games" />
								<Select.Item value="steam" label="Steam Games" />
							</Select.Content>
						</Select.Root>
						<Select.Root type="single" value={String(selectedCardIndex)} onValueChange={(v) => v && (selectedCardIndex = parseInt(v))}>
							<Select.Trigger class="flex-1">
								{currentDataset.cards[selectedCardIndex] ? getCardDisplayName(currentDataset.cards[selectedCardIndex] as AnyCard) : 'Select card'}
							</Select.Trigger>
							<Select.Content>
								{#each currentDataset.cards as card, i (i)}
									<Select.Item value={String(i)} label={getCardDisplayName(card as AnyCard)} />
								{/each}
							</Select.Content>
						</Select.Root>
					</div>
				</Card.Content>
			</Card.Root>
		{/if}
	</div>

	<!-- Right: Properties Panel -->
	<PropertiesPanel
		container={selectedContainer}
		dataFields={currentDataFields}
		{expandedPanels}
		{canUndo}
		{canRedo}
		onAddContainer={addContainer}
		onUndo={undo}
		onRedo={redo}
		onTogglePanel={togglePanel}
		onUpdateContainer={updateContainer}
		onDuplicateContainer={duplicateContainer}
		onDeleteContainer={deleteContainer}
		onAddTextComponent={addTextComponent}
		onAddImageComponent={addImageComponent}
		onAddBackgroundComponent={addBackgroundComponent}
		onAddBorderComponent={addBorderComponent}
		onAddIconComponent={addIconComponent}
		onAddBadgeComponent={addBadgeComponent}
		onAddStatPanelComponent={addStatPanelComponent}
		onAddDividerComponent={addDividerComponent}
		onAddProgressBarComponent={addProgressBarComponent}
		onAddRibbonComponent={addRibbonComponent}
		onAddFrameComponent={addFrameComponent}
		onAddStampComponent={addStampComponent}
		onUpdateTextComponent={updateTextComponent}
		onUpdateImageComponent={updateImageComponent}
		onUpdateBackgroundComponent={updateBackgroundComponent}
		onUpdateBorderComponent={updateBorderComponent}
		onUpdateBorderGlow={updateBorderGlow}
		onUpdateBorderHolographic={updateBorderHolographic}
		onUpdateIconComponent={updateIconComponent}
		onUpdateIconSelection={updateIconSelection}
		onUpdateBadgeComponent={updateBadgeComponent}
		onUpdateStatPanelComponent={updateStatPanelComponent}
		onUpdateDividerComponent={updateDividerComponent}
		onUpdateProgressBarComponent={updateProgressBarComponent}
		onUpdateRibbonComponent={updateRibbonComponent}
		onUpdateFrameComponent={updateFrameComponent}
		onUpdateStampComponent={updateStampComponent}
		onRemoveComponent={removeComponent}
		onMoveComponentUp={moveComponentUp}
		onMoveComponentDown={moveComponentDown}
	/>
</div>

<HelpModal bind:show={showHelp} />

<FieldRemapDialog
	bind:show={showRemapDialog}
	{unmappedFields}
	sourceDataset={selectedDataset}
	targetDataset={pendingDataset ?? selectedDataset}
	targetDataFields={pendingDataset ? datasets[pendingDataset].dataFields : currentDataFields}
	onApply={applyRemapping}
	onSkip={skipRemapping}
/>
