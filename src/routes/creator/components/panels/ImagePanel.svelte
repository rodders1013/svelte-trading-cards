<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import AnimationControls from '../AnimationControls.svelte';
	import EffectsControls from '../EffectsControls.svelte';
	import type { ImageComponent } from '../../types';
	import { dataFields } from '../../types';

	let {
		component,
		expanded = $bindable(true),
		onUpdate,
		onRemove,
		onMoveUp,
		onMoveDown
	}: {
		component: ImageComponent;
		expanded: boolean;
		onUpdate: (key: keyof Omit<ImageComponent, 'type' | 'id'>, value: unknown) => void;
		onRemove: () => void;
		onMoveUp: () => void;
		onMoveDown: () => void;
	} = $props();

	const imageFields = dataFields.filter((f) => f.value.includes('Url') || f.value.includes('image'));
</script>

<div class="border-b">
	<div class="flex items-center justify-between px-3 py-2">
		<button
			class="flex items-center gap-2 text-sm font-medium hover:text-foreground/80"
			onclick={() => (expanded = !expanded)}
		>
			<span class="text-sm">{expanded ? '▼' : '▶'}</span>
			Image
		</button>
		<div class="flex items-center gap-1">
			<Button variant="ghost" size="sm" class="h-6 w-6 p-0 text-sm" onclick={onMoveUp} title="Move up">↑</Button>
			<Button variant="ghost" size="sm" class="h-6 w-6 p-0 text-sm" onclick={onMoveDown} title="Move down">↓</Button>
			<Button variant="ghost" size="sm" class="h-6 px-2 text-sm text-destructive hover:text-destructive" onclick={onRemove}>Remove</Button>
		</div>
	</div>

	{#if expanded}
		<div class="space-y-3 px-3 pb-3">
			<div>
				<label class="text-sm text-muted-foreground">Data Field</label>
				<select
					value={component.dataField}
					onchange={(e) => onUpdate('dataField', (e.target as HTMLSelectElement).value)}
					class="w-full rounded border border-input bg-background px-2 py-1 text-sm"
				>
					{#each imageFields as field}
						<option value={field.value}>{field.label}</option>
					{/each}
				</select>
			</div>

			<div class="grid grid-cols-2 gap-2">
				<div>
					<label class="text-sm text-muted-foreground">Fit Mode</label>
					<select
						value={component.preserveAspectRatio}
						onchange={(e) => onUpdate('preserveAspectRatio', (e.target as HTMLSelectElement).value)}
						class="w-full rounded border border-input bg-background px-2 py-1 text-sm"
					>
						<option value="xMidYMid slice">Cover (fill)</option>
						<option value="xMidYMid meet">Contain (fit)</option>
						<option value="none">Stretch</option>
					</select>
				</div>
				<div>
					<label class="text-sm text-muted-foreground">Opacity</label>
					<input
						type="range"
						min="0"
						max="1"
						step="0.05"
						value={component.opacity}
						oninput={(e) => onUpdate('opacity', parseFloat((e.target as HTMLInputElement).value))}
						class="w-full"
					/>
				</div>
			</div>

			<AnimationControls bind:animation={component.animation} />
			<EffectsControls bind:effect={component.effect} />
		</div>
	{/if}
</div>
