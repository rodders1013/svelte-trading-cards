<script lang="ts">
	import { getAnimationOptions } from '$lib/styling/animations';
	import type {
		AnimationConfig,
		AnimationType,
		AnimationDirection,
		AnimationEasing,
		AnimationOrigin,
		PulsePattern,
		FloatStyle
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

	// Animations that use transform-origin (scale/rotate based)
	const transformAnimations: AnimationType[] = ['spin', 'pulse', 'bounce', 'ping'];

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
	const showOrigin = $derived(animation && transformAnimations.includes(animation.type));
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

			{#if animation.type === 'spin' || animation.type === 'trace'}
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

			{#if animation.type === 'pulse'}
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

			{#if animation.type === 'float'}
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
				{#if animation.floatStyle === 'gentle'}
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
