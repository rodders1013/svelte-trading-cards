<script lang="ts">
	import { getAnimationOptions } from '$lib/animations';
	import type {
		AnimationConfig,
		AnimationType,
		AnimationSpeed,
		AnimationDirection,
		AnimationEasing
	} from '$lib/animations';

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

	function handleTypeChange(e: Event) {
		const type = (e.target as HTMLSelectElement).value as AnimationType;
		if (type === 'none') {
			animation = undefined;
		} else {
			animation = {
				type,
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
</script>

<div class="rounded border border-input p-2">
	<span class="text-sm font-medium">Animation</span>
	<div class="mt-2 space-y-2">
		<div>
			<span class="text-sm text-muted-foreground">Type</span>
			<select
				class="mt-1 w-full rounded border border-input bg-background px-2 py-1 text-sm"
				value={animation?.type ?? 'none'}
				onchange={handleTypeChange}
			>
				{#each animationOptions as opt}
					<option value={opt.value}>{opt.label}</option>
				{/each}
			</select>
		</div>

		{#if animation && animation.type !== 'none'}
			<div class="grid grid-cols-2 gap-2">
				<div>
					<span class="text-sm text-muted-foreground">Speed</span>
					<select
						class="mt-1 w-full rounded border border-input bg-background px-2 py-1 text-sm"
						value={animation.speed}
						onchange={(e) => updateAnimation('speed', (e.target as HTMLSelectElement).value as AnimationSpeed)}
					>
						{#each speedOptions as opt}
							<option value={opt.value}>{opt.label}</option>
						{/each}
					</select>
				</div>

				{#if animation.type === 'spin'}
					<div>
						<span class="text-sm text-muted-foreground">Direction</span>
						<select
							class="mt-1 w-full rounded border border-input bg-background px-2 py-1 text-sm"
							value={animation.direction}
							onchange={(e) => updateAnimation('direction', (e.target as HTMLSelectElement).value as AnimationDirection)}
						>
							{#each directionOptions as opt}
								<option value={opt.value}>{opt.label}</option>
							{/each}
						</select>
					</div>
				{/if}
			</div>

			<div>
				<span class="text-sm text-muted-foreground">Easing</span>
				<select
					class="mt-1 w-full rounded border border-input bg-background px-2 py-1 text-sm"
					value={animation.easing}
					onchange={(e) => updateAnimation('easing', (e.target as HTMLSelectElement).value as AnimationEasing)}
				>
					{#each easingOptions as opt}
						<option value={opt.value}>{opt.label}</option>
					{/each}
				</select>
			</div>

			<label class="flex items-center gap-2 text-sm">
				<input
					type="checkbox"
					checked={animation.paused}
					onchange={(e) => updateAnimation('paused', (e.target as HTMLInputElement).checked)}
				/>
				Paused
			</label>
		{/if}
	</div>
</div>
