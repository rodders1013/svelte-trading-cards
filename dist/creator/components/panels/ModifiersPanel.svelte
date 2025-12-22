<script lang="ts">
	/**
	 * ModifiersPanel - Unified panel for all component modifiers
	 *
	 * Combines all modifier controls into a single reusable panel:
	 * - Clip Shape (mask component to a shape)
	 * - Effect (glow, shadow, neon, etc.)
	 * - Animation (pulse, float, spin, etc.)
	 * - Border (follows clip shape)
	 * - Holographic (animated color-shift)
	 * - Blend Mode
	 *
	 * Toggle which sections to show using the show* props.
	 */
	import * as Collapsible from '../../ui/collapsible';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import X from '@lucide/svelte/icons/x';
	import Sparkles from '@lucide/svelte/icons/sparkles';
	import EffectsControls from '../controls/EffectsControls.svelte';
	import AnimationControls from '../controls/AnimationControls.svelte';
	import BlendControls from '../controls/BlendControls.svelte';
	import BorderModifierControls from '../controls/BorderModifierControls.svelte';
	import HolographicControls from '../controls/HolographicControls.svelte';
	import HelpTooltip from '../HelpTooltip.svelte';
	import ShapePicker from '../../../styling/shapes/ShapePicker.svelte';
	import type { ShapeSource } from '../../../styling/shapes';
	import type { EffectConfig } from '../../../styling/effects';
	import type { AnimationConfig } from '../../../styling/animations';
	import type { BlendMode } from '../../../styling/blend';
	import type { BorderModifier, HolographicConfig } from '../../../types/modifiers';

	let {
		// Modifier values
		shapeSource = $bindable<ShapeSource | undefined>(undefined),
		effect = $bindable<EffectConfig | undefined>(undefined),
		animation = $bindable<AnimationConfig | undefined>(undefined),
		blendMode = $bindable<BlendMode | undefined>(undefined),
		border = $bindable<BorderModifier | undefined>(undefined),
		holographic = $bindable<HolographicConfig | undefined>(undefined),
		// Which sections to show (all default to true)
		showClipShape = true,
		showEffect = true,
		showAnimation = true,
		showBlend = true,
		showBorder = true,
		showHolographic = true
	}: {
		shapeSource?: ShapeSource | undefined;
		effect?: EffectConfig | undefined;
		animation?: AnimationConfig | undefined;
		blendMode?: BlendMode | undefined;
		border?: BorderModifier | undefined;
		holographic?: HolographicConfig | undefined;
		showClipShape?: boolean;
		showEffect?: boolean;
		showAnimation?: boolean;
		showBlend?: boolean;
		showBorder?: boolean;
		showHolographic?: boolean;
	} = $props();

	let clipShapeOpen = $state(false);
	let effectOpen = $state(false);
	let animationOpen = $state(false);
	let blendOpen = $state(false);
	let borderOpen = $state(false);
	let holographicOpen = $state(false);

	const hasClipShape = $derived(shapeSource !== undefined);
	const hasEffect = $derived(effect !== undefined);
	const hasAnimation = $derived(animation && animation.type !== 'none');
	const hasBlend = $derived(blendMode !== undefined && blendMode !== 'normal');
	const hasBorder = $derived(border !== undefined);
	const hasHolographic = $derived(holographic !== undefined);

	// Build active modifiers list for display
	const activeModifiers = $derived(
		[
			hasClipShape && 'Shape',
			hasEffect && 'Effect',
			hasAnimation && 'Animation',
			hasBorder && 'Border',
			hasHolographic && 'Holo',
			hasBlend && 'Blend'
		].filter(Boolean)
	);
	const hasAnyModifier = $derived(activeModifiers.length > 0);

	function handleBlendUpdate(mode: BlendMode | undefined) {
		blendMode = mode;
	}

	function handleShapeChange(source: ShapeSource) {
		// If selecting rectangle, clear shapeSource (default)
		if (source.type === 'builtin' && source.shape === 'rectangle') {
			shapeSource = undefined;
		} else {
			shapeSource = source;
		}
	}

	// Get current shape for ShapePicker (default to rectangle)
	const currentShapeValue = $derived<ShapeSource>(
		shapeSource ?? { type: 'builtin', shape: 'rectangle' }
	);
</script>

<div class="space-y-2">
	<!-- Header showing active modifiers -->
	{#if hasAnyModifier}
		<div class="flex items-center gap-1.5 text-xs text-muted-foreground">
			<Sparkles class="h-3 w-3" />
			<span>{activeModifiers.join(', ')} active</span>
		</div>
	{/if}

	<!-- Clip Shape Panel -->
	{#if showClipShape}
		<Collapsible.Root bind:open={clipShapeOpen}>
			<div class="flex items-center gap-2 rounded border border-violet-500/30 bg-violet-500/5 px-2 py-1.5 text-sm hover:bg-violet-500/10">
				<Collapsible.Trigger class="flex flex-1 items-center gap-2">
					<ChevronDown class="h-3 w-3 transition-transform {clipShapeOpen ? '' : '-rotate-90'}" />
					<span class="font-medium text-violet-400">Clip Shape</span>
					{#if hasClipShape && shapeSource}
						<span class="ml-auto rounded bg-violet-500/20 px-1.5 py-0.5 text-xs text-violet-400 capitalize">
							{shapeSource.type === 'builtin' ? shapeSource.shape : 'custom'}
						</span>
					{/if}
				</Collapsible.Trigger>
				{#if hasClipShape}
					<button
						class="rounded p-0.5 text-violet-400 hover:bg-violet-500/20"
						onclick={() => { shapeSource = undefined; }}
						title="Remove clip shape"
					>
						<X class="h-3 w-3" />
					</button>
				{/if}
				<HelpTooltip text="Mask this component with a shape. Content will be clipped to the shape boundary." />
			</div>
			<Collapsible.Content>
				<div class="mt-2 rounded border border-violet-500/20 bg-violet-500/5 p-2">
					<ShapePicker
						value={currentShapeValue}
						onchange={handleShapeChange}
					/>
				</div>
			</Collapsible.Content>
		</Collapsible.Root>
	{/if}

	<!-- Effect Panel -->
	{#if showEffect}
		<Collapsible.Root bind:open={effectOpen}>
			<div class="flex items-center gap-2 rounded border border-purple-500/30 bg-purple-500/5 px-2 py-1.5 text-sm hover:bg-purple-500/10">
				<Collapsible.Trigger class="flex flex-1 items-center gap-2">
					<ChevronDown class="h-3 w-3 transition-transform {effectOpen ? '' : '-rotate-90'}" />
					<span class="font-medium text-purple-400">Effect</span>
					{#if hasEffect && effect}
						<span class="ml-auto rounded bg-purple-500/20 px-1.5 py-0.5 text-xs text-purple-400 capitalize">
							{effect.type}
						</span>
					{/if}
				</Collapsible.Trigger>
				{#if hasEffect}
					<button
						class="rounded p-0.5 text-purple-400 hover:bg-purple-500/20"
						onclick={() => { effect = undefined; }}
						title="Remove effect"
					>
						<X class="h-3 w-3" />
					</button>
				{/if}
				<HelpTooltip text="Add visual effects like glow, shadow, or neon to this component." />
			</div>
			<Collapsible.Content>
				<div class="mt-2 rounded border border-purple-500/20 bg-purple-500/5 p-2">
					<EffectsControls bind:effect />
				</div>
			</Collapsible.Content>
		</Collapsible.Root>
	{/if}

	<!-- Animation Panel -->
	{#if showAnimation}
		<Collapsible.Root bind:open={animationOpen}>
			<div class="flex items-center gap-2 rounded border border-cyan-500/30 bg-cyan-500/5 px-2 py-1.5 text-sm hover:bg-cyan-500/10">
				<Collapsible.Trigger class="flex flex-1 items-center gap-2">
					<ChevronDown class="h-3 w-3 transition-transform {animationOpen ? '' : '-rotate-90'}" />
					<span class="font-medium text-cyan-400">Animation</span>
					{#if hasAnimation && animation}
						<span class="ml-auto rounded bg-cyan-500/20 px-1.5 py-0.5 text-xs text-cyan-400 capitalize">
							{animation.type}
						</span>
					{/if}
				</Collapsible.Trigger>
				{#if hasAnimation}
					<button
						class="rounded p-0.5 text-cyan-400 hover:bg-cyan-500/20"
						onclick={() => { animation = undefined; }}
						title="Remove animation"
					>
						<X class="h-3 w-3" />
					</button>
				{/if}
				<HelpTooltip text="Add motion animations like pulse, float, or spin to this component." />
			</div>
			<Collapsible.Content>
				<div class="mt-2 rounded border border-cyan-500/20 bg-cyan-500/5 p-2">
					<AnimationControls bind:animation />
				</div>
			</Collapsible.Content>
		</Collapsible.Root>
	{/if}

	<!-- Border Panel -->
	{#if showBorder}
		<Collapsible.Root bind:open={borderOpen}>
			<div class="flex items-center gap-2 rounded border border-blue-500/30 bg-blue-500/5 px-2 py-1.5 text-sm hover:bg-blue-500/10">
				<Collapsible.Trigger class="flex flex-1 items-center gap-2">
					<ChevronDown class="h-3 w-3 transition-transform {borderOpen ? '' : '-rotate-90'}" />
					<span class="font-medium text-blue-400">Border</span>
					{#if hasBorder && border}
						<span class="ml-auto rounded bg-blue-500/20 px-1.5 py-0.5 text-xs text-blue-400">
							{border.width}px
						</span>
					{/if}
				</Collapsible.Trigger>
				{#if hasBorder}
					<button
						class="rounded p-0.5 text-blue-400 hover:bg-blue-500/20"
						onclick={() => { border = undefined; }}
						title="Remove border"
					>
						<X class="h-3 w-3" />
					</button>
				{/if}
				<HelpTooltip text="Add a border that follows the component's clip shape." />
			</div>
			<Collapsible.Content>
				<div class="mt-2 rounded border border-blue-500/20 bg-blue-500/5 p-2">
					<BorderModifierControls bind:border />
				</div>
			</Collapsible.Content>
		</Collapsible.Root>
	{/if}

	<!-- Holographic Panel -->
	{#if showHolographic}
		<Collapsible.Root bind:open={holographicOpen}>
			<div class="flex items-center gap-2 rounded border border-pink-500/30 bg-pink-500/5 px-2 py-1.5 text-sm hover:bg-pink-500/10">
				<Collapsible.Trigger class="flex flex-1 items-center gap-2">
					<ChevronDown class="h-3 w-3 transition-transform {holographicOpen ? '' : '-rotate-90'}" />
					<span class="font-medium text-pink-400">Holographic</span>
					{#if hasHolographic}
						<span class="ml-auto rounded bg-pink-500/20 px-1.5 py-0.5 text-xs text-pink-400">
							active
						</span>
					{/if}
				</Collapsible.Trigger>
				{#if hasHolographic}
					<button
						class="rounded p-0.5 text-pink-400 hover:bg-pink-500/20"
						onclick={() => { holographic = undefined; }}
						title="Remove holographic"
					>
						<X class="h-3 w-3" />
					</button>
				{/if}
				<HelpTooltip text="Add an animated holographic color-shift effect." />
			</div>
			<Collapsible.Content>
				<div class="mt-2 rounded border border-pink-500/20 bg-pink-500/5 p-2">
					<HolographicControls bind:holographic />
				</div>
			</Collapsible.Content>
		</Collapsible.Root>
	{/if}

	<!-- Blend Mode Panel -->
	{#if showBlend}
		<Collapsible.Root bind:open={blendOpen}>
			<div class="flex items-center gap-2 rounded border border-amber-500/30 bg-amber-500/5 px-2 py-1.5 text-sm hover:bg-amber-500/10">
				<Collapsible.Trigger class="flex flex-1 items-center gap-2">
					<ChevronDown class="h-3 w-3 transition-transform {blendOpen ? '' : '-rotate-90'}" />
					<span class="font-medium text-amber-400">Blend Mode</span>
					{#if hasBlend}
						<span class="ml-auto rounded bg-amber-500/20 px-1.5 py-0.5 text-xs text-amber-400 capitalize">
							{blendMode}
						</span>
					{/if}
				</Collapsible.Trigger>
				{#if hasBlend}
					<button
						class="rounded p-0.5 text-amber-400 hover:bg-amber-500/20"
						onclick={() => { blendMode = undefined; }}
						title="Remove blend mode"
					>
						<X class="h-3 w-3" />
					</button>
				{/if}
				<HelpTooltip text="Control how this component blends with layers below it." />
			</div>
			<Collapsible.Content>
				<div class="mt-2 rounded border border-amber-500/20 bg-amber-500/5 p-2">
					<BlendControls blendMode={blendMode} onUpdate={handleBlendUpdate} />
				</div>
			</Collapsible.Content>
		</Collapsible.Root>
	{/if}
</div>
