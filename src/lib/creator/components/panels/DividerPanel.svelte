<script lang="ts">
	import ComponentPanel from '../ComponentPanel.svelte';
	import {
		FormSelect,
		FormColorPicker,
		FormSlider,
		FormInput,
		FormGrid
	} from '../form';
	import ModifiersPanel from './ModifiersPanel.svelte';
	import type { DividerComponent } from '../../types';

	let {
		component,
		expanded = $bindable(true),
		onUpdate,
		onRemove,
		onMoveUp,
		onMoveDown
	}: {
		component: DividerComponent;
		expanded: boolean;
		onUpdate: (key: keyof Omit<DividerComponent, 'type' | 'id'>, value: unknown) => void;
		onRemove: () => void;
		onMoveUp: () => void;
		onMoveDown: () => void;
	} = $props();

	const styles = ['solid', 'dashed', 'dotted', 'gradient', 'double'];
	const fades = ['none', 'left', 'right', 'both'];
	const ornaments = ['none', 'diamond', 'star', 'circle', 'square'];
</script>

<ComponentPanel
	title="Divider"
	badge={{ text: 'div', color: 'bg-gray-600' }}
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
			label="Fade"
			value={component.fade}
			onchange={(v) => onUpdate('fade', v)}
			options={fades}
		/>
	</FormGrid>

	<FormGrid>
		<FormColorPicker
			label="Color"
			value={component.color}
			onchange={(v) => onUpdate('color', v)}
		/>
		{#if component.style === 'gradient'}
			<FormColorPicker
				label="Secondary Color"
				value={component.secondaryColor ?? component.color}
				onchange={(v) => onUpdate('secondaryColor', v)}
			/>
		{/if}
	</FormGrid>

	<FormSlider
		label="Thickness"
		value={component.thickness}
		onchange={(v) => onUpdate('thickness', v)}
		min={1}
		max={10}
		step={1}
		suffix="px"
	/>

	<FormGrid>
		<FormSelect
			label="Ornament"
			value={component.ornament}
			onchange={(v) => onUpdate('ornament', v)}
			options={ornaments}
		/>
		{#if component.ornament !== 'none'}
			<FormInput
				label="Ornament Size"
				type="number"
				value={component.ornamentSize}
				onchange={(v) => onUpdate('ornamentSize', Number(v))}
				min={6}
				max={30}
			/>
		{/if}
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
		bind:shapeSource={component.shapeSource}
		bind:effect={component.effect}
		bind:animation={component.animation}
		bind:blendMode={component.blendMode}
		bind:border={component.border}
		bind:holographic={component.holographic}
	/>
</ComponentPanel>
