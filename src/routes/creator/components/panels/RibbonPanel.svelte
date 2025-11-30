<script lang="ts">
	import ComponentPanel from '../ComponentPanel.svelte';
	import {
		FormSelect,
		FormColorPicker,
		FormSlider,
		FormInput,
		FormGrid,
		PanelEffects
	} from '../form';
	import type { RibbonComponent } from '../../types';
	import { dataFields, fontFamilies } from '../../types';

	let {
		component,
		expanded = $bindable(true),
		onUpdate,
		onRemove,
		onMoveUp,
		onMoveDown
	}: {
		component: RibbonComponent;
		expanded: boolean;
		onUpdate: (key: keyof Omit<RibbonComponent, 'type' | 'id'>, value: unknown) => void;
		onRemove: () => void;
		onMoveUp: () => void;
		onMoveDown: () => void;
	} = $props();

	const positions = ['top-left', 'top-right', 'bottom-left', 'bottom-right', 'top', 'bottom'];
	const styles = ['flat', 'folded', 'banner', 'bookmark'];

	const textPresets = [
		{ value: 'none', label: '(Default: RIBBON)' },
		'NEW', 'HOT', 'SOLD', 'SOLD OUT', 'LIMITED', 'EXCLUSIVE',
		'1ST EDITION', 'SPECIAL', 'COLLECTOR', 'PREMIUM',
		'PROMO', 'BONUS', 'FREE', 'SALE',
		'RARE', 'ULTRA RARE', 'LEGENDARY', 'MYTHIC',
		'VERIFIED', 'AUTHENTIC', 'OFFICIAL'
	];

	const dataFieldOptions = [
		{ value: '', label: 'None (use preset text)' },
		...dataFields
	];
</script>

<ComponentPanel
	title="Ribbon"
	badge={{ text: 'rib', color: 'bg-red-600' }}
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

	<FormGrid>
		<FormSelect
			label="Position"
			value={component.position}
			onchange={(v) => onUpdate('position', v)}
			options={positions}
		/>
		<FormSelect
			label="Style"
			value={component.style}
			onchange={(v) => onUpdate('style', v)}
			options={styles}
		/>
	</FormGrid>

	<FormGrid cols={3}>
		<FormColorPicker
			label="Ribbon"
			value={component.color}
			onchange={(v) => onUpdate('color', v)}
		/>
		<FormColorPicker
			label="Text"
			value={component.textColor}
			onchange={(v) => onUpdate('textColor', v)}
		/>
		<FormColorPicker
			label="Shadow"
			value={component.shadowColor}
			onchange={(v) => onUpdate('shadowColor', v)}
		/>
	</FormGrid>

	<FormGrid>
		<FormSlider
			label="Angle"
			value={component.angle}
			onchange={(v) => onUpdate('angle', v)}
			min={0}
			max={90}
			step={1}
			suffix="°"
		/>
		<FormInput
			label="Font Size"
			type="number"
			value={component.fontSize}
			onchange={(v) => onUpdate('fontSize', Number(v))}
			min={8}
			max={24}
		/>
	</FormGrid>

	<FormSelect
		label="Font Family"
		value={component.fontFamily}
		onchange={(v) => onUpdate('fontFamily', v)}
		options={fontFamilies}
	/>

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
