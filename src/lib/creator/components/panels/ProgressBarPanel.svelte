<script lang="ts">
	import ComponentPanel from '../ComponentPanel.svelte';
	import {
		FormSelect,
		FormColorPicker,
		FormSlider,
		FormInput,
		FormCheckbox,
		FormGrid
	} from '../form';
	import ModifiersPanel from './ModifiersPanel.svelte';
	import type { ProgressBarComponent, DataFieldOption } from '../../types';

	let {
		component,
		dataFields,
		expanded = $bindable(true),
		onUpdate,
		onRemove,
		onMoveUp,
		onMoveDown
	}: {
		component: ProgressBarComponent;
		dataFields: DataFieldOption[];
		expanded: boolean;
		onUpdate: (key: keyof Omit<ProgressBarComponent, 'type' | 'id'>, value: unknown) => void;
		onRemove: () => void;
		onMoveUp: () => void;
		onMoveDown: () => void;
	} = $props();

	const styles = ['rounded', 'square', 'pointed'];
	const labelPositions = ['left', 'center', 'right', 'inside', 'none'];
	const labelFormats = ['value', 'percent', 'fraction'];

	const dataFieldOptions = $derived([
		{ value: '', label: 'None (use static value)' },
		...dataFields
	]);
</script>

<ComponentPanel
	title="Progress Bar"
	badge={{ text: 'bar', color: 'bg-green-600' }}
	bind:expanded
	{onRemove}
	{onMoveUp}
	{onMoveDown}
>
	<FormGrid>
		<FormInput
			label="Value"
			type="number"
			value={component.value}
			onchange={(v) => onUpdate('value', Number(v) || 0)}
			min={0}
		/>
		<FormInput
			label="Max"
			type="number"
			value={component.max}
			onchange={(v) => onUpdate('max', Number(v) || 100)}
			min={1}
		/>
	</FormGrid>

	<FormSelect
		label="Data Field (optional)"
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
			label="Fill Color"
			value={component.color}
			onchange={(v) => onUpdate('color', v)}
		/>
		<FormColorPicker
			label="Background"
			value={component.backgroundColor}
			onchange={(v) => onUpdate('backgroundColor', v)}
		/>
	</FormGrid>

	<FormInput
		label="Segments (0 = smooth)"
		type="number"
		value={component.segments}
		onchange={(v) => onUpdate('segments', Number(v) || 0)}
		min={0}
		max={20}
	/>

	<div class="space-y-2">
		<FormCheckbox
			label="Show Label"
			checked={component.showLabel}
			onchange={(v) => onUpdate('showLabel', v)}
		/>
		{#if component.showLabel}
			<FormGrid>
				<FormSelect
					label="Position"
					value={component.labelPosition}
					onchange={(v) => onUpdate('labelPosition', v)}
					options={labelPositions}
				/>
				<FormSelect
					label="Format"
					value={component.labelFormat}
					onchange={(v) => onUpdate('labelFormat', v)}
					options={labelFormats}
				/>
			</FormGrid>
		{/if}
	</div>

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
