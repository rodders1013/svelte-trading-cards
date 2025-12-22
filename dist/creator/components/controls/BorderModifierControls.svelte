<script lang="ts">
	import { FormColorPicker, FormSlider, FormSelect, FormGrid } from '../form';
	import type { BorderModifier } from '../../../types/modifiers';

	let {
		border = $bindable<BorderModifier | undefined>(undefined)
	}: {
		border: BorderModifier | undefined;
	} = $props();

	// Initialize with default values when enabling
	function enableBorder() {
		border = {
			color: '#ffffff',
			width: 2,
			opacity: 1,
			style: 'solid'
		};
	}

	function disableBorder() {
		border = undefined;
	}

	function updateBorder<K extends keyof BorderModifier>(key: K, value: BorderModifier[K]) {
		if (border) {
			border = { ...border, [key]: value };
		}
	}

	const styleOptions = [
		{ value: 'solid', label: 'Solid' },
		{ value: 'dashed', label: 'Dashed' },
		{ value: 'dotted', label: 'Dotted' }
	];

	const hasBorder = $derived(!!border);
</script>

<!--
	BorderModifierControls - Controls for the BorderModifier (applied to any component)
	Note: For glow effects on borders, use Effect → strokeGlow via ModifiersPanel
-->

<div class="space-y-3">
	<!-- Enable/Disable Toggle -->
	<label class="flex items-center gap-2 cursor-pointer">
		<input
			type="checkbox"
			checked={hasBorder}
			onchange={(e) => e.currentTarget.checked ? enableBorder() : disableBorder()}
			class="rounded border-slate-600 bg-slate-700 text-blue-500"
		/>
		<span class="text-sm text-slate-300">Add Border</span>
	</label>

	{#if hasBorder && border}
		<FormGrid>
			<FormColorPicker
				label="Color"
				value={border.color}
				onchange={(v) => updateBorder('color', v)}
			/>
			<FormSlider
				label="Width"
				value={border.width}
				min={1}
				max={20}
				step={1}
				onchange={(v) => updateBorder('width', v)}
			/>
		</FormGrid>

		<FormGrid>
			<FormSelect
				label="Style"
				value={border.style ?? 'solid'}
				onchange={(v) => updateBorder('style', v as 'solid' | 'dashed' | 'dotted')}
				options={styleOptions}
			/>
			<FormSlider
				label="Opacity"
				value={(border.opacity ?? 1) * 100}
				min={0}
				max={100}
				step={1}
				suffix="%"
				onchange={(v) => updateBorder('opacity', v / 100)}
			/>
		</FormGrid>
	{/if}
</div>
