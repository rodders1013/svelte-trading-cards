<script lang="ts">
	import {
		getEffectOptions,
		getDefaultEffectConfig,
		type EffectConfig,
		type EffectType
	} from '$lib/styling/effects';
	import * as Select from '$lib/creator/ui/select';
	import { Checkbox } from '$lib/creator/ui/checkbox';
	import { Label } from '$lib/creator/ui/label';
	import { Slider } from '$lib/creator/ui/slider';

	let {
		effect = $bindable<EffectConfig | undefined>(undefined)
	}: {
		effect: EffectConfig | undefined;
	} = $props();

	const effectOptions = getEffectOptions();

	const liftOptions: { value: 'sm' | 'md' | 'lg' | 'xl'; label: string }[] = [
		{ value: 'sm', label: 'Small' },
		{ value: 'md', label: 'Medium' },
		{ value: 'lg', label: 'Large' },
		{ value: 'xl', label: 'Extra Large' }
	];

	// Curated neon colors that look great
	const neonColors = [
		{ label: 'Hot Pink', value: '#ff1493' },
		{ label: 'Electric Blue', value: '#00d4ff' },
		{ label: 'Neon Green', value: '#39ff14' },
		{ label: 'Purple', value: '#bf00ff' },
		{ label: 'Orange', value: '#ff6600' },
		{ label: 'Red', value: '#ff0040' },
		{ label: 'Yellow', value: '#ffff00' },
		{ label: 'Cyan', value: '#00ffff' }
	];

	function handleTypeChange(type: string | undefined) {
		if (!type || type === 'none') {
			effect = undefined;
		} else {
			effect = getDefaultEffectConfig(type as EffectType);
		}
	}

	function updateEffect(key: string, value: unknown) {
		if (effect) {
			effect = { ...effect, [key]: value } as EffectConfig;
		}
	}

	// Get label for current effect type
	const currentEffectLabel = $derived(
		effectOptions.find((opt) => opt.value === (effect?.type ?? 'none'))?.label ?? 'None'
	);

	// Get label for current elevation (only for lift effect)
	const currentElevationLabel = $derived.by(() => {
		const e = effect;
		if (e && e.type === 'lift') {
			return liftOptions.find((opt) => opt.value === e.elevation)?.label ?? 'Medium';
		}
		return '';
	});
</script>

<div class="rounded border border-input p-2">
	<span class="text-sm font-medium">Effects</span>
	<div class="mt-2 space-y-2">
		<div>
			<span class="text-sm text-muted-foreground">Type</span>
			<Select.Root type="single" value={effect?.type ?? 'none'} onValueChange={handleTypeChange}>
				<Select.Trigger class="mt-1 w-full">
					{currentEffectLabel}
				</Select.Trigger>
				<Select.Content>
					{#each effectOptions as opt (opt.value)}
						<Select.Item value={opt.value} label={opt.label} />
					{/each}
				</Select.Content>
			</Select.Root>
		</div>

		{#if effect}
			<!-- Glow Effect Controls -->
			{#if effect.type === 'glow'}
				<div>
					<span class="text-sm text-muted-foreground">Color</span>
					<input
						type="color"
						class="mt-1 h-8 w-full cursor-pointer rounded border border-input"
						value={effect.color}
						oninput={(e) => updateEffect('color', (e.target as HTMLInputElement).value)}
					/>
				</div>
				<div>
					<span class="text-sm text-muted-foreground">Blur: {effect.blur}px</span>
					<input
						type="range"
						class="mt-1 w-full"
						min="1"
						max="50"
						value={effect.blur}
						oninput={(e) => updateEffect('blur', parseInt((e.target as HTMLInputElement).value))}
					/>
				</div>
				<div>
					<span class="text-sm text-muted-foreground">Intensity: {Math.round(effect.intensity * 100)}%</span>
					<input
						type="range"
						class="mt-1 w-full"
						min="0"
						max="100"
						value={effect.intensity * 100}
						oninput={(e) => updateEffect('intensity', parseInt((e.target as HTMLInputElement).value) / 100)}
					/>
				</div>

			<!-- Stroke Glow Effect Controls -->
			{:else if effect.type === 'strokeGlow'}
				<div>
					<span class="text-sm text-muted-foreground">Color (optional)</span>
					<input
						type="color"
						class="mt-1 h-8 w-full cursor-pointer rounded border border-input"
						value={effect.color ?? '#ffffff'}
						oninput={(e) => updateEffect('color', (e.target as HTMLInputElement).value)}
					/>
					<button
						type="button"
						class="mt-1 text-xs text-muted-foreground hover:text-foreground"
						onclick={() => updateEffect('color', undefined)}
					>
						Clear (use stroke color)
					</button>
				</div>
				<div>
					<span class="text-sm text-muted-foreground">Blur: {effect.blur}px</span>
					<input
						type="range"
						class="mt-1 w-full"
						min="1"
						max="50"
						value={effect.blur}
						oninput={(e) => updateEffect('blur', parseInt((e.target as HTMLInputElement).value))}
					/>
				</div>
				<div>
					<span class="text-sm text-muted-foreground">Intensity: {Math.round(effect.intensity * 100)}%</span>
					<input
						type="range"
						class="mt-1 w-full"
						min="0"
						max="100"
						value={effect.intensity * 100}
						oninput={(e) => updateEffect('intensity', parseInt((e.target as HTMLInputElement).value) / 100)}
					/>
				</div>

			<!-- Shadow Effect Controls -->
			{:else if effect.type === 'shadow'}
				<div>
					<span class="text-sm text-muted-foreground">Color</span>
					<input
						type="color"
						class="mt-1 h-8 w-full cursor-pointer rounded border border-input"
						value={effect.color.startsWith('rgba') ? '#000000' : effect.color}
						oninput={(e) => updateEffect('color', (e.target as HTMLInputElement).value)}
					/>
				</div>
				<div class="grid grid-cols-2 gap-2">
					<div>
						<span class="text-sm text-muted-foreground">Offset X: {effect.offsetX}</span>
						<input
							type="range"
							class="mt-1 w-full"
							min="-50"
							max="50"
							value={effect.offsetX}
							oninput={(e) => updateEffect('offsetX', parseInt((e.target as HTMLInputElement).value))}
						/>
					</div>
					<div>
						<span class="text-sm text-muted-foreground">Offset Y: {effect.offsetY}</span>
						<input
							type="range"
							class="mt-1 w-full"
							min="-50"
							max="50"
							value={effect.offsetY}
							oninput={(e) => updateEffect('offsetY', parseInt((e.target as HTMLInputElement).value))}
						/>
					</div>
				</div>
				<div>
					<span class="text-sm text-muted-foreground">Blur: {effect.blur}px</span>
					<input
						type="range"
						class="mt-1 w-full"
						min="0"
						max="50"
						value={effect.blur}
						oninput={(e) => updateEffect('blur', parseInt((e.target as HTMLInputElement).value))}
					/>
				</div>

			<!-- Neon Effect Controls -->
			{:else if effect.type === 'neon'}
				<div>
					<span class="text-sm text-muted-foreground">Neon Color</span>
					<div class="mt-1 flex flex-wrap gap-1">
						{#each neonColors as neon}
							<button
								type="button"
								class="h-7 w-7 rounded border-2 transition-transform hover:scale-110"
								class:border-white={effect.color === neon.value}
								class:border-transparent={effect.color !== neon.value}
								style="background-color: {neon.value}; box-shadow: 0 0 8px {neon.value};"
								title={neon.label}
								onclick={() => updateEffect('color', neon.value)}
							></button>
						{/each}
					</div>
					<input
						type="color"
						class="mt-2 h-8 w-full cursor-pointer rounded border border-input"
						value={effect.color}
						oninput={(e) => updateEffect('color', (e.target as HTMLInputElement).value)}
					/>
				</div>
				<div>
					<span class="text-sm text-muted-foreground">Intensity: {Math.round(effect.intensity * 100)}%</span>
					<input
						type="range"
						class="mt-1 w-full"
						min="0"
						max="100"
						value={effect.intensity * 100}
						oninput={(e) => updateEffect('intensity', parseInt((e.target as HTMLInputElement).value) / 100)}
					/>
				</div>
				<div>
					<span class="text-sm text-muted-foreground">Spread: {effect.spread}x</span>
					<input
						type="range"
						class="mt-1 w-full"
						min="1"
						max="3"
						step="0.5"
						value={effect.spread}
						oninput={(e) => updateEffect('spread', parseFloat((e.target as HTMLInputElement).value))}
					/>
				</div>

			<!-- Inner Glow Effect Controls -->
			{:else if effect.type === 'innerGlow'}
				<div>
					<span class="text-sm text-muted-foreground">Color</span>
					<input
						type="color"
						class="mt-1 h-8 w-full cursor-pointer rounded border border-input"
						value={effect.color}
						oninput={(e) => updateEffect('color', (e.target as HTMLInputElement).value)}
					/>
				</div>
				<div>
					<span class="text-sm text-muted-foreground">Blur: {effect.blur}px</span>
					<input
						type="range"
						class="mt-1 w-full"
						min="1"
						max="30"
						value={effect.blur}
						oninput={(e) => updateEffect('blur', parseInt((e.target as HTMLInputElement).value))}
					/>
				</div>
				<div>
					<span class="text-sm text-muted-foreground">Intensity: {Math.round(effect.intensity * 100)}%</span>
					<input
						type="range"
						class="mt-1 w-full"
						min="0"
						max="100"
						value={effect.intensity * 100}
						oninput={(e) => updateEffect('intensity', parseInt((e.target as HTMLInputElement).value) / 100)}
					/>
				</div>

			<!-- Lift Effect Controls -->
			{:else if effect.type === 'lift'}
				<div>
					<span class="text-sm text-muted-foreground">Elevation</span>
					<Select.Root type="single" value={effect.elevation} onValueChange={(v) => v && updateEffect('elevation', v)}>
						<Select.Trigger class="mt-1 w-full">
							{currentElevationLabel}
						</Select.Trigger>
						<Select.Content>
							{#each liftOptions as opt (opt.value)}
								<Select.Item value={opt.value} label={opt.label} />
							{/each}
						</Select.Content>
					</Select.Root>
				</div>

			<!-- Outline Effect Controls -->
			{:else if effect.type === 'outline'}
				<div>
					<span class="text-sm text-muted-foreground">Color</span>
					<input
						type="color"
						class="mt-1 h-8 w-full cursor-pointer rounded border border-input"
						value={effect.color}
						oninput={(e) => updateEffect('color', (e.target as HTMLInputElement).value)}
					/>
				</div>
				<div>
					<span class="text-sm text-muted-foreground">Width: {effect.width}px</span>
					<input
						type="range"
						class="mt-1 w-full"
						min="1"
						max="10"
						value={effect.width}
						oninput={(e) => updateEffect('width', parseInt((e.target as HTMLInputElement).value))}
					/>
				</div>
			{/if}

			<!-- Animation toggle (available for all effects) -->
			<div class="border-t border-input pt-2">
				<div class="flex items-center gap-2">
					<Checkbox
						id="effect-animated"
						checked={effect.animated}
						onCheckedChange={(checked) => updateEffect('animated', checked === true)}
					/>
					<Label for="effect-animated" class="text-sm">Animated (pulsing)</Label>
				</div>
				{#if effect.animated}
					<div class="mt-2">
						<div class="flex items-center justify-between">
							<span class="text-sm text-muted-foreground">Duration</span>
							<span class="text-sm text-muted-foreground">{effect.animationDuration.toFixed(1)}s</span>
						</div>
						<Slider
							type="single"
							class="mt-2"
							value={effect.animationDuration}
							min={0.1}
							max={5}
							step={0.1}
							onValueChange={(v: number) => updateEffect('animationDuration', v)}
						/>
					</div>
				{/if}
			</div>
		{/if}
	</div>
</div>
