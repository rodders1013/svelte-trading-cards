<script lang="ts">
	import * as Tooltip from '$lib/creator/ui/tooltip';
	import CircleHelp from '@lucide/svelte/icons/circle-help';

	let {
		text,
		delay = 1000
	}: {
		text: string;
		delay?: number;
	} = $props();

	let open = $state(false);

	function handleClick(e: MouseEvent) {
		e.preventDefault();
		e.stopPropagation();
		open = !open;
	}
</script>

<Tooltip.Provider delayDuration={delay}>
	<Tooltip.Root bind:open>
		<Tooltip.Trigger
			class="inline-flex cursor-help items-center justify-center text-muted-foreground opacity-60 transition-opacity hover:opacity-100"
			onclick={handleClick}
		>
			<CircleHelp class="h-3 w-3" />
		</Tooltip.Trigger>
		<Tooltip.Content side="top" sideOffset={8} class="max-w-[250px] text-balance">
			{text}
		</Tooltip.Content>
	</Tooltip.Root>
</Tooltip.Provider>
