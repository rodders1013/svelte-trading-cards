<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';

	interface Props {
		show: boolean;
		draftAge: string;
		onRestore: () => void;
		onDiscard: () => void;
	}

	let { show = $bindable(), draftAge, onRestore, onDiscard }: Props = $props();
</script>

<Dialog.Root bind:open={show}>
	<Dialog.Content class="sm:max-w-md">
		<Dialog.Header>
			<Dialog.Title>Restore Unsaved Work?</Dialog.Title>
			<Dialog.Description>
				You have an unsaved draft from {draftAge}. Would you like to restore it?
			</Dialog.Description>
		</Dialog.Header>
		<div class="flex justify-end gap-2 pt-4">
			<Button variant="outline" onclick={onDiscard}>Start Fresh</Button>
			<Button onclick={onRestore}>Restore Draft</Button>
		</div>
	</Dialog.Content>
</Dialog.Root>
