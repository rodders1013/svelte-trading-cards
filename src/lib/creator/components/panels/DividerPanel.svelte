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
	import { IconPicker } from '$lib/card/icons';
	import type { DividerComponent } from '../../types';
	import type { IconData } from '$lib/card/icons';
	import { ORNAMENT_PRESET_LABELS, type DividerOrnamentPreset } from '$lib/card/decorations';

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

	// Ornament options from the preset labels
	const ornamentOptions = Object.entries(ORNAMENT_PRESET_LABELS).map(([value, label]) => ({
		value,
		label
	}));

	function handleOrnamentChange(value: string) {
		const preset = value as DividerOrnamentPreset;
		onUpdate('ornamentPreset', preset);
	}

	function handleIconSelect(icon: { iconData: IconData; iconName: string }) {
		onUpdate('customOrnament', icon.iconData);
		onUpdate('customOrnamentName', icon.iconName);
	}
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

	<FormSelect
		label="Ornament"
		value={component.ornamentPreset}
		onchange={handleOrnamentChange}
		options={ornamentOptions}
	/>

	{#if component.ornamentPreset === 'custom'}
		<IconPicker
			value={component.customOrnament ? { iconData: component.customOrnament, iconName: component.customOrnamentName ?? '' } : undefined}
			onSelect={handleIconSelect}
		/>
	{/if}

	{#if component.ornamentPreset !== 'none'}
		<FormGrid>
			<FormInput
				label="Ornament Size"
				type="number"
				value={component.ornamentSize}
				onchange={(v) => onUpdate('ornamentSize', Number(v))}
				min={6}
				max={40}
			/>
			<FormColorPicker
				label="Ornament Color"
				value={component.ornamentColor ?? component.color}
				onchange={(v) => onUpdate('ornamentColor', v)}
			/>
		</FormGrid>
	{/if}

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
