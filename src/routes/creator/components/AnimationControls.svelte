<script lang="ts">
	import { getAnimationOptions } from '$lib/animations';
	import type {
		AnimationConfig,
		AnimationType,
		AnimationSpeed,
		AnimationDirection,
		AnimationEasing
	} from '$lib/animations';
	import * as Select from '$lib/components/ui/select';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Label } from '$lib/components/ui/label';

	let {
		animation = $bindable<AnimationConfig | undefined>(undefined)
	}: {
		animation: AnimationConfig | undefined;
	} = $props();

	const animationOptions = getAnimationOptions();

	const speedOptions: { value: AnimationSpeed; label: string }[] = [
		{ value: 'slow', label: 'Slow' },
		{ value: 'normal', label: 'Normal' },
		{ value: 'fast', label: 'Fast' }
	];

	const directionOptions: { value: AnimationDirection; label: string }[] = [
		{ value: 'clockwise', label: 'Clockwise' },
		{ value: 'counterclockwise', label: 'Counter-clockwise' }
	];

	const easingOptions: { value: AnimationEasing; label: string }[] = [
		{ value: 'linear', label: 'Linear' },
		{ value: 'ease', label: 'Ease' },
		{ value: 'ease-in', label: 'Ease In' },
		{ value: 'ease-out', label: 'Ease Out' },
		{ value: 'ease-in-out', label: 'Ease In-Out' }
	];

	function handleTypeChange(type: string | undefined) {
		if (!type || type === 'none') {
			animation = undefined;
		} else {
			animation = {
				type: type as AnimationType,
				speed: animation?.speed ?? 'normal',
				direction: animation?.direction ?? 'clockwise',
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

	const currentSpeedLabel = $derived.by(() => {
		if (!animation) return '';
		return speedOptions.find((opt) => opt.value === animation.speed)?.label ?? 'Normal';
	});

	const currentDirectionLabel = $derived.by(() => {
		if (!animation) return '';
		return directionOptions.find((opt) => opt.value === animation.direction)?.label ?? 'Clockwise';
	});

	const currentEasingLabel = $derived.by(() => {
		if (!animation) return '';
		return easingOptions.find((opt) => opt.value === animation.easing)?.label ?? 'Ease In-Out';
	});
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
			<div class="grid grid-cols-2 gap-2">
				<div>
					<span class="text-sm text-muted-foreground">Speed</span>
					<Select.Root type="single" value={animation.speed} onValueChange={(v) => v && updateAnimation('speed', v as AnimationSpeed)}>
						<Select.Trigger class="mt-1 w-full">
							{currentSpeedLabel}
						</Select.Trigger>
						<Select.Content>
							{#each speedOptions as opt (opt.value)}
								<Select.Item value={opt.value} label={opt.label} />
							{/each}
						</Select.Content>
					</Select.Root>
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
			</div>

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
