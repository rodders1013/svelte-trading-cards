<script lang="ts">
	import EffectsControls from '../EffectsControls.svelte';
	import HelpTooltip from '../HelpTooltip.svelte';
	import type { EffectConfig } from '$lib/effects';

	let {
		effect = $bindable<EffectConfig | undefined>(undefined)
	}: {
		effect: EffectConfig | undefined;
	} = $props();
</script>

<div class="rounded border border-purple-500/30 bg-purple-500/5 p-2">
	<div class="mb-2 flex items-center gap-2">
		<span class="text-sm font-medium text-purple-400">Component Effect</span>
		<HelpTooltip
			text="Effects apply to this component only. Other components in the layer are not affected."
		/>
	</div>
	<EffectsControls bind:effect />
</div>
