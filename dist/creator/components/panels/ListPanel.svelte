<script lang="ts">
	import ComponentPanel from '../ComponentPanel.svelte';
	import {
		FormSelect,
		FormFontSelect,
		FormColorPicker,
		FormInput,
		FormSlider,
		FormGrid
	} from '../form';
	import ModifiersPanel from './ModifiersPanel.svelte';
	import type { ListComponent, DataFieldOption } from '../../types';
	import { getAllFontsForDataset } from '../../../fonts';
	import { DEFAULT_DATASET, type DatasetId } from '../../../presets';

	let {
		component,
		dataFields,
		datasetId = DEFAULT_DATASET,
		expanded = $bindable(true),
		onUpdate,
		onRemove,
		onMoveUp,
		onMoveDown
	}: {
		component: ListComponent;
		dataFields: DataFieldOption[];
		datasetId?: DatasetId;
		expanded: boolean;
		onUpdate: (key: keyof Omit<ListComponent, 'type' | 'id'>, value: unknown) => void;
		onRemove: () => void;
		onMoveUp: () => void;
		onMoveDown: () => void;
	} = $props();

	// Get fonts for current dataset (brand fonts first, then web-safe by category)
	const fontOptions = $derived(getAllFontsForDataset(datasetId));

	const styles = [
		{ value: 'bullet', label: 'Bullet (•)' },
		{ value: 'numbered', label: 'Numbered (1.)' },
		{ value: 'dash', label: 'Dash (–)' },
		{ value: 'arrow', label: 'Arrow (→)' },
		{ value: 'none', label: 'None' }
	];

	const alignments = ['left', 'center', 'right'];
	const verticalAligns = ['top', 'center', 'bottom'];
	const fontWeights = ['normal', 'bold', 'lighter'];

	// Filter data fields to show only array-compatible fields
	const arrayFieldOptions = [
		{ value: '', label: 'Select data field...' },
		...dataFields
	];
</script>

<ComponentPanel
	title="List"
	badge={{ text: 'lst', color: 'bg-teal-600' }}
	bind:expanded
	{onRemove}
	{onMoveUp}
	{onMoveDown}
>
	<!-- Data Binding -->
	<FormSelect
		label="Data Field"
		value={component.dataField}
		onchange={(v) => onUpdate('dataField', v)}
		options={arrayFieldOptions}
	/>

	<FormInput
		label="Delimiter"
		value={component.delimiter}
		onchange={(v) => onUpdate('delimiter', v)}
		placeholder=","
	/>

	<!-- Style -->
	<FormSelect
		label="List Style"
		value={component.style}
		onchange={(v) => onUpdate('style', v)}
		options={styles}
	/>

	<!-- Typography -->
	<FormGrid>
		<FormInput
			label="Font Size"
			type="number"
			value={component.fontSize}
			onchange={(v) => onUpdate('fontSize', Number(v))}
			min={8}
			max={48}
		/>
		<FormSelect
			label="Weight"
			value={component.fontWeight}
			onchange={(v) => onUpdate('fontWeight', v)}
			options={fontWeights}
		/>
	</FormGrid>

	<FormFontSelect
		label="Font Family"
		value={component.fontFamily}
		onchange={(v) => onUpdate('fontFamily', v)}
		options={fontOptions}
	/>

	<!-- Colors -->
	<FormGrid cols={2}>
		<FormColorPicker
			label="Text Color"
			value={component.color}
			onchange={(v) => onUpdate('color', v)}
		/>
		<FormColorPicker
			label="Bullet Color"
			value={component.bulletColor ?? component.color}
			onchange={(v) => onUpdate('bulletColor', v)}
		/>
	</FormGrid>

	<!-- Layout -->
	<FormGrid>
		<FormSelect
			label="Align"
			value={component.alignment}
			onchange={(v) => onUpdate('alignment', v)}
			options={alignments}
		/>
		<FormSelect
			label="Vertical"
			value={component.verticalAlign}
			onchange={(v) => onUpdate('verticalAlign', v)}
			options={verticalAligns}
		/>
	</FormGrid>

	<FormGrid>
		<FormInput
			label="Line Height"
			type="number"
			value={component.lineHeight}
			onchange={(v) => onUpdate('lineHeight', Number(v))}
			min={1}
			max={3}
			step={0.1}
		/>
		<FormInput
			label="Item Spacing"
			type="number"
			value={component.itemSpacing}
			onchange={(v) => onUpdate('itemSpacing', Number(v))}
			min={0}
			max={20}
		/>
	</FormGrid>

	<FormInput
		label="Indent"
		type="number"
		value={component.indent}
		onchange={(v) => onUpdate('indent', Number(v))}
		min={0}
		max={50}
	/>

	<!-- Overflow -->
	<FormGrid>
		<FormInput
			label="Max Items"
			type="number"
			value={component.maxItems ?? ''}
			onchange={(v) => onUpdate('maxItems', v ? Number(v) : undefined)}
			min={1}
			max={20}
			placeholder="No limit"
		/>
		<FormInput
			label="Overflow Text"
			value={component.overflowText}
			onchange={(v) => onUpdate('overflowText', v)}
			placeholder={"+{n} more"}
		/>
	</FormGrid>

	<!-- Opacity -->
	<FormSlider
		label="Opacity"
		value={component.opacity}
		onchange={(v) => onUpdate('opacity', v)}
		min={0}
		max={1}
		step={0.05}
		percent
	/>

	<ModifiersPanel
		bind:shapeSource={component.shapeSource}
		bind:effect={component.effect}
		bind:animation={component.animation}
		bind:blendMode={component.blendMode}
		bind:border={component.border}
		bind:holographic={component.holographic}
	/>
</ComponentPanel>
