<script lang="ts">
	let {
		show = $bindable(false)
	}: {
		show: boolean;
	} = $props();
</script>

{#if show}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
		onclick={() => (show = false)}
		onkeydown={(e) => e.key === 'Escape' && (show = false)}
		role="dialog"
		aria-modal="true"
		aria-labelledby="help-title"
		tabindex="-1"
	>
		<div
			class="max-h-[80vh] w-full max-w-lg overflow-auto rounded-xl bg-background p-6 shadow-xl"
			onclick={(e) => e.stopPropagation()}
			onkeydown={(e) => e.stopPropagation()}
			role="document"
		>
			<div class="mb-4 flex items-center justify-between">
				<h2 id="help-title" class="text-lg font-semibold">Keyboard Shortcuts</h2>
				<button onclick={() => (show = false)} class="rounded p-1 hover:bg-muted" aria-label="Close help">
					<span class="text-xl leading-none">&times;</span>
				</button>
			</div>

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

				<!-- Zone Operations -->
				<div>
					<h3 class="mb-2 font-medium text-muted-foreground">Zone Operations</h3>
					<div class="grid grid-cols-2 gap-1">
						<div><kbd class="kbd">Cmd C</kbd></div>
						<div>Copy zone</div>
						<div><kbd class="kbd">Cmd V</kbd></div>
						<div>Paste zone</div>
						<div><kbd class="kbd">Delete</kbd> / <kbd class="kbd">Backspace</kbd></div>
						<div>Delete zone</div>
						<div><kbd class="kbd">Escape</kbd></div>
						<div>Deselect zone</div>
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
						<div>Click zone</div>
						<div>Select</div>
						<div>Drag zone</div>
						<div>Move</div>
						<div>Drag handles</div>
						<div>Resize</div>
					</div>
				</div>
			</div>

			<div class="mt-6 text-center text-sm text-muted-foreground">
				Press <kbd class="kbd">Escape</kbd> or click outside to close
			</div>
		</div>
	</div>
{/if}

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
