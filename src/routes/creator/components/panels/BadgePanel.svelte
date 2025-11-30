<script lang="ts">
	import ComponentPanel from '../ComponentPanel.svelte';
	import {
		FormSelect,
		FormColorPicker,
		FormInput,
		FormSlider,
		FormGrid,
		PanelEffects
	} from '../form';
	import type { BadgeComponent } from '../../types';
	import { dataFields, fontFamilies } from '../../types';

	let {
		component,
		expanded = $bindable(true),
		onUpdate,
		onRemove,
		onMoveUp,
		onMoveDown
	}: {
		component: BadgeComponent;
		expanded: boolean;
		onUpdate: (key: keyof Omit<BadgeComponent, 'type' | 'id'>, value: unknown) => void;
		onRemove: () => void;
		onMoveUp: () => void;
		onMoveDown: () => void;
	} = $props();

	const shapes = ['pill', 'square', 'diamond', 'hexagon', 'shield', 'star', 'circle'];
	const presets = ['custom', 'common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic', 'verified', 'new', 'sold', 'limited', 'promo', 'exclusive'];
	const sizes = [
		{ value: 'sm', label: 'SM' },
		{ value: 'md', label: 'MD' },
		{ value: 'lg', label: 'LG' }
	];

	const textPresets = [
		{ value: 'none', label: '(No text / Icon only)' },
		'COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY', 'MYTHIC',
		'NEW', 'HOT', 'SOLD', 'LIMITED', 'PROMO', 'EXCLUSIVE', 'VERIFIED',
		'1ST EDITION', 'SPECIAL', 'COLLECTOR', 'PREMIUM', 'ULTRA'
	];

	const dataFieldOptions = [
		{ value: '', label: 'None (use preset text)' },
		...dataFields
	];
</script>

<ComponentPanel
	title="Badge"
	badge={{ text: 'bdg', color: 'bg-purple-600' }}
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
			label="Shape"
			value={component.shape}
			onchange={(v) => onUpdate('shape', v)}
			options={shapes}
		/>
		<FormSelect
			label="Size"
			value={component.size}
			onchange={(v) => onUpdate('size', v)}
			options={sizes}
		/>
	</FormGrid>

	<FormSelect
		label="Preset"
		value={component.preset}
		onchange={(v) => onUpdate('preset', v)}
		options={presets}
	/>

	{#if component.preset === 'custom'}
		<FormGrid>
			<FormColorPicker
				label="Background"
				value={component.backgroundColor}
				onchange={(v) => onUpdate('backgroundColor', v)}
			/>
			<FormColorPicker
				label="Text Color"
				value={component.textColor}
				onchange={(v) => onUpdate('textColor', v)}
			/>
		</FormGrid>
	{/if}

	<FormGrid>
		<FormColorPicker
			label="Border Color"
			value={component.borderColor ?? '#ffffff'}
			onchange={(v) => onUpdate('borderColor', v)}
		/>
		<FormInput
			label="Border Width"
			type="number"
			value={component.borderWidth}
			onchange={(v) => onUpdate('borderWidth', Number(v) || 0)}
			min={0}
			max={10}
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
