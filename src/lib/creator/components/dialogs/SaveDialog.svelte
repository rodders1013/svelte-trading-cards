<script lang="ts">
	import * as Dialog from '$lib/creator/ui/dialog';
	import { Button } from '$lib/creator/ui/button';
	import { Input } from '$lib/creator/ui/input';
	import { Label } from '$lib/creator/ui/label';
	import Save from '@lucide/svelte/icons/save';
	import FilePlus from '@lucide/svelte/icons/file-plus';
	import Download from '@lucide/svelte/icons/download';

	let {
		open = $bindable(false),
		templateName = $bindable(''),
		isEditing = false,
		onSave,
		onSaveAsNew,
		onDownload
	}: {
		open: boolean;
		templateName: string;
		isEditing?: boolean;
		onSave: (name: string) => void;
		onSaveAsNew: (name: string) => void;
		onDownload: (name: string) => void;
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

	function handleDownload() {
		if (!nameInput.trim()) return;
		onDownload(nameInput.trim());
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
					Update this template or save a new community version
				{:else}
					Publish to community and/or download a JSON backup
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

		<div class="rounded-md border border-input bg-muted/20 p-3">
			<div class="flex items-start justify-between gap-2">
				<div>
					<p class="text-sm font-medium">Backup</p>
					<p class="text-xs text-muted-foreground">Download template JSON so you always keep a local copy.</p>
				</div>
				<Button variant="outline" onclick={handleDownload} class="gap-2">
					<Download class="h-4 w-4" />
					Download JSON
				</Button>
			</div>
		</div>

		<Dialog.Footer class="flex-col gap-2 sm:flex-row">
			{#if isEditing}
				<Button variant="outline" onclick={handleSaveAsNew} class="w-full gap-2 sm:w-auto">
					<FilePlus class="h-4 w-4" />
					Save as New Community Template
				</Button>
				<Button onclick={handleSave} class="w-full gap-2 sm:w-auto">
					<Save class="h-4 w-4" />
					Update Community Template
				</Button>
			{:else}
				<Button variant="outline" onclick={() => open = false} class="w-full sm:w-auto">
					Cancel
				</Button>
				<Button onclick={handleSave} class="w-full gap-2 sm:w-auto">
					<Save class="h-4 w-4" />
					Save to Community
				</Button>
			{/if}
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
