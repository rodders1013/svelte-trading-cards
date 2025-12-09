<script lang="ts">
	import { Button } from '$lib/creator/ui/button';
	import * as Select from '$lib/creator/ui/select';
	import { FormColorPicker, FormSlider } from '../form';
	import Sparkles from '@lucide/svelte/icons/sparkles';
	import RotateCcw from '@lucide/svelte/icons/rotate-ccw';

	let {
		value = $bindable<string | undefined>(undefined),
		disabled = false
	}: {
		value?: string;
		disabled?: boolean;
	} = $props();

	// Gradient presets
	const PRESETS = {
		default: {
			name: 'Default',
			highlight: '#ffffff',
			mid: '#e0d4ff',
			shadow: '#1a0a2e',
			intensity: 0.66
		},
		gold: {
			name: 'Gold',
			highlight: '#fff9e6',
			mid: '#ffd700',
			shadow: '#8b6914',
			intensity: 0.7
		},
		silver: {
			name: 'Silver',
			highlight: '#ffffff',
			mid: '#c0c0c0',
			shadow: '#4a4a4a',
			intensity: 0.6
		},
		rainbow: {
			name: 'Rainbow',
			highlight: '#ff6b6b',
			mid: '#4ecdc4',
			shadow: '#45b7d1',
			intensity: 0.8
		},
		emerald: {
			name: 'Emerald',
			highlight: '#d4ffed',
			mid: '#10b981',
			shadow: '#064e3b',
			intensity: 0.65
		},
		ruby: {
			name: 'Ruby',
			highlight: '#ffe4e6',
			mid: '#ef4444',
			shadow: '#7f1d1d',
			intensity: 0.7
		},
		sapphire: {
			name: 'Sapphire',
			highlight: '#dbeafe',
			mid: '#3b82f6',
			shadow: '#1e3a8a',
			intensity: 0.65
		},
		amethyst: {
			name: 'Amethyst',
			highlight: '#f3e8ff',
			mid: '#a855f7',
			shadow: '#581c87',
			intensity: 0.7
		}
	} as const;

	type PresetKey = keyof typeof PRESETS;

	// State
	let selectedPreset = $state<PresetKey | 'custom'>('default');
	let highlight = $state('#ffffff');
	let mid = $state('#e0d4ff');
	let shadow = $state('#1a0a2e');
	let intensity = $state(0.66);

	// Parse existing value to initialize state
	$effect(() => {
		if (!value) {
			// Reset to default when value is cleared
			selectedPreset = 'default';
			const preset = PRESETS.default;
			highlight = preset.highlight;
			mid = preset.mid;
			shadow = preset.shadow;
			intensity = preset.intensity;
		}
	});

	// Build gradient CSS string
	function buildGradient(): string {
		return `radial-gradient(
			farthest-corner circle at var(--gradient-x) var(--gradient-y),
			${highlight}${Math.round(intensity * 255).toString(16).padStart(2, '0')} 8%,
			${mid}${Math.round(intensity * 0.75 * 255).toString(16).padStart(2, '0')} 28%,
			${shadow}${Math.round(intensity * 0.4 * 255).toString(16).padStart(2, '0')} 90%
		)`.replace(/\s+/g, ' ').trim();
	}

	// Update value when colors/intensity change
	function updateGradient() {
		value = buildGradient();
	}

	// Apply preset
	function applyPreset(presetKey: PresetKey) {
		const preset = PRESETS[presetKey];
		highlight = preset.highlight;
		mid = preset.mid;
		shadow = preset.shadow;
		intensity = preset.intensity;
		selectedPreset = presetKey;
		updateGradient();
	}

	// Handle preset change
	function handlePresetChange(v: string) {
		if (v === 'custom') {
			selectedPreset = 'custom';
		} else if (v in PRESETS) {
			applyPreset(v as PresetKey);
		}
	}

	// Handle color changes - mark as custom
	function handleColorChange() {
		selectedPreset = 'custom';
		updateGradient();
	}

	// Reset to default
	function reset() {
		value = undefined;
		selectedPreset = 'default';
		const preset = PRESETS.default;
		highlight = preset.highlight;
		mid = preset.mid;
		shadow = preset.shadow;
		intensity = preset.intensity;
	}

	// Preset options for select
	const presetOptions = Object.entries(PRESETS).map(([key, preset]) => ({
		value: key,
		label: preset.name
	}));
</script>

<div class="space-y-3">
	<!-- Preset selector -->
	<div class="flex items-center gap-2">
		<Sparkles class="h-4 w-4 text-amber-500" />
		<Select.Root type="single" value={selectedPreset} onValueChange={handlePresetChange} disabled={disabled}>
			<Select.Trigger class="h-8 flex-1 text-sm">
				<span>{selectedPreset === 'custom' ? 'Custom' : PRESETS[selectedPreset as PresetKey]?.name ?? 'Select'}</span>
			</Select.Trigger>
			<Select.Content>
				{#each presetOptions as option (option.value)}
					<Select.Item value={option.value} label={option.label} />
				{/each}
				<Select.Item value="custom" label="Custom" />
			</Select.Content>
		</Select.Root>
		{#if value}
			<Button variant="ghost" size="sm" class="h-8 px-2" onclick={reset} title="Reset to default" {disabled}>
				<RotateCcw class="h-4 w-4" />
			</Button>
		{/if}
	</div>

	<!-- Color pickers -->
	<div class="grid grid-cols-3 gap-2">
		<div class:opacity-50={disabled} class:pointer-events-none={disabled}>
			<FormColorPicker
				label="Highlight"
				bind:value={highlight}
				onchange={handleColorChange}
			/>
		</div>
		<div class:opacity-50={disabled} class:pointer-events-none={disabled}>
			<FormColorPicker
				label="Mid"
				bind:value={mid}
				onchange={handleColorChange}
			/>
		</div>
		<div class:opacity-50={disabled} class:pointer-events-none={disabled}>
			<FormColorPicker
				label="Shadow"
				bind:value={shadow}
				onchange={handleColorChange}
			/>
		</div>
	</div>

	<!-- Intensity slider -->
	<div class:opacity-50={disabled} class:pointer-events-none={disabled}>
		<FormSlider
			label="Intensity"
			bind:value={intensity}
			min={0.1}
			max={1}
			step={0.05}
			onchange={() => { handleColorChange(); }}
			percent
		/>
	</div>

	<!-- Preview -->
	{#if value}
		<div class="rounded-lg border p-2">
			<div class="text-xs text-muted-foreground mb-1">Preview</div>
			<div
				class="h-16 w-full rounded-md"
				style="background: {buildGradient().replace('var(--gradient-x)', '50%').replace('var(--gradient-y)', '30%')};"
			></div>
		</div>
	{/if}
</div>
