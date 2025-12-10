<script lang="ts" module>
	export type { CardCarouselProps } from './types.js';
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		class: className = '',
		gap = 16,
		snap = true,
		snapAlign = 'start',
		showNavigation = true,
		scrollAmount = 1,
		'aria-label': ariaLabel = 'Card carousel',
		scrollLeft = $bindable(0),
		children,
		navigationPrev,
		navigationNext
	}: {
		class?: string;
		gap?: number;
		snap?: boolean;
		snapAlign?: 'start' | 'center' | 'end';
		showNavigation?: boolean;
		scrollAmount?: number;
		'aria-label'?: string;
		scrollLeft?: number;
		children: Snippet;
		navigationPrev?: Snippet;
		navigationNext?: Snippet;
	} = $props();

	let scrollContainer: HTMLDivElement;
	let canScrollLeft = $state(false);
	let canScrollRight = $state(true);

	function scrollPrev() {
		if (!scrollContainer) return;
		const cardWidth = scrollContainer.firstElementChild?.clientWidth ?? 280;
		scrollContainer.scrollBy({ left: -(cardWidth + gap) * scrollAmount, behavior: 'smooth' });
	}

	function scrollNext() {
		if (!scrollContainer) return;
		const cardWidth = scrollContainer.firstElementChild?.clientWidth ?? 280;
		scrollContainer.scrollBy({ left: (cardWidth + gap) * scrollAmount, behavior: 'smooth' });
	}

	function handleScroll() {
		if (!scrollContainer) return;
		scrollLeft = scrollContainer.scrollLeft;
		canScrollLeft = scrollContainer.scrollLeft > 0;
		canScrollRight =
			scrollContainer.scrollLeft < scrollContainer.scrollWidth - scrollContainer.clientWidth - 1;
	}
</script>

<div class="tc-carousel-wrapper {className}" role="region" aria-label={ariaLabel}>
	{#if showNavigation}
		<button
			class="tc-carousel-nav tc-carousel-prev"
			onclick={scrollPrev}
			aria-label="Previous"
			disabled={!canScrollLeft}
		>
			{#if navigationPrev}
				{@render navigationPrev()}
			{:else}
				<span aria-hidden="true" class="tc-nav-icon">&larr;</span>
			{/if}
		</button>
	{/if}

	<div
		bind:this={scrollContainer}
		class="tc-carousel-scroll"
		class:snap
		style="gap: {gap}px; --snap-align: {snapAlign};"
		onscroll={handleScroll}
		role="list"
	>
		{@render children()}
	</div>

	{#if showNavigation}
		<button
			class="tc-carousel-nav tc-carousel-next"
			onclick={scrollNext}
			aria-label="Next"
			disabled={!canScrollRight}
		>
			{#if navigationNext}
				{@render navigationNext()}
			{:else}
				<span aria-hidden="true" class="tc-nav-icon">&rarr;</span>
			{/if}
		</button>
	{/if}
</div>

<style>
	.tc-carousel-wrapper {
		position: relative;
		width: 100%;
	}

	.tc-carousel-scroll {
		display: flex;
		overflow-x: auto;
		scroll-behavior: smooth;
		-webkit-overflow-scrolling: touch;
		scrollbar-width: none;
		-ms-overflow-style: none;
	}

	.tc-carousel-scroll::-webkit-scrollbar {
		display: none;
	}

	.tc-carousel-scroll.snap {
		scroll-snap-type: x mandatory;
	}

	.tc-carousel-scroll > :global(*) {
		scroll-snap-align: var(--snap-align);
		flex-shrink: 0;
	}

	.tc-carousel-nav {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		z-index: 10;
		background: rgba(255, 255, 255, 0.9);
		border: 1px solid rgba(0, 0, 0, 0.1);
		border-radius: 50%;
		width: 40px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition:
			opacity 0.2s,
			background 0.2s;
	}

	.tc-carousel-nav:hover:not(:disabled) {
		background: white;
	}

	.tc-carousel-nav:disabled {
		opacity: 0.3;
		cursor: not-allowed;
	}

	.tc-carousel-prev {
		left: 8px;
	}

	.tc-carousel-next {
		right: 8px;
	}

	.tc-nav-icon {
		font-size: 18px;
		line-height: 1;
	}
</style>
