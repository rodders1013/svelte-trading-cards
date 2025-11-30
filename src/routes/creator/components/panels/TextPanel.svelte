<script lang="ts">
	import ComponentPanel from '../ComponentPanel.svelte';
	import {
		FormSelect,
		FormInput,
		FormColorPicker,
		FormGrid,
		PanelEffects
	} from '../form';
	import type { TextComponent, DataFieldOption } from '../../types';
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
		component: TextComponent;
		dataFields: DataFieldOption[];
		expanded: boolean;
		onUpdate: (key: keyof Omit<TextComponent, 'type' | 'id'>, value: unknown) => void;
		onRemove: () => void;
		onMoveUp: () => void;
		onMoveDown: () => void;
	} = $props();

	const fontWeights = [
		{ value: 'normal', label: 'Normal' },
		{ value: 'bold', label: 'Bold' }
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
		<FormSelect
			label="Font Family"
			value={component.fontFamily}
			onchange={(v) => onUpdate('fontFamily', v)}
			options={fontFamilies}
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
			label="Horizontal"
			value={component.alignment}
			onchange={(v) => onUpdate('alignment', v)}
			options={alignments}
		/>
	</FormGrid>

	<FormSelect
		label="Vertical Align"
		value={component.verticalAlign}
		onchange={(v) => onUpdate('verticalAlign', v)}
		options={verticalAligns}
	/>

	<FormColorPicker
		label="Color"
		value={component.fill}
		onchange={(v) => onUpdate('fill', v)}
	/>

	<PanelEffects bind:effect={component.effect} />
</ComponentPanel>
