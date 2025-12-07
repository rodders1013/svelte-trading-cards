<script lang="ts">
	import ComponentPanel from '../ComponentPanel.svelte';
	import {
		FormSelect,
		FormColorPicker,
		FormSlider,
		FormCheckbox,
		FormGrid
	} from '../form';
	import ModifiersPanel from './ModifiersPanel.svelte';
	import type { FrameComponent } from '../../types';

	let {
		component,
		expanded = $bindable(true),
		onUpdate,
		onRemove,
		onMoveUp,
		onMoveDown
	}: {
		component: FrameComponent;
		expanded: boolean;
		onUpdate: (key: keyof Omit<FrameComponent, 'type' | 'id'>, value: unknown) => void;
		onRemove: () => void;
		onMoveUp: () => void;
		onMoveDown: () => void;
	} = $props();

	const styles = ['simple', 'ornate', 'art-deco', 'celtic', 'tribal', 'elegant'];
	const sizes = [
		{ value: 'sm', label: 'SM' },
		{ value: 'md', label: 'MD' },
		{ value: 'lg', label: 'LG' }
	];
</script>

<ComponentPanel
	title="Frame"
	badge={{ text: 'frm', color: 'bg-yellow-600' }}
	bind:expanded
	{onRemove}
	{onMoveUp}
	{onMoveDown}
>
	<FormGrid>
		<FormSelect
			label="Style"
			value={component.style}
			onchange={(v) => onUpdate('style', v)}
			options={styles}
		/>
		<FormSelect
			label="Size"
			value={component.size}
			onchange={(v) => onUpdate('size', v)}
			options={sizes}
		/>
	</FormGrid>

	<div class="flex gap-4">
		<FormCheckbox
			label="Corners"
			checked={component.corners}
			onchange={(v) => onUpdate('corners', v)}
		/>
		<FormCheckbox
			label="Edges"
			checked={component.edges}
			onchange={(v) => onUpdate('edges', v)}
		/>
	</div>

	<FormGrid>
		<FormColorPicker
			label="Color"
			value={component.color}
			onchange={(v) => onUpdate('color', v)}
		/>
		<FormColorPicker
			label="Secondary"
			value={component.secondaryColor ?? component.color}
			onchange={(v) => onUpdate('secondaryColor', v)}
		/>
	</FormGrid>

	<FormSlider
		label="Stroke Width"
		value={component.strokeWidth}
		onchange={(v) => onUpdate('strokeWidth', v)}
		min={1}
		max={6}
		step={1}
		suffix="px"
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

	<ModifiersPanel
		bind:shapeSource={component.shapeSource}
		bind:effect={component.effect}
		bind:animation={component.animation}
		bind:blendMode={component.blendMode}
		bind:border={component.border}
		bind:holographic={component.holographic}
	/>
</ComponentPanel>
