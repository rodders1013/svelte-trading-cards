<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		cols = 2,
		class: className = '',
		children
	}: {
		cols?: 2 | 3 | 4;
		class?: string;
		children: Snippet;
	} = $props();

	const colsClass = {
		2: 'grid-cols-2',
		3: 'grid-cols-3',
		4: 'grid-cols-4'
	};
</script>

<div class="grid gap-2 {colsClass[cols]} {className}">
	{@render children()}
</div>
