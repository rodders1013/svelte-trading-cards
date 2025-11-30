<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		badge?: { text: string; color: string };
		expanded?: boolean;
		onRemove: () => void;
		onMoveUp: () => void;
		onMoveDown: () => void;
		children: Snippet;
	}

	let {
		title,
		badge,
		expanded = $bindable(true),
		onRemove,
		onMoveUp,
		onMoveDown,
		children
	}: Props = $props();
</script>

<Collapsible.Root bind:open={expanded} class="border-b">
	<div class="flex w-full items-center justify-between px-3 py-2 hover:bg-muted/50">
		<Collapsible.Trigger class="flex flex-1 items-center gap-2 text-sm font-medium">
			<ChevronDown
				class="h-3 w-3 shrink-0 transition-transform duration-200 {expanded ? '' : '-rotate-90'}"
			/>
			{#if badge}
				<span class="rounded px-1.5 py-0.5 text-xs font-bold text-white {badge.color}">{badge.text}</span>
			{/if}
			{title}
		</Collapsible.Trigger>
		<div class="flex items-center gap-1">
			<Button
				variant="ghost"
				size="sm"
				onclick={(e: MouseEvent) => { e.stopPropagation(); onMoveUp(); }}
				class="h-6 w-6 p-0"
				title="Move up"
			>
				<span class="text-xs">↑</span>
			</Button>
			<Button
				variant="ghost"
				size="sm"
				onclick={(e: MouseEvent) => { e.stopPropagation(); onMoveDown(); }}
				class="h-6 w-6 p-0"
				title="Move down"
			>
				<span class="text-xs">↓</span>
			</Button>
			<Button
				variant="ghost"
				size="sm"
				onclick={(e: MouseEvent) => { e.stopPropagation(); onRemove(); }}
				class="h-6 w-6 p-0 text-destructive"
				title="Remove"
			>
				<span class="text-xs">×</span>
			</Button>
		</div>
	</div>

	<Collapsible.Content>
		<div class="space-y-3 px-3 pb-3">
			{@render children()}
		</div>
	</Collapsible.Content>
</Collapsible.Root>
