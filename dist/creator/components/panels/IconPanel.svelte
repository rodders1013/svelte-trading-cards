<script lang="ts">
	import { IconPicker } from '../../../card/icons';
	import type { IconData } from '../../../card/icons';
	import ComponentPanel from '../ComponentPanel.svelte';
	import {
		FormColorPicker,
		FormSlider,
		FormCheckbox,
		FormGrid
	} from '../form';
	import * as Collapsible from '../../ui/collapsible';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
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

	// Collapsible states
	let strokeOpen = $state(!!component.stroke);
	let transformOpen = $state(false);

	// Helper to update transform properties
	function updateTransform(key: string, value: number | boolean) {
		const current = component.transform ?? {};
		onUpdate('transform', { ...current, [key]: value });
	}
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
			<!-- Fill Color -->
			<FormColorPicker
				label="Fill Color"
				value={component.color}
				onchange={(v) => onUpdate('color', v)}
			/>

			<!-- Opacity -->
			<FormSlider
				label="Opacity"
				value={component.opacity}
				onchange={(v) => onUpdate('opacity', v)}
				min={0}
				max={1}
				step={0.05}
				percent
			/>

			<!-- Stroke Section -->
			<Collapsible.Root bind:open={strokeOpen}>
				<div class="flex items-center gap-2 rounded border border-border/50 bg-muted/30 px-2 py-1.5 text-sm">
					<Collapsible.Trigger class="flex flex-1 items-center gap-2">
						<ChevronDown class="h-3 w-3 transition-transform {strokeOpen ? '' : '-rotate-90'}" />
						<span class="font-medium">Stroke</span>
						{#if component.stroke}
							<span class="ml-auto rounded bg-primary/20 px-1.5 py-0.5 text-xs">On</span>
						{/if}
					</Collapsible.Trigger>
				</div>
				<Collapsible.Content>
					<div class="mt-2 space-y-2 rounded border border-border/30 bg-muted/20 p-2">
						<FormGrid>
							<FormColorPicker
								label="Color"
								value={component.stroke ?? '#000000'}
								onchange={(v) => onUpdate('stroke', v)}
							/>
							<FormSlider
								label="Width"
								value={component.strokeWidth}
								onchange={(v) => onUpdate('strokeWidth', v)}
								min={0.5}
								max={10}
								step={0.5}
								suffix="px"
							/>
						</FormGrid>
						{#if component.stroke}
							<button
								type="button"
								class="text-xs text-muted-foreground hover:text-foreground"
								onclick={() => onUpdate('stroke', undefined)}
							>
								Remove stroke
							</button>
						{/if}
					</div>
				</Collapsible.Content>
			</Collapsible.Root>

			<!-- Transform Section -->
			<Collapsible.Root bind:open={transformOpen}>
				<div class="flex items-center gap-2 rounded border border-border/50 bg-muted/30 px-2 py-1.5 text-sm">
					<Collapsible.Trigger class="flex flex-1 items-center gap-2">
						<ChevronDown class="h-3 w-3 transition-transform {transformOpen ? '' : '-rotate-90'}" />
						<span class="font-medium">Transform</span>
						{#if component.transform?.scale !== undefined && component.transform.scale !== 1}
							<span class="ml-auto rounded bg-primary/20 px-1.5 py-0.5 text-xs">{component.transform.scale}x</span>
						{/if}
					</Collapsible.Trigger>
				</div>
				<Collapsible.Content>
					<div class="mt-2 space-y-2 rounded border border-border/30 bg-muted/20 p-2">
						<FormSlider
							label="Scale"
							value={component.transform?.scale ?? 1}
							onchange={(v) => updateTransform('scale', v)}
							min={0.1}
							max={2}
							step={0.05}
							suffix="x"
						/>
						<FormGrid>
							<FormSlider
								label="Offset X"
								value={component.transform?.offsetX ?? 0}
								onchange={(v) => updateTransform('offsetX', v)}
								min={-100}
								max={100}
								step={1}
								suffix="%"
							/>
							<FormSlider
								label="Offset Y"
								value={component.transform?.offsetY ?? 0}
								onchange={(v) => updateTransform('offsetY', v)}
								min={-100}
								max={100}
								step={1}
								suffix="%"
							/>
						</FormGrid>
						<FormSlider
							label="Rotation"
							value={component.transform?.rotation ?? component.rotation}
							onchange={(v) => updateTransform('rotation', v)}
							min={0}
							max={360}
							step={15}
							suffix="°"
						/>
						<div class="flex gap-4">
							<FormCheckbox
								label="Flip Horizontal"
								checked={component.transform?.flipHorizontal ?? component.flipHorizontal}
								onchange={(v) => updateTransform('flipHorizontal', v)}
							/>
							<FormCheckbox
								label="Flip Vertical"
								checked={component.transform?.flipVertical ?? component.flipVertical}
								onchange={(v) => updateTransform('flipVertical', v)}
							/>
						</div>
					</div>
				</Collapsible.Content>
			</Collapsible.Root>

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
