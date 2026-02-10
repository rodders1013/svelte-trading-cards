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
		username = $bindable(''),
		scope = $bindable<'universal' | 'game'>('universal'),
		gameKey = $bindable(''),
		gameOptions = [],
		isEditing = false,
		onSave,
		onSaveAsNew,
		onDownload
	}: {
		open: boolean;
		templateName: string;
		username: string;
		scope: 'universal' | 'game';
		gameKey: string;
		gameOptions: Array<{ value: string; label: string }>;
		isEditing?: boolean;
		onSave: (name: string, username: string, scope: 'universal' | 'game', gameKey?: string) => void;
		onSaveAsNew: (name: string, username: string, scope: 'universal' | 'game', gameKey?: string) => void;
		onDownload: (name: string) => void;
	} = $props();

	let nameInput = $state('');
	let usernameInput = $state('');

	// Reset name input when dialog opens
	$effect(() => {
		if (open) {
			nameInput = templateName || 'New Template';
			usernameInput = username || '';
			if (scope === 'game' && !gameKey && gameOptions.length > 0) {
				gameKey = gameOptions[0].value;
			}
		}
	});

	$effect(() => {
		if (open && scope === 'game' && !gameKey && gameOptions.length > 0) {
			gameKey = gameOptions[0].value;
		}
	});

	function handleSave() {
		if (!nameInput.trim() || !usernameInput.trim()) return;
		if (scope === 'game' && !gameKey.trim()) return;
		username = usernameInput.trim();
		onSave(
			nameInput.trim(),
			username,
			scope,
			scope === 'game' ? gameKey.trim() || undefined : undefined
		);
		open = false;
	}

	function handleSaveAsNew() {
		if (!nameInput.trim() || !usernameInput.trim()) return;
		if (scope === 'game' && !gameKey.trim()) return;
		username = usernameInput.trim();
		onSaveAsNew(
			nameInput.trim(),
			username,
			scope,
			scope === 'game' ? gameKey.trim() || undefined : undefined
		);
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
			<div class="space-y-2">
				<Label for="template-username">Username</Label>
				<Input
					id="template-username"
					bind:value={usernameInput}
					placeholder="Your display name"
				/>
			</div>
			<div class="space-y-2">
				<Label for="template-scope">Template Scope</Label>
				<select
					id="template-scope"
					class="w-full rounded border border-input bg-background px-3 py-2 text-sm"
					bind:value={scope}
				>
					<option value="universal">Universal (all datasets)</option>
					<option value="game">Game-specific</option>
				</select>
			</div>
			{#if scope === 'game'}
				<div class="space-y-2">
					<Label for="template-game-key">Game / Dataset Key</Label>
					<select
						id="template-game-key"
						class="w-full rounded border border-input bg-background px-3 py-2 text-sm"
						bind:value={gameKey}
					>
						<option value="">Select game</option>
						{#each gameOptions as option (option.value)}
							<option value={option.value}>{option.label}</option>
						{/each}
					</select>
				</div>
			{/if}
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
