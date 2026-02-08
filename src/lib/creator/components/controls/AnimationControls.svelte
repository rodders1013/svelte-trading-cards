<script lang="ts">
	import { getAnimationOptions, getAnimationMeta } from '$lib/styling/animations';
	import type {
		AnimationConfig,
		AnimationType,
		AnimationDirection,
		AnimationEasing,
		AnimationOrigin,
		PulsePattern,
		FloatStyle,
		TraceMode
	} from '$lib/styling/animations';
	import * as Select from '$lib/creator/ui/select';
	import { Checkbox } from '$lib/creator/ui/checkbox';
	import { Label } from '$lib/creator/ui/label';
	import { Slider } from '$lib/creator/ui/slider';

	let {
		animation = $bindable<AnimationConfig | undefined>(undefined)
	}: {
		animation: AnimationConfig | undefined;
	} = $props();

	const animationOptions = getAnimationOptions();

	const directionOptions: { value: AnimationDirection; label: string }[] = [
		{ value: 'clockwise', label: 'Clockwise' },
		{ value: 'counterclockwise', label: 'Counter-clockwise' }
	];

	const originOptions: { value: AnimationOrigin; label: string }[] = [
		{ value: 'center', label: 'Center' },
		{ value: 'top-left', label: 'Top Left' },
		{ value: 'top', label: 'Top' },
		{ value: 'top-right', label: 'Top Right' },
		{ value: 'left', label: 'Left' },
		{ value: 'right', label: 'Right' },
		{ value: 'bottom-left', label: 'Bottom Left' },
		{ value: 'bottom', label: 'Bottom' },
		{ value: 'bottom-right', label: 'Bottom Right' }
	];

	const pulsePatternOptions: { value: PulsePattern; label: string }[] = [
		{ value: 'single', label: 'Single' },
		{ value: 'heartbeat', label: 'Heartbeat' },
		{ value: 'triple', label: 'Triple' }
	];

	const floatStyleOptions: { value: FloatStyle; label: string }[] = [
		{ value: 'gentle', label: 'Gentle' },
		{ value: 'bob', label: 'Bob' },
		{ value: 'sway', label: 'Sway' },
		{ value: 'orbit', label: 'Orbit' }
	];

	const easingOptions: { value: AnimationEasing; label: string }[] = [
		{ value: 'linear', label: 'Linear' },
		{ value: 'ease', label: 'Ease' },
		{ value: 'ease-in', label: 'Ease In' },
		{ value: 'ease-out', label: 'Ease Out' },
		{ value: 'ease-in-out', label: 'Ease In-Out' }
	];

	const traceModeOptions: { value: TraceMode; label: string }[] = [
		{ value: 'ball', label: 'Ball' },
		{ value: 'multi-ball', label: 'Multi-Ball' },
		{ value: 'line', label: 'Line' },
		{ value: 'reveal', label: 'Reveal' }
	];

	const currentMeta = $derived(getAnimationMeta(animation?.type ?? 'none'));

	function handleTypeChange(type: string | undefined) {
		if (!type || type === 'none') {
			animation = undefined;
		} else {
			animation = {
				type: type as AnimationType,
				duration: animation?.duration ?? 1.5,
				direction: animation?.direction ?? 'clockwise',
				origin: animation?.origin ?? 'center',
				scale: animation?.scale ?? 1.1,
				pulsePattern: animation?.pulsePattern ?? 'single',
				floatStyle: animation?.floatStyle ?? 'gentle',
				floatDistance: animation?.floatDistance ?? 3,
				floatRotation: animation?.floatRotation ?? 1,
				traceMode: animation?.traceMode ?? 'ball',
				traceSegmentPct: animation?.traceSegmentPct ?? 4,
				traceCount: animation?.traceCount ?? 1,
				traceSize: animation?.traceSize ?? undefined,
				traceOpacity: animation?.traceOpacity ?? 1,
				traceColor: animation?.traceColor ?? 'currentColor',
				traceGlow: animation?.traceGlow ?? 3,
				traceGlowColor: animation?.traceGlowColor ?? 'currentColor',
				easing: animation?.easing ?? 'ease-in-out',
				delay: animation?.delay ?? 0,
				iterationCount: animation?.iterationCount ?? 'infinite',
				paused: animation?.paused ?? false
			};
		}
	}

	function updateAnimation<K extends keyof AnimationConfig>(key: K, value: AnimationConfig[K]) {
		if (animation) {
			animation = { ...animation, [key]: value };
		}
	}

	// Get labels for current values
	const currentTypeLabel = $derived(
		animationOptions.find((opt) => opt.value === (animation?.type ?? 'none'))?.label ?? 'None'
	);

	const currentDirectionLabel = $derived.by(() => {
		const a = animation;
		if (!a) return '';
		return directionOptions.find((opt) => opt.value === a.direction)?.label ?? 'Clockwise';
	});

	const currentOriginLabel = $derived.by(() => {
		const a = animation;
		if (!a) return '';
		return originOptions.find((opt) => opt.value === a.origin)?.label ?? 'Center';
	});

	const currentPulsePatternLabel = $derived.by(() => {
		const a = animation;
		if (!a) return '';
		return pulsePatternOptions.find((opt) => opt.value === a.pulsePattern)?.label ?? 'Single';
	});

	const currentFloatStyleLabel = $derived.by(() => {
		const a = animation;
		if (!a) return '';
		return floatStyleOptions.find((opt) => opt.value === a.floatStyle)?.label ?? 'Gentle';
	});

	const currentEasingLabel = $derived.by(() => {
		const a = animation;
		if (!a) return '';
		return easingOptions.find((opt) => opt.value === a.easing)?.label ?? 'Ease In-Out';
	});

	// Check if current animation uses transform-origin
	const showOrigin = $derived(animation && currentMeta.supportsOrigin);
</script>

<div class="rounded border border-input p-2">
	<span class="text-sm font-medium">Animation</span>
	<div class="mt-2 space-y-2">
		<div>
			<span class="text-sm text-muted-foreground">Type</span>
			<Select.Root type="single" value={animation?.type ?? 'none'} onValueChange={handleTypeChange}>
				<Select.Trigger class="mt-1 w-full">
					{currentTypeLabel}
				</Select.Trigger>
				<Select.Content>
					{#each animationOptions as opt (opt.value)}
						<Select.Item value={opt.value} label={opt.label} />
					{/each}
				</Select.Content>
			</Select.Root>
		</div>

		{#if animation && animation.type !== 'none'}
			<div>
				<div class="flex items-center justify-between">
					<span class="text-sm text-muted-foreground">Duration</span>
					<span class="text-sm text-muted-foreground">{animation.duration.toFixed(1)}s</span>
				</div>
				<Slider
					type="single"
					class="mt-2"
					value={animation.duration}
					min={0.1}
					max={5}
					step={0.1}
					onValueChange={(v: number) => updateAnimation('duration', v)}
				/>
			</div>

			{#if currentMeta.supportsDirection}
				<div>
					<span class="text-sm text-muted-foreground">Direction</span>
					<Select.Root type="single" value={animation.direction} onValueChange={(v) => v && updateAnimation('direction', v as AnimationDirection)}>
						<Select.Trigger class="mt-1 w-full">
							{currentDirectionLabel}
						</Select.Trigger>
						<Select.Content>
							{#each directionOptions as opt (opt.value)}
								<Select.Item value={opt.value} label={opt.label} />
							{/each}
						</Select.Content>
					</Select.Root>
				</div>
			{/if}

			{#if showOrigin}
				<div>
					<span class="text-sm text-muted-foreground">Origin</span>
					<Select.Root type="single" value={animation.origin} onValueChange={(v) => v && updateAnimation('origin', v as AnimationOrigin)}>
						<Select.Trigger class="mt-1 w-full">
							{currentOriginLabel}
						</Select.Trigger>
						<Select.Content>
							{#each originOptions as opt (opt.value)}
								<Select.Item value={opt.value} label={opt.label} />
							{/each}
						</Select.Content>
					</Select.Root>
				</div>
			{/if}

			{#if currentMeta.supportsPulsePattern}
				<div>
					<span class="text-sm text-muted-foreground">Pattern</span>
					<Select.Root type="single" value={animation.pulsePattern} onValueChange={(v) => v && updateAnimation('pulsePattern', v as PulsePattern)}>
						<Select.Trigger class="mt-1 w-full">
							{currentPulsePatternLabel}
						</Select.Trigger>
						<Select.Content>
							{#each pulsePatternOptions as opt (opt.value)}
								<Select.Item value={opt.value} label={opt.label} />
							{/each}
						</Select.Content>
					</Select.Root>
				</div>
				{#if currentMeta.supportsScale}
					<div>
						<div class="flex items-center justify-between">
							<span class="text-sm text-muted-foreground">Scale</span>
							<span class="text-sm text-muted-foreground">{Math.round((animation.scale - 1) * 100)}%</span>
						</div>
						<Slider
							type="single"
							class="mt-2"
							value={animation.scale}
							min={1.05}
							max={2}
							step={0.05}
							onValueChange={(v: number) => updateAnimation('scale', v)}
						/>
					</div>
				{/if}
			{/if}

			{#if currentMeta.supportsFloatStyle}
				<div>
					<span class="text-sm text-muted-foreground">Style</span>
					<Select.Root type="single" value={animation.floatStyle} onValueChange={(v) => v && updateAnimation('floatStyle', v as FloatStyle)}>
						<Select.Trigger class="mt-1 w-full">
							{currentFloatStyleLabel}
						</Select.Trigger>
						<Select.Content>
							{#each floatStyleOptions as opt (opt.value)}
								<Select.Item value={opt.value} label={opt.label} />
							{/each}
						</Select.Content>
					</Select.Root>
				</div>
				{#if currentMeta.supportsFloatDistance}
					<div>
						<div class="flex items-center justify-between">
							<span class="text-sm text-muted-foreground">Distance</span>
							<span class="text-sm text-muted-foreground">{animation.floatDistance}%</span>
						</div>
						<Slider
							type="single"
							class="mt-2"
							value={animation.floatDistance}
							min={1}
							max={15}
							step={1}
							onValueChange={(v: number) => updateAnimation('floatDistance', v)}
						/>
					</div>
				{/if}
				{#if currentMeta.supportsFloatRotation && animation.floatStyle === 'gentle'}
					<div>
						<div class="flex items-center justify-between">
							<span class="text-sm text-muted-foreground">Rotation</span>
							<span class="text-sm text-muted-foreground">{animation.floatRotation}°</span>
						</div>
						<Slider
							type="single"
							class="mt-2"
							value={animation.floatRotation}
							min={0}
							max={10}
							step={0.5}
							onValueChange={(v: number) => updateAnimation('floatRotation', v)}
						/>
					</div>
				{/if}
			{/if}

			{#if animation.type === 'trace'}
				<div>
					<span class="text-sm text-muted-foreground">Mode</span>
					<Select.Root type="single" value={animation.traceMode} onValueChange={(v) => v && updateAnimation('traceMode', v as TraceMode)}>
						<Select.Trigger class="mt-1 w-full">
							{traceModeOptions.find((opt) => opt.value === animation.traceMode)?.label ?? 'Reveal'}
						</Select.Trigger>
						<Select.Content>
							{#each traceModeOptions as opt (opt.value)}
								<Select.Item value={opt.value} label={opt.label} />
							{/each}
						</Select.Content>
					</Select.Root>
				</div>
				<div>
					<div class="flex items-center justify-between">
						<span class="text-sm text-muted-foreground">Segment</span>
						<span class="text-sm text-muted-foreground">{animation.traceSegmentPct}%</span>
					</div>
					<Slider
						type="single"
						class="mt-2"
						value={animation.traceSegmentPct}
						min={1}
						max={30}
						step={1}
						onValueChange={(v: number) => updateAnimation('traceSegmentPct', v)}
					/>
				</div>
				{#if animation.traceMode === 'multi-ball'}
					<div>
						<div class="flex items-center justify-between">
							<span class="text-sm text-muted-foreground">Count</span>
							<span class="text-sm text-muted-foreground">{animation.traceCount}</span>
						</div>
						<Slider
							type="single"
							class="mt-2"
							value={animation.traceCount}
							min={2}
							max={8}
							step={1}
							onValueChange={(v: number) => updateAnimation('traceCount', v)}
						/>
					</div>
				{/if}
				<div>
					<div class="flex items-center justify-between">
						<span class="text-sm text-muted-foreground">Size</span>
						<span class="text-sm text-muted-foreground">
							{animation.traceSize === undefined ? 'Auto' : `${animation.traceSize}px`}
						</span>
					</div>
					<div class="mt-2 flex items-center gap-2">
						<Checkbox
							id="trace-size-auto"
							checked={animation.traceSize === undefined}
							onCheckedChange={(checked) => {
								if (checked === true) {
									updateAnimation('traceSize', undefined);
								} else {
									updateAnimation('traceSize', 2);
								}
							}}
						/>
						<Label for="trace-size-auto" class="text-xs text-muted-foreground">Match stroke</Label>
					</div>
					<Slider
						type="single"
						class="mt-2"
						value={animation.traceSize ?? 2}
						min={0.5}
						max={10}
						step={0.5}
						disabled={animation.traceSize === undefined}
						onValueChange={(v: number) => updateAnimation('traceSize', v)}
					/>
				</div>
				<div>
					<div class="flex items-center justify-between">
						<span class="text-sm text-muted-foreground">Opacity</span>
						<span class="text-sm text-muted-foreground">{Math.round(animation.traceOpacity * 100)}%</span>
					</div>
					<Slider
						type="single"
						class="mt-2"
						value={animation.traceOpacity}
						min={0}
						max={1}
						step={0.05}
						onValueChange={(v: number) => updateAnimation('traceOpacity', v)}
					/>
				</div>
				<div>
					<span class="text-sm text-muted-foreground">Color</span>
					<div class="mt-1 flex items-center gap-2">
						<input
							type="color"
							class="h-8 w-12 rounded border border-input bg-transparent"
							value={animation.traceColor}
							oninput={(e) => updateAnimation('traceColor', (e.currentTarget as HTMLInputElement).value)}
						/>
						<input
							type="text"
							class="flex-1 rounded border border-input bg-background px-2 py-1 text-xs"
							value={animation.traceColor}
							oninput={(e) => updateAnimation('traceColor', (e.currentTarget as HTMLInputElement).value)}
						/>
					</div>
				</div>
				<div>
					<span class="text-sm text-muted-foreground">Glow Color</span>
					<div class="mt-1 flex items-center gap-2">
						<input
							type="color"
							class="h-8 w-12 rounded border border-input bg-transparent"
							value={animation.traceGlowColor}
							oninput={(e) => updateAnimation('traceGlowColor', (e.currentTarget as HTMLInputElement).value)}
						/>
						<input
							type="text"
							class="flex-1 rounded border border-input bg-background px-2 py-1 text-xs"
							value={animation.traceGlowColor}
							oninput={(e) => updateAnimation('traceGlowColor', (e.currentTarget as HTMLInputElement).value)}
						/>
					</div>
				</div>
				<div>
					<div class="flex items-center justify-between">
						<span class="text-sm text-muted-foreground">Glow</span>
						<span class="text-sm text-muted-foreground">{animation.traceGlow.toFixed(1)}</span>
					</div>
					<Slider
						type="single"
						class="mt-2"
						value={animation.traceGlow}
						min={0}
						max={10}
						step={0.5}
						onValueChange={(v: number) => updateAnimation('traceGlow', v)}
					/>
				</div>
			{/if}

			<div>
				<span class="text-sm text-muted-foreground">Easing</span>
				<Select.Root type="single" value={animation.easing} onValueChange={(v) => v && updateAnimation('easing', v as AnimationEasing)}>
					<Select.Trigger class="mt-1 w-full">
						{currentEasingLabel}
					</Select.Trigger>
					<Select.Content>
						{#each easingOptions as opt (opt.value)}
							<Select.Item value={opt.value} label={opt.label} />
						{/each}
					</Select.Content>
				</Select.Root>
			</div>

			<div class="flex items-center gap-2">
				<Checkbox
					id="animation-paused"
					checked={animation.paused}
					onCheckedChange={(checked) => updateAnimation('paused', checked === true)}
				/>
				<Label for="animation-paused" class="text-sm">Paused</Label>
			</div>
		{/if}
	</div>
</div>
