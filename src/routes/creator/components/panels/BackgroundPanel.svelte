<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import AnimationControls from '../AnimationControls.svelte';
	import EffectsControls from '../EffectsControls.svelte';
	import type { BackgroundComponent } from '../../types';

	let {
		component,
		expanded = $bindable(true),
		onUpdate,
		onRemove,
		onMoveUp,
		onMoveDown
	}: {
		component: BackgroundComponent;
		expanded: boolean;
		onUpdate: (key: keyof Omit<BackgroundComponent, 'type' | 'id'>, value: unknown) => void;
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
			Background
		</button>
		<div class="flex items-center gap-1">
			<Button variant="ghost" size="sm" class="h-6 w-6 p-0 text-sm" onclick={onMoveUp} title="Move up">↑</Button>
			<Button variant="ghost" size="sm" class="h-6 w-6 p-0 text-sm" onclick={onMoveDown} title="Move down">↓</Button>
			<Button variant="ghost" size="sm" class="h-6 px-2 text-sm text-destructive hover:text-destructive" onclick={onRemove}>Remove</Button>
		</div>
	</div>

	{#if expanded}
		<div class="space-y-3 px-3 pb-3">
			<!-- Fill Section -->
			<div class="rounded border border-input p-2">
				<label class="text-sm font-medium">Fill</label>
				<div class="mt-2 space-y-2">
					<div>
						<label class="text-sm text-muted-foreground">Type</label>
						<select
							value={component.fillType}
							onchange={(e) => onUpdate('fillType', (e.target as HTMLSelectElement).value as 'none' | 'solid' | 'gradient')}
							class="w-full rounded border border-input bg-background px-2 py-1 text-sm"
						>
							<option value="none">None</option>
							<option value="solid">Solid Color</option>
							<option value="gradient">Gradient</option>
						</select>
					</div>

					{#if component.fillType === 'solid'}
						<div>
							<label class="text-sm text-muted-foreground">Color</label>
							<input
								type="color"
								value={component.solidColor ?? '#1e293b'}
								oninput={(e) => onUpdate('solidColor', (e.target as HTMLInputElement).value)}
								class="h-8 w-full cursor-pointer rounded"
							/>
						</div>
						<div>
							<label class="text-sm text-muted-foreground">Fill Opacity: {(component.fillOpacity ?? 1).toFixed(2)}</label>
							<input
								type="range"
								min="0"
								max="1"
								step="0.05"
								value={component.fillOpacity ?? 1}
								oninput={(e) => onUpdate('fillOpacity', parseFloat((e.target as HTMLInputElement).value))}
								class="w-full"
							/>
						</div>
					{:else if component.fillType === 'gradient'}
						<div>
							<label class="text-sm text-muted-foreground">Direction</label>
							<select
								value={component.gradientDirection ?? 'vertical'}
								onchange={(e) => onUpdate('gradientDirection', (e.target as HTMLSelectElement).value as 'vertical' | 'horizontal' | 'diagonal')}
								class="w-full rounded border border-input bg-background px-2 py-1 text-sm"
							>
								<option value="vertical">Vertical</option>
								<option value="horizontal">Horizontal</option>
								<option value="diagonal">Diagonal</option>
							</select>
						</div>
						<div class="flex gap-2">
							<div class="flex-1">
								<label class="text-sm text-muted-foreground">Color 1</label>
								<input
									type="color"
									value={component.gradientColors?.[0] ?? '#1e293b'}
									oninput={(e) => onUpdate('gradientColors', [(e.target as HTMLInputElement).value, component.gradientColors?.[1] ?? '#0f172a'])}
									class="h-8 w-full cursor-pointer rounded"
								/>
							</div>
							<div class="flex-1">
								<label class="text-sm text-muted-foreground">Color 2</label>
								<input
									type="color"
									value={component.gradientColors?.[1] ?? '#0f172a'}
									oninput={(e) => onUpdate('gradientColors', [component.gradientColors?.[0] ?? '#1e293b', (e.target as HTMLInputElement).value])}
									class="h-8 w-full cursor-pointer rounded"
								/>
							</div>
						</div>
						<div>
							<label class="text-sm text-muted-foreground">Fill Opacity: {(component.fillOpacity ?? 1).toFixed(2)}</label>
							<input
								type="range"
								min="0"
								max="1"
								step="0.05"
								value={component.fillOpacity ?? 1}
								oninput={(e) => onUpdate('fillOpacity', parseFloat((e.target as HTMLInputElement).value))}
								class="w-full"
							/>
						</div>
					{/if}
				</div>
			</div>

			<!-- Pattern Overlay Section -->
			<div class="rounded border border-input p-2">
				<label class="text-sm font-medium">Pattern Overlay</label>
				<div class="mt-2 space-y-2">
					<div>
						<label class="text-sm text-muted-foreground">Pattern</label>
						<select
							value={component.patternType}
							onchange={(e) => onUpdate('patternType', (e.target as HTMLSelectElement).value as 'none' | 'dots' | 'grid' | 'diagonal' | 'hexagons')}
							class="w-full rounded border border-input bg-background px-2 py-1 text-sm"
						>
							<option value="none">None</option>
							<option value="dots">Dots</option>
							<option value="grid">Grid</option>
							<option value="diagonal">Diagonal Lines</option>
							<option value="hexagons">Hexagons</option>
						</select>
					</div>

					{#if component.patternType !== 'none'}
						<div>
							<label class="text-sm text-muted-foreground">Pattern Color</label>
							<input
								type="color"
								value={component.patternColor ?? '#ffffff'}
								oninput={(e) => onUpdate('patternColor', (e.target as HTMLInputElement).value)}
								class="h-8 w-full cursor-pointer rounded"
							/>
						</div>
						<div>
							<label class="text-sm text-muted-foreground">Pattern Opacity: {(component.patternOpacity ?? 0.3).toFixed(2)}</label>
							<input
								type="range"
								min="0.05"
								max="1"
								step="0.05"
								value={component.patternOpacity ?? 0.3}
								oninput={(e) => onUpdate('patternOpacity', parseFloat((e.target as HTMLInputElement).value))}
								class="w-full"
							/>
						</div>
					{/if}
				</div>
			</div>

			<AnimationControls bind:animation={component.animation} />
			<EffectsControls bind:effect={component.effect} />
		</div>
	{/if}
</div>
