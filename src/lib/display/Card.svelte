<script lang="ts" module>
	import type { CardTemplate, CardData } from '$lib/types';
	import type { Rarity, CardProps, FlippableCardProps } from './types.js';

	export interface Props extends CardProps, FlippableCardProps {
		/** Card template defining the visual layout */
		template: CardTemplate;
		/** Card data to populate the template */
		data?: CardData;
		/** Back template for flip support (optional) */
		backTemplate?: CardTemplate;
		/** Back data for flip support (optional, defaults to main data) */
		backData?: CardData;
	}
</script>

<script lang="ts">
	import HoverTilt from 'hover-tilt/HoverTilt.svelte';
	import { CARD_WIDTH, CARD_HEIGHT } from '$lib/types';
	import { CardCanvas } from '$lib/core';
	import { FIXED_TILT_SETTINGS, getRarityPreset, type GlareMaskName } from './presets.js';

	let {
		// Content
		template,
		data = {},
		backTemplate,
		backData,

		// Flip support
		flipped = $bindable(false),
		flipOnClick = false,
		flipOnHover = false,
		flipDuration = 600,

		// Rarity override
		rarity,

		// Disable all effects
		disabled = false,

		// Event handlers
		onclick,
		onkeydown,

		// Layout
		width = CARD_WIDTH,
		height = CARD_HEIGHT,
		class: className = ''
	}: Props = $props();

	// Track flip animation state to hide glare during transitions
	let isAnimating = $state(false);
	let animationTimeout: ReturnType<typeof setTimeout> | null = null;

	// Watch for flipped changes to trigger animation state
	$effect(() => {
		// Access flipped to track it
		const _ = flipped;

		// Only track animation if we have a back template
		if (backTemplate) {
			isAnimating = true;

			// Clear any existing timeout
			if (animationTimeout) clearTimeout(animationTimeout);

			// Set animating to false after flip duration completes
			animationTimeout = setTimeout(() => {
				isAnimating = false;
			}, flipDuration);
		}

		return () => {
			if (animationTimeout) clearTimeout(animationTimeout);
		};
	});

	// Determine effective rarity (prop > template > default)
	const effectiveRarity = $derived<Rarity>(rarity ?? template.display?.rarity ?? 'common');

	// Get preset for the effective rarity
	const preset = $derived(getRarityPreset(effectiveRarity));

	// Custom gradient from template (user-configurable in creator)
	const customGradient = $derived(template.display?.customGradient);

	// Map mask name to CSS gradient (no external images needed)
	function getMaskGradient(maskName: string | undefined): string | undefined {
		if (!maskName) return undefined;

		// CSS gradient-based masks for different effects
		const maskGradients: Record<GlareMaskName, string> = {
			// Foil: diagonal stripes
			foil: `repeating-linear-gradient(
				45deg,
				rgba(255,255,255,0.8) 0px,
				rgba(255,255,255,0.8) 2px,
				rgba(255,255,255,0.3) 2px,
				rgba(255,255,255,0.3) 8px
			)`,
			// Holo: horizontal rainbow bands
			holo: `repeating-linear-gradient(
				0deg,
				rgba(255,255,255,1) 0px,
				rgba(255,255,255,0.6) 4px,
				rgba(255,255,255,1) 8px
			)`,
			// Sparkle: radial dots pattern
			sparkle: `radial-gradient(circle at 20% 30%, white 1px, transparent 2px),
				radial-gradient(circle at 80% 20%, white 1px, transparent 2px),
				radial-gradient(circle at 40% 70%, white 1px, transparent 2px),
				radial-gradient(circle at 70% 60%, white 1px, transparent 2px),
				radial-gradient(circle at 10% 80%, white 1px, transparent 2px),
				radial-gradient(circle at 90% 90%, white 1px, transparent 2px)`,
			// Prism: angular gradient
			prism: `conic-gradient(
				from 0deg,
				rgba(255,255,255,0.9) 0deg,
				rgba(255,255,255,0.4) 60deg,
				rgba(255,255,255,0.9) 120deg,
				rgba(255,255,255,0.4) 180deg,
				rgba(255,255,255,0.9) 240deg,
				rgba(255,255,255,0.4) 300deg,
				rgba(255,255,255,0.9) 360deg
			)`,
			// Rainbow: no mask (full coverage)
			rainbow: 'none'
		};
		return maskGradients[maskName as GlareMaskName];
	}

	// Handle click for flip and custom onclick
	function handleClick(event: MouseEvent) {
		if (flipOnClick && (backTemplate || flipped)) {
			flipped = !flipped;
		}
		onclick?.(event);
	}

	// Handle keyboard for accessibility
	function handleKeydown(event: KeyboardEvent) {
		if ((event.key === 'Enter' || event.key === ' ') && flipOnClick) {
			event.preventDefault();
			flipped = !flipped;
		}
		onkeydown?.(event);
	}

	// Handle hover for flip
	function handleMouseEnter() {
		if (flipOnHover && backTemplate) {
			flipped = true;
		}
	}

	function handleMouseLeave() {
		if (flipOnHover && backTemplate) {
			flipped = false;
		}
	}

	// Aspect ratio for container
	const aspectRatio = $derived(`${width} / ${height}`);

	// Back data defaults to main data if not provided
	const effectiveBackData = $derived(backData ?? data);
</script>

<div
	class="tc-card {className}"
	class:disabled
	class:has-flip={!!backTemplate}
	class:is-flipped={flipped}
	class:is-animating={isAnimating}
	style:aspect-ratio={aspectRatio}
	style:--flip-duration="{flipDuration}ms"
	style:--hover-tilt-custom-gradient={customGradient}
	onclick={handleClick}
	onkeydown={handleKeydown}
	onmouseenter={handleMouseEnter}
	onmouseleave={handleMouseLeave}
	role={onclick || flipOnClick ? 'button' : undefined}
	tabindex={onclick || flipOnClick ? 0 : undefined}
>
	{#if disabled}
		<!-- Static card without effects -->
		<div class="tc-card-inner" class:flipped>
			<div class="tc-card-face tc-card-front">
				<CardCanvas {template} {data} {width} {height} />
			</div>
			{#if backTemplate}
				<div class="tc-card-face tc-card-back">
					<CardCanvas template={backTemplate} data={effectiveBackData} {width} {height} />
				</div>
			{/if}
		</div>
	{:else}
		<!-- Interactive card with hover-tilt -->
		<HoverTilt
			tiltFactor={FIXED_TILT_SETTINGS.tiltFactor}
			scaleFactor={FIXED_TILT_SETTINGS.scaleFactor}
			springOptions={FIXED_TILT_SETTINGS.springOptions}
			glareIntensity={preset.glareIntensity}
			glareMask={getMaskGradient(preset.glareMask)}
			blendMode={preset.blendMode}
			shadow={preset.shadow}
			shadowBlur={preset.shadowBlur}
		>
			<div class="tc-card-inner" class:flipped>
				<div class="tc-card-face tc-card-front">
					<CardCanvas {template} {data} {width} {height} />
				</div>
				{#if backTemplate}
					<div class="tc-card-face tc-card-back">
						<CardCanvas template={backTemplate} data={effectiveBackData} {width} {height} />
					</div>
				{/if}
			</div>
		</HoverTilt>
	{/if}
</div>

<style>
	.tc-card {
		position: relative;
		width: 100%;
		max-width: 100%;
	}

	.tc-card:focus-visible {
		outline: 2px solid var(--tc-focus-color, #3b82f6);
		outline-offset: 4px;
		border-radius: 8px;
	}

	.tc-card-inner {
		position: relative;
		width: 100%;
		height: 100%;
		transition: transform var(--flip-duration, 600ms) ease-in-out;
		transform-style: preserve-3d;
	}

	.tc-card-inner.flipped {
		transform: rotateY(180deg);
	}

	.tc-card-face {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		backface-visibility: hidden;
		-webkit-backface-visibility: hidden;
		/* Allow hover-tilt's glare to show on top */
		pointer-events: none;
	}

	.tc-card-face :global(svg) {
		width: 100%;
		height: 100%;
		display: block;
		pointer-events: none;
	}

	.tc-card-back {
		transform: rotateY(180deg);
	}

	/* When there's no back template, inner doesn't need 3D */
	.tc-card:not(.has-flip) .tc-card-inner {
		transform-style: flat;
	}

	.tc-card:not(.has-flip) .tc-card-face {
		position: relative;
		backface-visibility: visible;
	}

	/* Ensure hover-tilt container gets proper dimensions */
	.tc-card :global(.hover-tilt-container) {
		width: 100%;
		height: 100%;
	}

	.tc-card :global(.hover-tilt) {
		width: 100%;
		height: 100%;
		border-radius: 26px;
	}

	/* Hide hover-tilt glare only during flip animation */
	.tc-card.is-animating :global(.hover-tilt::before) {
		opacity: 0 !important;
	}

	/* Also hide the shadow glow during animation */
	.tc-card.is-animating :global(.hover-tilt-shadow) {
		box-shadow: none !important;
	}

</style>
