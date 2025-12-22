<script lang="ts">
	import { Label } from '../../ui/label';
	import * as Select from '../../ui/select';

	type Option = { value: string; label: string } | string;

	let {
		label,
		value = $bindable(''),
		options,
		onchange,
		class: className = '',
		placeholder = 'Select...'
	}: {
		label: string;
		value: string;
		options: Option[];
		onchange?: (value: string) => void;
		class?: string;
		placeholder?: string;
	} = $props();

	const normalizedOptions = $derived(
		options.map((opt) => (typeof opt === 'string' ? { value: opt, label: opt } : opt))
	);

	function handleValueChange(newValue: string | undefined) {
		if (newValue !== undefined) {
			value = newValue;
			onchange?.(newValue);
		}
	}

	// Find the label for the current value
	const selectedLabel = $derived(
		normalizedOptions.find((opt) => opt.value === value)?.label ?? value
	);
</script>

<div class={className}>
	<Label class="mb-0.5 text-xs text-muted-foreground">{label}</Label>
	<Select.Root type="single" {value} onValueChange={handleValueChange}>
		<Select.Trigger class="h-8 w-full text-sm">
			{#if value}
				{selectedLabel}
			{:else}
				<span class="text-muted-foreground">{placeholder}</span>
			{/if}
		</Select.Trigger>
		<Select.Content>
			{#each normalizedOptions as opt (opt.value)}
				<Select.Item value={opt.value} label={opt.label} />
			{/each}
		</Select.Content>
	</Select.Root>
</div>
