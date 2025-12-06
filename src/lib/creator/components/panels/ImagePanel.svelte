<script lang="ts">
	import ComponentPanel from '../ComponentPanel.svelte';
	import { FormSelect, FormSlider, FormGrid, PanelEffects, PanelBlend } from '../form';
	import type { ImageComponent, DataFieldOption } from '../../types';

	let {
		component,
		dataFields,
		expanded = $bindable(true),
		isCardBase = false,
		onUpdate,
		onRemove,
		onMoveUp,
		onMoveDown,
		onToggleVisibility,
		onSwapLayer
	}: {
		component: ImageComponent;
		dataFields: DataFieldOption[];
		expanded: boolean;
		isCardBase?: boolean;
		onUpdate: (key: keyof Omit<ImageComponent, 'type' | 'id'>, value: unknown) => void;
		onRemove: () => void;
		onMoveUp: () => void;
		onMoveDown: () => void;
		onToggleVisibility?: () => void;
		onSwapLayer?: () => void;
	} = $props();

	// Filter to image fields based on type or naming convention
	const imageFields = $derived(
		dataFields.filter((f) => f.type === 'image' || f.value.toLowerCase().includes('image') || f.value.toLowerCase().includes('art') || f.value.toLowerCase().includes('url'))
	);

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
	visible={component.visible}
	showVisibilityToggle={isCardBase}
	canRemove={!isCardBase}
	canMove={!isCardBase}
	onSwapLayer={isCardBase ? onSwapLayer : undefined}
	{onRemove}
	{onMoveUp}
	{onMoveDown}
	{onToggleVisibility}
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
	<PanelBlend bind:blendMode={component.blendMode} />
</ComponentPanel>
