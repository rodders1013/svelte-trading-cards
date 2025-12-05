<script lang="ts">
	import { Label } from '$lib/components/ui/label';

	let {
		label,
		value = $bindable('#000000'),
		onchange,
		class: className = ''
	}: {
		label: string;
		value: string;
		onchange?: (value: string) => void;
		class?: string;
	} = $props();

	function handleInput(e: Event) {
		const newValue = (e.target as HTMLInputElement).value;
		value = newValue;
		onchange?.(newValue);
	}
</script>

<div class={className}>
	<Label class="mb-0.5 text-xs text-muted-foreground">{label}</Label>
	<input
		type="color"
		{value}
		oninput={handleInput}
		class="h-7 w-full cursor-pointer rounded border border-input bg-background"
	/>
</div>
