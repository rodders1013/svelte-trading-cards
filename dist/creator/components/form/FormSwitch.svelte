<script lang="ts">
	import { Label } from '../../ui/label';
	import { Switch } from '../../ui/switch';

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

<div class="flex items-center justify-between gap-1.5 {className}">
	<Label class="text-xs">{label}</Label>
	<Switch {checked} onCheckedChange={handleChange} />
</div>
