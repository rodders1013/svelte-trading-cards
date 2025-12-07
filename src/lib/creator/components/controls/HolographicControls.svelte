<script lang="ts">
	import { FormColorPicker, FormSlider, FormSelect, FormGrid } from '../form';
	import type { HolographicConfig } from '$lib/types';

	let {
		holographic = $bindable<HolographicConfig | undefined>(undefined)
	}: {
		holographic: HolographicConfig | undefined;
	} = $props();

	// Initialize with default values when enabling
	function enableHolographic() {
		holographic = {
			color: '#3b82f6',
			secondaryColor: '#ec4899',
			speed: 3,
			angle: 45,
			apply: 'fill'
		};
	}

	function disableHolographic() {
		holographic = undefined;
	}

	function updateHolographic<K extends keyof HolographicConfig>(key: K, value: HolographicConfig[K]) {
		if (holographic) {
			holographic = { ...holographic, [key]: value };
		}
	}

	const applyOptions = [
		{ value: 'fill', label: 'Fill' },
		{ value: 'stroke', label: 'Stroke' },
		{ value: 'both', label: 'Both' }
	];

	const hasHolographic = $derived(!!holographic);
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
		<span class="text-sm text-slate-300">Holographic Effect</span>
	</label>

	{#if hasHolographic && holographic}
		<FormGrid>
			<FormColorPicker
				label="Primary Color"
				value={holographic.color ?? '#3b82f6'}
				onchange={(v) => updateHolographic('color', v)}
			/>
			<FormColorPicker
				label="Secondary Color"
				value={holographic.secondaryColor ?? '#ec4899'}
				onchange={(v) => updateHolographic('secondaryColor', v)}
			/>
		</FormGrid>

		<FormColorPicker
			label="Tertiary Color (optional)"
			value={holographic.tertiaryColor ?? ''}
			onchange={(v) => updateHolographic('tertiaryColor', v || undefined)}
		/>

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

		<FormSelect
			label="Apply To"
			value={holographic.apply ?? 'fill'}
			onchange={(v) => updateHolographic('apply', v as 'fill' | 'stroke' | 'both')}
			options={applyOptions}
		/>
	{/if}
</div>
