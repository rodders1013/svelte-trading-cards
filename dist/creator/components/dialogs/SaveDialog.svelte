<script lang="ts">
	import * as Dialog from '../../ui/dialog';
	import { Button } from '../../ui/button';
	import { Input } from '../../ui/input';
	import { Label } from '../../ui/label';
	import Save from '@lucide/svelte/icons/save';
	import FilePlus from '@lucide/svelte/icons/file-plus';

	let {
		open = $bindable(false),
		templateName = $bindable(''),
		isEditing = false,
		onSave,
		onSaveAsNew
	}: {
		open: boolean;
		templateName: string;
		isEditing?: boolean;
		onSave: (name: string) => void;
		onSaveAsNew: (name: string) => void;
	} = $props();

	let nameInput = $state('');

	// Reset name input when dialog opens
	$effect(() => {
		if (open) {
			nameInput = templateName || 'New Template';
		}
	});

	function handleSave() {
		if (!nameInput.trim()) return;
		onSave(nameInput.trim());
		open = false;
	}

	function handleSaveAsNew() {
		if (!nameInput.trim()) return;
		onSaveAsNew(nameInput.trim());
		open = false;
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			e.preventDefault();
			handleSave();
		}
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="max-w-sm">
		<Dialog.Header>
			<Dialog.Title>Save Template</Dialog.Title>
			<Dialog.Description>
				{#if isEditing}
					Update the existing template or save as a new one
				{:else}
					Enter a name for your template
				{/if}
			</Dialog.Description>
		</Dialog.Header>

		<div class="space-y-4 py-4">
			<div class="space-y-2">
				<Label for="template-name">Template Name</Label>
				<Input
					id="template-name"
					bind:value={nameInput}
					placeholder="My Template"
					onkeydown={handleKeydown}
					autofocus
				/>
			</div>
		</div>

		<Dialog.Footer class="flex-col gap-2 sm:flex-row">
			{#if isEditing}
				<Button variant="outline" onclick={handleSaveAsNew} class="w-full gap-2 sm:w-auto">
					<FilePlus class="h-4 w-4" />
					Save as New
				</Button>
				<Button onclick={handleSave} class="w-full gap-2 sm:w-auto">
					<Save class="h-4 w-4" />
					Update
				</Button>
			{:else}
				<Button variant="outline" onclick={() => open = false} class="w-full sm:w-auto">
					Cancel
				</Button>
				<Button onclick={handleSave} class="w-full gap-2 sm:w-auto">
					<Save class="h-4 w-4" />
					Save
				</Button>
			{/if}
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
