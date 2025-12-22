<script lang="ts">
	import { Label } from '../../ui/label';
	import { Slider } from '../../ui/slider';

	let {
		label,
		value = $bindable(0),
		min = 0,
		max = 100,
		step = 1,
		percent = false,
		suffix = '',
		onchange,
		class: className = ''
	}: {
		label: string;
		value: number;
		min?: number;
		max?: number;
		step?: number;
		/** When true, slider uses 0-100 range but value is 0-1 internally */
		percent?: boolean;
		suffix?: string;
		onchange?: (value: number) => void;
		class?: string;
	} = $props();

	// For percent mode: slider is 0-100, value is 0-1
	const sliderMin = $derived(percent ? 0 : min);
	const sliderMax = $derived(percent ? 100 : max);
	const sliderStep = $derived(percent ? 1 : step);
	const sliderValue = $derived(percent ? Math.round(value * 100) : value);

	const displayValue = $derived(
		percent ? `${Math.round(value * 100)}%` : `${value}${suffix}`
	);

	function handleChange(newValue: number) {
		const actualValue = percent ? newValue / 100 : newValue;
		value = actualValue;
		onchange?.(actualValue);
	}
</script>

<div class={className}>
	<Label class="mb-0.5 flex items-center justify-between text-xs text-muted-foreground">
		<span>{label}</span>
		<span class="font-medium text-foreground">{displayValue}</span>
	</Label>
	<Slider
		type="single"
		value={sliderValue}
		onValueChange={handleChange}
		min={sliderMin}
		max={sliderMax}
		step={sliderStep}
		class="mt-1"
	/>
</div>
