<script lang="ts">
	import ComponentPanel from '../ComponentPanel.svelte';
	import { FormSelect, FormSlider, FormGrid } from '../form';
	import ModifiersPanel from './ModifiersPanel.svelte';
	import type { ImageComponent, DataFieldOption } from '../../types';
	import type { FilterConfig, ImageTransformConfig } from '../../../styling/filters';
	import { DEFAULT_FILTER_CONFIG, DEFAULT_IMAGE_TRANSFORM, hasActiveFilters, hasActiveTransform } from '../../../styling/filters';
	import * as Collapsible from '../../ui/collapsible';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import X from '@lucide/svelte/icons/x';
	import FlipHorizontal from '@lucide/svelte/icons/flip-horizontal';
	import FlipVertical from '@lucide/svelte/icons/flip-vertical';
	import HelpTooltip from '../HelpTooltip.svelte';

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

	// Transform section state
	let showTransform = $state(false);

	// Filter section state
	let showFilters = $state(false);

	// Get current transform values with defaults
	const currentTransform = $derived<ImageTransformConfig>({
		...DEFAULT_IMAGE_TRANSFORM,
		...component.transform
	});

	// Get current filter values with defaults
	const currentFilter = $derived<FilterConfig>({
		...DEFAULT_FILTER_CONFIG,
		...component.filter
	});

	// Check if has active transform/filter
	const hasTransform = $derived(hasActiveTransform(component.transform));
	const hasFilter = $derived(hasActiveFilters(component.filter));

	// Update transform property
	function updateTransform(key: keyof ImageTransformConfig, value: unknown) {
		const newTransform = { ...currentTransform, [key]: value };
		// If all default values, clear transform
		if (!hasActiveTransform(newTransform)) {
			onUpdate('transform', undefined);
		} else {
			onUpdate('transform', newTransform);
		}
	}

	// Update filter property
	function updateFilter(key: keyof FilterConfig, value: unknown) {
		const newFilter = { ...currentFilter, [key]: value };
		// If all default values, clear filter
		if (!hasActiveFilters(newFilter)) {
			onUpdate('filter', undefined);
		} else {
			onUpdate('filter', newFilter);
		}
	}

	// Reset transform to defaults
	function resetTransform() {
		onUpdate('transform', undefined);
	}

	// Reset filter to defaults
	function resetFilters() {
		onUpdate('filter', undefined);
	}
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

	<!-- Transform Section (Pan/Zoom/Rotation/Flip) - Image specific -->
	<Collapsible.Root bind:open={showTransform}>
		<div class="flex items-center gap-2 rounded border border-cyan-500/30 bg-cyan-500/5 px-2 py-1.5 text-sm hover:bg-cyan-500/10">
			<Collapsible.Trigger class="flex flex-1 items-center gap-2">
				<ChevronDown class="h-3 w-3 transition-transform {showTransform ? '' : '-rotate-90'}" />
				<span class="font-medium text-cyan-400">Transform</span>
				{#if hasTransform}
					<span class="ml-auto rounded bg-cyan-500/20 px-1.5 py-0.5 text-xs text-cyan-400">
						active
					</span>
				{/if}
			</Collapsible.Trigger>
			{#if hasTransform}
				<button
					class="rounded p-0.5 text-cyan-400 hover:bg-cyan-500/20"
					onclick={resetTransform}
					title="Reset transform"
				>
					<X class="h-3 w-3" />
				</button>
			{/if}
			<HelpTooltip text="Zoom in first, then use Pan to move around. At zoom = 1, the image fills the container exactly." />
		</div>
		<Collapsible.Content>
			<div class="mt-2 space-y-3 rounded border border-cyan-500/20 bg-cyan-500/5 p-2">
				<!-- Zoom first for better UX flow -->
				<FormSlider
					label="Zoom"
					value={currentTransform.scale}
					onchange={(v) => updateTransform('scale', v)}
					min={0.1}
					max={10}
					step={0.1}
				/>

				<!-- Pan (Offset X/Y) -->
				<FormGrid>
					<FormSlider
						label="Pan X"
						value={currentTransform.offsetX}
						onchange={(v) => updateTransform('offsetX', v)}
						min={-500}
						max={500}
						step={5}
					/>
					<FormSlider
						label="Pan Y"
						value={currentTransform.offsetY}
						onchange={(v) => updateTransform('offsetY', v)}
						min={-500}
						max={500}
						step={5}
					/>
				</FormGrid>

				<!-- Rotation -->
				<FormSlider
					label="Rotation"
					value={currentTransform.rotation}
					onchange={(v) => updateTransform('rotation', v)}
					min={0}
					max={360}
					step={1}
				/>

				<!-- Flip buttons -->
				<div class="flex gap-2">
					<button
						class="flex flex-1 items-center justify-center gap-1.5 rounded border px-2 py-1.5 text-xs transition-colors {currentTransform.flipHorizontal ? 'border-cyan-500 bg-cyan-500/20 text-cyan-400' : 'border-zinc-600 bg-zinc-800 text-zinc-400 hover:border-cyan-500/50'}"
						onclick={() => updateTransform('flipHorizontal', !currentTransform.flipHorizontal)}
					>
						<FlipHorizontal class="h-3 w-3" />
						Flip H
					</button>
					<button
						class="flex flex-1 items-center justify-center gap-1.5 rounded border px-2 py-1.5 text-xs transition-colors {currentTransform.flipVertical ? 'border-cyan-500 bg-cyan-500/20 text-cyan-400' : 'border-zinc-600 bg-zinc-800 text-zinc-400 hover:border-cyan-500/50'}"
						onclick={() => updateTransform('flipVertical', !currentTransform.flipVertical)}
					>
						<FlipVertical class="h-3 w-3" />
						Flip V
					</button>
				</div>
			</div>
		</Collapsible.Content>
	</Collapsible.Root>

	<!-- Filters Section (Brightness/Contrast/etc) - Image specific -->
	<Collapsible.Root bind:open={showFilters}>
		<div class="flex items-center gap-2 rounded border border-amber-500/30 bg-amber-500/5 px-2 py-1.5 text-sm hover:bg-amber-500/10">
			<Collapsible.Trigger class="flex flex-1 items-center gap-2">
				<ChevronDown class="h-3 w-3 transition-transform {showFilters ? '' : '-rotate-90'}" />
				<span class="font-medium text-amber-400">Adjustments</span>
				{#if hasFilter}
					<span class="ml-auto rounded bg-amber-500/20 px-1.5 py-0.5 text-xs text-amber-400">
						active
					</span>
				{/if}
			</Collapsible.Trigger>
			{#if hasFilter}
				<button
					class="rounded p-0.5 text-amber-400 hover:bg-amber-500/20"
					onclick={resetFilters}
					title="Reset adjustments"
				>
					<X class="h-3 w-3" />
				</button>
			{/if}
			<HelpTooltip text="Adjust image filters like brightness, contrast, saturation, and more." />
		</div>
		<Collapsible.Content>
			<div class="mt-2 space-y-3 rounded border border-amber-500/20 bg-amber-500/5 p-2">
				<!-- Brightness & Contrast -->
				<FormGrid>
					<FormSlider
						label="Brightness"
						value={currentFilter.brightness}
						onchange={(v) => updateFilter('brightness', v)}
						min={0}
						max={3}
						step={0.05}
					/>
					<FormSlider
						label="Contrast"
						value={currentFilter.contrast}
						onchange={(v) => updateFilter('contrast', v)}
						min={0}
						max={3}
						step={0.05}
					/>
				</FormGrid>

				<!-- Saturation -->
				<FormSlider
					label="Saturation"
					value={currentFilter.saturate}
					onchange={(v) => updateFilter('saturate', v)}
					min={0}
					max={3}
					step={0.05}
				/>

				<!-- Blur -->
				<FormSlider
					label="Blur"
					value={currentFilter.blur}
					onchange={(v) => updateFilter('blur', v)}
					min={0}
					max={20}
					step={0.5}
				/>

				<!-- Grayscale & Sepia -->
				<FormGrid>
					<FormSlider
						label="Grayscale"
						value={currentFilter.grayscale}
						onchange={(v) => updateFilter('grayscale', v)}
						min={0}
						max={1}
						step={0.05}
						percent
					/>
					<FormSlider
						label="Sepia"
						value={currentFilter.sepia}
						onchange={(v) => updateFilter('sepia', v)}
						min={0}
						max={1}
						step={0.05}
						percent
					/>
				</FormGrid>

				<!-- Hue Rotate -->
				<FormSlider
					label="Hue Rotate"
					value={currentFilter.hueRotate}
					onchange={(v) => updateFilter('hueRotate', v)}
					min={0}
					max={360}
					step={1}
				/>

				<!-- Invert -->
				<FormSlider
					label="Invert"
					value={currentFilter.invert}
					onchange={(v) => updateFilter('invert', v)}
					min={0}
					max={1}
					step={0.05}
					percent
				/>
			</div>
		</Collapsible.Content>
	</Collapsible.Root>

	<!-- Unified Modifiers (Clip Shape, Effect, Animation, Border, Holographic, Blend) -->
	<ModifiersPanel
		bind:shapeSource={component.shapeSource}
		bind:effect={component.effect}
		bind:animation={component.animation}
		bind:blendMode={component.blendMode}
		bind:border={component.border}
		bind:holographic={component.holographic}
	/>
</ComponentPanel>
