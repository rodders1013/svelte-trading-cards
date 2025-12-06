<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import Eye from '@lucide/svelte/icons/eye';
	import EyeOff from '@lucide/svelte/icons/eye-off';
	import ArrowUpDown from '@lucide/svelte/icons/arrow-up-down';
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		badge?: { text: string; color: string };
		expanded?: boolean;
		/** Whether this component is visible (for visibility toggle) */
		visible?: boolean;
		/** Show visibility toggle instead of remove button (for Card Base) */
		showVisibilityToggle?: boolean;
		/** Allow removing this component (default true) */
		canRemove?: boolean;
		/** Allow reordering this component (default true) */
		canMove?: boolean;
		/** Callback to swap layer order (for Card Base image/background) */
		onSwapLayer?: () => void;
		onRemove: () => void;
		onMoveUp: () => void;
		onMoveDown: () => void;
		onToggleVisibility?: () => void;
		children: Snippet;
	}

	let {
		title,
		badge,
		expanded = $bindable(true),
		visible = true,
		showVisibilityToggle = false,
		canRemove = true,
		canMove = true,
		onSwapLayer,
		onRemove,
		onMoveUp,
		onMoveDown,
		onToggleVisibility,
		children
	}: Props = $props();
</script>

<Collapsible.Root bind:open={expanded} class="border-b {!visible ? 'opacity-60' : ''}">
	<div class="flex w-full items-center justify-between px-2 py-1.5 hover:bg-muted/50">
		<Collapsible.Trigger class="flex flex-1 items-center gap-1.5 text-sm font-medium">
			<ChevronDown
				class="h-3 w-3 shrink-0 transition-transform duration-200 {expanded ? '' : '-rotate-90'}"
			/>
			{#if badge}
				<span class="rounded px-1 py-0.5 text-[10px] font-bold uppercase text-white {badge.color}">{badge.text}</span>
			{/if}
			{title}
			{#if !visible}
				<span class="text-xs text-muted-foreground">(hidden)</span>
			{/if}
		</Collapsible.Trigger>
		<div class="flex items-center">
			{#if onSwapLayer}
				<Button
					variant="ghost"
					size="sm"
					onclick={(e: MouseEvent) => { e.stopPropagation(); onSwapLayer(); }}
					class="h-5 w-5 p-0"
					title="Swap layer order"
				>
					<ArrowUpDown class="h-3 w-3" />
				</Button>
			{/if}
			{#if showVisibilityToggle && onToggleVisibility}
				<Button
					variant="ghost"
					size="sm"
					onclick={(e: MouseEvent) => { e.stopPropagation(); onToggleVisibility(); }}
					class="h-5 w-5 p-0"
					title={visible ? 'Hide' : 'Show'}
				>
					{#if visible}
						<Eye class="h-3 w-3" />
					{:else}
						<EyeOff class="h-3 w-3" />
					{/if}
				</Button>
			{/if}
			{#if canMove}
				<Button
					variant="ghost"
					size="sm"
					onclick={(e: MouseEvent) => { e.stopPropagation(); onMoveUp(); }}
					class="h-5 w-5 p-0"
					title="Move up"
				>
					<span class="text-[10px]">↑</span>
				</Button>
				<Button
					variant="ghost"
					size="sm"
					onclick={(e: MouseEvent) => { e.stopPropagation(); onMoveDown(); }}
					class="h-5 w-5 p-0"
					title="Move down"
				>
					<span class="text-[10px]">↓</span>
				</Button>
			{/if}
			{#if canRemove}
				<Button
					variant="ghost"
					size="sm"
					onclick={(e: MouseEvent) => { e.stopPropagation(); onRemove(); }}
					class="h-5 w-5 p-0 text-destructive"
					title="Remove"
				>
					<span class="text-[10px]">×</span>
				</Button>
			{/if}
		</div>
	</div>

	<Collapsible.Content>
		<div class="space-y-2 px-2 pb-2">
			{@render children()}
		</div>
	</Collapsible.Content>
</Collapsible.Root>
