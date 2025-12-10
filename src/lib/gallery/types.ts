import type { Snippet } from 'svelte';

/**
 * Context provided to CardRow children via snippet
 */
export interface CardRowContext {
	/** Get transform style for a card at given index */
	getTransform: (index: number) => string;
	/** Get z-index for a card at given index */
	getZIndex: (index: number) => number;
	/** Call when hovering a card */
	onHover: (index: number) => void;
	/** Call when leaving a card */
	onLeave: () => void;
	/** Currently hovered card index (null if none) */
	hoveredIndex: number | null;
}

/**
 * Props for CardRow component
 * Overlapping card row with hover-to-expand effect
 */
export interface CardRowProps {
	/** CSS class for custom styling */
	class?: string;
	/** Width of each card in pixels (default: 280) */
	cardWidth?: number;
	/** Visible width of overlapped cards in pixels (default: 80) */
	visibleWidth?: number;
	/** Scale factor on hover (default: 1.08) */
	hoverScale?: number;
	/** Transition duration in seconds (default: 0.5) */
	transitionDuration?: number;
	/** ARIA label for the row */
	'aria-label'?: string;
	/** Children snippet - receives CardRowContext */
	children: Snippet<[CardRowContext]>;
	/** Callback when a card is hovered */
	onCardHover?: (index: number) => void;
	/** Callback when mouse leaves a card */
	onCardLeave?: () => void;
}

/**
 * Props for CardGrid component
 * CSS Grid container for responsive card layouts
 */
export interface CardGridProps {
	/** CSS class for custom styling */
	class?: string;
	/** Minimum card width for auto-fit columns (default: 280) */
	minCardWidth?: number;
	/** Gap between cards in pixels (default: 24) */
	gap?: number;
	/** Custom grid-template-columns (overrides minCardWidth) */
	columns?: string;
	/** ARIA label for the grid */
	'aria-label'?: string;
	/** Children to render inside the grid */
	children: Snippet;
}

/**
 * Props for CardCarousel component
 * Horizontal scrolling carousel with snap points
 */
export interface CardCarouselProps {
	/** CSS class for custom styling */
	class?: string;
	/** Gap between cards in pixels (default: 16) */
	gap?: number;
	/** Enable CSS scroll snap (default: true) */
	snap?: boolean;
	/** Snap alignment (default: 'start') */
	snapAlign?: 'start' | 'center' | 'end';
	/** Show navigation arrows (default: true) */
	showNavigation?: boolean;
	/** Number of cards to scroll per navigation click (default: 1) */
	scrollAmount?: number;
	/** ARIA label for the carousel */
	'aria-label'?: string;
	/** Bindable: current scroll position */
	scrollLeft?: number;
	/** Children to render inside the carousel */
	children: Snippet;
	/** Custom prev navigation button */
	navigationPrev?: Snippet;
	/** Custom next navigation button */
	navigationNext?: Snippet;
}

/**
 * Props for CardModal component
 * Full-size card modal/lightbox
 */
export interface CardModalProps {
	/** Whether the modal is open */
	open: boolean;
	/** Callback when modal should close */
	onClose?: () => void;
	/** Close on backdrop click (default: true) */
	closeOnBackdrop?: boolean;
	/** Close on Escape key (default: true) */
	closeOnEscape?: boolean;
	/** ARIA label for the modal */
	'aria-label'?: string;
	/** CSS class for the modal container */
	class?: string;
	/** Content to render inside the modal */
	children: Snippet;
}
