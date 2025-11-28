<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import type { ContainerState, ClipShape } from '../types';

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
</script>

<Card.Root>
	<button class="flex w-full items-center justify-between px-3 py-2 hover:bg-muted/50" onclick={onTogglePanel}>
		<span class="flex items-center gap-2 text-sm font-medium">
			<span class="text-sm">{expanded ? '▼' : '▶'}</span>
			Zone Properties
		</span>
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
	</button>

	{#if expanded}
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
					<label class="text-sm text-muted-foreground">Clip Shape</label>
					<select
						value={container.clipShape}
						onchange={(e) => onUpdate('clipShape', (e.target as HTMLSelectElement).value as ClipShape)}
						class="w-full rounded border border-input bg-background px-2 py-1 text-sm"
					>
						<option value="rect">Rectangle</option>
						<option value="circle">Circle</option>
						<option value="ellipse">Ellipse</option>
						<option value="hexagon">Hexagon</option>
						<option value="octagon">Octagon</option>
						<option value="diamond">Diamond</option>
						<option value="shield">Shield</option>
						<option value="star">Star</option>
					</select>
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
						<label class="text-sm text-muted-foreground">Clip Content</label>
						<label class="mt-1 flex items-center gap-2">
							<input
								type="checkbox"
								checked={container.clipContent}
								onchange={(e) => onUpdate('clipContent', (e.target as HTMLInputElement).checked)}
							/>
							<span class="text-sm">Enabled</span>
						</label>
					</div>
				{/if}
			</div>
		</Card.Content>
	{/if}
</Card.Root>
