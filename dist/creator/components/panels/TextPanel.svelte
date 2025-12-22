<script lang="ts">
	import ComponentPanel from '../ComponentPanel.svelte';
	import {
		FormSelect,
		FormFontSelect,
		FormInput,
		FormSlider,
		FormColorPicker,
		FormGrid,
		FormSwitch
	} from '../form';
	import ModifiersPanel from './ModifiersPanel.svelte';
	import type { TextComponent, DataFieldOption } from '../../types';
	import type { TextBoundsConfig } from '../../../card/fields';
	import { getAllFontsForDataset } from '../../../fonts';
	import {
		getLabelsByCategory,
		DEFAULT_DATASET,
		type DatasetId
	} from '../../../presets';

	let {
		component,
		dataFields,
		datasetId = DEFAULT_DATASET,
		expanded = $bindable(true),
		onUpdate,
		onRemove,
		onMoveUp,
		onMoveDown
	}: {
		component: TextComponent;
		dataFields: DataFieldOption[];
		datasetId?: DatasetId;
		expanded: boolean;
		onUpdate: (key: keyof Omit<TextComponent, 'type' | 'id'>, value: unknown) => void;
		onRemove: () => void;
		onMoveUp: () => void;
		onMoveDown: () => void;
	} = $props();

	// Get fonts for current dataset (brand fonts first, then web-safe by category)
	const fontOptions = $derived(getAllFontsForDataset(datasetId));

	// Get categorized labels based on current dataset
	const labelCategories = $derived(getLabelsByCategory(datasetId));

	// Flatten for simple dropdown - deduplicate labels
	const flatTextPresets = $derived.by(() => {
		const seen = new Set<string>();
		const flat: Array<{ value: string; label: string } | string> = [
			{ value: 'none', label: '(Use data field)' }
		];

		const addUnique = (labels: readonly string[]) => {
			for (const label of labels) {
				if (!seen.has(label)) {
					seen.add(label);
					flat.push(label);
				}
			}
		};

		// Add dataset-specific labels first (priority)
		if (labelCategories.specific.length > 0) {
			addUnique(labelCategories.specific);
		}

		// Add shared categories (skip duplicates)
		addUnique(labelCategories.rarity);
		addUnique(labelCategories.status);
		addUnique(labelCategories.editions);
		addUnique(labelCategories.general);

		return flat;
	});

	const dataFieldOptions = $derived([
		{ value: '', label: 'None (use preset text)' },
		...dataFields
	]);

	const fontWeights = [
		{ value: 'normal', label: 'Normal' },
		{ value: 'bold', label: 'Bold' }
	];

	const fontStyles = [
		{ value: 'normal', label: 'Normal' },
		{ value: 'italic', label: 'Italic' }
	];

	const textDecorations = [
		{ value: 'none', label: 'None' },
		{ value: 'underline', label: 'Underline' },
		{ value: 'line-through', label: 'Strikethrough' }
	];

	const textTransforms = [
		{ value: 'none', label: 'None' },
		{ value: 'uppercase', label: 'Uppercase' },
		{ value: 'lowercase', label: 'Lowercase' },
		{ value: 'capitalize', label: 'Capitalize' }
	];

	const alignments = [
		{ value: 'left', label: 'Left' },
		{ value: 'center', label: 'Center' },
		{ value: 'right', label: 'Right' }
	];

	const verticalAligns = [
		{ value: 'top', label: 'Top' },
		{ value: 'center', label: 'Center' },
		{ value: 'bottom', label: 'Bottom' }
	];

	// Check if any bounds inset is set
	const hasBoundsActive = $derived(
		(component.bounds?.insetLeft ?? 0) > 0 ||
		(component.bounds?.insetRight ?? 0) > 0 ||
		(component.bounds?.insetTop ?? 0) > 0 ||
		(component.bounds?.insetBottom ?? 0) > 0
	);

	// Helper to update bounds
	function updateBounds(key: keyof TextBoundsConfig, value: number | boolean) {
		const currentBounds = component.bounds ?? {
			insetLeft: 0,
			insetRight: 0,
			insetTop: 0,
			insetBottom: 0,
			showGuide: false
		};
		onUpdate('bounds', { ...currentBounds, [key]: value });
	}
</script>

<ComponentPanel
	title="Text"
	badge={{ text: 'txt', color: 'bg-blue-600' }}
	bind:expanded
	{onRemove}
	{onMoveUp}
	{onMoveDown}
>
	<div class="rounded bg-muted/50 px-2 py-1.5 text-sm text-muted-foreground">
		Text automatically scales between min/max size to fit the zone
	</div>

	<FormSelect
		label="Preset Text"
		value={component.textPreset ?? 'none'}
		onchange={(v) => onUpdate('textPreset', v)}
		options={flatTextPresets}
	/>

	<FormSelect
		label="Data Field (overrides preset)"
		value={component.dataField ?? ''}
		onchange={(v) => onUpdate('dataField', v || undefined)}
		options={dataFieldOptions}
	/>

	<FormFontSelect
		label="Font Family"
		value={component.fontFamily}
		onchange={(v) => onUpdate('fontFamily', v)}
		options={fontOptions}
	/>

	<div class="rounded border border-input p-2">
		<label class="text-sm font-medium">Font Size Range</label>
		<FormGrid class="mt-1">
			<FormInput
				label="Min Size"
				type="number"
				value={component.minFontSize}
				onchange={(v) => onUpdate('minFontSize', v)}
				min={8}
				max={component.maxFontSize - 1}
			/>
			<FormInput
				label="Max Size"
				type="number"
				value={component.maxFontSize}
				onchange={(v) => onUpdate('maxFontSize', v)}
				min={component.minFontSize + 1}
				max={200}
			/>
		</FormGrid>
	</div>

	<FormGrid>
		<FormSelect
			label="Weight"
			value={component.fontWeight}
			onchange={(v) => onUpdate('fontWeight', v)}
			options={fontWeights}
		/>
		<FormSelect
			label="Style"
			value={component.fontStyle}
			onchange={(v) => onUpdate('fontStyle', v)}
			options={fontStyles}
		/>
	</FormGrid>

	<FormGrid>
		<FormSelect
			label="Decoration"
			value={component.textDecoration}
			onchange={(v) => onUpdate('textDecoration', v)}
			options={textDecorations}
		/>
		<FormSelect
			label="Transform"
			value={component.textTransform}
			onchange={(v) => onUpdate('textTransform', v)}
			options={textTransforms}
		/>
	</FormGrid>

	<FormGrid>
		<FormSelect
			label="Horizontal Align"
			value={component.alignment}
			onchange={(v) => onUpdate('alignment', v)}
			options={alignments}
		/>
		<FormSelect
			label="Vertical Align"
			value={component.verticalAlign}
			onchange={(v) => onUpdate('verticalAlign', v)}
			options={verticalAligns}
		/>
	</FormGrid>

	<FormSlider
		label="Padding"
		value={component.padding}
		onchange={(v) => onUpdate('padding', v)}
		min={0}
		max={50}
		step={1}
	/>

	<FormGrid>
		<FormColorPicker
			label="Color"
			value={component.fill}
			onchange={(v) => onUpdate('fill', v)}
		/>
		<FormSlider
			label="Opacity"
			value={component.opacity}
			onchange={(v) => onUpdate('opacity', v)}
			percent
		/>
	</FormGrid>

	<!-- Text Bounds Section -->
	<div class="rounded border border-input p-2">
		<div class="mb-2 flex items-center justify-between">
			<label class="text-sm font-medium">Text Bounds</label>
			{#if hasBoundsActive}
				<span class="rounded bg-blue-500/20 px-1.5 py-0.5 text-xs text-blue-400">Active</span>
			{/if}
		</div>
		<p class="mb-2 text-xs text-muted-foreground">
			Constrain text to a safe zone within the layer. Useful when using clip shapes.
		</p>
		<FormGrid>
			<FormSlider
				label="Left %"
				value={component.bounds?.insetLeft ?? 0}
				onchange={(v) => updateBounds('insetLeft', v)}
				min={0}
				max={50}
				step={1}
			/>
			<FormSlider
				label="Right %"
				value={component.bounds?.insetRight ?? 0}
				onchange={(v) => updateBounds('insetRight', v)}
				min={0}
				max={50}
				step={1}
			/>
		</FormGrid>
		<FormGrid>
			<FormSlider
				label="Top %"
				value={component.bounds?.insetTop ?? 0}
				onchange={(v) => updateBounds('insetTop', v)}
				min={0}
				max={50}
				step={1}
			/>
			<FormSlider
				label="Bottom %"
				value={component.bounds?.insetBottom ?? 0}
				onchange={(v) => updateBounds('insetBottom', v)}
				min={0}
				max={50}
				step={1}
			/>
		</FormGrid>
		<FormSwitch
			label="Show Guide"
			checked={component.bounds?.showGuide ?? false}
			onchange={(v) => updateBounds('showGuide', v)}
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
</ComponentPanel>
