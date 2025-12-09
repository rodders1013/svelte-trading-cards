import type { Snippet } from 'svelte';

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
