<script lang="ts">
	import { Button } from '../../ui/button';
	import * as Popover from '../../ui/popover';
	import Plus from '@lucide/svelte/icons/plus';
	import Type from '@lucide/svelte/icons/type';
	import ImageIcon from '@lucide/svelte/icons/image';
	import ListIcon from '@lucide/svelte/icons/list';
	import PaintBucket from '@lucide/svelte/icons/paint-bucket';
	import Square from '@lucide/svelte/icons/square';
	import Frame from '@lucide/svelte/icons/frame';
	import Minus from '@lucide/svelte/icons/minus';
	import BarChart3 from '@lucide/svelte/icons/bar-chart-3';
	import Gauge from '@lucide/svelte/icons/gauge';
	import Star from '@lucide/svelte/icons/star';
	import Sparkles from '@lucide/svelte/icons/sparkles';
	import Ribbon from '@lucide/svelte/icons/ribbon';
	import type { Component } from 'svelte';

	interface ComponentOption {
		type: string;
		label: string;
		icon: Component;
		onAdd: () => void;
		disabled: boolean;
	}

	interface ComponentCategory {
		name: string;
		items: ComponentOption[];
	}

	let {
		hasText,
		hasImage,
		hasList,
		hasBackground,
		hasBorder,
		hasFrame,
		hasDivider,
		hasStatPanel,
		hasProgressBar,
		hasIconRating,
		hasIcon,
		hasRibbon,
		onAddText,
		onAddImage,
		onAddList,
		onAddBackground,
		onAddBorder,
		onAddFrame,
		onAddDivider,
		onAddStatPanel,
		onAddProgressBar,
		onAddIconRating,
		onAddIcon,
		onAddRibbon
	}: {
		hasText: boolean;
		hasImage: boolean;
		hasList: boolean;
		hasBackground: boolean;
		hasBorder: boolean;
		hasFrame: boolean;
		hasDivider: boolean;
		hasStatPanel: boolean;
		hasProgressBar: boolean;
		hasIconRating: boolean;
		hasIcon: boolean;
		hasRibbon: boolean;
		onAddText: () => void;
		onAddImage: () => void;
		onAddList: () => void;
		onAddBackground: () => void;
		onAddBorder: () => void;
		onAddFrame: () => void;
		onAddDivider: () => void;
		onAddStatPanel: () => void;
		onAddProgressBar: () => void;
		onAddIconRating: () => void;
		onAddIcon: () => void;
		onAddRibbon: () => void;
	} = $props();

	let open = $state(false);

	const categories: ComponentCategory[] = $derived([
		{
			name: 'Content',
			items: [
				{ type: 'text', label: 'Text', icon: Type, onAdd: onAddText, disabled: hasText },
				{ type: 'image', label: 'Image', icon: ImageIcon, onAdd: onAddImage, disabled: hasImage },
				{ type: 'list', label: 'List', icon: ListIcon, onAdd: onAddList, disabled: hasList }
			]
		},
		{
			name: 'Visual',
			items: [
				{ type: 'background', label: 'Background', icon: PaintBucket, onAdd: onAddBackground, disabled: hasBackground },
				{ type: 'border', label: 'Border', icon: Square, onAdd: onAddBorder, disabled: hasBorder },
				{ type: 'frame', label: 'Frame', icon: Frame, onAdd: onAddFrame, disabled: hasFrame },
				{ type: 'divider', label: 'Divider', icon: Minus, onAdd: onAddDivider, disabled: hasDivider }
			]
		},
		{
			name: 'Data',
			items: [
				{ type: 'statpanel', label: 'Stats', icon: BarChart3, onAdd: onAddStatPanel, disabled: hasStatPanel },
				{ type: 'progressbar', label: 'Progress', icon: Gauge, onAdd: onAddProgressBar, disabled: hasProgressBar },
				{ type: 'iconrating', label: 'Rating', icon: Star, onAdd: onAddIconRating, disabled: hasIconRating }
			]
		},
		{
			name: 'Decoration',
			items: [
				{ type: 'icon', label: 'Icon', icon: Sparkles, onAdd: onAddIcon, disabled: hasIcon },
				{ type: 'ribbon', label: 'Ribbon', icon: Ribbon, onAdd: onAddRibbon, disabled: hasRibbon }
			]
		}
	]);

	function handleAdd(item: ComponentOption) {
		if (!item.disabled) {
			item.onAdd();
			open = false;
		}
	}
</script>

<Popover.Root bind:open>
	<Popover.Trigger>
		{#snippet child({ props })}
			<Button {...props} variant="default" size="sm" class="gap-1.5 bg-blue-600 hover:bg-blue-700">
				<Plus class="h-4 w-4" />
				<span>Component</span>
			</Button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content class="w-64 p-2" align="start">
		<div class="space-y-2">
			{#each categories as category}
				<div>
					<div class="px-2 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wide">
						{category.name}
					</div>
					<div class="grid grid-cols-2 gap-1">
						{#each category.items as item}
							<button
								type="button"
								class="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors
									{item.disabled
										? 'cursor-not-allowed text-muted-foreground/50'
										: 'hover:bg-muted text-foreground cursor-pointer'}"
								disabled={item.disabled}
								onclick={() => handleAdd(item)}
							>
								<item.icon class="h-4 w-4 shrink-0" />
								<span class="truncate">{item.label}</span>
							</button>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</Popover.Content>
</Popover.Root>
