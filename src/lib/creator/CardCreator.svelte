<script lang="ts">
	import { PersistedState, PressedKeys, IsIdle } from 'runed';
	import { MediaQuery } from 'svelte/reactivity';
	import { registerComponent, Group } from '$lib';
	import { GradientBackground, Image, PatternBackground, SolidBackground } from '$lib/card/backgrounds';
	import { Border } from '$lib/card/borders';
	import { TextField, StatPanel, List } from '$lib/card/fields';
	import { Icon } from '$lib/card/icons';
	import type { IconData } from '$lib/card/icons';
	import { Divider, ProgressBar, Ribbon, Frame, IconRating } from '$lib/card/decorations';
	import { CARD_WIDTH, CARD_HEIGHT } from '$lib/types';
	import type { CardTemplate } from '$lib/types';
	import * as Card from '$lib/creator/ui/card';
	import * as Resizable from '$lib/creator/ui/resizable';
	import * as Drawer from '$lib/creator/ui/drawer';
	import { Button } from '$lib/creator/ui/button';
	import PanelLeft from '@lucide/svelte/icons/panel-left';
	import Layers from '@lucide/svelte/icons/layers';

	import HierarchyPanel from './components/layout/HierarchyPanel.svelte';
	import TopBar from './components/layout/TopBar.svelte';
	import CanvasControls from './components/controls/CanvasControls.svelte';
	import CanvasPreview from './components/CanvasPreview.svelte';
	import PropertiesPanel from './components/layout/PropertiesPanel.svelte';
	import HelpModal from './components/dialogs/HelpModal.svelte';
	import FieldRemapDialog from './components/dialogs/FieldRemapDialog.svelte';
	import RestoreDraftDialog from './components/dialogs/RestoreDraftDialog.svelte';
	import ExportDialog from './components/dialogs/ExportDialog.svelte';
	import { downloadSVG, downloadPNGClient } from '$lib/export/downloadSVG';
import { extractFontsFromCard, loadGoogleFonts } from '$lib/fonts';

	import type {
		ContainerState,
		ComponentItem,
		BorderComponent,
		ResizeHandle,
		DataFieldOption
	} from './types.js';

	import {
		createInitialCardBackground,
		createContainer,
		createTextComponent,
		createImageComponent,
		createBackgroundComponent,
		createBorderComponent,
		createIconComponent,
		createStatPanelComponent,
		createDividerComponent,
		createProgressBarComponent,
		createRibbonComponent,
		createFrameComponent,
		createListComponent,
		createIconRatingComponent,
		generateId,
		getComponentByType,
		hasComponentType,
		buildTemplate,
		buildPreviewData
	} from './state.svelte.js';

	// =============================================================================
	// PROPS - Consumer configures the creator via these
	// =============================================================================

	interface Dataset {
		id: string;
		name: string;
		dataFields: DataFieldOption[];
		cards: Record<string, unknown>[];
	}

	interface Props {
		/** Available datasets for preview */
		datasets: Record<string, Dataset>;
		/** Initial dataset to use */
		initialDataset?: string;
		/** Initial template to load (editor state) */
		initialTemplate?: ContainerState[];
		/** Initial template name */
		initialTemplateName?: string;
		/** Callback when template is saved */
		onSave?: (data: { template: CardTemplate; editorState: ContainerState[]; name: string }) => void;
		/** Callback when template changes */
		onChange?: (data: { template: CardTemplate; editorState: ContainerState[] }) => void;
		/** Show help button */
		showHelpButton?: boolean;
		/** CSS class for the container */
		class?: string;
	}

	let {
		datasets,
		initialDataset,
		initialTemplate,
		initialTemplateName = 'New Template',
		onSave,
		onChange,
		showHelpButton = true,
		class: className = ''
	}: Props = $props();

	// =============================================================================
	// COMPONENT REGISTRATION
	// =============================================================================

	// Register all built-in components
	registerComponent('Group', Group);
	registerComponent('GradientBackground', GradientBackground);
	registerComponent('SolidBackground', SolidBackground);
	registerComponent('Image', Image);
	registerComponent('PatternBackground', PatternBackground);
	registerComponent('Border', Border);
	registerComponent('TextField', TextField);
	registerComponent('Icon', Icon);
	registerComponent('StatPanel', StatPanel);
	registerComponent('Divider', Divider);
	registerComponent('ProgressBar', ProgressBar);
	registerComponent('Ribbon', Ribbon);
	registerComponent('Frame', Frame);
	registerComponent('List', List);
	registerComponent('IconRating', IconRating);

	// =============================================================================
	// STATE
	// =============================================================================

	// Template state
	let templateName = $state(initialTemplateName);
	let containers = $state<ContainerState[]>(initialTemplate ?? [createInitialCardBackground()]);
	let selectedContainerId = $state<string | null>(containers[0]?.id ?? null);
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
			'addcomponent'
		])
	);

	// Preview data
	const datasetKeys = $derived(Object.keys(datasets));
	let selectedDataset = $state(initialDataset ?? datasetKeys[0] ?? '');
	let selectedCardIndex = $state(0);
	const currentDataset = $derived(datasets[selectedDataset]);
	const currentCard = $derived(currentDataset?.cards[selectedCardIndex] as Record<string, unknown> | undefined);
	const currentDataFields = $derived(currentDataset?.dataFields ?? []);

	// Helper to get display name from any card type
	function getCardDisplayName(card: Record<string, unknown>): string {
		// Try common name fields
		if (typeof card.gameName === 'string') return card.gameName;
		if (typeof card.appName === 'string') return card.appName;
		if (typeof card.title === 'string') return card.title;
		if (typeof card.name === 'string') return card.name;
		return 'Untitled';
	}

	// Derived data for CanvasControls dataset selector
	const datasetOptions = $derived(datasetKeys.map(key => ({ id: key, name: datasets[key].name })));
	const cardOptions = $derived(
		currentDataset?.cards.map((card, i) => ({
			index: i,
			name: getCardDisplayName(card as Record<string, unknown>)
		})) ?? []
	);

	// Field remapping state
	let showRemapDialog = $state(false);
	let pendingDataset = $state<string | null>(null);
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
	function handleDatasetChange(newDataset: string) {
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

	// Dynamic center pane sizing based on card width
	let paneGroupElement = $state<HTMLElement | null>(null);
	let paneGroupWidth = $state(1200); // Default fallback
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let paneGroupApi = $state<any>(null);

	// Card width in pixels = 375 * zoom + padding (border ~2px, container p-1 ~4px each side = ~12px total)
	const cardWidthPx = $derived(375 * zoomScale + 12);
	// Convert to percentage of pane group width, with min 30% and max 80%
	const centerMinSize = $derived(
		Math.min(80, Math.max(30, Math.ceil((cardWidthPx / paneGroupWidth) * 100)))
	);

	// Keep center pane exactly at card size by adjusting both side panels equally
	let lastCenterMinSize = $state(30);
	$effect(() => {
		if (!paneGroupApi?.getLayout || centerMinSize === lastCenterMinSize) return;

		const currentLayout = paneGroupApi.getLayout();
		if (!currentLayout || currentLayout.length !== 3) return;

		const [left, , right] = currentLayout;
		const totalSides = left + right;

		// Always set center to exactly centerMinSize, distribute remaining space to sides
		if (totalSides > 0) {
			const newCenter = centerMinSize;
			const remainingSpace = 100 - newCenter;
			const leftRatio = left / totalSides;
			const newLeft = Math.max(15, Math.min(35, remainingSpace * leftRatio));
			const newRight = Math.max(15, remainingSpace - newLeft);
			paneGroupApi.setLayout([newLeft, newCenter, newRight]);
		}

		lastCenterMinSize = centerMinSize;
	});

	// Grid size (replaces imported GRID_SIZE constant for reactivity)
	const GRID_SIZE_OPTIONS = [10, 25, 50] as const;
	let gridSize = $state<number>(25);

	function cycleGridSize() {
		const currentIndex = GRID_SIZE_OPTIONS.indexOf(gridSize as 10 | 25 | 50);
		const nextIndex = (currentIndex + 1) % GRID_SIZE_OPTIONS.length;
		gridSize = GRID_SIZE_OPTIONS[nextIndex];
	}

	// Snap to grid
	let snapToGrid = $state(false);

	// Clipboard for copy/paste
	let clipboard = $state<ContainerState | null>(null);

	// Help modal
	let showHelp = $state(false);

	// Export dialog
	let showExportDialog = $state(false);
	let canvasSvgElement = $state<SVGSVGElement | null>(null);

	// =============================================================================
	// RESPONSIVE BREAKPOINTS
	// =============================================================================

	const isDesktop = new MediaQuery('min-width: 1024px');
	const isTablet = new MediaQuery('min-width: 640px');
	const isMobile = new MediaQuery('max-width: 639px');

	// Drawer state for tablet/mobile
	let propertiesDrawerOpen = $state(false);
	let hierarchyDrawerOpen = $state(false);

	// =============================================================================
	// AUTO-SAVE DRAFT (PersistedState + IsIdle)
	// =============================================================================

	interface DraftData {
		containers: ContainerState[];
		templateName: string;
		timestamp: number;
	}

	// Auto-save draft to localStorage
	const draft = new PersistedState<DraftData | null>('card-creator-draft', null);

	// Track user idle state - save only when user pauses (2 seconds of inactivity)
	const idle = new IsIdle({ timeout: 2000 });

	// Track if there are unsaved changes
	let hasUnsavedChanges = $state(false);

	// Show restore dialog state
	let showRestoreDraftDialog = $state(false);

	// Helper to format time ago
	function formatTimeAgo(timestamp: number): string {
		const seconds = Math.floor((Date.now() - timestamp) / 1000);
		if (seconds < 60) return 'just now';
		const minutes = Math.floor(seconds / 60);
		if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
		const hours = Math.floor(minutes / 60);
		if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
		const days = Math.floor(hours / 24);
		return `${days} day${days > 1 ? 's' : ''} ago`;
	}

	// Check for existing draft on mount (only if no initial template)
	let hasCheckedDraft = $state(false);
	$effect(() => {
		if (hasCheckedDraft) return;
		hasCheckedDraft = true;

		if (draft.current && !initialTemplate) {
			const age = Date.now() - draft.current.timestamp;
			const isRecent = age < 24 * 60 * 60 * 1000; // 24 hours
			if (isRecent && draft.current.containers.length > 0) {
				showRestoreDraftDialog = true;
			}
		}
	});

	// Mark as having unsaved changes when containers or templateName change
	$effect(() => {
		// Access reactive values to track them
		containers;
		templateName;
		// Mark as having unsaved changes (skip initial render)
		if (hasCheckedDraft) {
			hasUnsavedChanges = true;
		}
	});

	// Save draft when user becomes idle AND there are unsaved changes
	$effect(() => {
		if (idle.current && hasUnsavedChanges && canvasInteraction === 'idle' && !isTransitioning) {
			try {
				draft.current = {
					containers: $state.snapshot(containers) as ContainerState[],
					templateName,
					timestamp: Date.now()
				};
				hasUnsavedChanges = false;
			} catch {
				// Silently fail if localStorage is full or unavailable
			}
		}
	});

	// Restore draft
	function restoreDraft() {
		if (draft.current) {
			containers = draft.current.containers;
			templateName = draft.current.templateName;
			selectedContainerId = containers.length > 0 ? containers[0].id : null;
			// Reset history after restore
			history = [];
			historyIndex = -1;
		}
		showRestoreDraftDialog = false;
	}

	// Discard draft and start fresh
	function discardDraft() {
		showRestoreDraftDialog = false;
	}

	// Clear draft (called after explicit save)
	function clearDraft() {
		draft.current = null;
	}

	// Build template and preview data
	const template = $derived(buildTemplate(templateName, containers));
	const previewData = $derived(buildPreviewData(previewMode, currentCard ?? {}, currentDataFields));

	// Notify onChange when template changes
	$effect(() => {
		onChange?.({ template, editorState: containers });
	});

	// Auto-load Google Fonts when containers change (e.g., template loaded)
	$effect(() => {
		const fonts = extractFontsFromCard(containers);
		if (fonts.length > 0) {
			loadGoogleFonts(fonts);
		}
	});

	// Track pane group width for dynamic center sizing
	$effect(() => {
		if (!paneGroupElement) return;

		const observer = new ResizeObserver((entries) => {
			for (const entry of entries) {
				paneGroupWidth = entry.contentRect.width;
			}
		});

		observer.observe(paneGroupElement);
		paneGroupWidth = paneGroupElement.clientWidth;

		return () => observer.disconnect();
	});

	// =============================================================================
	// HISTORY
	// =============================================================================

	/** Maximum history size to prevent memory bloat */
	const MAX_HISTORY_SIZE = 50;

	function pushHistory() {
		let newHistory = history.slice(0, historyIndex + 1);
		// Use $state.snapshot to get a plain object from the reactive proxy before cloning
		newHistory.push(structuredClone($state.snapshot(containers)));

		// Enforce history limit
		if (newHistory.length > MAX_HISTORY_SIZE) {
			newHistory = newHistory.slice(-MAX_HISTORY_SIZE);
		}

		history = newHistory;
		historyIndex = newHistory.length - 1;
	}

	function undo() {
		if (!canUndo) return;
		isTransitioning = true;
		historyIndex--;
		// Use $state.snapshot since history is reactive
		containers = structuredClone($state.snapshot(history)[historyIndex]);
		setTimeout(() => (isTransitioning = false), 50);
	}

	function redo() {
		if (!canRedo) return;
		isTransitioning = true;
		historyIndex++;
		// Use $state.snapshot since history is reactive
		containers = structuredClone($state.snapshot(history)[historyIndex]);
		setTimeout(() => (isTransitioning = false), 50);
	}

	// =============================================================================
	// CONTAINER MANAGEMENT
	// =============================================================================

	function addContainer() {
		const containerNumber = containers.length + 1;
		const newContainer = createContainer(containerNumber);
		pushHistory();
		containers = [...containers, newContainer];
		selectedContainerId = newContainer.id;
		propertiesPanelTab = 'layer';
	}

	function addContainerFromTemplate(templateId: string) {
		const containerNumber = containers.length + 1;
		const newContainer = createContainer(containerNumber);

		// Add components based on template
		switch (templateId) {
			case 'title':
				// Title block: background + text
				newContainer.name = `Title ${containerNumber}`;
				newContainer.height = 80;
				newContainer.components = [
					createBackgroundComponent(),
					createTextComponent()
				];
				break;
			case 'image-frame':
				// Image frame: border + image
				newContainer.name = `Image ${containerNumber}`;
				newContainer.components = [
					createBorderComponent(),
					createImageComponent()
				];
				break;
			case 'stats-block':
				// Stats block: background + stats
				newContainer.name = `Stats ${containerNumber}`;
				newContainer.height = 150;
				newContainer.components = [
					createBackgroundComponent(),
					createStatPanelComponent()
				];
				break;
			case 'card-base':
				// Card base: full card with background + border
				newContainer.name = `Card Base`;
				newContainer.x = 0;
				newContainer.y = 0;
				newContainer.width = CARD_WIDTH;
				newContainer.height = CARD_HEIGHT;
				newContainer.components = [
					createBackgroundComponent(),
					createBorderComponent()
				];
				break;
		}

		pushHistory();
		containers = [...containers, newContainer];
		selectedContainerId = newContainer.id;
		propertiesPanelTab = 'layer';
	}

	function duplicateContainerById(containerId: string) {
		const containerToDuplicate = containers.find(c => c.id === containerId);
		if (!containerToDuplicate) return;
		pushHistory();
		const newContainer: ContainerState = {
			...structuredClone($state.snapshot(containerToDuplicate)),
			id: generateId(),
			name: `${containerToDuplicate.name} (copy)`,
			y: containerToDuplicate.y + 20,
			x: containerToDuplicate.x + 20
		};
		containers = [...containers, newContainer];
		selectedContainerId = newContainer.id;
		propertiesPanelTab = 'layer';
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
			...structuredClone($state.snapshot(selectedContainer)),
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
		clipboard = structuredClone($state.snapshot(selectedContainer));
	}

	function pasteContainer() {
		if (!clipboard) return;
		pushHistory();
		const newContainer: ContainerState = {
			...structuredClone(clipboard),
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

	function renameContainer(containerId: string, newName: string) {
		pushHistory();
		containers = containers.map((c) => (c.id === containerId ? { ...c, name: newName } : c));
	}

	// =============================================================================
	// COMPONENT MANAGEMENT
	// =============================================================================

	// Component factory map - maps type names to their factory functions
	const componentFactories: Record<ComponentItem['type'], () => ComponentItem> = {
		text: createTextComponent,
		image: createImageComponent,
		background: createBackgroundComponent,
		border: createBorderComponent,
		icon: createIconComponent,
		statpanel: createStatPanelComponent,
		divider: createDividerComponent,
		progressbar: createProgressBarComponent,
		ribbon: createRibbonComponent,
		frame: createFrameComponent,
		list: createListComponent,
		iconrating: createIconRatingComponent
	};

	// Active tab in properties panel (for auto-switching after adding component)
	let propertiesPanelTab = $state<'layer' | 'components'>('layer');

	// Selected component ID for visual feedback
	let selectedComponentId = $state<string | null>(null);

	function selectComponent(componentId: string | null) {
		selectedComponentId = componentId;
	}

	/**
	 * Generic function to add a component to the selected container.
	 * Prevents duplicate component types per container.
	 * Adds to the START of the components array and auto-selects it.
	 */
	function addComponent(type: ComponentItem['type']) {
		if (!selectedContainerId) return;
		const container = containers.find((c) => c.id === selectedContainerId);
		if (!container || hasComponentType(container, type)) return;
		pushHistory();
		const newComponent = componentFactories[type]();
		containers = containers.map((c) =>
			c.id === selectedContainerId
				? { ...c, components: [newComponent, ...c.components] }
				: c
		);
		// Switch to Components tab, expand the panel, and select the new component
		propertiesPanelTab = 'components';
		selectedComponentId = newComponent.id;
		const panelId = `comp-${type}`;
		if (!expandedPanels.has(panelId)) {
			expandedPanels = new Set([...expandedPanels, panelId]);
		}
	}

	// Type-safe component adders (thin wrappers for API compatibility)
	const addTextComponent = () => addComponent('text');
	const addImageComponent = () => addComponent('image');
	const addBackgroundComponent = () => addComponent('background');

	// Border adder - also syncs text padding with new border's default width
	function addBorderComponent() {
		if (!selectedContainerId) return;
		const container = containers.find((c) => c.id === selectedContainerId);
		if (!container || hasComponentType(container, 'border')) return;
		pushHistory();
		const newBorder = componentFactories['border']() as BorderComponent;
		const borderWidth = newBorder.width;

		containers = containers.map((c) => {
			if (c.id !== selectedContainerId) return c;
			// Add border and sync text padding
			const updatedComponents = c.components.map((comp) =>
				comp.type === 'text' ? { ...comp, padding: borderWidth } : comp
			);
			return { ...c, components: [newBorder, ...updatedComponents] };
		});

		propertiesPanelTab = 'components';
		selectedComponentId = newBorder.id;
		if (!expandedPanels.has('comp-border')) {
			expandedPanels = new Set([...expandedPanels, 'comp-border']);
		}
	}
	const addIconComponent = () => addComponent('icon');
	const addStatPanelComponent = () => addComponent('statpanel');
	const addDividerComponent = () => addComponent('divider');
	const addProgressBarComponent = () => addComponent('progressbar');
	const addRibbonComponent = () => addComponent('ribbon');
	const addFrameComponent = () => addComponent('frame');
	const addListComponent = () => addComponent('list');
	const addIconRatingComponent = () => addComponent('iconrating');

	function removeComponent(type: ComponentItem['type']) {
		if (!selectedContainerId) return;
		pushHistory();
		containers = containers.map((c) => {
			if (c.id !== selectedContainerId) return c;
			return { ...c, components: c.components.filter((comp) => comp.type !== type) };
		});
	}

	/**
	 * Generic function to update a component property.
	 */
	function updateComponent(type: ComponentItem['type'], key: string, value: unknown) {
		if (!selectedContainerId) return;
		pushHistory();
		containers = containers.map((c) =>
			c.id === selectedContainerId
				? { ...c, components: c.components.map((comp) => (comp.type === type ? { ...comp, [key]: value } : comp)) }
				: c
		);
	}

	// Type-safe component updaters (thin wrappers for API compatibility)
	const updateTextComponent = (key: string, value: unknown) => updateComponent('text', key, value);
	const updateImageComponent = (key: string, value: unknown) => updateComponent('image', key, value);
	const updateBackgroundComponent = (key: string, value: unknown) => updateComponent('background', key, value);

	// Border component updater - also syncs text padding with border width
	function updateBorderComponent(key: string, value: unknown) {
		if (!selectedContainerId) return;
		pushHistory();
		containers = containers.map((c) => {
			if (c.id !== selectedContainerId) return c;

			const updatedComponents = c.components.map((comp) => {
				if (comp.type === 'border') {
					return { ...comp, [key]: value };
				}
				// Auto-sync text padding with border width
				if (comp.type === 'text' && key === 'width' && typeof value === 'number') {
					return { ...comp, padding: value };
				}
				return comp;
			});

			return { ...c, components: updatedComponents };
		});
	}
	const updateIconComponent = (key: string, value: unknown) => updateComponent('icon', key, value);
	const updateStatPanelComponent = (key: string, value: unknown) => updateComponent('statpanel', key, value);
	const updateDividerComponent = (key: string, value: unknown) => updateComponent('divider', key, value);
	const updateProgressBarComponent = (key: string, value: unknown) => updateComponent('progressbar', key, value);
	const updateRibbonComponent = (key: string, value: unknown) => updateComponent('ribbon', key, value);
	const updateFrameComponent = (key: string, value: unknown) => updateComponent('frame', key, value);
	const updateListComponent = (key: string, value: unknown) => updateComponent('list', key, value);
	const updateIconRatingComponent = (key: string, value: unknown) => updateComponent('iconrating', key, value);

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

	// =============================================================================
	// UI INTERACTIONS
	// =============================================================================

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

	// Clear all component panels (collapse them all)
	function collapseAllComponentPanels() {
		const newSet = new Set(expandedPanels);
		for (const panelId of Array.from(newSet)) {
			if (panelId.startsWith('comp-')) {
				newSet.delete(panelId);
			}
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
		pushHistory(); // Save state BEFORE drag starts
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
		pushHistory(); // Save state BEFORE resize starts
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
				newX = Math.round(newX / gridSize) * gridSize;
				newY = Math.round(newY / gridSize) * gridSize;
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
					newX = Math.round(newX / gridSize) * gridSize;
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
					const newRight = Math.round((containerStart.x + newWidth) / gridSize) * gridSize;
					newWidth = newRight - containerStart.x;
				}
				if (newWidth < minSize) newWidth = minSize;
				if (newX + newWidth > CARD_WIDTH) newWidth = CARD_WIDTH - newX;
			}

			if (activeResizeHandle.includes('n')) {
				newY = Math.round(containerStart.y + dy);
				newHeight = Math.round(containerStart.height - dy);
				if (snapToGrid) {
					newY = Math.round(newY / gridSize) * gridSize;
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
					const newBottom = Math.round((containerStart.y + newHeight) / gridSize) * gridSize;
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
		// History was already pushed at start of drag/resize
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

	// =============================================================================
	// SAVE/LOAD
	// =============================================================================

	function saveTemplate() {
		if (onSave) {
			onSave({
				template,
				editorState: containers,
				name: templateName
			});
		} else {
			// Default: download as JSON file
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
		// Clear auto-save draft after explicit save
		clearDraft();
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

	async function handleExport(options: { format: 'svg' | 'png'; bleedMm: number; scale: number }) {
		if (canvasSvgElement === null) {
			alert('Cannot export: Canvas not ready');
			return;
		}

		const filename = templateName.toLowerCase().replace(/\s+/g, '-') || 'card';

		if (options.format === 'svg') {
			downloadSVG(canvasSvgElement, {
				filename,
				bleedMm: options.bleedMm
			});
		} else {
			try {
				await downloadPNGClient(canvasSvgElement, {
					filename,
					scale: options.scale,
					bleedMm: options.bleedMm
				});
			} catch (error) {
				console.error('Export failed:', error);
				alert('Export failed. Please try again.');
			}
		}
	}

	// =============================================================================
	// KEYBOARD SHORTCUTS (Cross-platform: macOS Cmd / Windows Ctrl)
	// =============================================================================

	const keys = new PressedKeys();

	// Check if in text input (skip single-key shortcuts when typing)
	function isInTextInput(): boolean {
		const tag = document.activeElement?.tagName;
		return tag === 'INPUT' || tag === 'TEXTAREA';
	}

	// Cross-platform modifier check (Cmd on macOS, Ctrl on Windows)
	function hasModifier(e: KeyboardEvent): boolean {
		return e.metaKey || e.ctrlKey;
	}

	// Modifier shortcuts: Cmd/Ctrl + Key (work everywhere, need preventDefault)
	type ModifierShortcut = {
		key: string | string[];
		shift?: boolean;
		action: () => void;
	};

	const modifierShortcuts: ModifierShortcut[] = [
		{ key: 'z', shift: false, action: undo },
		{ key: 'z', shift: true, action: redo },
		{ key: 'y', action: redo },
		{ key: 'c', action: copyContainer },
		{ key: 'v', action: pasteContainer },
		{ key: ['=', '+'], action: zoomIn },
		{ key: '-', action: zoomOut },
		{ key: '0', action: resetZoom },
		{ key: '/', action: () => { showHelp = !showHelp; } }
	];

	// Single-key shortcuts (only when not in text input)
	type SingleKeyShortcut = {
		key: string | string[];
		action: (e: KeyboardEvent) => void;
		requiresSelection?: boolean;
	};

	const singleKeyShortcuts: SingleKeyShortcut[] = [
		{ key: 'g', action: () => { showGrid = !showGrid; } },
		{ key: 'h', action: () => { if (selectedContainerId) toggleVisibility(selectedContainerId); }, requiresSelection: true },
		{ key: 'l', action: () => { if (selectedContainerId) toggleLock(selectedContainerId); }, requiresSelection: true },
		{ key: 'Escape', action: () => { selectedContainerId = null; } },
		{ key: ['Delete', 'Backspace'], action: () => { if (selectedContainer && !selectedContainer.locked) deleteContainer(); }, requiresSelection: true },
		{ key: '?', action: () => { showHelp = !showHelp; } },
		{ key: 'ArrowUp', action: (e) => { e.preventDefault(); nudgeContainer(0, e.shiftKey ? -10 : -1); }, requiresSelection: true },
		{ key: 'ArrowDown', action: (e) => { e.preventDefault(); nudgeContainer(0, e.shiftKey ? 10 : 1); }, requiresSelection: true },
		{ key: 'ArrowLeft', action: (e) => { e.preventDefault(); nudgeContainer(e.shiftKey ? -10 : -1, 0); }, requiresSelection: true },
		{ key: 'ArrowRight', action: (e) => { e.preventDefault(); nudgeContainer(e.shiftKey ? 10 : 1, 0); }, requiresSelection: true }
	];

	function handleKeydown(e: KeyboardEvent) {
		// Handle modifier shortcuts (Cmd/Ctrl + Key)
		if (hasModifier(e)) {
			for (const shortcut of modifierShortcuts) {
				const keyMatches = Array.isArray(shortcut.key)
					? shortcut.key.includes(e.key)
					: e.key === shortcut.key;

				if (keyMatches) {
					// Check shift modifier if specified
					if (shortcut.shift !== undefined && e.shiftKey !== shortcut.shift) continue;

					e.preventDefault();
					shortcut.action();
					return;
				}
			}
			return;
		}

		// Skip single-key shortcuts when typing in inputs
		if (isInTextInput()) return;

		// Handle single-key shortcuts
		for (const shortcut of singleKeyShortcuts) {
			const keyMatches = Array.isArray(shortcut.key)
				? shortcut.key.includes(e.key)
				: e.key === shortcut.key;

			if (keyMatches) {
				shortcut.action(e);
				return;
			}
		}
	}

	// Also register common shortcuts with PressedKeys for reactive state
	// This allows components to check if shortcuts are active
	const isUndoPressed = $derived(keys.has('Meta', 'z') || keys.has('Control', 'z'));
	const isRedoPressed = $derived(keys.has('Meta', 'Shift', 'z') || keys.has('Control', 'Shift', 'z'));
</script>

<svelte:window onkeydown={handleKeydown} onpointermove={handleCanvasPointerMove} onpointerup={handleCanvasPointerUp} />

<div class="flex h-screen flex-col {className}">
	<!-- Top Bar (full width) -->
	<TopBar
		bind:templateName
		hasDraft={!!draft.current}
		lastSaved={draft.current?.timestamp ? new Date(draft.current.timestamp) : null}
		bind:previewMode
		datasets={datasetOptions}
		bind:selectedDataset
		bind:selectedCardIndex
		cards={cardOptions}
		onDatasetChange={handleDatasetChange}
		onSaveTemplate={saveTemplate}
		onLoadTemplate={loadTemplate}
		onExport={() => { showExportDialog = true; }}
	/>

	<!-- Main Content - Desktop: Resizable 3-column layout -->
	{#if isDesktop.current}
		<div bind:this={paneGroupElement} class="flex-1">
		<Resizable.PaneGroup direction="horizontal" class="h-full" autoSaveId="card-creator-panels" bind:this={paneGroupApi}>
			<!-- Left: Properties Panel (editing) -->
			<Resizable.Pane
				defaultSize={25}
				minSize={18}
				maxSize={35}
			>
				<div class="h-full overflow-hidden">
					<PropertiesPanel
						container={selectedContainer}
						dataFields={currentDataFields}
						datasetId={selectedDataset as import('$lib/presets').DatasetId}
						{previewData}
						{expandedPanels}
						bind:activeTab={propertiesPanelTab}
						{selectedComponentId}
						{containers}
						{canUndo}
						{canRedo}
						onAddContainer={addContainer}
						onAddContainerFromTemplate={addContainerFromTemplate}
						onDuplicateContainerById={duplicateContainerById}
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
						onAddStatPanelComponent={addStatPanelComponent}
						onAddDividerComponent={addDividerComponent}
						onAddProgressBarComponent={addProgressBarComponent}
						onAddRibbonComponent={addRibbonComponent}
						onAddFrameComponent={addFrameComponent}
						onAddListComponent={addListComponent}
						onAddIconRatingComponent={addIconRatingComponent}
						onUpdateTextComponent={updateTextComponent}
						onUpdateImageComponent={updateImageComponent}
						onUpdateBackgroundComponent={updateBackgroundComponent}
						onUpdateBorderComponent={updateBorderComponent}
						onUpdateIconComponent={updateIconComponent}
						onUpdateIconSelection={updateIconSelection}
						onUpdateStatPanelComponent={updateStatPanelComponent}
						onUpdateDividerComponent={updateDividerComponent}
						onUpdateProgressBarComponent={updateProgressBarComponent}
						onUpdateRibbonComponent={updateRibbonComponent}
						onUpdateFrameComponent={updateFrameComponent}
						onUpdateListComponent={updateListComponent}
						onUpdateIconRatingComponent={updateIconRatingComponent}
						onRemoveComponent={removeComponent}
						onMoveComponentUp={moveComponentUp}
						onMoveComponentDown={moveComponentDown}
						onSelectComponent={selectComponent}
						onCollapseAllComponentPanels={collapseAllComponentPanels}
					/>
				</div>
			</Resizable.Pane>

			<Resizable.Handle withHandle />

			<!-- Center: Canvas (size is dynamic based on card width at current zoom) -->
			<Resizable.Pane defaultSize={centerMinSize} minSize={centerMinSize}>
				<div class="h-full overflow-auto">
					<div class="flex min-h-full flex-col items-center gap-1 py-1">
					<CanvasControls
						bind:zoomLevel
						bind:showGrid
						bind:gridSize
						onZoomIn={zoomIn}
						onZoomOut={zoomOut}
						onResetZoom={resetZoom}
						onCycleGridSize={cycleGridSize}
						onShowHelp={showHelpButton ? () => { showHelp = true; } : undefined}
					/>

					<CanvasPreview
						{template}
						{previewData}
						{containers}
						bind:selectedContainerId
						bind:svgElement={canvasSvgElement}
						{zoomLevel}
						{showGrid}
							{gridSize}
						{canvasInteraction}
						{interactionContainerId}
						{activeResizeHandle}
						{isTransitioning}
						canvasScale={CANVAS_SCALE}
						onStartDrag={startDrag}
						onStartResize={startResize}
					/>
					</div>
				</div>
			</Resizable.Pane>

			<Resizable.Handle withHandle />

			<!-- Right: Hierarchy Panel (layer management) -->
			<Resizable.Pane
				defaultSize={25}
				minSize={15}
				maxSize={40}
			>
				<div class="h-full overflow-hidden">
					<HierarchyPanel
						{containers}
						bind:selectedContainerId
						{expandedPanels}
						onTogglePanel={togglePanel}
						onToggleVisibility={toggleVisibility}
						onToggleComponentVisibility={toggleComponentVisibility}
						onMoveContainerUp={moveContainerUp}
						onMoveContainerDown={moveContainerDown}
						onMoveComponentUp={moveComponentUp}
						onMoveComponentDown={moveComponentDown}
						onRenameContainer={renameContainer}
						onDragStart={handleDragStart}
						onDragOver={handleDragOver}
						onDrop={handleDrop}
						onDragEnd={handleDragEnd}
						{dragOverContainerId}
					/>
				</div>
			</Resizable.Pane>
		</Resizable.PaneGroup>
		</div>
	{:else if isTablet.current}
		<!-- Tablet: Canvas with side drawers -->
		<div class="flex flex-1 flex-col overflow-hidden">
			<!-- Tablet toolbar with drawer triggers -->
			<div class="flex items-center justify-between border-b bg-card px-3 py-2">
				<Button variant="outline" size="sm" onclick={() => propertiesDrawerOpen = true}>
					<PanelLeft class="mr-2 h-4 w-4" />
					Edit
				</Button>
				<CanvasControls
					bind:zoomLevel
					bind:showGrid
					bind:gridSize
					onZoomIn={zoomIn}
					onZoomOut={zoomOut}
					onResetZoom={resetZoom}
					onCycleGridSize={cycleGridSize}
					onShowHelp={showHelpButton ? () => { showHelp = true; } : undefined}
				/>
				<Button variant="outline" size="sm" onclick={() => hierarchyDrawerOpen = true}>
					<Layers class="mr-2 h-4 w-4" />
					Layers
				</Button>
			</div>

			<!-- Canvas area -->
			<div class="flex flex-1 items-start justify-center overflow-auto p-3 pt-4">
				<CanvasPreview
					{template}
					{previewData}
					{containers}
					bind:selectedContainerId
					bind:svgElement={canvasSvgElement}
					{zoomLevel}
					{showGrid}
					{gridSize}
					{canvasInteraction}
					{interactionContainerId}
					{activeResizeHandle}
					{isTransitioning}
					canvasScale={CANVAS_SCALE}
					onStartDrag={startDrag}
					onStartResize={startResize}
				/>
			</div>
		</div>

		<!-- Properties Drawer (Left) -->
		<Drawer.Root bind:open={propertiesDrawerOpen} direction="left">
			<Drawer.Content class="h-full w-[85vw] max-w-md">
				<Drawer.Header class="border-b">
					<Drawer.Title>Edit Properties</Drawer.Title>
				</Drawer.Header>
				<div class="flex-1 overflow-auto p-3">
					<PropertiesPanel
						container={selectedContainer}
						dataFields={currentDataFields}
						datasetId={selectedDataset as import('$lib/presets').DatasetId}
						{previewData}
						{expandedPanels}
						bind:activeTab={propertiesPanelTab}
						{selectedComponentId}
						{containers}
						{canUndo}
						{canRedo}
						onAddContainer={addContainer}
						onAddContainerFromTemplate={addContainerFromTemplate}
						onDuplicateContainerById={duplicateContainerById}
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
						onAddStatPanelComponent={addStatPanelComponent}
						onAddDividerComponent={addDividerComponent}
						onAddProgressBarComponent={addProgressBarComponent}
						onAddRibbonComponent={addRibbonComponent}
						onAddFrameComponent={addFrameComponent}
						onAddListComponent={addListComponent}
						onAddIconRatingComponent={addIconRatingComponent}
						onUpdateTextComponent={updateTextComponent}
						onUpdateImageComponent={updateImageComponent}
						onUpdateBackgroundComponent={updateBackgroundComponent}
						onUpdateBorderComponent={updateBorderComponent}
						onUpdateIconComponent={updateIconComponent}
						onUpdateIconSelection={updateIconSelection}
						onUpdateStatPanelComponent={updateStatPanelComponent}
						onUpdateDividerComponent={updateDividerComponent}
						onUpdateProgressBarComponent={updateProgressBarComponent}
						onUpdateRibbonComponent={updateRibbonComponent}
						onUpdateFrameComponent={updateFrameComponent}
						onUpdateListComponent={updateListComponent}
						onUpdateIconRatingComponent={updateIconRatingComponent}
						onRemoveComponent={removeComponent}
						onMoveComponentUp={moveComponentUp}
						onMoveComponentDown={moveComponentDown}
						onSelectComponent={selectComponent}
						onCollapseAllComponentPanels={collapseAllComponentPanels}
					/>
				</div>
			</Drawer.Content>
		</Drawer.Root>

		<!-- Hierarchy Drawer (Right) -->
		<Drawer.Root bind:open={hierarchyDrawerOpen} direction="right">
			<Drawer.Content class="h-full w-[85vw] max-w-sm">
				<Drawer.Header class="border-b">
					<Drawer.Title>Layers</Drawer.Title>
				</Drawer.Header>
				<div class="flex-1 overflow-auto p-3">
					<HierarchyPanel
						{containers}
						bind:selectedContainerId
						{expandedPanels}
						onTogglePanel={togglePanel}
						onToggleVisibility={toggleVisibility}
						onToggleComponentVisibility={toggleComponentVisibility}
						onMoveContainerUp={moveContainerUp}
						onMoveContainerDown={moveContainerDown}
						onMoveComponentUp={moveComponentUp}
						onMoveComponentDown={moveComponentDown}
						onRenameContainer={renameContainer}
						onDragStart={handleDragStart}
						onDragOver={handleDragOver}
						onDrop={handleDrop}
						onDragEnd={handleDragEnd}
						{dragOverContainerId}
					/>
				</div>
			</Drawer.Content>
		</Drawer.Root>
	{:else}
		<!-- Mobile: Canvas with bottom drawer (Phase 4) -->
		<div class="flex flex-1 flex-col overflow-hidden">
			<!-- Mobile toolbar -->
			<div class="flex items-center justify-center border-b bg-card px-3 py-2">
				<CanvasControls
					bind:zoomLevel
					bind:showGrid
					bind:gridSize
					onZoomIn={zoomIn}
					onZoomOut={zoomOut}
					onResetZoom={resetZoom}
					onCycleGridSize={cycleGridSize}
					onShowHelp={showHelpButton ? () => { showHelp = true; } : undefined}
				/>
			</div>

			<!-- Canvas area -->
			<div class="flex flex-1 items-start justify-center overflow-auto p-3 pt-4">
				<CanvasPreview
					{template}
					{previewData}
					{containers}
					bind:selectedContainerId
					bind:svgElement={canvasSvgElement}
					{zoomLevel}
					{showGrid}
					{gridSize}
					{canvasInteraction}
					{interactionContainerId}
					{activeResizeHandle}
					{isTransitioning}
					canvasScale={CANVAS_SCALE}
					onStartDrag={startDrag}
					onStartResize={startResize}
				/>
			</div>

			<!-- Mobile bottom bar with quick actions -->
			<div class="flex items-center justify-around border-t bg-card px-3 py-2">
				<Button variant="ghost" size="sm" onclick={() => propertiesDrawerOpen = true}>
					<PanelLeft class="h-5 w-5" />
					<span class="sr-only">Edit</span>
				</Button>
				<Button variant="ghost" size="sm" onclick={() => hierarchyDrawerOpen = true}>
					<Layers class="h-5 w-5" />
					<span class="sr-only">Layers</span>
				</Button>
			</div>
		</div>

		<!-- Mobile Properties Drawer (Bottom) -->
		<Drawer.Root bind:open={propertiesDrawerOpen} direction="bottom">
			<Drawer.Content class="max-h-[85vh]">
				<Drawer.Header class="border-b">
					<Drawer.Title>Edit Properties</Drawer.Title>
				</Drawer.Header>
				<div class="flex-1 overflow-auto p-3">
					<PropertiesPanel
						container={selectedContainer}
						dataFields={currentDataFields}
						datasetId={selectedDataset as import('$lib/presets').DatasetId}
						{previewData}
						{expandedPanels}
						bind:activeTab={propertiesPanelTab}
						{selectedComponentId}
						{containers}
						{canUndo}
						{canRedo}
						onAddContainer={addContainer}
						onAddContainerFromTemplate={addContainerFromTemplate}
						onDuplicateContainerById={duplicateContainerById}
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
						onAddStatPanelComponent={addStatPanelComponent}
						onAddDividerComponent={addDividerComponent}
						onAddProgressBarComponent={addProgressBarComponent}
						onAddRibbonComponent={addRibbonComponent}
						onAddFrameComponent={addFrameComponent}
						onAddListComponent={addListComponent}
						onAddIconRatingComponent={addIconRatingComponent}
						onUpdateTextComponent={updateTextComponent}
						onUpdateImageComponent={updateImageComponent}
						onUpdateBackgroundComponent={updateBackgroundComponent}
						onUpdateBorderComponent={updateBorderComponent}
						onUpdateIconComponent={updateIconComponent}
						onUpdateIconSelection={updateIconSelection}
						onUpdateStatPanelComponent={updateStatPanelComponent}
						onUpdateDividerComponent={updateDividerComponent}
						onUpdateProgressBarComponent={updateProgressBarComponent}
						onUpdateRibbonComponent={updateRibbonComponent}
						onUpdateFrameComponent={updateFrameComponent}
						onUpdateListComponent={updateListComponent}
						onUpdateIconRatingComponent={updateIconRatingComponent}
						onRemoveComponent={removeComponent}
						onMoveComponentUp={moveComponentUp}
						onMoveComponentDown={moveComponentDown}
						onSelectComponent={selectComponent}
						onCollapseAllComponentPanels={collapseAllComponentPanels}
					/>
				</div>
			</Drawer.Content>
		</Drawer.Root>

		<!-- Mobile Hierarchy Drawer (Bottom) -->
		<Drawer.Root bind:open={hierarchyDrawerOpen} direction="bottom">
			<Drawer.Content class="max-h-[85vh]">
				<Drawer.Header class="border-b">
					<Drawer.Title>Layers</Drawer.Title>
				</Drawer.Header>
				<div class="flex-1 overflow-auto p-3">
					<HierarchyPanel
						{containers}
						bind:selectedContainerId
						{expandedPanels}
						onTogglePanel={togglePanel}
						onToggleVisibility={toggleVisibility}
						onToggleComponentVisibility={toggleComponentVisibility}
						onMoveContainerUp={moveContainerUp}
						onMoveContainerDown={moveContainerDown}
						onMoveComponentUp={moveComponentUp}
						onMoveComponentDown={moveComponentDown}
						onRenameContainer={renameContainer}
						onDragStart={handleDragStart}
						onDragOver={handleDragOver}
						onDrop={handleDrop}
						onDragEnd={handleDragEnd}
						{dragOverContainerId}
					/>
				</div>
			</Drawer.Content>
		</Drawer.Root>
	{/if}
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

<RestoreDraftDialog
	bind:show={showRestoreDraftDialog}
	draftAge={draft.current ? formatTimeAgo(draft.current.timestamp) : ''}
	onRestore={restoreDraft}
	onDiscard={discardDraft}
/>

<ExportDialog
	bind:show={showExportDialog}
	onExport={handleExport}
/>
