<script lang="ts">
	import ComponentPanel from '../ComponentPanel.svelte';
	import {
		FormSelect,
		FormFontSelect,
		FormColorPicker,
		FormInput,
		FormSlider,
		FormGrid,
		PanelEffects
	} from '../form';
	import type { BadgeComponent, DataFieldOption } from '../../types';
	import { getAllFontsForDataset } from '$lib/fonts';
	import {
		getLabelsByCategory,
		getCategoryDisplayName,
		DEFAULT_DATASET,
		type DatasetId
	} from '$lib/presets';

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
		component: BadgeComponent;
		dataFields: DataFieldOption[];
		datasetId?: DatasetId;
		expanded: boolean;
		onUpdate: (key: keyof Omit<BadgeComponent, 'type' | 'id'>, value: unknown) => void;
		onRemove: () => void;
		onMoveUp: () => void;
		onMoveDown: () => void;
	} = $props();

	const shapes = ['pill', 'square', 'diamond', 'hexagon', 'shield', 'star', 'circle'];
	const presets = ['custom', 'common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic', 'verified', 'new', 'sold', 'limited', 'promo', 'exclusive'];
	const sizes = [
		{ value: 'sm', label: 'SM' },
		{ value: 'md', label: 'MD' },
		{ value: 'lg', label: 'LG' }
	];

	// Get categorized labels based on current dataset
	const labelCategories = $derived(getLabelsByCategory(datasetId));
	const datasetDisplayName = $derived(getCategoryDisplayName(datasetId));

	// Build grouped text presets for the dropdown
	const textPresets = $derived.by(() => {
		const options: Array<{ value: string; label: string } | { group: string; options: string[] }> = [
			{ value: 'none', label: '(No text / Icon only)' }
		];

		// Add dataset-specific labels
		if (labelCategories.specific.length > 0) {
			options.push({ group: datasetDisplayName, options: [...labelCategories.specific] });
		}

		// Add shared categories
		options.push({ group: 'Rarity', options: [...labelCategories.rarity] });
		options.push({ group: 'Status', options: [...labelCategories.status] });
		options.push({ group: 'Editions', options: [...labelCategories.editions] });
		options.push({ group: 'General', options: [...labelCategories.general] });

		return options;
	});

	// Flatten for simple dropdown (until grouped select is implemented)
	// Deduplicate labels to avoid duplicate key errors
	const flatTextPresets = $derived.by(() => {
		const seen = new Set<string>();
		const flat: Array<{ value: string; label: string } | string> = [
			{ value: 'none', label: '(No text / Icon only)' }
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

	const dataFieldOptions = [
		{ value: '', label: 'None (use preset text)' },
		...dataFields
	];

	// Get fonts for current dataset (brand fonts first, then web-safe by category)
	const fontOptions = $derived(getAllFontsForDataset(datasetId));
</script>

<ComponentPanel
	title="Badge"
	badge={{ text: 'bdg', color: 'bg-purple-600' }}
	bind:expanded
	{onRemove}
	{onMoveUp}
	{onMoveDown}
>
	<FormSelect
		label="Text Label"
		value={component.textPreset}
		onchange={(v) => onUpdate('textPreset', v)}
		options={flatTextPresets}
	/>

	<FormSelect
		label="Data Field (overrides preset)"
		value={component.dataField ?? ''}
		onchange={(v) => onUpdate('dataField', v || undefined)}
		options={dataFieldOptions}
	/>

	<FormGrid>
		<FormSelect
			label="Shape"
			value={component.shape}
			onchange={(v) => onUpdate('shape', v)}
			options={shapes}
		/>
		<FormSelect
			label="Size"
			value={component.size}
			onchange={(v) => onUpdate('size', v)}
			options={sizes}
		/>
	</FormGrid>

	<FormSelect
		label="Preset"
		value={component.preset}
		onchange={(v) => onUpdate('preset', v)}
		options={presets}
	/>

	{#if component.preset === 'custom'}
		<FormGrid>
			<FormColorPicker
				label="Background"
				value={component.backgroundColor}
				onchange={(v) => onUpdate('backgroundColor', v)}
			/>
			<FormColorPicker
				label="Text Color"
				value={component.textColor}
				onchange={(v) => onUpdate('textColor', v)}
			/>
		</FormGrid>
	{/if}

	<FormGrid>
		<FormColorPicker
			label="Border Color"
			value={component.borderColor ?? '#ffffff'}
			onchange={(v) => onUpdate('borderColor', v)}
		/>
		<FormInput
			label="Border Width"
			type="number"
			value={component.borderWidth}
			onchange={(v) => onUpdate('borderWidth', Number(v) || 0)}
			min={0}
			max={10}
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

	<PanelEffects bind:effect={component.effect} />
</ComponentPanel>
