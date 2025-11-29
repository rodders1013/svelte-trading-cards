<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import AnimationControls from '../AnimationControls.svelte';
	import EffectsControls from '../EffectsControls.svelte';
	import type { BorderComponent } from '../../types';

	let {
		component,
		expanded = $bindable(true),
		onUpdate,
		onUpdateGlow,
		onUpdateHolographic,
		onRemove,
		onMoveUp,
		onMoveDown
	}: {
		component: BorderComponent;
		expanded: boolean;
		onUpdate: (key: keyof Omit<BorderComponent, 'type' | 'id'>, value: unknown) => void;
		onUpdateGlow: (key: string, value: unknown) => void;
		onUpdateHolographic: (key: string, value: unknown) => void;
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
			Border
		</button>
		<div class="flex items-center gap-1">
			<Button variant="ghost" size="sm" class="h-6 w-6 p-0 text-sm" onclick={onMoveUp} title="Move up">↑</Button>
			<Button variant="ghost" size="sm" class="h-6 w-6 p-0 text-sm" onclick={onMoveDown} title="Move down">↓</Button>
			<Button variant="ghost" size="sm" class="h-6 px-2 text-sm text-destructive hover:text-destructive" onclick={onRemove}>Remove</Button>
		</div>
	</div>

	{#if expanded}
		<div class="space-y-4 px-3 pb-3">
			<!-- Basic border settings -->
			<div class="grid grid-cols-3 gap-2">
				<div>
					<label class="text-sm text-muted-foreground">Color</label>
					<input
						type="color"
						value={component.color}
						oninput={(e) => onUpdate('color', (e.target as HTMLInputElement).value)}
						class="h-8 w-full cursor-pointer rounded"
					/>
				</div>
				<div>
					<label class="text-sm text-muted-foreground">Width</label>
					<input
						type="number"
						value={component.width}
						onchange={(e) => onUpdate('width', parseInt((e.target as HTMLInputElement).value))}
						class="w-full rounded border border-input bg-background px-2 py-1 text-sm"
					/>
				</div>
				<div>
					<label class="text-sm text-muted-foreground">Opacity</label>
					<input
						type="range"
						min="0"
						max="1"
						step="0.1"
						value={component.opacity}
						oninput={(e) => onUpdate('opacity', parseFloat((e.target as HTMLInputElement).value))}
						class="mt-2 w-full"
					/>
				</div>
			</div>

			<!-- Glow Effect -->
			<div class="rounded border border-input p-2">
				<label class="flex items-center gap-2 text-sm font-medium">
					<input
						type="checkbox"
						checked={component.glow?.enabled ?? false}
						onchange={(e) => onUpdateGlow('enabled', (e.target as HTMLInputElement).checked)}
					/>
					Glow Effect
				</label>
				{#if component.glow?.enabled}
					<div class="mt-2 grid grid-cols-2 gap-2">
						<div>
							<label class="text-sm text-muted-foreground">Color</label>
							<input
								type="color"
								value={component.glow.color}
								oninput={(e) => onUpdateGlow('color', (e.target as HTMLInputElement).value)}
								class="h-7 w-full cursor-pointer rounded"
							/>
						</div>
						<div>
							<label class="text-sm text-muted-foreground">Blur</label>
							<input
								type="number"
								value={component.glow.blur}
								onchange={(e) => onUpdateGlow('blur', parseInt((e.target as HTMLInputElement).value))}
								class="w-full rounded border border-input bg-background px-2 py-1 text-sm"
							/>
						</div>
						<div>
							<label class="text-sm text-muted-foreground">Intensity</label>
							<input
								type="range"
								min="0"
								max="1"
								step="0.1"
								value={component.glow.intensity}
								oninput={(e) => onUpdateGlow('intensity', parseFloat((e.target as HTMLInputElement).value))}
								class="w-full"
							/>
						</div>
						<div>
							<label class="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
								<input
									type="checkbox"
									checked={component.glow.animated}
									onchange={(e) => onUpdateGlow('animated', (e.target as HTMLInputElement).checked)}
								/>
								Animate
							</label>
						</div>
					</div>
				{/if}
			</div>

			<!-- Holographic Effect -->
			<div class="rounded border border-input p-2">
				<label class="flex items-center gap-2 text-sm font-medium">
					<input
						type="checkbox"
						checked={component.holographic?.enabled ?? false}
						onchange={(e) => onUpdateHolographic('enabled', (e.target as HTMLInputElement).checked)}
					/>
					Holographic Effect
				</label>
				{#if component.holographic?.enabled}
					<div class="mt-2 grid grid-cols-2 gap-2">
						<div>
							<label class="text-sm text-muted-foreground">Secondary Color</label>
							<input
								type="color"
								value={component.holographic.secondaryColor}
								oninput={(e) => onUpdateHolographic('secondaryColor', (e.target as HTMLInputElement).value)}
								class="h-7 w-full cursor-pointer rounded"
							/>
						</div>
						<div>
							<label class="text-sm text-muted-foreground">Speed (s)</label>
							<input
								type="number"
								min="0.5"
								max="10"
								step="0.5"
								value={component.holographic.speed}
								onchange={(e) => onUpdateHolographic('speed', parseFloat((e.target as HTMLInputElement).value))}
								class="w-full rounded border border-input bg-background px-2 py-1 text-sm"
							/>
						</div>
					</div>
				{/if}
			</div>

			<!-- Multi-layer -->
			<div class="rounded border border-input p-2">
				<label class="text-sm font-medium">Multi-Layer Border</label>
				<div class="mt-2 grid grid-cols-2 gap-2">
					<div>
						<label class="text-sm text-muted-foreground">Layers</label>
						<input
							type="number"
							min="1"
							max="5"
							value={component.layers ?? 1}
							onchange={(e) => onUpdate('layers', parseInt((e.target as HTMLInputElement).value))}
							class="w-full rounded border border-input bg-background px-2 py-1 text-sm"
						/>
					</div>
					<div>
						<label class="text-sm text-muted-foreground">Spacing</label>
						<input
							type="number"
							min="1"
							max="20"
							value={component.layerSpacing ?? 4}
							onchange={(e) => onUpdate('layerSpacing', parseInt((e.target as HTMLInputElement).value))}
							class="w-full rounded border border-input bg-background px-2 py-1 text-sm"
						/>
					</div>
				</div>
			</div>

			<AnimationControls bind:animation={component.animation} />
			<EffectsControls bind:effect={component.effect} />
		</div>
	{/if}
</div>
