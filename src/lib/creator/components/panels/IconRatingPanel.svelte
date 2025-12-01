<script lang="ts">
	import { IconPicker } from '$lib/components/icons';
	import type { IconData } from '$lib/components/icons';
	import { RATING_ICON_PRESETS, RATING_ICON_LABELS } from '$lib/components/decorations/IconRating.svelte';
	import type { RatingIconPreset } from '$lib/components/decorations';
	import ComponentPanel from '../ComponentPanel.svelte';
	import {
		FormSelect,
		FormColorPicker,
		FormSlider,
		FormInput,
		FormCheckbox,
		FormGrid,
		PanelEffects
	} from '../form';
	import type { IconRatingComponent, DataFieldOption } from '../../types';
	import type { FontDropdownOption } from '$lib/fonts';
	import Link from '@lucide/svelte/icons/link';
	import HelpTooltip from '../HelpTooltip.svelte';

	let {
		component,
		dataFields,
		fonts,
		previewData = {},
		expanded = $bindable(true),
		onUpdate,
		onRemove,
		onMoveUp,
		onMoveDown
	}: {
		component: IconRatingComponent;
		dataFields: DataFieldOption[];
		fonts: FontDropdownOption[];
		previewData?: Record<string, unknown>;
		expanded: boolean;
		onUpdate: (key: keyof Omit<IconRatingComponent, 'type' | 'id'>, value: unknown) => void;
		onRemove: () => void;
		onMoveUp: () => void;
		onMoveDown: () => void;
	} = $props();

	// Icon preset options
	const iconPresetOptions = $derived(
		(Object.keys(RATING_ICON_LABELS) as RatingIconPreset[]).map((key) => ({
			value: key,
			label: RATING_ICON_LABELS[key]
		}))
	);

	const dataFieldOptions = $derived([
		{ value: '', label: 'None (use static value)' },
		...dataFields.filter((f) => f.type === 'number' || !f.type)
	]);

	const valuePositions = ['left', 'right'];
	const valueFormats = [
		{ value: 'decimal', label: 'Decimal (4.5)' },
		{ value: 'fraction', label: 'Fraction (4.5/5)' },
		{ value: 'percent', label: 'Percent (90%)' },
		{ value: 'none', label: 'Hidden' }
	];

	// Show custom icon picker when preset is 'custom'
	const showCustomIconPicker = $derived(component.iconPreset === 'custom');

	// Check if value is data-bound
	const isDataBound = $derived(!!component.dataField);

	// Get the resolved value from data when data-bound
	const resolvedValue = $derived.by(() => {
		if (component.dataField && previewData[component.dataField] !== undefined) {
			const v = previewData[component.dataField];
			return typeof v === 'number' ? v : parseFloat(String(v)) || 0;
		}
		return component.value;
	});

	// Get the field label for display
	const boundFieldLabel = $derived.by(() => {
		if (!component.dataField) return '';
		const field = dataFields.find(f => f.value === component.dataField);
		return field?.label || component.dataField;
	});

	function handleIconSelect(icon: { iconData: IconData; iconName: string }) {
		onUpdate('customIcon', icon.iconData);
		onUpdate('customIconName', icon.iconName);
	}
</script>

<ComponentPanel
	title="Icon Rating"
	badge={{ text: '★', color: 'bg-yellow-600' }}
	bind:expanded
	{onRemove}
	{onMoveUp}
	{onMoveDown}
>
	<!-- Data Field Binding -->
	<FormSelect
		label="Data Field (optional)"
		value={component.dataField ?? ''}
		onchange={(v) => onUpdate('dataField', v || undefined)}
		options={dataFieldOptions}
	/>

	<!-- Value Settings -->
	<FormGrid>
		{#if isDataBound}
			<!-- Data-bound value display -->
			<div>
				<label class="mb-1 flex items-center gap-1.5 text-sm text-muted-foreground">
					<Link class="h-3 w-3 text-blue-400" />
					<span>Value</span>
					<span class="text-xs text-blue-400">({boundFieldLabel})</span>
				</label>
				<div class="flex h-8 items-center rounded-md border border-blue-500/30 bg-blue-500/10 px-3 text-sm text-blue-300">
					{resolvedValue}
				</div>
			</div>
		{:else}
			<FormInput
				label="Value"
				type="number"
				value={component.value}
				onchange={(v) => onUpdate('value', Number(v) || 0)}
				min={0}
				step={0.5}
			/>
		{/if}
		<div>
			<label class="mb-1 flex items-center gap-1.5 text-sm text-muted-foreground">
				Source Max Value
				<HelpTooltip text="Scale values from a different range to your icon count. Example: A value of 47 out of 100 with 5 icons becomes 2.35 stars." />
			</label>
			<input
				type="number"
				class="flex h-8 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
				value={component.sourceMax ?? ''}
				onchange={(e) => {
					const v = (e.target as HTMLInputElement).value;
					onUpdate('sourceMax', v ? Number(v) : undefined);
				}}
				min={1}
				placeholder={isDataBound ? 'e.g., 100' : 'optional'}
			/>
		</div>
	</FormGrid>

	<FormInput
		label="Number of Icons"
		type="number"
		value={component.max}
		onchange={(v) => onUpdate('max', Number(v) || 5)}
		min={1}
		max={10}
	/>

	<!-- Scaling preview -->
	<p class="text-xs text-muted-foreground">
		{#if component.sourceMax}
			{resolvedValue}/{component.sourceMax} → {((resolvedValue / component.sourceMax) * component.max).toFixed(1)}/{component.max} icons
		{:else}
			{resolvedValue}/{component.max} icons
		{/if}
	</p>

	<!-- Icon Selection -->
	<div class="space-y-2">
		<FormSelect
			label="Icon Style"
			value={component.iconPreset}
			onchange={(v) => onUpdate('iconPreset', v)}
			options={iconPresetOptions}
		/>

		{#if showCustomIconPicker}
			<div class="pl-2 border-l-2 border-zinc-700">
				<p class="text-xs text-zinc-400 mb-2">Select a custom icon:</p>
				<IconPicker
					value={{ iconData: component.customIcon, iconName: component.customIconName }}
					onSelect={handleIconSelect}
				/>
			</div>
		{/if}
	</div>

	<!-- Layout -->
	<FormGrid>
		<FormInput
			label="Icon Size"
			type="number"
			value={component.size}
			onchange={(v) => onUpdate('size', Number(v) || 24)}
			min={8}
			max={64}
		/>
		<FormInput
			label="Gap"
			type="number"
			value={component.gap}
			onchange={(v) => onUpdate('gap', Number(v) || 0)}
			min={0}
			max={20}
		/>
	</FormGrid>

	<!-- Colors -->
	<FormGrid>
		<FormColorPicker
			label="Filled Color"
			value={component.filledColor}
			onchange={(v) => onUpdate('filledColor', v)}
		/>
		<FormColorPicker
			label="Empty Color"
			value={component.emptyColor}
			onchange={(v) => onUpdate('emptyColor', v)}
		/>
	</FormGrid>

	<div class="space-y-2">
		<FormCheckbox
			label="Use opacity for empty (same color, faded)"
			checked={component.useEmptyOpacity}
			onchange={(v) => onUpdate('useEmptyOpacity', v)}
		/>
		{#if component.useEmptyOpacity}
			<FormSlider
				label="Empty Opacity"
				value={component.emptyOpacity}
				onchange={(v) => onUpdate('emptyOpacity', v)}
				min={0}
				max={1}
				step={0.05}
				percent
			/>
		{/if}
	</div>

	<FormCheckbox
		label="Allow half values"
		checked={component.allowHalf}
		onchange={(v) => onUpdate('allowHalf', v)}
	/>

	<!-- Value Display -->
	<div class="space-y-2">
		<FormCheckbox
			label="Show value text"
			checked={component.showValue}
			onchange={(v) => onUpdate('showValue', v)}
		/>

		{#if component.showValue}
			<FormGrid>
				<FormSelect
					label="Position"
					value={component.valuePosition}
					onchange={(v) => onUpdate('valuePosition', v)}
					options={valuePositions}
				/>
				<FormSelect
					label="Format"
					value={component.valueFormat}
					onchange={(v) => onUpdate('valueFormat', v)}
					options={valueFormats}
				/>
			</FormGrid>

			<FormGrid>
				<FormInput
					label="Font Size"
					type="number"
					value={component.valueFontSize}
					onchange={(v) => onUpdate('valueFontSize', Number(v) || 14)}
					min={8}
					max={48}
				/>
				<FormColorPicker
					label="Value Color"
					value={component.valueColor}
					onchange={(v) => onUpdate('valueColor', v)}
				/>
			</FormGrid>

			<FormSelect
				label="Font Family"
				value={component.valueFontFamily}
				onchange={(v) => onUpdate('valueFontFamily', v)}
				options={fonts}
			/>
		{/if}
	</div>

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
