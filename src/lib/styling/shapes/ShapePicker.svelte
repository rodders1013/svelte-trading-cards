<script lang="ts">
	import { BUNDLED_SHAPES } from './bundledShapes';
	import { SHAPE_CATEGORIES, BUILT_IN_SHAPES, type BuiltInShape, type ShapeSource } from './types';
	import { stripFillAttributes, getShapeTransform } from './shapeUtils';
	import IconPicker from '$lib/card/icons/IconPicker.svelte';
	import type { IconData } from '$lib/card/icons/Icon.svelte';
	import { Button } from '$lib/creator/ui/button';

	interface Props {
		value: ShapeSource;
		onchange: (source: ShapeSource) => void;
		showCustomOption?: boolean;
	}

	let { value, onchange, showCustomOption = true }: Props = $props();

	// UI state
	let showCustomPicker = $state(false);

	// Check if current value is a built-in shape
	const currentShape = $derived(value.type === 'builtin' ? value.shape : null);

	// Handle built-in shape selection
	function selectBuiltIn(shape: BuiltInShape) {
		onchange({ type: 'builtin', shape });
		showCustomPicker = false;
	}

	// Handle custom icon selection
	function selectCustomIcon(icon: { iconData: IconData; iconName: string }) {
		if (icon.iconData.body) {
			onchange({
				type: 'custom',
				iconData: icon.iconData,
				iconName: icon.iconName
			});
		}
		showCustomPicker = false;
	}

	// Render a shape preview
	function getShapePreview(shape: BuiltInShape, size: number = 32): { body: string; transform: string } {
		const shapeData = BUNDLED_SHAPES[shape];
		const strippedBody = stripFillAttributes(shapeData.body);
		const transform = getShapeTransform(shapeData, { width: size, height: size, scaleMode: 'contain' });
		return { body: strippedBody, transform };
	}

	// Custom icon preview data
	const customIconPreview = $derived.by(() => {
		if (value.type === 'custom' && value.iconData?.body) {
			return {
				strippedBody: stripFillAttributes(value.iconData.body),
				transform: getShapeTransform(
					{ body: value.iconData.body, width: value.iconData.width ?? 24, height: value.iconData.height ?? 24 },
					{ width: 32, height: 32, scaleMode: 'contain' }
				)
			};
		}
		return null;
	});
</script>

<div class="space-y-3">
	<!-- Current custom selection display -->
	{#if value.type === 'custom' && value.iconData?.body && customIconPreview}
		<div class="flex items-center gap-2 rounded border border-input bg-muted/30 p-2">
			<svg width="32" height="32" class="text-foreground">
				<g transform={customIconPreview.transform} fill="currentColor">
					{@html customIconPreview.strippedBody}
				</g>
			</svg>
			<span class="flex-1 truncate text-sm">{value.iconName ?? 'Custom Icon'}</span>
			<Button
				variant="outline"
				size="sm"
				class="h-6 px-2 text-xs"
				onclick={() => selectBuiltIn('circle')}
			>
				Change
			</Button>
		</div>
	{:else}
		<!-- Built-in shapes in scrollable grid (same style as IconPicker) -->
		<div class="max-h-[140px] overflow-y-auto rounded border border-input">
			<div class="flex flex-wrap gap-1 p-1.5">
				{#each BUILT_IN_SHAPES as shape}
					{@const preview = getShapePreview(shape, 32)}
					<button
						type="button"
						class="flex h-11 w-11 items-center justify-center rounded transition-colors
							{currentShape === shape
								? 'bg-primary/20 ring-2 ring-primary'
								: 'hover:bg-muted'}"
						onclick={() => selectBuiltIn(shape)}
						title={shape}
					>
						<svg width="32" height="32" class="text-foreground">
							<g transform={preview.transform} fill="currentColor">
								{@html preview.body}
							</g>
						</svg>
					</button>
				{/each}
			</div>
		</div>
		<p class="text-xs text-muted-foreground">
			{BUILT_IN_SHAPES.length} shapes. Click to select.
		</p>

		<!-- Custom icon option -->
		{#if showCustomOption}
			{#if showCustomPicker}
				<div class="space-y-2 border-t border-border pt-2">
					<div class="flex items-center justify-between">
						<span class="text-xs text-muted-foreground">Search custom icon</span>
						<Button
							variant="ghost"
							size="sm"
							class="h-6 px-2 text-xs"
							onclick={() => (showCustomPicker = false)}
						>
							Cancel
						</Button>
					</div>
					<IconPicker
						value={value.type === 'custom' ? { iconData: value.iconData, iconName: value.iconName } : undefined}
						onSelect={selectCustomIcon}
					/>
				</div>
			{:else}
				<Button
					variant="outline"
					size="sm"
					class="w-full text-xs"
					onclick={() => (showCustomPicker = true)}
				>
					Use Custom Icon...
				</Button>
			{/if}
		{/if}
	{/if}
</div>
