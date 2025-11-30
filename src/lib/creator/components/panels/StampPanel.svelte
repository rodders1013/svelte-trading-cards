<script lang="ts">
	import ComponentPanel from '../ComponentPanel.svelte';
	import {
		FormSelect,
		FormColorPicker,
		FormSlider,
		FormInput,
		FormCheckbox,
		FormGrid,
		PanelEffects
	} from '../form';
	import type { StampComponent, DataFieldOption } from '../../types';
	import { fontFamilies } from '../../types';

	let {
		component,
		dataFields,
		expanded = $bindable(true),
		onUpdate,
		onRemove,
		onMoveUp,
		onMoveDown
	}: {
		component: StampComponent;
		dataFields: DataFieldOption[];
		expanded: boolean;
		onUpdate: (key: keyof Omit<StampComponent, 'type' | 'id'>, value: unknown) => void;
		onRemove: () => void;
		onMoveUp: () => void;
		onMoveDown: () => void;
	} = $props();

	const styles = ['wax-seal', 'rubber', 'foil', 'embossed', 'badge'];

	const textPresets = [
		{ value: 'none', label: '(No text / Icon only)' },
		'#001', '#010', '#050', '#100', '#500', '#1000',
		'1ST EDITION', 'LIMITED EDITION', 'SPECIAL EDITION', 'COLLECTOR EDITION',
		'AUTHENTIC', 'VERIFIED', 'OFFICIAL', 'CERTIFIED', 'APPROVED',
		'PREMIUM', 'ELITE', 'MASTER', 'ORIGINAL',
		'2024', '2025', '2026'
	];

	const dataFieldOptions = [
		{ value: '', label: 'None (use preset text)' },
		...dataFields
	];
</script>

<ComponentPanel
	title="Stamp"
	badge={{ text: 'stp', color: 'bg-rose-700' }}
	bind:expanded
	{onRemove}
	{onMoveUp}
	{onMoveDown}
>
	<FormSelect
		label="Text Label"
		value={component.textPreset}
		onchange={(v) => onUpdate('textPreset', v)}
		options={textPresets}
	/>

	<FormSelect
		label="Data Field (overrides preset)"
		value={component.dataField ?? ''}
		onchange={(v) => onUpdate('dataField', v || undefined)}
		options={dataFieldOptions}
	/>

	<FormSelect
		label="Style"
		value={component.style}
		onchange={(v) => onUpdate('style', v)}
		options={styles}
	/>

	<FormGrid>
		<FormColorPicker
			label="Color"
			value={component.color}
			onchange={(v) => onUpdate('color', v)}
		/>
		<FormColorPicker
			label="Text Color"
			value={component.textColor}
			onchange={(v) => onUpdate('textColor', v)}
		/>
	</FormGrid>

	<FormSlider
		label="Rotation"
		value={component.rotation}
		onchange={(v) => onUpdate('rotation', v)}
		min={-45}
		max={45}
		step={1}
		suffix="°"
	/>

	<FormCheckbox
		label="Show Ring / Text Path"
		checked={component.showRing}
		onchange={(v) => onUpdate('showRing', v)}
	/>

	<FormGrid>
		<FormSelect
			label="Font Family"
			value={component.fontFamily}
			onchange={(v) => onUpdate('fontFamily', v)}
			options={fontFamilies}
		/>
		<FormInput
			label="Font Size"
			type="number"
			value={component.fontSize}
			onchange={(v) => onUpdate('fontSize', Number(v))}
			min={6}
			max={20}
		/>
	</FormGrid>

	<FormSlider
		label="Opacity"
		value={component.opacity}
		onchange={(v) => onUpdate('opacity', v)}
		min={0}
		max={1}
		step={0.05}
		percent
	/>

	<PanelEffects bind:effect={component.effect} />
</ComponentPanel>
