<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { IconPicker } from '$lib/components/icons';
	import type { IconData } from '$lib/components/icons';
	import AnimationControls from '../AnimationControls.svelte';
	import EffectsControls from '../EffectsControls.svelte';
	import type { IconComponent } from '../../types';

	let {
		component,
		expanded = $bindable(true),
		onUpdate,
		onUpdateIcon,
		onRemove,
		onMoveUp,
		onMoveDown
	}: {
		component: IconComponent;
		expanded: boolean;
		onUpdate: (key: keyof Omit<IconComponent, 'type' | 'id'>, value: unknown) => void;
		onUpdateIcon: (icon: { iconData: IconData; iconName: string }) => void;
		onRemove: () => void;
		onMoveUp: () => void;
		onMoveDown: () => void;
	} = $props();
</script>

<div class="border-b last:border-b-0">
	<div class="flex items-center justify-between px-3 py-2">
		<button
			class="flex items-center gap-2 text-sm font-medium hover:text-foreground/80"
			onclick={() => (expanded = !expanded)}
		>
			<span class="text-sm">{expanded ? '▼' : '▶'}</span>
			Icon
		</button>
		<div class="flex items-center gap-1">
			<Button variant="ghost" size="sm" class="h-6 w-6 p-0 text-sm" onclick={onMoveUp} title="Move up">↑</Button>
			<Button variant="ghost" size="sm" class="h-6 w-6 p-0 text-sm" onclick={onMoveDown} title="Move down">↓</Button>
			<Button variant="ghost" size="sm" class="h-6 px-2 text-sm text-destructive hover:text-destructive" onclick={onRemove}>Remove</Button>
		</div>
	</div>

	{#if expanded}
		<div class="space-y-4 px-3 pb-3">
			<!-- Icon Picker -->
			<IconPicker
				value={{ iconData: component.iconData, iconName: component.iconName }}
				onSelect={onUpdateIcon}
			/>

			<!-- Icon Settings -->
			{#if component.iconData?.body}
				<div class="space-y-3">
					<!-- Color -->
					<div>
						<label class="text-sm text-muted-foreground">Color</label>
						<input
							type="color"
							value={component.color}
							oninput={(e) => onUpdate('color', (e.target as HTMLInputElement).value)}
							class="h-8 w-full cursor-pointer rounded"
						/>
					</div>

					<!-- Size & Opacity -->
					<div class="grid grid-cols-2 gap-2">
						<div>
							<label class="text-sm text-muted-foreground">Size (auto if empty)</label>
							<input
								type="number"
								min="8"
								max="500"
								value={component.size ?? ''}
								placeholder="auto"
								onchange={(e) => onUpdate('size', (e.target as HTMLInputElement).value ? parseInt((e.target as HTMLInputElement).value) : undefined)}
								class="w-full rounded border border-input bg-background px-2 py-1 text-sm"
							/>
						</div>
						<div>
							<label class="text-sm text-muted-foreground">Opacity: {component.opacity.toFixed(2)}</label>
							<input
								type="range"
								min="0"
								max="1"
								step="0.05"
								value={component.opacity}
								oninput={(e) => onUpdate('opacity', parseFloat((e.target as HTMLInputElement).value))}
								class="mt-1 w-full"
							/>
						</div>
					</div>

					<!-- Rotation -->
					<div>
						<label class="text-sm text-muted-foreground">Rotation: {component.rotation}deg</label>
						<input
							type="range"
							min="0"
							max="360"
							step="15"
							value={component.rotation}
							oninput={(e) => onUpdate('rotation', parseInt((e.target as HTMLInputElement).value))}
							class="w-full"
						/>
					</div>

					<!-- Flip -->
					<div class="flex gap-4">
						<label class="flex items-center gap-2 text-sm">
							<input
								type="checkbox"
								checked={component.flipHorizontal}
								onchange={(e) => onUpdate('flipHorizontal', (e.target as HTMLInputElement).checked)}
							/>
							Flip Horizontal
						</label>
						<label class="flex items-center gap-2 text-sm">
							<input
								type="checkbox"
								checked={component.flipVertical}
								onchange={(e) => onUpdate('flipVertical', (e.target as HTMLInputElement).checked)}
							/>
							Flip Vertical
						</label>
					</div>

					<AnimationControls bind:animation={component.animation} />
					<EffectsControls bind:effect={component.effect} />
				</div>
			{/if}
		</div>
	{/if}
</div>
