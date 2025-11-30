<script lang="ts">
	import { untrack } from 'svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Select from '$lib/components/ui/select';
	import { Button } from '$lib/components/ui/button';
	import type { DataFieldOption } from '$lib/demo';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import Sparkles from '@lucide/svelte/icons/sparkles';

	let {
		show = $bindable(false),
		unmappedFields,
		sourceDataset,
		targetDataset,
		targetDataFields,
		onApply,
		onSkip
	}: {
		show: boolean;
		unmappedFields: string[];
		sourceDataset: string;
		targetDataset: string;
		targetDataFields: DataFieldOption[];
		onApply: (mapping: Record<string, string>) => void;
		onSkip: () => void;
	} = $props();

	// Track the user's mapping choices
	let mappings = $state<Record<string, string>>({});
	let lastInitializedFields = $state<string>('');

	// Reset mappings when dialog opens with new fields
	$effect(() => {
		const fieldsKey = unmappedFields.join(',');
		if (show && unmappedFields.length > 0 && fieldsKey !== lastInitializedFields) {
			// Use untrack to prevent infinite loop
			untrack(() => {
				lastInitializedFields = fieldsKey;
				const newMappings: Record<string, string> = {};
				// Auto-suggest mappings based on field type/name similarity
				for (const field of unmappedFields) {
					const suggestion = suggestMapping(field);
					if (suggestion) {
						newMappings[field] = suggestion;
					}
				}
				mappings = newMappings;
			});
		}
	});

	// Simple suggestion based on common patterns
	function suggestMapping(sourceField: string): string | null {
		const lowerField = sourceField.toLowerCase();

		// Common mapping patterns
		const patterns: Record<string, string[]> = {
			// Title/Name fields
			'gamename': ['title', 'appname', 'name'],
			'title': ['gamename', 'appname', 'name'],
			'appname': ['title', 'gamename', 'name'],
			// Player ID fields
			'gamertag': ['psnid', 'steamusername', 'playerid', 'username'],
			'psnid': ['gamertag', 'steamusername', 'playerid', 'username'],
			'steamusername': ['gamertag', 'psnid', 'playerid', 'username'],
			// Image fields
			'coverart': ['boxart', 'headerimage', 'image', 'imageurl'],
			'boxart': ['coverart', 'headerimage', 'image', 'imageurl'],
			'headerimage': ['coverart', 'boxart', 'image', 'imageurl'],
			// Achievement fields
			'achievements': ['trophies', 'achievementsunlocked'],
			'trophies': ['achievements', 'achievementsunlocked'],
			'achievementsunlocked': ['achievements', 'trophies'],
			// Category fields
			'genre': ['category', 'tags'],
			'category': ['genre', 'tags'],
		};

		const possibleMappings = patterns[lowerField] || [];

		// Find first match in target fields
		for (const possible of possibleMappings) {
			const match = targetDataFields.find(f => f.value.toLowerCase() === possible);
			if (match) return match.value;
		}

		// If no pattern match, try to find same type
		return null;
	}

	function handleApply() {
		onApply(mappings);
		lastInitializedFields = ''; // Reset for next time
		show = false;
	}

	function handleSkip() {
		lastInitializedFields = ''; // Reset for next time
		onSkip();
		show = false;
	}

	// Check if all fields have been mapped
	const allMapped = $derived(
		unmappedFields.every(f => mappings[f] && mappings[f] !== '')
	);
</script>

<Dialog.Root bind:open={show}>
	<Dialog.Content class="sm:max-w-lg">
		<Dialog.Header>
			<Dialog.Title class="flex items-center gap-2">
				<Sparkles class="h-5 w-5 text-yellow-500" />
				Remap Data Fields
			</Dialog.Title>
			<Dialog.Description>
				Switching from <span class="font-medium capitalize">{sourceDataset}</span> to <span class="font-medium capitalize">{targetDataset}</span>.
				Some fields need to be remapped.
			</Dialog.Description>
		</Dialog.Header>

		<div class="space-y-3 py-4">
			{#each unmappedFields as field (field)}
				<div class="flex items-center gap-3">
					<!-- Source field -->
					<div class="w-1/3">
						<div class="rounded-md border border-dashed border-orange-500/50 bg-orange-500/10 px-3 py-2 text-sm">
							<span class="text-orange-400">{field}</span>
						</div>
					</div>

					<!-- Arrow -->
					<ArrowRight class="h-4 w-4 text-muted-foreground" />

					<!-- Target field dropdown -->
					<div class="flex-1">
						<Select.Root
							type="single"
							value={mappings[field] || ''}
							onValueChange={(v) => v !== undefined && (mappings[field] = v)}
						>
							<Select.Trigger class="w-full {mappings[field] ? 'border-green-500/50' : 'border-muted'}">
								{#if mappings[field]}
									<span class="text-green-400">
										{targetDataFields.find(f => f.value === mappings[field])?.label || mappings[field]}
									</span>
								{:else}
									<span class="text-muted-foreground">Select field...</span>
								{/if}
							</Select.Trigger>
							<Select.Content>
								<Select.Item value="" label="(Leave unmapped)" />
								{#each targetDataFields as targetField (targetField.value)}
									<Select.Item value={targetField.value} label={targetField.label}>
										<span class="flex items-center gap-2">
											{targetField.label}
											{#if targetField.type}
												<span class="text-xs text-muted-foreground">({targetField.type})</span>
											{/if}
										</span>
									</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>
					</div>
				</div>
			{/each}

			{#if unmappedFields.length === 0}
				<p class="text-center text-muted-foreground">All fields are compatible - no remapping needed!</p>
			{/if}
		</div>

		<Dialog.Footer class="flex gap-2">
			<Button variant="outline" onclick={handleSkip}>
				Skip (keep old bindings)
			</Button>
			<Button onclick={handleApply} disabled={!allMapped && unmappedFields.length > 0}>
				Apply Remapping
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
