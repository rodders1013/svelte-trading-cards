<script lang="ts">
	import { FormColorPicker, FormSlider, FormSelect, FormGrid } from '../form';
	import { Checkbox } from '$lib/creator/ui/checkbox';
	import { Label } from '$lib/creator/ui/label';
	import type { HolographicConfig } from '$lib/types';

	let {
		holographic = $bindable<HolographicConfig | undefined>(undefined)
	}: {
		holographic: HolographicConfig | undefined;
	} = $props();

	// Preset color combinations
	const presets = [
		{ name: 'Blue/Pink', color: '#3b82f6', secondary: '#ec4899', tertiary: undefined },
		{ name: 'Rainbow', color: '#ef4444', secondary: '#22c55e', tertiary: '#3b82f6' },
		{ name: 'Gold/Purple', color: '#f59e0b', secondary: '#8b5cf6', tertiary: undefined },
		{ name: 'Cyan/Magenta', color: '#06b6d4', secondary: '#d946ef', tertiary: undefined },
		{ name: 'Neon', color: '#00ff00', secondary: '#ff00ff', tertiary: '#00ffff' },
		{ name: 'Fire', color: '#ef4444', secondary: '#f59e0b', tertiary: '#fbbf24' },
		{ name: 'Ocean', color: '#0ea5e9', secondary: '#06b6d4', tertiary: '#14b8a6' },
		{ name: 'Sunset', color: '#f97316', secondary: '#ec4899', tertiary: '#8b5cf6' }
	] as const;

	// Track if tertiary color is enabled
	let useTertiaryColor = $state(false);

	// Initialize with default values when enabling
	function enableHolographic() {
		holographic = {
			color: '#3b82f6',
			secondaryColor: '#ec4899',
			speed: 3,
			angle: 45,
			apply: 'fill'
		};
		useTertiaryColor = false;
	}

	function disableHolographic() {
		holographic = undefined;
		useTertiaryColor = false;
	}

	function updateHolographic<K extends keyof HolographicConfig>(key: K, value: HolographicConfig[K]) {
		if (holographic) {
			holographic = { ...holographic, [key]: value };
		}
	}

	function applyPreset(preset: typeof presets[number]) {
		if (holographic) {
			holographic = {
				...holographic,
				color: preset.color,
				secondaryColor: preset.secondary,
				tertiaryColor: preset.tertiary
			};
			useTertiaryColor = !!preset.tertiary;
		}
	}

	function handleTertiaryToggle(checked: boolean) {
		useTertiaryColor = checked;
		if (!checked && holographic) {
			// Clear tertiary color when disabled
			holographic = { ...holographic, tertiaryColor: undefined };
		} else if (checked && holographic && !holographic.tertiaryColor) {
			// Set a default tertiary color when enabled
			holographic = { ...holographic, tertiaryColor: '#22c55e' };
		}
	}

	const applyOptions = [
		{ value: 'fill', label: 'Fill' },
		{ value: 'stroke', label: 'Stroke' },
		{ value: 'both', label: 'Both' }
	];

	const hasHolographic = $derived(!!holographic);

	// Sync useTertiaryColor state with holographic config
	$effect(() => {
		if (holographic?.tertiaryColor) {
			useTertiaryColor = true;
		}
	});
</script>

<div class="space-y-3">
	<!-- Enable/Disable Toggle -->
	<label class="flex items-center gap-2 cursor-pointer">
		<input
			type="checkbox"
			checked={hasHolographic}
			onchange={(e) => e.currentTarget.checked ? enableHolographic() : disableHolographic()}
			class="rounded border-slate-600 bg-slate-700 text-pink-500"
		/>
		<span class="text-sm text-slate-300">Enable Holographic</span>
	</label>

	{#if hasHolographic && holographic}
		<!-- Presets -->
		<div>
			<span class="text-xs text-muted-foreground">Presets</span>
			<div class="mt-1 flex flex-wrap gap-1">
				{#each presets as preset}
					<button
						class="rounded px-2 py-1 text-xs bg-muted hover:bg-muted/80 transition-colors"
						onclick={() => applyPreset(preset)}
					>
						{preset.name}
					</button>
				{/each}
			</div>
		</div>

		<!-- Color pickers -->
		<FormGrid>
			<FormColorPicker
				label="Primary"
				value={holographic.color ?? '#3b82f6'}
				onchange={(v) => updateHolographic('color', v)}
			/>
			<FormColorPicker
				label="Secondary"
				value={holographic.secondaryColor ?? '#ec4899'}
				onchange={(v) => updateHolographic('secondaryColor', v)}
			/>
		</FormGrid>

		<!-- Tertiary color toggle -->
		<div class="space-y-2">
			<div class="flex items-center gap-2">
				<Checkbox
					id="use-tertiary"
					checked={useTertiaryColor}
					onCheckedChange={(checked) => handleTertiaryToggle(checked === true)}
				/>
				<Label for="use-tertiary" class="text-sm">Rainbow (3 colors)</Label>
			</div>
			{#if useTertiaryColor}
				<FormColorPicker
					label="Tertiary"
					value={holographic.tertiaryColor ?? '#22c55e'}
					onchange={(v) => updateHolographic('tertiaryColor', v || undefined)}
				/>
			{/if}
		</div>

		<!-- Speed and Angle sliders -->
		<FormGrid>
			<FormSlider
				label="Speed"
				value={holographic.speed ?? 3}
				min={0.5}
				max={10}
				step={0.5}
				suffix="s"
				onchange={(v) => updateHolographic('speed', v)}
			/>
			<FormSlider
				label="Angle"
				value={holographic.angle ?? 45}
				min={0}
				max={360}
				step={15}
				suffix="°"
				onchange={(v) => updateHolographic('angle', v)}
			/>
		</FormGrid>

		<!-- Apply mode -->
		<FormSelect
			label="Apply To"
			value={holographic.apply ?? 'fill'}
			onchange={(v) => updateHolographic('apply', v as 'fill' | 'stroke' | 'both')}
			options={applyOptions}
		/>
	{/if}
</div>
