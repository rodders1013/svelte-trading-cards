<script lang="ts">
	import ComponentPanel from '../ComponentPanel.svelte';
	import {
		FormColorPicker,
		FormInput,
		FormSlider,
		FormGrid
	} from '../form';
	import ModifiersPanel from './ModifiersPanel.svelte';
	import type { BorderComponent } from '../../types';

	let {
		component,
		expanded = $bindable(true),
		isCardBase = false,
		onUpdate,
		onRemove,
		onMoveUp,
		onMoveDown,
		onToggleVisibility
	}: {
		component: BorderComponent;
		expanded: boolean;
		isCardBase?: boolean;
		onUpdate: (key: keyof Omit<BorderComponent, 'type' | 'id'>, value: unknown) => void;
		onRemove: () => void;
		onMoveUp: () => void;
		onMoveDown: () => void;
		onToggleVisibility?: () => void;
	} = $props();
</script>

<ComponentPanel
	title="Border"
	badge={{ text: 'bdr', color: 'bg-amber-600' }}
	bind:expanded
	visible={component.visible}
	showVisibilityToggle={isCardBase}
	canRemove={!isCardBase}
	canMove={!isCardBase}
	{onRemove}
	{onMoveUp}
	{onMoveDown}
	{onToggleVisibility}
>
	<FormGrid cols={3}>
		<FormColorPicker
			label="Color"
			value={component.color}
			onchange={(v) => onUpdate('color', v)}
		/>
		<FormInput
			label="Width"
			type="number"
			value={component.width}
			onchange={(v) => onUpdate('width', Number(v))}
		/>
		<FormSlider
			label="Opacity"
			value={component.opacity}
			onchange={(v) => onUpdate('opacity', v)}
			min={0}
			max={1}
			step={0.1}
			percent
		/>
	</FormGrid>

	<!-- Multi-layer -->
	<div class="rounded border border-input p-2">
		<label class="text-sm font-medium">Multi-Layer Border</label>
		<FormGrid class="mt-2">
			<FormInput
				label="Layers"
				type="number"
				value={component.layers ?? 1}
				onchange={(v) => onUpdate('layers', Number(v))}
				min={1}
				max={5}
			/>
			<FormInput
				label="Spacing"
				type="number"
				value={component.layerSpacing ?? 4}
				onchange={(v) => onUpdate('layerSpacing', Number(v))}
				min={1}
				max={20}
			/>
		</FormGrid>
	</div>

	<!-- Unified Modifiers (Effect includes strokeGlow, plus Animation, Holographic, Blend) -->
	<ModifiersPanel
		bind:effect={component.effect}
		bind:animation={component.animation}
		bind:blendMode={component.blendMode}
		bind:holographic={component.holographic}
		showClipShape={false}
		showBorder={false}
	/>
</ComponentPanel>
