<script lang="ts">
	import ComponentPanel from '../ComponentPanel.svelte';
	import { FormSelect, FormSlider, FormGrid, PanelEffects, PanelBlend } from '../form';
	import type { ImageComponent, DataFieldOption } from '../../types';
	import ShapePicker from '$lib/shapes/ShapePicker.svelte';
	import type { ShapeSource } from '$lib/shapes';
	import type { FilterConfig, ImageTransformConfig } from '$lib/filters';
	import { DEFAULT_FILTER_CONFIG, DEFAULT_IMAGE_TRANSFORM, hasActiveFilters, hasActiveTransform } from '$lib/filters';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import RotateCw from '@lucide/svelte/icons/rotate-cw';
	import X from '@lucide/svelte/icons/x';
	import FlipHorizontal from '@lucide/svelte/icons/flip-horizontal';
	import FlipVertical from '@lucide/svelte/icons/flip-vertical';
	import CircleHelp from '@lucide/svelte/icons/circle-help';

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

	// Shape section state
	let showShape = $state(false);

	// Handle shape source change
	function handleShapeChange(source: ShapeSource) {
		// If selecting rectangle, clear shapeSource
		if (source.type === 'builtin' && source.shape === 'rectangle') {
			onUpdate('shapeSource', undefined);
		} else {
			onUpdate('shapeSource', source);
		}
	}

	// Get current shape for display
	const currentShapeValue = $derived<ShapeSource>(
		component.shapeSource ?? { type: 'builtin', shape: 'rectangle' }
	);

	// Check if has custom shape
	const hasShape = $derived(!!component.shapeSource);

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

	<!-- Clip Shape Section -->
	<Collapsible.Root bind:open={showShape}>
		<div class="flex items-center gap-2 rounded border border-purple-500/30 bg-purple-500/5 px-2 py-1.5 text-sm hover:bg-purple-500/10">
			<Collapsible.Trigger class="flex flex-1 items-center gap-2">
				<ChevronDown class="h-3 w-3 transition-transform {showShape ? '' : '-rotate-90'}" />
				<span class="font-medium text-purple-400">Clip Shape</span>
				{#if hasShape && component.shapeSource}
					<span class="ml-auto rounded bg-purple-500/20 px-1.5 py-0.5 text-xs text-purple-400 capitalize">
						{component.shapeSource.type === 'builtin' ? component.shapeSource.shape : 'custom'}
					</span>
				{/if}
			</Collapsible.Trigger>
			{#if hasShape}
				<button
					class="rounded p-0.5 text-purple-400 hover:bg-purple-500/20"
					onclick={() => onUpdate('shapeSource', undefined)}
					title="Remove clip shape"
				>
					<X class="h-3 w-3" />
				</button>
			{/if}
		</div>
		<Collapsible.Content>
			<div class="mt-2 rounded border border-purple-500/20 bg-purple-500/5 p-2">
				<ShapePicker
					value={currentShapeValue}
					onchange={handleShapeChange}
				/>
			</div>
		</Collapsible.Content>
	</Collapsible.Root>

	<!-- Transform Section (Pan/Zoom/Rotation/Flip) -->
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
			<Tooltip.Provider>
				<Tooltip.Root>
					<Tooltip.Trigger>
						<CircleHelp class="h-3.5 w-3.5 text-cyan-400/60 hover:text-cyan-400" />
					</Tooltip.Trigger>
					<Tooltip.Content side="left" class="max-w-[240px] text-xs">
						<p class="font-medium mb-1">How Transform Works</p>
						<p class="text-muted-foreground">Zoom in first (scale {'>'} 1), then use Pan to move around the image. At zoom = 1, the image fills the container exactly.</p>
					</Tooltip.Content>
				</Tooltip.Root>
			</Tooltip.Provider>
			{#if hasTransform}
				<button
					class="rounded p-0.5 text-cyan-400 hover:bg-cyan-500/20"
					onclick={resetTransform}
					title="Reset transform"
				>
					<RotateCw class="h-3 w-3" />
				</button>
			{/if}
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

	<!-- Filters Section (Brightness/Contrast/etc) -->
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
					<RotateCw class="h-3 w-3" />
				</button>
			{/if}
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

	<PanelEffects bind:effect={component.effect} />
	<PanelBlend bind:blendMode={component.blendMode} />
</ComponentPanel>
