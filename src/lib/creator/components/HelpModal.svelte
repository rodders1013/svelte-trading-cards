<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';

	let {
		show = $bindable(false)
	}: {
		show: boolean;
	} = $props();
</script>

<Dialog.Root bind:open={show}>
	<Dialog.Content class="max-h-[80vh] overflow-auto sm:max-w-lg">
		<Dialog.Header>
			<Dialog.Title>Keyboard Shortcuts</Dialog.Title>
		</Dialog.Header>

		<div class="space-y-4 text-sm">
			<!-- General -->
			<div>
				<h3 class="mb-2 font-medium text-muted-foreground">General</h3>
				<div class="grid grid-cols-2 gap-1">
					<div><kbd class="kbd">?</kbd> or <kbd class="kbd">Cmd /</kbd></div>
					<div>Show this help</div>
					<div><kbd class="kbd">Cmd Z</kbd></div>
					<div>Undo</div>
					<div><kbd class="kbd">Cmd Shift Z</kbd></div>
					<div>Redo</div>
				</div>
			</div>

			<!-- Layer Operations -->
			<div>
				<h3 class="mb-2 font-medium text-muted-foreground">Layer Operations</h3>
				<div class="grid grid-cols-2 gap-1">
					<div><kbd class="kbd">Cmd C</kbd></div>
					<div>Copy layer</div>
					<div><kbd class="kbd">Cmd V</kbd></div>
					<div>Paste layer</div>
					<div><kbd class="kbd">Delete</kbd> / <kbd class="kbd">Backspace</kbd></div>
					<div>Delete layer</div>
					<div><kbd class="kbd">Escape</kbd></div>
					<div>Deselect layer</div>
					<div><kbd class="kbd">H</kbd></div>
					<div>Toggle visibility</div>
					<div><kbd class="kbd">L</kbd></div>
					<div>Toggle lock</div>
				</div>
			</div>

			<!-- Movement -->
			<div>
				<h3 class="mb-2 font-medium text-muted-foreground">Movement</h3>
				<div class="grid grid-cols-2 gap-1">
					<div><kbd class="kbd">Arrow Keys</kbd></div>
					<div>Nudge 1px</div>
					<div><kbd class="kbd">Shift</kbd> + <kbd class="kbd">Arrow Keys</kbd></div>
					<div>Nudge 10px</div>
					<div><kbd class="kbd">Shift</kbd> + Drag</div>
					<div>Snap to grid</div>
				</div>
			</div>

			<!-- View -->
			<div>
				<h3 class="mb-2 font-medium text-muted-foreground">View</h3>
				<div class="grid grid-cols-2 gap-1">
					<div><kbd class="kbd">G</kbd></div>
					<div>Toggle grid</div>
					<div><kbd class="kbd">Cmd +</kbd></div>
					<div>Zoom in</div>
					<div><kbd class="kbd">Cmd -</kbd></div>
					<div>Zoom out</div>
					<div><kbd class="kbd">Cmd 0</kbd></div>
					<div>Reset zoom</div>
				</div>
			</div>

			<!-- Mouse -->
			<div>
				<h3 class="mb-2 font-medium text-muted-foreground">Mouse</h3>
				<div class="grid grid-cols-2 gap-1">
					<div>Click layer</div>
					<div>Select</div>
					<div>Drag layer</div>
					<div>Move</div>
					<div>Drag handles</div>
					<div>Resize</div>
				</div>
			</div>
		</div>

		<div class="mt-6 text-center text-sm text-muted-foreground">
			Press <kbd class="kbd">Escape</kbd> or click outside to close
		</div>
	</Dialog.Content>
</Dialog.Root>

<style>
	.kbd {
		display: inline-block;
		padding: 0.15rem 0.4rem;
		font-size: 0.75rem;
		font-family: ui-monospace, monospace;
		background: hsl(var(--muted));
		border: 1px solid hsl(var(--border));
		border-radius: 0.25rem;
	}
</style>
