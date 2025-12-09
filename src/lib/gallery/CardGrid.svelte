<script lang="ts" module>
	export type { CardGridProps } from './types.js';
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		class: className = '',
		minCardWidth = 280,
		gap = 24,
		columns,
		'aria-label': ariaLabel = 'Card gallery',
		children
	}: {
		class?: string;
		minCardWidth?: number;
		gap?: number;
		columns?: string;
		'aria-label'?: string;
		children: Snippet;
	} = $props();

	const gridStyle = $derived(
		columns
			? `grid-template-columns: ${columns}; gap: ${gap}px;`
			: `grid-template-columns: repeat(auto-fit, minmax(${minCardWidth}px, 1fr)); gap: ${gap}px;`
	);
</script>

<div class="tc-card-grid {className}" style={gridStyle} role="list" aria-label={ariaLabel}>
	{@render children()}
</div>

<style>
	.tc-card-grid {
		display: grid;
		width: 100%;
	}

	.tc-card-grid > :global(*) {
		role: listitem;
	}
</style>
