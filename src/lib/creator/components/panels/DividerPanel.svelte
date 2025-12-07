<script lang="ts">
	import ComponentPanel from '../ComponentPanel.svelte';
	import {
		FormSelect,
		FormColorPicker,
		FormSlider,
		FormInput,
		FormGrid,
		FormCheckbox
	} from '../form';
	import * as Collapsible from '$lib/creator/ui/collapsible';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import ModifiersPanel from './ModifiersPanel.svelte';
	import { IconPicker } from '$lib/card/icons';
	import type { DividerComponent } from '../../types';
	import type { IconData } from '$lib/card/icons';
	import { DIVIDER_ICON_LABELS, type DividerIconPreset } from '$lib/card/decorations';

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

	// Icon options from the preset labels
	const iconOptions = Object.entries(DIVIDER_ICON_LABELS).map(([value, label]) => ({
		value,
		label
	}));

	function handleIconPresetChange(value: string) {
		const preset = value as DividerIconPreset;
		onUpdate('iconPreset', preset);
	}

	function handleIconSelect(icon: { iconData: IconData; iconName: string }) {
		onUpdate('customIcon', icon.iconData);
		onUpdate('customIconName', icon.iconName);
	}

	// Collapsible states for icon options
	let iconStrokeOpen = $state(!!component.iconStroke);
	let iconTransformOpen = $state(false);

	// Helper to update icon transform properties
	function updateIconTransform(key: string, value: number | boolean) {
		const current = component.iconTransform ?? {};
		onUpdate('iconTransform', { ...current, [key]: value });
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
		label="Icon"
		value={component.iconPreset}
		onchange={handleIconPresetChange}
		options={iconOptions}
	/>

	{#if component.iconPreset === 'custom'}
		<IconPicker
			value={component.customIcon ? { iconData: component.customIcon, iconName: component.customIconName ?? '' } : undefined}
			onSelect={handleIconSelect}
		/>
	{/if}

	{#if component.iconPreset !== 'none'}
		<div class="space-y-3 rounded border border-border/30 bg-muted/20 p-2">
			<FormGrid>
				<FormInput
					label="Icon Size"
					type="number"
					value={component.iconSize}
					onchange={(v) => onUpdate('iconSize', Number(v))}
					min={6}
					max={40}
				/>
				<FormColorPicker
					label="Icon Color"
					value={component.iconColor ?? component.color}
					onchange={(v) => onUpdate('iconColor', v)}
				/>
			</FormGrid>

			<!-- Icon Stroke Section -->
			<Collapsible.Root bind:open={iconStrokeOpen}>
				<div class="flex items-center gap-2 rounded border border-border/50 bg-muted/30 px-2 py-1.5 text-sm">
					<Collapsible.Trigger class="flex flex-1 items-center gap-2">
						<ChevronDown class="h-3 w-3 transition-transform {iconStrokeOpen ? '' : '-rotate-90'}" />
						<span class="font-medium">Icon Stroke</span>
						{#if component.iconStroke}
							<span class="ml-auto rounded bg-primary/20 px-1.5 py-0.5 text-xs">On</span>
						{/if}
					</Collapsible.Trigger>
				</div>
				<Collapsible.Content>
					<div class="mt-2 space-y-2 rounded border border-border/30 bg-muted/20 p-2">
						<FormGrid>
							<FormColorPicker
								label="Color"
								value={component.iconStroke ?? '#000000'}
								onchange={(v) => onUpdate('iconStroke', v)}
							/>
							<FormSlider
								label="Width"
								value={component.iconStrokeWidth}
								onchange={(v) => onUpdate('iconStrokeWidth', v)}
								min={0.5}
								max={10}
								step={0.5}
								suffix="px"
							/>
						</FormGrid>
						{#if component.iconStroke}
							<button
								type="button"
								class="text-xs text-muted-foreground hover:text-foreground"
								onclick={() => onUpdate('iconStroke', undefined)}
							>
								Remove stroke
							</button>
						{/if}
					</div>
				</Collapsible.Content>
			</Collapsible.Root>

			<!-- Icon Transform Section -->
			<Collapsible.Root bind:open={iconTransformOpen}>
				<div class="flex items-center gap-2 rounded border border-border/50 bg-muted/30 px-2 py-1.5 text-sm">
					<Collapsible.Trigger class="flex flex-1 items-center gap-2">
						<ChevronDown class="h-3 w-3 transition-transform {iconTransformOpen ? '' : '-rotate-90'}" />
						<span class="font-medium">Icon Transform</span>
						{#if component.iconTransform?.scale !== undefined && component.iconTransform.scale !== 1}
							<span class="ml-auto rounded bg-primary/20 px-1.5 py-0.5 text-xs">{component.iconTransform.scale}x</span>
						{/if}
					</Collapsible.Trigger>
				</div>
				<Collapsible.Content>
					<div class="mt-2 space-y-2 rounded border border-border/30 bg-muted/20 p-2">
						<FormSlider
							label="Scale"
							value={component.iconTransform?.scale ?? 1}
							onchange={(v) => updateIconTransform('scale', v)}
							min={0.1}
							max={2}
							step={0.05}
							suffix="x"
						/>
						<FormGrid>
							<FormSlider
								label="Offset X"
								value={component.iconTransform?.offsetX ?? 0}
								onchange={(v) => updateIconTransform('offsetX', v)}
								min={-100}
								max={100}
								step={1}
								suffix="%"
							/>
							<FormSlider
								label="Offset Y"
								value={component.iconTransform?.offsetY ?? 0}
								onchange={(v) => updateIconTransform('offsetY', v)}
								min={-100}
								max={100}
								step={1}
								suffix="%"
							/>
						</FormGrid>
						<FormSlider
							label="Rotation"
							value={component.iconTransform?.rotation ?? 0}
							onchange={(v) => updateIconTransform('rotation', v)}
							min={0}
							max={360}
							step={15}
							suffix="°"
						/>
						<div class="flex gap-4">
							<FormCheckbox
								label="Flip H"
								checked={component.iconTransform?.flipHorizontal ?? false}
								onchange={(v) => updateIconTransform('flipHorizontal', v)}
							/>
							<FormCheckbox
								label="Flip V"
								checked={component.iconTransform?.flipVertical ?? false}
								onchange={(v) => updateIconTransform('flipVertical', v)}
							/>
						</div>
					</div>
				</Collapsible.Content>
			</Collapsible.Root>
		</div>
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
