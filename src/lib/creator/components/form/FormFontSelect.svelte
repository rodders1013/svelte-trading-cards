<script lang="ts">
	import { Label } from '$lib/creator/ui/label';
	import * as Select from '$lib/creator/ui/select';
	import { loadFont } from '$lib/fonts';

	type FontOption = { value: string; label: string };

	let {
		label,
		value = $bindable(''),
		options,
		onchange,
		class: className = ''
	}: {
		label: string;
		value: string;
		options: FontOption[];
		onchange?: (value: string) => void;
		class?: string;
	} = $props();

	function handleValueChange(newValue: string | undefined) {
		if (newValue !== undefined) {
			value = newValue;
			// Load the font on demand (works for Google Fonts and brand fonts like SST)
			loadFont(newValue);
			onchange?.(newValue);
		}
	}

	// Find the label for the current value
	const selectedOption = $derived(options.find((opt) => opt.value === value));
</script>

<div class={className}>
	<Label class="mb-0.5 text-xs text-muted-foreground">{label}</Label>
	<Select.Root type="single" {value} onValueChange={handleValueChange}>
		<Select.Trigger class="h-8 w-full text-sm">
			{#if selectedOption}
				<span style="font-family: {value}">{selectedOption.label}</span>
			{:else}
				<span class="text-muted-foreground">Select font...</span>
			{/if}
		</Select.Trigger>
		<Select.Content class="max-h-64">
			{#each options as opt (opt.value)}
				<Select.Item value={opt.value} label={opt.label}>
					<span style="font-family: {opt.value}">{opt.label}</span>
				</Select.Item>
			{/each}
		</Select.Content>
	</Select.Root>
</div>
