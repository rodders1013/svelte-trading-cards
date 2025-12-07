<script lang="ts">
	import * as Dialog from '$lib/creator/ui/dialog';
	import * as Select from '$lib/creator/ui/select';
	import { Button } from '$lib/creator/ui/button';
	import { Label } from '$lib/creator/ui/label';
	import Download from '@lucide/svelte/icons/download';
	import FileImage from '@lucide/svelte/icons/file-image';
	import FileCode from '@lucide/svelte/icons/file-code';

	let {
		show = $bindable(false),
		onExport
	}: {
		show: boolean;
		onExport: (options: { format: 'svg' | 'png'; bleedMm: number; scale: number }) => void;
	} = $props();

	let format = $state<'svg' | 'png'>('png');
	let bleedMm = $state(0);
	let scale = $state(2);

	const bleedOptions = [
		{ value: '0', label: 'No bleed (digital only)' },
		{ value: '1', label: '1mm bleed' },
		{ value: '2', label: '2mm bleed' },
		{ value: '3', label: '3mm bleed (recommended for print)' }
	];

	const scaleOptions = [
		{ value: '1', label: '1x (750 x 1050)' },
		{ value: '2', label: '2x (1500 x 2100)' },
		{ value: '3', label: '3x (2250 x 3150)' }
	];

	function handleExport() {
		onExport({ format, bleedMm, scale });
		show = false;
	}

	const currentBleedLabel = $derived(bleedOptions.find(o => o.value === String(bleedMm))?.label ?? 'No bleed');
	const currentScaleLabel = $derived(scaleOptions.find(o => o.value === String(scale))?.label ?? '2x');
</script>

<Dialog.Root bind:open={show}>
	<Dialog.Content class="max-w-md">
		<Dialog.Header>
			<Dialog.Title>Export Card</Dialog.Title>
			<Dialog.Description>Choose format and bleed options for your card.</Dialog.Description>
		</Dialog.Header>

		<div class="space-y-4 py-4">
			<!-- Format Selection -->
			<div class="space-y-2">
				<Label>Format</Label>
				<div class="grid grid-cols-2 gap-2">
					<button
						class="flex items-center justify-center gap-2 rounded-lg border-2 px-4 py-3 text-sm font-medium transition-colors {format === 'png' ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:border-muted-foreground/50'}"
						onclick={() => format = 'png'}
					>
						<FileImage class="h-5 w-5" />
						PNG
					</button>
					<button
						class="flex items-center justify-center gap-2 rounded-lg border-2 px-4 py-3 text-sm font-medium transition-colors {format === 'svg' ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:border-muted-foreground/50'}"
						onclick={() => format = 'svg'}
					>
						<FileCode class="h-5 w-5" />
						SVG
					</button>
				</div>
			</div>

			<!-- Bleed Selection -->
			<div class="space-y-2">
				<Label>Bleed (for print)</Label>
				<Select.Root type="single" value={String(bleedMm)} onValueChange={(v) => v && (bleedMm = parseInt(v))}>
					<Select.Trigger class="w-full">
						{currentBleedLabel}
					</Select.Trigger>
					<Select.Content>
						{#each bleedOptions as option (option.value)}
							<Select.Item value={option.value} label={option.label} />
						{/each}
					</Select.Content>
				</Select.Root>
				<p class="text-xs text-muted-foreground">
					{#if bleedMm > 0}
						The Card Base layer will extend {bleedMm}mm beyond the card edge for safe cutting.
					{:else}
						No bleed - use for digital display only.
					{/if}
				</p>
			</div>

			<!-- Scale Selection (PNG only) -->
			{#if format === 'png'}
				<div class="space-y-2">
					<Label>Resolution</Label>
					<Select.Root type="single" value={String(scale)} onValueChange={(v) => v && (scale = parseInt(v))}>
						<Select.Trigger class="w-full">
							{currentScaleLabel}
						</Select.Trigger>
						<Select.Content>
							{#each scaleOptions as option (option.value)}
								<Select.Item value={option.value} label={option.label} />
							{/each}
						</Select.Content>
					</Select.Root>
				</div>
			{/if}
		</div>

		<Dialog.Footer>
			<Button variant="outline" onclick={() => show = false}>Cancel</Button>
			<Button onclick={handleExport} class="gap-2">
				<Download class="h-4 w-4" />
				Export {format.toUpperCase()}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
