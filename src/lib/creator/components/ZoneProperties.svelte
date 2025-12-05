<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import * as Select from '$lib/components/ui/select';
	import { Label } from '$lib/components/ui/label';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import AnimationControls from './AnimationControls.svelte';
	import HelpTooltip from './HelpTooltip.svelte';
	import type { ContainerState, ClipShape } from '../types';
	import type { AnimationConfig } from '$lib/animations';

	let {
		container,
		expanded = $bindable(true),
		onUpdate,
		onDuplicate,
		onDelete,
		onTogglePanel
	}: {
		container: ContainerState;
		expanded: boolean;
		onUpdate: <K extends keyof ContainerState>(key: K, value: ContainerState[K]) => void;
		onDuplicate: () => void;
		onDelete: () => void;
		onTogglePanel: () => void;
	} = $props();

	// Local animation state that syncs with container
	let localAnimation = $state<AnimationConfig | undefined>(container.animation);
	let previousContainerId = $state(container.id);

	// Sync local state when container changes (different container selected)
	$effect(() => {
		if (container.id !== previousContainerId) {
			localAnimation = container.animation;
			previousContainerId = container.id;
		}
	});

	// Update container when local animation changes
	$effect(() => {
		// Only update if the animation actually changed
		if (JSON.stringify(localAnimation) !== JSON.stringify(container.animation)) {
			onUpdate('animation', localAnimation);
		}
	});

	let showAdvanced = $state(false);
</script>

<div class="space-y-3">
	{#if container.isCardBase}
		<!-- Card Base Info -->
		<div class="rounded border border-blue-500/30 bg-blue-500/10 px-3 py-2 text-xs text-blue-300">
			<p class="font-medium">Card Base Layer</p>
			<p class="mt-1 text-blue-300/80">This layer covers the full card and extends to the bleed area when exporting for print.</p>
		</div>
	{:else}
		<!-- Name -->
		<div>
			<label class="mb-1 block text-xs text-muted-foreground">Name</label>
			<input
				type="text"
				value={container.name}
				onchange={(e) => onUpdate('name', (e.target as HTMLInputElement).value)}
				class="h-8 w-full rounded border border-input bg-background px-2 text-sm"
			/>
		</div>

		<!-- Position & Size in compact 2x2 grid -->
		<div class="grid grid-cols-4 gap-2">
			<div>
				<label class="mb-1 block text-xs text-muted-foreground">X</label>
				<input
					type="number"
					value={container.x}
					onchange={(e) => onUpdate('x', parseInt((e.target as HTMLInputElement).value))}
					class="h-8 w-full rounded border border-input bg-background px-2 text-sm"
				/>
			</div>
			<div>
				<label class="mb-1 block text-xs text-muted-foreground">Y</label>
				<input
					type="number"
					value={container.y}
					onchange={(e) => onUpdate('y', parseInt((e.target as HTMLInputElement).value))}
					class="h-8 w-full rounded border border-input bg-background px-2 text-sm"
				/>
			</div>
			<div>
				<label class="mb-1 block text-xs text-muted-foreground">Width</label>
				<input
					type="number"
					value={container.width}
					onchange={(e) => onUpdate('width', parseInt((e.target as HTMLInputElement).value))}
					class="h-8 w-full rounded border border-input bg-background px-2 text-sm"
				/>
			</div>
			<div>
				<label class="mb-1 block text-xs text-muted-foreground">Height</label>
				<input
					type="number"
					value={container.height}
					onchange={(e) => onUpdate('height', parseInt((e.target as HTMLInputElement).value))}
					class="h-8 w-full rounded border border-input bg-background px-2 text-sm"
				/>
			</div>
		</div>

		<!-- Shape & Radius -->
		<div class="grid grid-cols-2 gap-2">
			<div>
				<Label class="mb-1 block text-xs text-muted-foreground">Clip Shape</Label>
				<Select.Root type="single" value={container.clipShape} onValueChange={(v) => v && onUpdate('clipShape', v as ClipShape)}>
					<Select.Trigger class="h-8 w-full text-sm">
						{container.clipShape === 'rect' ? 'Rectangle' :
						 container.clipShape === 'circle' ? 'Circle' :
						 container.clipShape === 'ellipse' ? 'Ellipse' :
						 container.clipShape === 'hexagon' ? 'Hexagon' :
						 container.clipShape === 'octagon' ? 'Octagon' :
						 container.clipShape === 'diamond' ? 'Diamond' :
						 container.clipShape === 'shield' ? 'Shield' :
						 container.clipShape === 'star' ? 'Star' : container.clipShape}
					</Select.Trigger>
					<Select.Content>
						<Select.Item value="rect" label="Rectangle" />
						<Select.Item value="circle" label="Circle" />
						<Select.Item value="ellipse" label="Ellipse" />
						<Select.Item value="hexagon" label="Hexagon" />
						<Select.Item value="octagon" label="Octagon" />
						<Select.Item value="diamond" label="Diamond" />
						<Select.Item value="shield" label="Shield" />
						<Select.Item value="star" label="Star" />
					</Select.Content>
				</Select.Root>
			</div>
			{#if container.clipShape === 'rect'}
				<div>
					<label class="mb-1 block text-xs text-muted-foreground">Corner Radius</label>
					<input
						type="number"
						value={container.radius}
						onchange={(e) => onUpdate('radius', parseInt((e.target as HTMLInputElement).value))}
						class="h-8 w-full rounded border border-input bg-background px-2 text-sm"
					/>
				</div>
			{:else}
				<div>
					<Label class="mb-1 block text-xs text-muted-foreground">Clip Content</Label>
					<div class="flex h-8 items-center gap-2">
						<Checkbox
							id="clip-content"
							checked={container.clipContent}
							onCheckedChange={(checked) => onUpdate('clipContent', checked === true)}
						/>
						<Label for="clip-content" class="text-sm">Enabled</Label>
					</div>
				</div>
			{/if}
		</div>
	{/if}

	<!-- Advanced Section (Animation) -->
	<Collapsible.Root bind:open={showAdvanced}>
		<div class="flex items-center gap-2 rounded border border-blue-500/30 bg-blue-500/5 px-2 py-1.5 text-sm hover:bg-blue-500/10">
			<Collapsible.Trigger class="flex flex-1 items-center gap-2">
				<ChevronDown class="h-3 w-3 transition-transform {showAdvanced ? '' : '-rotate-90'}" />
				<span class="font-medium text-blue-400">Animation</span>
				{#if localAnimation?.type && localAnimation.type !== 'none'}
					<span class="ml-auto rounded bg-blue-500/20 px-1.5 py-0.5 text-xs text-blue-400">Active</span>
				{/if}
			</Collapsible.Trigger>
			<HelpTooltip text="Animation applies to this entire layer and all components within it." />
		</div>
		<Collapsible.Content>
			<div class="mt-2 rounded border border-blue-500/20 bg-blue-500/5 p-2">
				<AnimationControls bind:animation={localAnimation} />
			</div>
		</Collapsible.Content>
	</Collapsible.Root>

	<!-- Delete Layer (hidden for Card Base) -->
	{#if !container.isCardBase}
		<div class="border-t border-destructive/20 pt-3">
			<Button variant="destructive" size="sm" class="w-full" onclick={onDelete}>
				Delete Layer
			</Button>
		</div>
	{/if}
</div>
