<script lang="ts">
	import ComponentPanel from '../ComponentPanel.svelte';
	import {
		FormColorPicker,
		FormInput,
		FormSlider,
		FormGrid
	} from '../form';
	import ModifiersPanel from './ModifiersPanel.svelte';
	import type { BadgeComponent, DataFieldOption } from '../../types';
	import { DEFAULT_DATASET, type DatasetId } from '$lib/presets';
	import ShapePicker from '$lib/styling/shapes/ShapePicker.svelte';
	import type { ShapeSource } from '$lib/styling/shapes';

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
		component: BadgeComponent;
		dataFields: DataFieldOption[];
		datasetId?: DatasetId;
		expanded: boolean;
		onUpdate: (key: keyof Omit<BadgeComponent, 'type' | 'id'>, value: unknown) => void;
		onRemove: () => void;
		onMoveUp: () => void;
		onMoveDown: () => void;
	} = $props();

	// Handle shape source updates
	function handleShapeChange(source: ShapeSource) {
		onUpdate('shapeSource', source);
	}
</script>

<ComponentPanel
	title="Badge"
	badge={{ text: 'bdg', color: 'bg-purple-600' }}
	bind:expanded
	{onRemove}
	{onMoveUp}
	{onMoveDown}
>
	<div class="rounded bg-muted/50 px-2 py-1.5 text-sm text-muted-foreground">
		Shape only - add a TextField in same zone for text
	</div>

	<!-- Shape Picker -->
	<div class="space-y-1.5">
		<label class="text-xs font-medium text-muted-foreground">Shape</label>
		<ShapePicker
			value={component.shapeSource}
			onchange={handleShapeChange}
		/>
	</div>

	<FormColorPicker
		label="Background"
		value={component.backgroundColor}
		onchange={(v) => onUpdate('backgroundColor', v)}
	/>

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
		bind:effect={component.effect}
		bind:animation={component.animation}
		bind:blendMode={component.blendMode}
		bind:border={component.border}
		bind:holographic={component.holographic}
		showClipShape={false}
	/>
</ComponentPanel>
