<script lang="ts">
	import { Label } from '$lib/components/ui/label';
	import { Checkbox } from '$lib/components/ui/checkbox';

	let {
		label,
		checked = $bindable(false),
		onchange,
		class: className = ''
	}: {
		label: string;
		checked: boolean;
		onchange?: (checked: boolean) => void;
		class?: string;
	} = $props();

	function handleChange(newChecked: boolean) {
		checked = newChecked;
		onchange?.(newChecked);
	}
</script>

<div class="flex items-center gap-2 {className}">
	<Checkbox {checked} onCheckedChange={handleChange} />
	<Label class="text-sm">{label}</Label>
</div>
