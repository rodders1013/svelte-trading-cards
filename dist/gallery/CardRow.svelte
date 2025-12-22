<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { CardRowProps } from './types.js';

	let {
		class: className = '',
		cardWidth = 280,
		visibleWidth = 80,
		hoverScale = 1.08,
		transitionDuration = 0.5,
		'aria-label': ariaLabel = 'Card row',
		children,
		onCardHover,
		onCardLeave
	}: CardRowProps = $props();

	let hoveredIndex = $state<number | null>(null);
	let cardCount = $state(0);
	let rowElement: HTMLDivElement;

	// Update card count when children render
	$effect(() => {
		if (rowElement) {
			cardCount = rowElement.querySelectorAll('.card-row-item').length;
		}
	});

	function handleCardHover(index: number) {
		hoveredIndex = index;
		onCardHover?.(index);
	}

	function handleCardLeave() {
		hoveredIndex = null;
		onCardLeave?.();
	}

	// Calculate card position based on hover state
	function getCardTransform(index: number): string {
		const baseOffset = index * visibleWidth;

		if (hoveredIndex === null) {
			return `translateX(${baseOffset}px)`;
		}

		if (index === hoveredIndex) {
			return `translateX(${baseOffset}px) scale(${hoverScale})`;
		}

		// Cards to the right of hovered card push out
		if (index > hoveredIndex) {
			const pushAmount = cardWidth - visibleWidth + 10;
			return `translateX(${baseOffset + pushAmount}px)`;
		}

		return `translateX(${baseOffset}px)`;
	}

	function getZIndex(index: number): number {
		if (hoveredIndex === index) {
			return 100;
		}
		return index;
	}

	// Calculate container width based on card count
	const containerWidth = $derived(
		cardCount > 0 ? (cardCount - 1) * visibleWidth + cardWidth + 50 : 0
	);

	// Calculate min-height based on card dimensions (750/1050 aspect ratio)
	const cardHeight = $derived(Math.round(cardWidth * (1050 / 750)));
	const rowHeight = $derived(cardHeight + 120); // Extra space for hover scale and shadows
</script>

<div class="card-row-container {className}">
	<div
		class="card-row"
		bind:this={rowElement}
		role="list"
		aria-label={ariaLabel}
		style:min-height="{rowHeight}px"
		style:width="{containerWidth}px"
		style:--transition-duration="{transitionDuration}s"
	>
		{@render children({
			getTransform: getCardTransform,
			getZIndex,
			onHover: handleCardHover,
			onLeave: handleCardLeave,
			hoveredIndex
		})}
	</div>
</div>

<style>
	.card-row-container {
		position: relative;
		width: 100%;
		overflow-x: auto;
		overflow-y: visible;
		padding: 1rem;
		scroll-padding: 2rem;
	}

	.card-row {
		position: relative;
		display: flex;
		padding-top: 60px;
		padding-bottom: 60px;
		width: fit-content;
	}

	/* Global styles for card items - consumers add .card-row-item class */
	.card-row :global(.card-row-item) {
		position: absolute;
		left: 0;
		top: 60px;
		transition: transform var(--transition-duration, 0.5s) cubic-bezier(0.25, 0.1, 0.25, 1);
		will-change: transform, z-index;
		cursor: pointer;
		padding-right: 30px;
	}

	/* In CardRow context, don't clip at hover-tilt level to avoid cutting off neighboring cards */
	.card-row :global(.hover-tilt) {
		overflow: visible !important;
	}

	/* Instead, clip at the SVG level for rounded corners */
	.card-row :global(.tc-card-face svg) {
		border-radius: 3%;
	}

	.card-row :global(.card-row-item:hover) {
		transition: transform calc(var(--transition-duration, 0.5s) * 0.8) cubic-bezier(0.25, 0.1, 0.25, 1);
	}

	/* Reduced motion support */
	@media (prefers-reduced-motion: reduce) {
		.card-row :global(.card-row-item) {
			transition: none;
		}
	}
</style>
