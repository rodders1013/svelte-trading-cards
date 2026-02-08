<script lang="ts">
	import { Button } from '$lib/creator/ui/button';
	import ComponentPanel from '../ComponentPanel.svelte';
	import {
		FormSelect,
		FormFontSelect,
		FormInput,
		FormColorPicker,
		FormSlider,
		FormCheckbox,
		FormGrid
	} from '../form';
	import ModifiersPanel from './ModifiersPanel.svelte';
	import type { StatPanelComponent, DataFieldOption } from '../../types';
	import type { StatRow } from '$lib/card/fields';
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
		component: StatPanelComponent;
		dataFields: DataFieldOption[];
		datasetId?: DatasetId;
		expanded: boolean;
		onUpdate: (key: keyof Omit<StatPanelComponent, 'type' | 'id'>, value: unknown) => void;
		onRemove: () => void;
		onMoveUp: () => void;
		onMoveDown: () => void;
	} = $props();

	// Get categorized labels based on current dataset
	const labelCategories = $derived(getLabelsByCategory(datasetId));
	const datasetDisplayName = $derived(getCategoryDisplayName(datasetId));

	// Build flat list of label presets (dataset-specific first, then shared)
	// Deduplicate labels to avoid duplicate key errors
	const labelPresets = $derived.by(() => {
		const seen = new Set<string>();
		const labels: string[] = [];

		const addUnique = (items: readonly string[]) => {
			for (const label of items) {
				if (!seen.has(label)) {
					seen.add(label);
					labels.push(label);
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

		return labels;
	});

	// Get fonts for current dataset (brand fonts first, then web-safe by category)
	const fontOptions = $derived(getAllFontsForDataset(datasetId));
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

	function addRow() {
		const newRow: StatRow = {
			labelPreset: 'ATTACK',
			dataField: 'title',
			showBar: true,
			barColor: '#3b82f6',
			barMax: 100
		};
		onUpdate('rows', [...component.rows, newRow]);
	}

	function updateRow(index: number, key: keyof StatRow, value: unknown) {
		const newRows = [...component.rows];
		newRows[index] = { ...newRows[index], [key]: value };
		onUpdate('rows', newRows);
	}

	function removeRow(index: number) {
		const newRows = component.rows.filter((_, i) => i !== index);
		onUpdate('rows', newRows);
	}
</script>

<ComponentPanel
	title="Stat Panel"
	badge={{ text: 'stat', color: 'bg-cyan-600' }}
	bind:expanded
	{onRemove}
	{onMoveUp}
	{onMoveDown}
>
	<!-- Rows -->
	<div>
		<div class="mb-2 flex items-center justify-between">
			<label class="text-xs font-medium">Stat Rows</label>
			<Button variant="outline" size="sm" onclick={addRow} class="h-6 text-xs">
				+ Add Row
			</Button>
		</div>
		<div class="space-y-2">
			{#each component.rows as row, index (index)}
				<div class="rounded border p-2">
					<div class="mb-2 flex items-center justify-between">
						<span class="text-xs font-medium">Row {index + 1}</span>
						<Button
							variant="ghost"
							size="sm"
							onclick={() => removeRow(index)}
							class="h-5 w-5 p-0 text-destructive"
						>
							<span class="text-xs">×</span>
						</Button>
					</div>
					<FormGrid>
						<FormSelect
							label="Label"
							value={row.labelPreset}
							onchange={(v) => updateRow(index, 'labelPreset', v)}
							options={labelPresets}
						/>
						<FormSelect
							label="Value (Data Field)"
							value={row.dataField}
							onchange={(v) => updateRow(index, 'dataField', v)}
							options={dataFields}
						/>
					</FormGrid>
					<div class="mt-2 flex items-center gap-2">
						<FormCheckbox
							label="Show Bar"
							checked={row.showBar}
							onchange={(v) => updateRow(index, 'showBar', v)}
						/>
						{#if row.showBar}
							<input
								type="color"
								value={row.barColor}
								oninput={(e) => updateRow(index, 'barColor', (e.target as HTMLInputElement).value)}
								class="h-6 w-10 cursor-pointer rounded border"
							/>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	</div>

	<FormColorPicker
		label="Text Color"
		value={component.textColor}
		onchange={(v) => onUpdate('textColor', v)}
	/>

	<div class="flex gap-4">
		<FormCheckbox
			label="Show Dividers"
			checked={component.divider}
			onchange={(v) => onUpdate('divider', v)}
		/>
		<FormCheckbox
			label="Compact"
			checked={component.compact}
			onchange={(v) => onUpdate('compact', v)}
		/>
	</div>

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
				min={6}
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
			value={component.fontStyle ?? 'normal'}
			onchange={(v) => onUpdate('fontStyle', v)}
			options={fontStyles}
		/>
	</FormGrid>

	<FormGrid>
		<FormSelect
			label="Decoration"
			value={component.textDecoration ?? 'none'}
			onchange={(v) => onUpdate('textDecoration', v)}
			options={textDecorations}
		/>
		<FormSelect
			label="Transform"
			value={component.textTransform ?? 'none'}
			onchange={(v) => onUpdate('textTransform', v)}
			options={textTransforms}
		/>
	</FormGrid>

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
