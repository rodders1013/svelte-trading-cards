<script lang="ts">
	import ComponentPanel from '../ComponentPanel.svelte';
	import { FormSelect, FormSlider, FormGrid, PanelEffects } from '../form';
	import type { ImageComponent } from '../../types';
	import { dataFields } from '../../types';

	let {
		component,
		expanded = $bindable(true),
		onUpdate,
		onRemove,
		onMoveUp,
		onMoveDown
	}: {
		component: ImageComponent;
		expanded: boolean;
		onUpdate: (key: keyof Omit<ImageComponent, 'type' | 'id'>, value: unknown) => void;
		onRemove: () => void;
		onMoveUp: () => void;
		onMoveDown: () => void;
	} = $props();

	const imageFields = dataFields.filter((f) => f.value.includes('Url') || f.value.includes('image'));

	const fitModes = [
		{ value: 'xMidYMid slice', label: 'Cover (fill)' },
		{ value: 'xMidYMid meet', label: 'Contain (fit)' },
		{ value: 'none', label: 'Stretch' }
	];
</script>

<ComponentPanel
	title="Image"
	badge={{ text: 'img', color: 'bg-pink-600' }}
	bind:expanded
	{onRemove}
	{onMoveUp}
	{onMoveDown}
>
	<FormSelect
		label="Data Field"
		value={component.dataField}
		onchange={(v) => onUpdate('dataField', v)}
		options={imageFields}
	/>

	<FormGrid>
		<FormSelect
			label="Fit Mode"
			value={component.preserveAspectRatio}
			onchange={(v) => onUpdate('preserveAspectRatio', v)}
			options={fitModes}
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
	</FormGrid>

	<PanelEffects bind:effect={component.effect} />
</ComponentPanel>
