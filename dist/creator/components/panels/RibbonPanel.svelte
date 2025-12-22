<script lang="ts">
	import ComponentPanel from '../ComponentPanel.svelte';
	import {
		FormSelect,
		FormFontSelect,
		FormColorPicker,
		FormSlider,
		FormInput,
		FormGrid
	} from '../form';
	import ModifiersPanel from './ModifiersPanel.svelte';
	import type { RibbonComponent, DataFieldOption } from '../../types';
	import { getAllFontsForDataset } from '../../../fonts';
	import {
		getLabelsByCategory,
		getCategoryDisplayName,
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
		component: RibbonComponent;
		dataFields: DataFieldOption[];
		datasetId?: DatasetId;
		expanded: boolean;
		onUpdate: (key: keyof Omit<RibbonComponent, 'type' | 'id'>, value: unknown) => void;
		onRemove: () => void;
		onMoveUp: () => void;
		onMoveDown: () => void;
	} = $props();

	const positions = ['top-left', 'top-right', 'bottom-left', 'bottom-right', 'top', 'bottom'];
	const styles = ['flat', 'folded', 'banner', 'bookmark'];

	// Get categorized labels based on current dataset
	const labelCategories = $derived(getLabelsByCategory(datasetId));
	const datasetDisplayName = $derived(getCategoryDisplayName(datasetId));

	// Build flat list of text presets (dataset-specific first, then shared)
	// Deduplicate labels to avoid duplicate key errors
	const textPresets = $derived.by(() => {
		const seen = new Set<string>();
		const presets: Array<{ value: string; label: string } | string> = [
			{ value: 'none', label: '(Default: RIBBON)' }
		];

		const addUnique = (labels: readonly string[]) => {
			for (const label of labels) {
				if (!seen.has(label)) {
					seen.add(label);
					presets.push(label);
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

		return presets;
	});

	const dataFieldOptions = [
		{ value: '', label: 'None (use preset text)' },
		...dataFields
	];

	// Get fonts for current dataset (brand fonts first, then web-safe by category)
	const fontOptions = $derived(getAllFontsForDataset(datasetId));
</script>

<ComponentPanel
	title="Ribbon"
	badge={{ text: 'rib', color: 'bg-red-600' }}
	bind:expanded
	{onRemove}
	{onMoveUp}
	{onMoveDown}
>
	<FormSelect
		label="Text Label"
		value={component.textPreset}
		onchange={(v) => onUpdate('textPreset', v)}
		options={textPresets}
	/>

	<FormSelect
		label="Data Field (overrides preset)"
		value={component.dataField ?? ''}
		onchange={(v) => onUpdate('dataField', v || undefined)}
		options={dataFieldOptions}
	/>

	<FormGrid>
		<FormSelect
			label="Position"
			value={component.position}
			onchange={(v) => onUpdate('position', v)}
			options={positions}
		/>
		<FormSelect
			label="Style"
			value={component.style}
			onchange={(v) => onUpdate('style', v)}
			options={styles}
		/>
	</FormGrid>

	<FormGrid cols={3}>
		<FormColorPicker
			label="Ribbon"
			value={component.color}
			onchange={(v) => onUpdate('color', v)}
		/>
		<FormColorPicker
			label="Text"
			value={component.textColor}
			onchange={(v) => onUpdate('textColor', v)}
		/>
		<FormColorPicker
			label="Shadow"
			value={component.shadowColor}
			onchange={(v) => onUpdate('shadowColor', v)}
		/>
	</FormGrid>

	<FormGrid>
		<FormSlider
			label="Angle"
			value={component.angle}
			onchange={(v) => onUpdate('angle', v)}
			min={0}
			max={90}
			step={1}
			suffix="°"
		/>
		<FormInput
			label="Font Size"
			type="number"
			value={component.fontSize}
			onchange={(v) => onUpdate('fontSize', Number(v))}
			min={8}
			max={24}
		/>
	</FormGrid>

	<FormFontSelect
		label="Font Family"
		value={component.fontFamily}
		onchange={(v) => onUpdate('fontFamily', v)}
		options={fontOptions}
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

	<ModifiersPanel
		bind:shapeSource={component.shapeSource}
		bind:effect={component.effect}
		bind:animation={component.animation}
		bind:blendMode={component.blendMode}
		bind:border={component.border}
		bind:holographic={component.holographic}
	/>
</ComponentPanel>
