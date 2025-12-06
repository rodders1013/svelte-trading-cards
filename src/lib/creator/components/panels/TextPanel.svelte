<script lang="ts">
	import ComponentPanel from '../ComponentPanel.svelte';
	import {
		FormSelect,
		FormFontSelect,
		FormInput,
		FormSlider,
		FormColorPicker,
		FormGrid,
		PanelEffects
	} from '../form';
	import type { TextComponent, DataFieldOption } from '../../types';
	import { getAllFontsForDataset } from '$lib/fonts';
	import { DEFAULT_DATASET, type DatasetId } from '$lib/presets';

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
		component: TextComponent;
		dataFields: DataFieldOption[];
		datasetId?: DatasetId;
		expanded: boolean;
		onUpdate: (key: keyof Omit<TextComponent, 'type' | 'id'>, value: unknown) => void;
		onRemove: () => void;
		onMoveUp: () => void;
		onMoveDown: () => void;
	} = $props();

	// Get fonts for current dataset (brand fonts first, then web-safe by category)
	const fontOptions = $derived(getAllFontsForDataset(datasetId));

	const fontWeights = [
		{ value: 'normal', label: 'Normal' },
		{ value: 'bold', label: 'Bold' }
	];

	const fontStyles = [
		{ value: 'normal', label: 'Normal' },
		{ value: 'italic', label: 'Italic' }
	];

	const textDecorations = [
		{ value: 'none', label: 'None' },
		{ value: 'underline', label: 'Underline' },
		{ value: 'line-through', label: 'Strikethrough' }
	];

	const textTransforms = [
		{ value: 'none', label: 'None' },
		{ value: 'uppercase', label: 'Uppercase' },
		{ value: 'lowercase', label: 'Lowercase' },
		{ value: 'capitalize', label: 'Capitalize' }
	];

	const alignments = [
		{ value: 'left', label: 'Left' },
		{ value: 'center', label: 'Center' },
		{ value: 'right', label: 'Right' }
	];

	const verticalAligns = [
		{ value: 'top', label: 'Top' },
		{ value: 'center', label: 'Center' },
		{ value: 'bottom', label: 'Bottom' }
	];
</script>

<ComponentPanel
	title="Text"
	badge={{ text: 'txt', color: 'bg-blue-600' }}
	bind:expanded
	{onRemove}
	{onMoveUp}
	{onMoveDown}
>
	<div class="rounded bg-muted/50 px-2 py-1.5 text-sm text-muted-foreground">
		Text automatically scales between min/max size to fit the zone
	</div>

	<FormGrid>
		<FormSelect
			label="Data Field"
			value={component.dataField}
			onchange={(v) => onUpdate('dataField', v)}
			options={dataFields}
		/>
		<FormFontSelect
			label="Font Family"
			value={component.fontFamily}
			onchange={(v) => onUpdate('fontFamily', v)}
			options={fontOptions}
		/>
	</FormGrid>

	<div class="rounded border border-input p-2">
		<label class="text-sm font-medium">Font Size Range</label>
		<FormGrid class="mt-1">
			<FormInput
				label="Min Size"
				type="number"
				value={component.minFontSize}
				onchange={(v) => onUpdate('minFontSize', v)}
				min={8}
				max={component.maxFontSize - 1}
			/>
			<FormInput
				label="Max Size"
				type="number"
				value={component.maxFontSize}
				onchange={(v) => onUpdate('maxFontSize', v)}
				min={component.minFontSize + 1}
				max={200}
			/>
		</FormGrid>
	</div>

	<FormGrid>
		<FormSelect
			label="Weight"
			value={component.fontWeight}
			onchange={(v) => onUpdate('fontWeight', v)}
			options={fontWeights}
		/>
		<FormSelect
			label="Style"
			value={component.fontStyle}
			onchange={(v) => onUpdate('fontStyle', v)}
			options={fontStyles}
		/>
	</FormGrid>

	<FormGrid>
		<FormSelect
			label="Decoration"
			value={component.textDecoration}
			onchange={(v) => onUpdate('textDecoration', v)}
			options={textDecorations}
		/>
		<FormSelect
			label="Transform"
			value={component.textTransform}
			onchange={(v) => onUpdate('textTransform', v)}
			options={textTransforms}
		/>
	</FormGrid>

	<FormGrid>
		<FormSelect
			label="Horizontal Align"
			value={component.alignment}
			onchange={(v) => onUpdate('alignment', v)}
			options={alignments}
		/>
		<FormSelect
			label="Vertical Align"
			value={component.verticalAlign}
			onchange={(v) => onUpdate('verticalAlign', v)}
			options={verticalAligns}
		/>
	</FormGrid>

	<FormSlider
		label="Padding"
		value={component.padding}
		onchange={(v) => onUpdate('padding', v)}
		min={0}
		max={50}
		step={1}
	/>

	<FormGrid>
		<FormColorPicker
			label="Color"
			value={component.fill}
			onchange={(v) => onUpdate('fill', v)}
		/>
		<FormSlider
			label="Opacity"
			value={component.opacity}
			onchange={(v) => onUpdate('opacity', v)}
			percent
		/>
	</FormGrid>

	<PanelEffects bind:effect={component.effect} />
</ComponentPanel>
