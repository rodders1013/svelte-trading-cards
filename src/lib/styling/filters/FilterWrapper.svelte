<script lang="ts" module>
	import { z } from 'zod';
	import { FilterConfigSchema } from './types.js';

	export const FilterWrapperPropsSchema = z.object({
		filter: FilterConfigSchema.optional()
	});

	export type FilterWrapperProps = z.infer<typeof FilterWrapperPropsSchema>;
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { buildFilterString, hasActiveFilters } from './types.js';

	let {
		filter,
		children
	}: FilterWrapperProps & {
		children: Snippet;
	} = $props();

	// Generate CSS filter string
	const filterStyle = $derived.by(() => {
		if (!filter || !hasActiveFilters(filter)) return '';
		const filterString = buildFilterString(filter);
		return filterString ? `filter: ${filterString}` : '';
	});

	const hasFilter = $derived(hasActiveFilters(filter));
</script>

<!--
	FilterWrapper applies CSS filter effects to child content.
	Uses CSS filter property which works on SVG elements.
-->

{#if hasFilter}
	<g style={filterStyle}>
		{@render children()}
	</g>
{:else}
	{@render children()}
{/if}
