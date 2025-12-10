<script lang="ts" module>
	export type { CardModalProps } from './types.js';
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { fade, scale } from 'svelte/transition';

	let {
		open = $bindable(false),
		onClose,
		closeOnBackdrop = true,
		closeOnEscape = true,
		'aria-label': ariaLabel = 'Card detail view',
		class: className = '',
		children
	}: {
		open?: boolean;
		onClose?: () => void;
		closeOnBackdrop?: boolean;
		closeOnEscape?: boolean;
		'aria-label'?: string;
		class?: string;
		children: Snippet;
	} = $props();

	function handleClose() {
		open = false;
		onClose?.();
	}

	function handleBackdropClick(event: MouseEvent) {
		if (closeOnBackdrop && event.target === event.currentTarget) {
			handleClose();
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (closeOnEscape && event.key === 'Escape') {
			handleClose();
		}
	}

	// Lock body scroll when modal is open
	$effect(() => {
		if (open) {
			const originalOverflow = document.body.style.overflow;
			document.body.style.overflow = 'hidden';
			return () => {
				document.body.style.overflow = originalOverflow;
			};
		}
	});
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="tc-modal-backdrop {className}"
		role="dialog"
		aria-modal="true"
		aria-label={ariaLabel}
		onclick={handleBackdropClick}
		transition:fade={{ duration: 200 }}
	>
		<div class="tc-modal-content" transition:scale={{ duration: 200, start: 0.95 }}>
			<button class="tc-modal-close" onclick={handleClose} aria-label="Close modal">
				<span aria-hidden="true">&times;</span>
			</button>
			{@render children()}
		</div>
	</div>
{/if}

<style>
	.tc-modal-backdrop {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.85);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 9999;
		padding: 24px;
	}

	.tc-modal-content {
		position: relative;
		max-width: 90vw;
		max-height: 90vh;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.tc-modal-close {
		position: absolute;
		top: -48px;
		right: 0;
		font-size: 32px;
		color: white;
		background: transparent;
		border: none;
		cursor: pointer;
		width: 40px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		transition: background 0.2s;
	}

	.tc-modal-close:hover {
		background: rgba(255, 255, 255, 0.1);
	}

	.tc-modal-close:focus-visible {
		outline: 2px solid white;
		outline-offset: 2px;
	}
</style>
