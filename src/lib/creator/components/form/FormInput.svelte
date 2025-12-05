<script lang="ts">
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';

	let {
		label,
		value = $bindable(''),
		type = 'text',
		min,
		max,
		step,
		placeholder = '',
		onchange,
		class: className = ''
	}: {
		label: string;
		value: string | number;
		type?: 'text' | 'number' | 'email' | 'password' | 'url';
		min?: number;
		max?: number;
		step?: number;
		placeholder?: string;
		onchange?: (value: string | number) => void;
		class?: string;
	} = $props();

	function handleChange(e: Event) {
		const target = e.target as HTMLInputElement;
		const newValue = type === 'number' ? parseFloat(target.value) || 0 : target.value;
		value = newValue;
		onchange?.(newValue);
	}
</script>

<div class={className}>
	<Label class="mb-0.5 text-xs text-muted-foreground">{label}</Label>
	<Input {type} {value} {min} {max} {step} {placeholder} onchange={handleChange} class="h-8 text-sm" />
</div>
