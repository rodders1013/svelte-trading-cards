<script lang="ts">
	import { Label } from '$lib/components/ui/label';
	import { Slider } from '$lib/components/ui/slider';

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
		percent?: boolean;
		suffix?: string;
		onchange?: (value: number) => void;
		class?: string;
	} = $props();

	const displayValue = $derived(
		percent ? `${Math.round(value * 100)}%` : `${value}${suffix}`
	);

	function handleChange(newValue: number) {
		value = newValue;
		onchange?.(newValue);
	}
</script>

<div class={className}>
	<Label class="mb-0.5 flex items-center justify-between text-xs text-muted-foreground">
		<span>{label}</span>
		<span class="font-medium text-foreground">{displayValue}</span>
	</Label>
	<Slider
		type="single"
		{value}
		onValueChange={handleChange}
		{min}
		{max}
		{step}
		class="mt-1"
	/>
</div>
