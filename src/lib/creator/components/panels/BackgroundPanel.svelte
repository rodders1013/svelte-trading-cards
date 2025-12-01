<script lang="ts">
	import ComponentPanel from '../ComponentPanel.svelte';
	import { FormSelect, FormSlider, FormColorPicker, FormInput, FormGrid, PanelEffects } from '../form';
	import { IconPicker } from '$lib/components/icons';
	import type { IconData } from '$lib/components/icons';
	import { PATTERN_LABELS, PATTERN_PRESETS } from '$lib/components/backgrounds/PatternBackground.svelte';
	import type { PatternType } from '$lib/components/backgrounds';
	import type { BackgroundComponent } from '../../types';
	import { Button } from '$lib/components/ui/button';
	import Trash2 from '@lucide/svelte/icons/trash-2';
	import Plus from '@lucide/svelte/icons/plus';

	let {
		component,
		expanded = $bindable(true),
		onUpdate,
		onRemove,
		onMoveUp,
		onMoveDown
	}: {
		component: BackgroundComponent;
		expanded: boolean;
		onUpdate: (key: keyof Omit<BackgroundComponent, 'type' | 'id'>, value: unknown) => void;
		onRemove: () => void;
		onMoveUp: () => void;
		onMoveDown: () => void;
	} = $props();

	const fillTypes = [
		{ value: 'none', label: 'None' },
		{ value: 'solid', label: 'Solid Color' },
		{ value: 'gradient', label: 'Gradient' }
	];

	const gradientDirections = [
		{ value: 'vertical', label: 'Vertical' },
		{ value: 'horizontal', label: 'Horizontal' },
		{ value: 'diagonal', label: 'Diagonal' }
	];

	// Build pattern options from PATTERN_LABELS
	const patternTypes = $derived([
		{ value: 'none', label: 'None' },
		...Object.entries(PATTERN_LABELS).map(([value, label]) => ({ value, label }))
	]);

	// Check if current pattern needs icon picker
	const needsIconPicker = $derived(component.patternType === 'icon');
	const needsMultiIconPicker = $derived(component.patternType === 'icons');
	const hasPatternOptions = $derived(component.patternType !== 'none');

	// Apply preset values when pattern changes
	function handlePatternChange(newPattern: string) {
		onUpdate('patternType', newPattern);

		// Apply preset defaults for the new pattern
		if (newPattern !== 'none') {
			const preset = PATTERN_PRESETS[newPattern as PatternType];
			if (preset) {
				onUpdate('patternSize', preset.size);
				onUpdate('patternSpacing', preset.spacing);
				onUpdate('patternStrokeWidth', preset.strokeWidth);
			}
		}
	}

	// Handle single icon selection
	function handleIconSelect(icon: { iconData: IconData; iconName: string }) {
		onUpdate('patternIcon', icon.iconData);
		onUpdate('patternIconName', icon.iconName);
	}

	// Handle multi-icon addition
	function addIconToPattern(icon: { iconData: IconData; iconName: string }) {
		const currentIcons = component.patternIcons ?? [];
		onUpdate('patternIcons', [...currentIcons, { iconData: icon.iconData, iconName: icon.iconName, rotation: 0 }]);
	}

	// Remove icon from multi-icon pattern
	function removeIconFromPattern(index: number) {
		const currentIcons = component.patternIcons ?? [];
		onUpdate('patternIcons', currentIcons.filter((_, i) => i !== index));
	}

	// Update icon rotation in multi-icon pattern
	function updateIconRotation(index: number, rotation: number) {
		const currentIcons = component.patternIcons ?? [];
		const updated = [...currentIcons];
		updated[index] = { ...updated[index], rotation };
		onUpdate('patternIcons', updated);
	}
</script>

<ComponentPanel
	title="Background"
	badge={{ text: 'bg', color: 'bg-slate-600' }}
	bind:expanded
	{onRemove}
	{onMoveUp}
	{onMoveDown}
>
	<!-- Fill Section -->
	<div class="rounded border border-input p-2">
		<label class="text-sm font-medium">Fill</label>
		<div class="mt-2 space-y-2">
			<FormSelect
				label="Type"
				value={component.fillType}
				onchange={(v) => onUpdate('fillType', v)}
				options={fillTypes}
			/>

			{#if component.fillType === 'solid'}
				<FormColorPicker
					label="Color"
					value={component.solidColor ?? '#1e293b'}
					onchange={(v) => onUpdate('solidColor', v)}
				/>
				<FormSlider
					label="Fill Opacity"
					value={component.fillOpacity ?? 1}
					onchange={(v) => onUpdate('fillOpacity', v)}
					min={0}
					max={1}
					step={0.05}
					percent
				/>
			{:else if component.fillType === 'gradient'}
				<FormSelect
					label="Direction"
					value={component.gradientDirection ?? 'vertical'}
					onchange={(v) => onUpdate('gradientDirection', v)}
					options={gradientDirections}
				/>
				<div class="flex gap-2">
					<FormColorPicker
						label="Color 1"
						value={component.gradientColors?.[0] ?? '#1e293b'}
						onchange={(v) => onUpdate('gradientColors', [v, component.gradientColors?.[1] ?? '#0f172a'])}
						class="flex-1"
					/>
					<FormColorPicker
						label="Color 2"
						value={component.gradientColors?.[1] ?? '#0f172a'}
						onchange={(v) => onUpdate('gradientColors', [component.gradientColors?.[0] ?? '#1e293b', v])}
						class="flex-1"
					/>
				</div>
				<FormSlider
					label="Fill Opacity"
					value={component.fillOpacity ?? 1}
					onchange={(v) => onUpdate('fillOpacity', v)}
					min={0}
					max={1}
					step={0.05}
					percent
				/>
			{/if}
		</div>
	</div>

	<!-- Pattern Overlay Section -->
	<div class="rounded border border-input p-2">
		<label class="text-sm font-medium">Pattern Overlay</label>
		<div class="mt-2 space-y-2">
			<FormSelect
				label="Pattern"
				value={component.patternType}
				onchange={handlePatternChange}
				options={patternTypes}
			/>

			{#if hasPatternOptions}
				<FormColorPicker
					label="Pattern Color"
					value={component.patternColor ?? '#ffffff'}
					onchange={(v) => onUpdate('patternColor', v)}
				/>

				<FormGrid>
					<FormSlider
						label="Opacity"
						value={component.patternOpacity ?? 0.3}
						onchange={(v) => onUpdate('patternOpacity', v)}
						min={0.05}
						max={1}
						step={0.05}
						percent
					/>
					<FormInput
						label="Size"
						type="number"
						value={component.patternSize ?? 20}
						onchange={(v) => onUpdate('patternSize', Number(v) || 20)}
						min={4}
						max={200}
					/>
				</FormGrid>

				<FormGrid>
					<FormInput
						label="Spacing"
						type="number"
						value={component.patternSpacing ?? 0}
						onchange={(v) => onUpdate('patternSpacing', Number(v) || 0)}
						min={0}
						max={100}
					/>
					<FormInput
						label="Rotation"
						type="number"
						value={component.patternRotation ?? 0}
						onchange={(v) => onUpdate('patternRotation', Number(v) || 0)}
						min={-180}
						max={180}
					/>
				</FormGrid>

				<FormSlider
					label="Stroke Width"
					value={component.patternStrokeWidth ?? 1}
					onchange={(v) => onUpdate('patternStrokeWidth', v)}
					min={0.5}
					max={5}
					step={0.5}
				/>

				<!-- Single Icon Pattern Options -->
				{#if needsIconPicker}
					<div class="rounded border border-input bg-muted/20 p-2">
						<label class="mb-2 block text-sm font-medium">Pattern Icon</label>
						<IconPicker
							value={{ iconData: component.patternIcon, iconName: component.patternIconName }}
							onSelect={handleIconSelect}
						/>
						{#if component.patternIcon}
							<FormGrid class="mt-2">
								<FormInput
									label="Icon Rotation"
									type="number"
									value={component.patternIconRotation ?? 0}
									onchange={(v) => onUpdate('patternIconRotation', Number(v) || 0)}
									min={-180}
									max={180}
								/>
								<FormSlider
									label="Icon Scale"
									value={component.patternIconScale ?? 1}
									onchange={(v) => onUpdate('patternIconScale', v)}
									min={0.5}
									max={2}
									step={0.1}
								/>
							</FormGrid>
						{/if}
					</div>
				{/if}

				<!-- Multi-Icon Pattern Options -->
				{#if needsMultiIconPicker}
					<div class="rounded border border-input bg-muted/20 p-2">
						<label class="mb-2 block text-sm font-medium">Pattern Icons</label>

						<!-- Current icons list -->
						{#if component.patternIcons && component.patternIcons.length > 0}
							<div class="mb-2 space-y-1">
								{#each component.patternIcons as iconItem, index}
									<div class="flex items-center gap-2 rounded bg-background p-1.5">
										<span class="flex-1 truncate text-xs">
											{iconItem.iconName ?? 'Icon ' + (index + 1)}
										</span>
										<div class="flex items-center gap-1">
											<span class="text-[10px] text-muted-foreground">Rot:</span>
											<input
												type="number"
												class="h-6 w-12 rounded border border-input bg-background px-1 text-xs"
												value={iconItem.rotation ?? 0}
												onchange={(e) => updateIconRotation(index, Number((e.target as HTMLInputElement).value) || 0)}
												placeholder="0"
												min={-180}
												max={180}
											/>
											<span class="text-[10px] text-muted-foreground">°</span>
										</div>
										<Button
											variant="ghost"
											size="icon"
											class="h-6 w-6"
											onclick={() => removeIconFromPattern(index)}
										>
											<Trash2 class="h-3 w-3" />
										</Button>
									</div>
								{/each}
							</div>

							<!-- Row Offset for staggered pattern -->
							<FormInput
								label="Row Offset (stagger)"
								type="number"
								value={component.patternRowOffset ?? 0}
								onchange={(v) => onUpdate('patternRowOffset', Number(v) || 0)}
								min={-100}
								max={100}
							/>
							<p class="text-xs text-muted-foreground">
								Shift alternating rows horizontally for a brick/staggered effect
							</p>
						{/if}

						<!-- Add icon picker -->
						<div class="rounded border border-dashed border-input p-2">
							<p class="mb-2 text-xs text-muted-foreground">
								<Plus class="mr-1 inline h-3 w-3" />
								Add icon to pattern
							</p>
							<IconPicker
								value={{ iconData: undefined, iconName: undefined }}
								onSelect={addIconToPattern}
							/>
						</div>
					</div>
				{/if}
			{/if}
		</div>
	</div>

	<PanelEffects bind:effect={component.effect} />
</ComponentPanel>
