<script lang="ts">
	import { Button } from '$lib/creator/ui/button';
	import * as Collapsible from '$lib/creator/ui/collapsible';
	import { Label } from '$lib/creator/ui/label';
	import { Checkbox } from '$lib/creator/ui/checkbox';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import X from '@lucide/svelte/icons/x';
	import AnimationControls from './controls/AnimationControls.svelte';
	import BlendControls from './controls/BlendControls.svelte';
	import HelpTooltip from './HelpTooltip.svelte';
	import ShapePicker from '$lib/styling/shapes/ShapePicker.svelte';
	import type { ShapeSource } from '$lib/styling/shapes';
	import type { ContainerState } from '../types';
	import type { AnimationConfig } from '$lib/styling/animations';

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
	let showBlend = $state(false);
	let showShape = $state(false);

	// Check if current shape is a simple rect (no shapeSource)
	const isSimpleRect = $derived(!container.shapeSource);

	// Handle shape source change
	function handleShapeChange(source: ShapeSource) {
		// If selecting rectangle, clear shapeSource to use default rect behavior
		if (source.type === 'builtin' && source.shape === 'rectangle') {
			onUpdate('shapeSource', undefined);
		} else {
			onUpdate('shapeSource', source);
			// Shapes always clip - ensure clipContent is enabled
			if (!container.clipContent) {
				onUpdate('clipContent', true);
			}
		}
	}

	// Get current shape for display
	const currentShapeValue = $derived<ShapeSource>(
		container.shapeSource ?? { type: 'builtin', shape: 'rectangle' }
	);
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

		<!-- Corner Radius & Clip Content (only for default rect - no shapeSource) -->
		{#if isSimpleRect}
			<div class="grid grid-cols-2 gap-2">
				<div>
					<label class="mb-1 block text-xs text-muted-foreground">Corner Radius</label>
					<input
						type="number"
						value={container.radius}
						onchange={(e) => onUpdate('radius', parseInt((e.target as HTMLInputElement).value))}
						class="h-8 w-full rounded border border-input bg-background px-2 text-sm"
					/>
				</div>
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
			</div>
		{/if}
		<!-- Note: When a clip shape is selected, it always clips (shape IS the mask) -->

		<!-- Shape Section -->
		<Collapsible.Root bind:open={showShape}>
			<div class="flex items-center gap-2 rounded border border-purple-500/30 bg-purple-500/5 px-2 py-1.5 text-sm hover:bg-purple-500/10">
				<Collapsible.Trigger class="flex flex-1 items-center gap-2">
					<ChevronDown class="h-3 w-3 transition-transform {showShape ? '' : '-rotate-90'}" />
					<span class="font-medium text-purple-400">Clip Shape</span>
					{#if !isSimpleRect && container.shapeSource}
						<span class="ml-auto rounded bg-purple-500/20 px-1.5 py-0.5 text-xs text-purple-400 capitalize">
							{container.shapeSource.type === 'builtin' ? container.shapeSource.shape : 'custom'}
						</span>
					{/if}
				</Collapsible.Trigger>
				{#if !isSimpleRect}
					<button
						class="rounded p-0.5 text-purple-400 hover:bg-purple-500/20"
						onclick={() => onUpdate('shapeSource', undefined)}
						title="Remove clip shape"
					>
						<X class="h-3 w-3" />
					</button>
				{/if}
				<HelpTooltip text="Shape used to clip/mask this layer's content." />
			</div>
			<Collapsible.Content>
				<div class="mt-2 rounded border border-purple-500/20 bg-purple-500/5 p-2">
					<ShapePicker
						value={currentShapeValue}
						onchange={handleShapeChange}
					/>
				</div>
			</Collapsible.Content>
		</Collapsible.Root>
	{/if}

	<!-- Animation Section -->
	<Collapsible.Root bind:open={showAdvanced}>
		<div class="flex items-center gap-2 rounded border border-blue-500/30 bg-blue-500/5 px-2 py-1.5 text-sm hover:bg-blue-500/10">
			<Collapsible.Trigger class="flex flex-1 items-center gap-2">
				<ChevronDown class="h-3 w-3 transition-transform {showAdvanced ? '' : '-rotate-90'}" />
				<span class="font-medium text-blue-400">Animation</span>
				{#if localAnimation?.type && localAnimation.type !== 'none'}
					<span class="ml-auto rounded bg-blue-500/20 px-1.5 py-0.5 text-xs text-blue-400 capitalize">{localAnimation.type}</span>
				{/if}
			</Collapsible.Trigger>
			{#if localAnimation?.type && localAnimation.type !== 'none'}
				<button
					class="rounded p-0.5 text-blue-400 hover:bg-blue-500/20"
					onclick={() => { localAnimation = undefined; }}
					title="Remove animation"
				>
					<X class="h-3 w-3" />
				</button>
			{/if}
			<HelpTooltip text="Animation applies to this entire layer and all components within it." />
		</div>
		<Collapsible.Content>
			<div class="mt-2 rounded border border-blue-500/20 bg-blue-500/5 p-2">
				<AnimationControls bind:animation={localAnimation} />
			</div>
		</Collapsible.Content>
	</Collapsible.Root>

	<!-- Blend Mode Section -->
	<Collapsible.Root bind:open={showBlend}>
		<div class="flex items-center gap-2 rounded border border-amber-500/30 bg-amber-500/5 px-2 py-1.5 text-sm hover:bg-amber-500/10">
			<Collapsible.Trigger class="flex flex-1 items-center gap-2">
				<ChevronDown class="h-3 w-3 transition-transform {showBlend ? '' : '-rotate-90'}" />
				<span class="font-medium text-amber-400">Blend Mode</span>
				{#if container.blendMode && container.blendMode !== 'normal'}
					<span class="ml-auto rounded bg-amber-500/20 px-1.5 py-0.5 text-xs text-amber-400 capitalize">{container.blendMode}</span>
				{/if}
			</Collapsible.Trigger>
			{#if container.blendMode && container.blendMode !== 'normal'}
				<button
					class="rounded p-0.5 text-amber-400 hover:bg-amber-500/20"
					onclick={() => onUpdate('blendMode', undefined)}
					title="Remove blend mode"
				>
					<X class="h-3 w-3" />
				</button>
			{/if}
			<HelpTooltip text="Blend mode affects how this layer composites with layers below it." />
		</div>
		<Collapsible.Content>
			<div class="mt-2 rounded border border-amber-500/20 bg-amber-500/5 p-2">
				<BlendControls
					blendMode={container.blendMode}
					onUpdate={(mode) => onUpdate('blendMode', mode)}
				/>
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
