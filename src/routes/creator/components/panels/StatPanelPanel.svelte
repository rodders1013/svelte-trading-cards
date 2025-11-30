<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import ComponentPanel from '../ComponentPanel.svelte';
	import {
		FormSelect,
		FormColorPicker,
		FormSlider,
		FormCheckbox,
		FormGrid,
		PanelEffects
	} from '../form';
	import type { StatPanelComponent } from '../../types';
	import type { StatRow } from '$lib/components/fields';
	import { fontFamilies, dataFields } from '../../types';

	let {
		component,
		expanded = $bindable(true),
		onUpdate,
		onRemove,
		onMoveUp,
		onMoveDown
	}: {
		component: StatPanelComponent;
		expanded: boolean;
		onUpdate: (key: keyof Omit<StatPanelComponent, 'type' | 'id'>, value: unknown) => void;
		onRemove: () => void;
		onMoveUp: () => void;
		onMoveDown: () => void;
	} = $props();

	const labelPresets = [
		'ATTACK', 'DEFENSE', 'HEALTH', 'HP', 'MP', 'MANA', 'POWER', 'SPEED', 'LUCK',
		'STRENGTH', 'AGILITY', 'INTELLIGENCE', 'STAMINA', 'ARMOR', 'DAMAGE',
		'LEVEL', 'RANK', 'TIER', 'RARITY', 'EDITION', 'YEAR', 'SERIES',
		'SCORE', 'POINTS', 'VALUE', 'RATING', 'COUNT', 'TOTAL', 'MAX',
		'TYPE', 'CLASS', 'ELEMENT', 'FACTION', 'TEAM', 'ROLE',
		'STATUS', 'CONDITION', 'QUALITY', 'GRADE'
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

	<FormGrid>
		<FormColorPicker
			label="Label Color"
			value={component.labelColor}
			onchange={(v) => onUpdate('labelColor', v)}
		/>
		<FormColorPicker
			label="Value Color"
			value={component.valueColor}
			onchange={(v) => onUpdate('valueColor', v)}
		/>
	</FormGrid>

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

	<FormSelect
		label="Font Family"
		value={component.fontFamily}
		onchange={(v) => onUpdate('fontFamily', v)}
		options={fontFamilies}
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
