<script lang="ts">
	import * as Collapsible from '$lib/creator/ui/collapsible';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import EffectsControls from '../controls/EffectsControls.svelte';
	import HelpTooltip from '../HelpTooltip.svelte';
	import type { EffectConfig } from '$lib/styling/effects';

	let {
		effect = $bindable<EffectConfig | undefined>(undefined)
	}: {
		effect: EffectConfig | undefined;
	} = $props();

	let open = $state(false);
	const hasEffect = $derived(effect !== undefined);
</script>

<Collapsible.Root bind:open>
	<div class="flex items-center gap-2 rounded border border-purple-500/30 bg-purple-500/5 px-2 py-1.5 text-sm hover:bg-purple-500/10">
		<Collapsible.Trigger class="flex flex-1 items-center gap-2">
			<ChevronDown class="h-3 w-3 transition-transform {open ? '' : '-rotate-90'}" />
			<span class="font-medium text-purple-400">Effect</span>
			{#if hasEffect && effect}
				<span class="ml-auto rounded bg-purple-500/20 px-1.5 py-0.5 text-xs text-purple-400 capitalize">{effect.type}</span>
			{/if}
		</Collapsible.Trigger>
		<HelpTooltip text="Effects apply to this component only. Other components in the layer are not affected." />
	</div>
	<Collapsible.Content>
		<div class="mt-2 rounded border border-purple-500/20 bg-purple-500/5 p-2">
			<EffectsControls bind:effect />
		</div>
	</Collapsible.Content>
</Collapsible.Root>
