<script lang="ts">
	import { Label } from '$lib/creator/ui/label';
	import * as Select from '$lib/creator/ui/select';
	import { BLEND_MODE_OPTIONS, type BlendMode } from '$lib/styling/blend';

	interface Props {
		blendMode: BlendMode | undefined;
		onUpdate: (blendMode: BlendMode | undefined) => void;
	}

	let { blendMode = 'normal', onUpdate }: Props = $props();

	// Group blend modes by category for better UX
	const categories = [
		{ label: 'Basic', modes: BLEND_MODE_OPTIONS.filter(o => o.category === 'basic') },
		{ label: 'Darken', modes: BLEND_MODE_OPTIONS.filter(o => o.category === 'darken') },
		{ label: 'Lighten', modes: BLEND_MODE_OPTIONS.filter(o => o.category === 'lighten') },
		{ label: 'Contrast', modes: BLEND_MODE_OPTIONS.filter(o => o.category === 'contrast') },
		{ label: 'Inversion', modes: BLEND_MODE_OPTIONS.filter(o => o.category === 'inversion') }
	];

	const currentLabel = $derived(
		BLEND_MODE_OPTIONS.find(o => o.value === (blendMode ?? 'normal'))?.label ?? 'Normal'
	);

	function handleChange(value: string | undefined) {
		if (value === 'normal' || value === undefined) {
			onUpdate(undefined);
		} else {
			onUpdate(value as BlendMode);
		}
	}
</script>

<div class="space-y-2">
	<Label class="text-xs text-muted-foreground">Blend Mode</Label>
	<Select.Root
		type="single"
		value={blendMode ?? 'normal'}
		onValueChange={handleChange}
	>
		<Select.Trigger class="h-8 text-xs w-full">
			{currentLabel}
		</Select.Trigger>
		<Select.Content>
			{#each categories as category}
				<div class="px-2 py-1 text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
					{category.label}
				</div>
				{#each category.modes as mode}
					<Select.Item value={mode.value} label={mode.label} class="text-xs" />
				{/each}
			{/each}
		</Select.Content>
	</Select.Root>
	{#if blendMode && blendMode !== 'normal'}
		{@const currentMode = BLEND_MODE_OPTIONS.find(o => o.value === blendMode)}
		{#if currentMode}
			<p class="text-[10px] text-muted-foreground">{currentMode.description}</p>
		{/if}
	{/if}
</div>
