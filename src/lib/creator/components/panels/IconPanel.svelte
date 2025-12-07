<script lang="ts">
	import { IconPicker } from '$lib/card/icons';
	import type { IconData } from '$lib/card/icons';
	import ComponentPanel from '../ComponentPanel.svelte';
	import {
		FormColorPicker,
		FormInput,
		FormSlider,
		FormCheckbox,
		FormGrid
	} from '../form';
	import ModifiersPanel from './ModifiersPanel.svelte';
	import type { IconComponent } from '../../types';

	let {
		component,
		expanded = $bindable(true),
		onUpdate,
		onUpdateIcon,
		onRemove,
		onMoveUp,
		onMoveDown
	}: {
		component: IconComponent;
		expanded: boolean;
		onUpdate: (key: keyof Omit<IconComponent, 'type' | 'id'>, value: unknown) => void;
		onUpdateIcon: (icon: { iconData: IconData; iconName: string }) => void;
		onRemove: () => void;
		onMoveUp: () => void;
		onMoveDown: () => void;
	} = $props();
</script>

<ComponentPanel
	title="Icon"
	badge={{ text: 'ico', color: 'bg-orange-600' }}
	bind:expanded
	{onRemove}
	{onMoveUp}
	{onMoveDown}
>
	<IconPicker
		value={{ iconData: component.iconData, iconName: component.iconName }}
		onSelect={onUpdateIcon}
	/>

	{#if component.iconData?.body}
		<div class="space-y-3">
			<FormColorPicker
				label="Color"
				value={component.color}
				onchange={(v) => onUpdate('color', v)}
			/>

			<FormGrid>
				<FormInput
					label="Size (auto if empty)"
					type="number"
					value={component.size ?? ''}
					onchange={(v) => onUpdate('size', v ? Number(v) : undefined)}
					min={8}
					max={500}
					placeholder="auto"
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

			<FormSlider
				label="Rotation"
				value={component.rotation}
				onchange={(v) => onUpdate('rotation', v)}
				min={0}
				max={360}
				step={15}
				suffix="°"
			/>

			<div class="flex gap-4">
				<FormCheckbox
					label="Flip Horizontal"
					checked={component.flipHorizontal}
					onchange={(v) => onUpdate('flipHorizontal', v)}
				/>
				<FormCheckbox
					label="Flip Vertical"
					checked={component.flipVertical}
					onchange={(v) => onUpdate('flipVertical', v)}
				/>
			</div>

			<ModifiersPanel
				bind:shapeSource={component.shapeSource}
				bind:effect={component.effect}
				bind:animation={component.animation}
				bind:blendMode={component.blendMode}
				bind:border={component.border}
				bind:holographic={component.holographic}
			/>
		</div>
	{/if}
</ComponentPanel>
