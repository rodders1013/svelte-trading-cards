export type { CardModalProps } from './types.js';
import type { Snippet } from 'svelte';
type $$ComponentProps = {
    open?: boolean;
    onClose?: () => void;
    closeOnBackdrop?: boolean;
    closeOnEscape?: boolean;
    'aria-label'?: string;
    class?: string;
    children: Snippet;
};
declare const CardModal: import("svelte").Component<$$ComponentProps, {}, "open">;
type CardModal = ReturnType<typeof CardModal>;
export default CardModal;
