<script lang="ts">
	import ComponentPanel from '../ComponentPanel.svelte';
	import {
		FormColorPicker,
		FormInput,
		FormSlider,
		FormCheckbox,
		FormGrid
	} from '../form';
	import PanelEffects from './PanelEffects.svelte';
	import type { BorderComponent } from '../../types';

	let {
		component,
		expanded = $bindable(true),
		isCardBase = false,
		onUpdate,
		onUpdateGlow,
		onUpdateHolographic,
		onRemove,
		onMoveUp,
		onMoveDown,
		onToggleVisibility
	}: {
		component: BorderComponent;
		expanded: boolean;
		isCardBase?: boolean;
		onUpdate: (key: keyof Omit<BorderComponent, 'type' | 'id'>, value: unknown) => void;
		onUpdateGlow: (key: string, value: unknown) => void;
		onUpdateHolographic: (key: string, value: unknown) => void;
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

	<!-- Glow Effect -->
	<div class="rounded border border-input p-2">
		<FormCheckbox
			label="Glow Effect"
			checked={component.glow?.enabled ?? false}
			onchange={(v) => onUpdateGlow('enabled', v)}
			class="font-medium"
		/>
		{#if component.glow?.enabled}
			<FormGrid class="mt-2">
				<FormColorPicker
					label="Color"
					value={component.glow.color}
					onchange={(v) => onUpdateGlow('color', v)}
				/>
				<FormInput
					label="Blur"
					type="number"
					value={component.glow.blur}
					onchange={(v) => onUpdateGlow('blur', Number(v))}
				/>
			</FormGrid>
			<FormGrid class="mt-2">
				<FormSlider
					label="Intensity"
					value={component.glow.intensity}
					onchange={(v) => onUpdateGlow('intensity', v)}
					min={0}
					max={1}
					step={0.1}
					percent
				/>
				<FormCheckbox
					label="Animate"
					checked={component.glow.animated}
					onchange={(v) => onUpdateGlow('animated', v)}
					class="mt-4"
				/>
			</FormGrid>
		{/if}
	</div>

	<!-- Holographic Effect -->
	<div class="rounded border border-input p-2">
		<FormCheckbox
			label="Holographic Effect"
			checked={component.holographic?.enabled ?? false}
			onchange={(v) => onUpdateHolographic('enabled', v)}
			class="font-medium"
		/>
		{#if component.holographic?.enabled}
			<FormGrid class="mt-2">
				<FormColorPicker
					label="Secondary Color"
					value={component.holographic.secondaryColor}
					onchange={(v) => onUpdateHolographic('secondaryColor', v)}
				/>
				<FormInput
					label="Speed (s)"
					type="number"
					value={component.holographic.speed}
					onchange={(v) => onUpdateHolographic('speed', Number(v))}
					min={0.5}
					max={10}
					step={0.5}
				/>
			</FormGrid>
		{/if}
	</div>

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

	<PanelEffects bind:effect={component.effect} />
</ComponentPanel>
