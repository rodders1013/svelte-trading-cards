<script lang="ts">
	import { Accordion as AccordionPrimitive } from "bits-ui";
	import ChevronDownIcon from "@lucide/svelte/icons/chevron-down";
	import { cn, type WithoutChild } from "../utils.js";

	let {
		ref = $bindable(null),
		class: className,
		level = 3,
		children,
		...restProps
	}: WithoutChild<AccordionPrimitive.TriggerProps> & {
		level?: AccordionPrimitive.HeaderProps["level"];
	} = $props();
</script>

<AccordionPrimitive.Header {level} class="flex">
	<AccordionPrimitive.Trigger
		data-slot="accordion-trigger"
		bind:ref
		class={cn(
			"focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-center gap-2 rounded-md py-4 text-start text-sm font-medium outline-none transition-all hover:underline focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&[data-state=closed]>svg]:-rotate-90",
			className
		)}
		{...restProps}
	>
		<ChevronDownIcon
			class="text-muted-foreground pointer-events-none size-4 shrink-0 transition-transform duration-200"
		/>
		{@render children?.()}
	</AccordionPrimitive.Trigger>
</AccordionPrimitive.Header>
