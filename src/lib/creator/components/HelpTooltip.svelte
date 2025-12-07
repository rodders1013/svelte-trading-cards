<script lang="ts">
	import * as Tooltip from '$lib/creator/ui/tooltip';

	let { text }: { text: string } = $props();
</script>

<Tooltip.Provider>
	<Tooltip.Root>
		<Tooltip.Trigger class="inline-flex cursor-help items-center justify-center text-muted-foreground opacity-60 transition-opacity hover:opacity-100">
			<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<circle cx="12" cy="12" r="10"/>
				<path d="M12 16v-4"/>
				<path d="M12 8h.01"/>
			</svg>
		</Tooltip.Trigger>
		<Tooltip.Content side="top" sideOffset={8} class="max-w-[250px] text-balance">
			{text}
		</Tooltip.Content>
	</Tooltip.Root>
</Tooltip.Provider>
