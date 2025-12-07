<script lang="ts">
	import { Label } from '$lib/creator/ui/label';
	import { Checkbox } from '$lib/creator/ui/checkbox';

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

<div class="flex items-center gap-1.5 {className}">
	<Checkbox {checked} onCheckedChange={handleChange} />
	<Label class="text-xs">{label}</Label>
</div>
