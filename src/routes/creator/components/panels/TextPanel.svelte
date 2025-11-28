<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import AnimationControls from '../AnimationControls.svelte';
	import type { TextComponent } from '../../types';
	import { dataFields, fontFamilies } from '../../types';

	let {
		component,
		expanded = $bindable(true),
		onUpdate,
		onRemove,
		onMoveUp,
		onMoveDown
	}: {
		component: TextComponent;
		expanded: boolean;
		onUpdate: (key: keyof Omit<TextComponent, 'type' | 'id'>, value: unknown) => void;
		onRemove: () => void;
		onMoveUp: () => void;
		onMoveDown: () => void;
	} = $props();
</script>

<div class="border-b">
	<div class="flex items-center justify-between px-3 py-2">
		<button
			class="flex items-center gap-2 text-sm font-medium hover:text-foreground/80"
			onclick={() => (expanded = !expanded)}
		>
			<span class="text-sm">{expanded ? '▼' : '▶'}</span>
			Text
		</button>
		<div class="flex items-center gap-1">
			<Button variant="ghost" size="sm" class="h-6 w-6 p-0 text-sm" onclick={onMoveUp} title="Move up">↑</Button>
			<Button variant="ghost" size="sm" class="h-6 w-6 p-0 text-sm" onclick={onMoveDown} title="Move down">↓</Button>
			<Button variant="ghost" size="sm" class="h-6 px-2 text-sm text-destructive hover:text-destructive" onclick={onRemove}>Remove</Button>
		</div>
	</div>

	{#if expanded}
		<div class="space-y-3 px-3 pb-3">
			<div class="rounded bg-muted/50 px-2 py-1.5 text-sm text-muted-foreground">
				Text automatically scales between min/max size to fit the zone
			</div>

			<div class="grid grid-cols-2 gap-2">
				<div>
					<label class="text-sm text-muted-foreground">Data Field</label>
					<select
						value={component.dataField}
						onchange={(e) => onUpdate('dataField', (e.target as HTMLSelectElement).value)}
						class="w-full rounded border border-input bg-background px-2 py-1 text-sm"
					>
						{#each dataFields as field}
							<option value={field.value}>{field.label}</option>
						{/each}
					</select>
				</div>
				<div>
					<label class="text-sm text-muted-foreground">Font Family</label>
					<select
						value={component.fontFamily}
						onchange={(e) => onUpdate('fontFamily', (e.target as HTMLSelectElement).value)}
						class="w-full rounded border border-input bg-background px-2 py-1 text-sm"
					>
						{#each fontFamilies as font}
							<option value={font.value}>{font.label}</option>
						{/each}
					</select>
				</div>
			</div>

			<div class="rounded border border-input p-2">
				<label class="text-sm font-medium">Font Size Range</label>
				<div class="mt-1 grid grid-cols-2 gap-2">
					<div>
						<label class="text-sm text-muted-foreground">Min Size</label>
						<input
							type="number"
							min="8"
							max={component.maxFontSize - 1}
							value={component.minFontSize}
							onchange={(e) => onUpdate('minFontSize', parseInt((e.target as HTMLInputElement).value))}
							class="w-full rounded border border-input bg-background px-2 py-1 text-sm"
						/>
					</div>
					<div>
						<label class="text-sm text-muted-foreground">Max Size</label>
						<input
							type="number"
							min={component.minFontSize + 1}
							max="200"
							value={component.maxFontSize}
							onchange={(e) => onUpdate('maxFontSize', parseInt((e.target as HTMLInputElement).value))}
							class="w-full rounded border border-input bg-background px-2 py-1 text-sm"
						/>
					</div>
				</div>
			</div>

			<div class="grid grid-cols-2 gap-2">
				<div>
					<label class="text-sm text-muted-foreground">Weight</label>
					<select
						value={component.fontWeight}
						onchange={(e) => onUpdate('fontWeight', (e.target as HTMLSelectElement).value)}
						class="w-full rounded border border-input bg-background px-2 py-1 text-sm"
					>
						<option value="normal">Normal</option>
						<option value="bold">Bold</option>
					</select>
				</div>
				<div>
					<label class="text-sm text-muted-foreground">Horizontal</label>
					<select
						value={component.alignment}
						onchange={(e) => onUpdate('alignment', (e.target as HTMLSelectElement).value as 'left' | 'center' | 'right')}
						class="w-full rounded border border-input bg-background px-2 py-1 text-sm"
					>
						<option value="left">Left</option>
						<option value="center">Center</option>
						<option value="right">Right</option>
					</select>
				</div>
			</div>

			<div>
				<label class="text-sm text-muted-foreground">Vertical Align</label>
				<select
					value={component.verticalAlign}
					onchange={(e) => onUpdate('verticalAlign', (e.target as HTMLSelectElement).value as 'top' | 'center' | 'bottom')}
					class="w-full rounded border border-input bg-background px-2 py-1 text-sm"
				>
					<option value="top">Top</option>
					<option value="center">Center</option>
					<option value="bottom">Bottom</option>
				</select>
			</div>

			<div>
				<label class="text-sm text-muted-foreground">Color</label>
				<div class="flex gap-2">
					<input
						type="color"
						value={component.fill}
						onchange={(e) => onUpdate('fill', (e.target as HTMLInputElement).value)}
						class="h-8 w-12 cursor-pointer rounded"
					/>
					<input
						type="text"
						value={component.fill}
						onchange={(e) => onUpdate('fill', (e.target as HTMLInputElement).value)}
						class="flex-1 rounded border border-input bg-background px-2 py-1 font-mono text-sm"
					/>
				</div>
			</div>

			<AnimationControls bind:animation={component.animation} />
		</div>
	{/if}
</div>
