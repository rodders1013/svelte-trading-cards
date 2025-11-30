<script lang="ts">
	import { Label } from '$lib/components/ui/label';
	import { Switch } from '$lib/components/ui/switch';

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

<div class="flex items-center justify-between gap-2 {className}">
	<Label class="text-sm">{label}</Label>
	<Switch {checked} onCheckedChange={handleChange} />
</div>
