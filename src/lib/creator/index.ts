// Main creator component
export { default as CardCreator } from './CardCreator.svelte';

// Types
export type {
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
	ListComponent,
	IconRatingComponent,
	ClipShape,
	ResizeHandle,
	DataFieldOption
} from './types.js';

// State utilities (for advanced usage)
export {
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
	createListComponent,
	createIconRatingComponent,
	generateId,
	buildTemplate,
	buildPreviewData,
	GRID_SIZE
} from './state.svelte.js';
