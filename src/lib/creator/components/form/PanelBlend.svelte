<script lang="ts">
	import * as Collapsible from '$lib/components/ui/collapsible';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import BlendControls from '../BlendControls.svelte';
	import type { BlendMode } from '$lib/blend';

	let {
		blendMode = $bindable<BlendMode | undefined>(undefined)
	}: {
		blendMode: BlendMode | undefined;
	} = $props();

	let open = $state(false);
	const hasBlend = $derived(blendMode !== undefined && blendMode !== 'normal');

	function handleUpdate(mode: BlendMode | undefined) {
		blendMode = mode;
	}
</script>

<Collapsible.Root bind:open>
	<div class="flex items-center gap-2 rounded border border-amber-500/30 bg-amber-500/5 px-2 py-1.5 text-sm hover:bg-amber-500/10">
		<Collapsible.Trigger class="flex flex-1 items-center gap-2">
			<ChevronDown class="h-3 w-3 transition-transform {open ? '' : '-rotate-90'}" />
			<span class="font-medium text-amber-400">Blend Mode</span>
			{#if hasBlend}
				<span class="ml-auto rounded bg-amber-500/20 px-1.5 py-0.5 text-xs text-amber-400 capitalize">{blendMode}</span>
			{/if}
		</Collapsible.Trigger>
	</div>
	<Collapsible.Content>
		<div class="mt-2 rounded border border-amber-500/20 bg-amber-500/5 p-2">
			<BlendControls blendMode={blendMode} onUpdate={handleUpdate} />
		</div>
	</Collapsible.Content>
</Collapsible.Root>
