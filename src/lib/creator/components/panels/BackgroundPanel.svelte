<script lang="ts">
	import ComponentPanel from '../ComponentPanel.svelte';
	import { FormSelect, FormSlider, FormColorPicker, PanelEffects } from '../form';
	import type { BackgroundComponent } from '../../types';

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

	const patternTypes = [
		{ value: 'none', label: 'None' },
		{ value: 'dots', label: 'Dots' },
		{ value: 'grid', label: 'Grid' },
		{ value: 'diagonal', label: 'Diagonal Lines' },
		{ value: 'hexagons', label: 'Hexagons' }
	];
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
				onchange={(v) => onUpdate('patternType', v)}
				options={patternTypes}
			/>

			{#if component.patternType !== 'none'}
				<FormColorPicker
					label="Pattern Color"
					value={component.patternColor ?? '#ffffff'}
					onchange={(v) => onUpdate('patternColor', v)}
				/>
				<FormSlider
					label="Pattern Opacity"
					value={component.patternOpacity ?? 0.3}
					onchange={(v) => onUpdate('patternOpacity', v)}
					min={0.05}
					max={1}
					step={0.05}
					percent
				/>
			{/if}
		</div>
	</div>

	<PanelEffects bind:effect={component.effect} />
</ComponentPanel>
