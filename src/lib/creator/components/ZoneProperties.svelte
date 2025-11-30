<script lang="ts">
	import * as Card from '$lib/components/ui/card';
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
</script>

<Card.Root>
	<Collapsible.Root open={expanded} onOpenChange={() => onTogglePanel()}>
		<div class="flex items-center justify-between px-3 py-2 hover:bg-muted/50">
			<Collapsible.Trigger class="flex items-center gap-2 text-sm font-medium">
				<ChevronDown
					class="h-3 w-3 shrink-0 transition-transform duration-200 {expanded ? '' : '-rotate-90'}"
				/>
				Layer Properties
				<HelpTooltip text="Layers group components together. Animation applies to the entire layer and all its components." />
			</Collapsible.Trigger>
			<div class="flex gap-2">
				<Button
					variant="outline"
					size="sm"
					onclick={(e) => {
						e.stopPropagation();
						onDuplicate();
					}}>Duplicate</Button
				>
				<Button
					variant="destructive"
					size="sm"
					onclick={(e) => {
						e.stopPropagation();
						onDelete();
					}}>Delete</Button
				>
			</div>
		</div>

		<Collapsible.Content>
			<Card.Content class="space-y-3 border-t pt-3">
				<!-- Name -->
				<div>
					<label class="text-sm text-muted-foreground">Name</label>
					<input
						type="text"
						value={container.name}
						onchange={(e) => onUpdate('name', (e.target as HTMLInputElement).value)}
						class="w-full rounded border border-input bg-background px-2 py-1 text-sm"
					/>
				</div>

				<!-- Position & Size -->
				<div class="grid grid-cols-4 gap-2">
					<div>
						<label class="text-sm text-muted-foreground">X</label>
						<input
							type="number"
							value={container.x}
							onchange={(e) => onUpdate('x', parseInt((e.target as HTMLInputElement).value))}
							class="w-full rounded border border-input bg-background px-2 py-1 text-sm"
						/>
					</div>
					<div>
						<label class="text-sm text-muted-foreground">Y</label>
						<input
							type="number"
							value={container.y}
							onchange={(e) => onUpdate('y', parseInt((e.target as HTMLInputElement).value))}
							class="w-full rounded border border-input bg-background px-2 py-1 text-sm"
						/>
					</div>
					<div>
						<label class="text-sm text-muted-foreground">Width</label>
						<input
							type="number"
							value={container.width}
							onchange={(e) => onUpdate('width', parseInt((e.target as HTMLInputElement).value))}
							class="w-full rounded border border-input bg-background px-2 py-1 text-sm"
						/>
					</div>
					<div>
						<label class="text-sm text-muted-foreground">Height</label>
						<input
							type="number"
							value={container.height}
							onchange={(e) => onUpdate('height', parseInt((e.target as HTMLInputElement).value))}
							class="w-full rounded border border-input bg-background px-2 py-1 text-sm"
						/>
					</div>
				</div>

				<!-- Shape & Radius -->
				<div class="grid grid-cols-2 gap-2">
					<div>
						<Label class="text-sm text-muted-foreground">Clip Shape</Label>
						<Select.Root type="single" value={container.clipShape} onValueChange={(v) => v && onUpdate('clipShape', v as ClipShape)}>
							<Select.Trigger class="w-full">
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
							<label class="text-sm text-muted-foreground">Corner Radius</label>
							<input
								type="number"
								value={container.radius}
								onchange={(e) => onUpdate('radius', parseInt((e.target as HTMLInputElement).value))}
								class="w-full rounded border border-input bg-background px-2 py-1 text-sm"
							/>
						</div>
					{:else}
						<div>
							<Label class="text-sm text-muted-foreground">Clip Content</Label>
							<div class="mt-1 flex items-center gap-2">
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

				<!-- Layer Animation -->
				<div class="rounded border border-blue-500/30 bg-blue-500/5 p-2">
					<div class="mb-2 flex items-center gap-2">
						<span class="text-sm font-medium text-blue-400">Layer Animation</span>
						<HelpTooltip text="Animation applies to this entire layer and all components within it. All components will move together as a unit." />
					</div>
					<AnimationControls bind:animation={localAnimation} />
				</div>
			</Card.Content>
		</Collapsible.Content>
	</Collapsible.Root>
</Card.Root>
