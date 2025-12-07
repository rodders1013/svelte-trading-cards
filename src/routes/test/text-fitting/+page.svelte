<script lang="ts">
	import FitText from '$lib/utils/FitText.svelte';
	import StatPanel from '$lib/components/fields/StatPanel.svelte';
	import List from '$lib/components/fields/List.svelte';
	import Badge from '$lib/components/decorations/Badge.svelte';
	import Ribbon from '$lib/components/decorations/Ribbon.svelte';
	import TextField from '$lib/components/fields/TextField.svelte';
	import type { ContainerContext } from '$lib/types';

	// Test data with various text lengths
	let shortText = $state('Hi');
	let mediumText = $state('Hello World');
	let longText = $state('The Quick Brown Fox Jumps Over The Lazy Dog');
	let veryLongText = $state('This is a very long piece of text that should definitely need to wrap across multiple lines or shrink significantly to fit in the available space');
	let customText = $state('Custom Text');

	// Test container sizes
	let containerWidth = $state(200);
	let containerHeight = $state(60);

	// Font size options
	let minFontSize = $state(8);
	let maxFontSize = $state(48);

	// Border options
	let borderWidth = $state(0);

	// Test options
	let singleLine = $state(false);
	let inset = $state(0);
	let showDebug = $state(true);

	// Effective inset (inset + border)
	const effectiveInset = $derived(inset + borderWidth);

	// Component test container
	const smallContainer: ContainerContext = { width: 150, height: 100, radius: 8 };
	const mediumContainer: ContainerContext = { width: 200, height: 120, radius: 8 };
	const largeContainer: ContainerContext = { width: 300, height: 150, radius: 8 };

	// Test data for components
	const testData = {
		title: 'God of War Ragnarok',
		shortTitle: 'GOW',
		longTitle: 'The Legend of Zelda: Tears of the Kingdom - Deluxe Edition',
		value: 95,
		longValue: 'Platinum Trophy Unlocked!',
		items: ['Item 1', 'A very long item name that should truncate', 'Short', 'Another long item name here'],
		category: 'Action RPG Adventure Game'
	};
</script>

<div class="min-h-screen bg-slate-900 p-8 text-white">
	<h1 class="mb-8 text-3xl font-bold">Text Fitting Test Page</h1>

	<!-- Controls Section -->
	<div class="mb-8 rounded-lg border border-slate-700 bg-slate-800 p-6">
		<h2 class="mb-4 text-xl font-semibold">Controls</h2>

		<!-- Container Size Controls -->
		<div class="mb-4">
			<h3 class="mb-2 text-sm font-medium text-slate-400">Container Size</h3>
			<div class="grid grid-cols-2 gap-4 md:grid-cols-4">
				<div>
					<label class="mb-1 block text-xs text-slate-500">Width</label>
					<input
						type="range"
						bind:value={containerWidth}
						min="50"
						max="400"
						class="w-full"
					/>
					<span class="text-sm text-slate-400">{containerWidth}px</span>
				</div>
				<div>
					<label class="mb-1 block text-xs text-slate-500">Height</label>
					<input
						type="range"
						bind:value={containerHeight}
						min="20"
						max="200"
						class="w-full"
					/>
					<span class="text-sm text-slate-400">{containerHeight}px</span>
				</div>
				<div>
					<label class="mb-1 block text-xs text-slate-500">Padding/Inset</label>
					<input
						type="range"
						bind:value={inset}
						min="0"
						max="30"
						class="w-full"
					/>
					<span class="text-sm text-slate-400">{inset}px</span>
				</div>
				<div>
					<label class="mb-1 block text-xs text-slate-500">Border Width</label>
					<input
						type="range"
						bind:value={borderWidth}
						min="0"
						max="20"
						class="w-full"
					/>
					<span class="text-sm text-slate-400">{borderWidth}px</span>
				</div>
			</div>
		</div>

		<!-- Font Size Controls -->
		<div class="mb-4">
			<h3 class="mb-2 text-sm font-medium text-slate-400">Font Size Range</h3>
			<div class="grid grid-cols-2 gap-4 md:grid-cols-4">
				<div>
					<label class="mb-1 block text-xs text-slate-500">Min Size</label>
					<input
						type="range"
						bind:value={minFontSize}
						min="4"
						max={maxFontSize - 1}
						class="w-full"
					/>
					<span class="text-sm text-slate-400">{minFontSize}px</span>
				</div>
				<div>
					<label class="mb-1 block text-xs text-slate-500">Max Size</label>
					<input
						type="range"
						bind:value={maxFontSize}
						min={minFontSize + 1}
						max="120"
						class="w-full"
					/>
					<span class="text-sm text-slate-400">{maxFontSize}px</span>
				</div>
				<div class="flex flex-col gap-2">
					<label class="flex items-center gap-2">
						<input type="checkbox" bind:checked={singleLine} />
						<span class="text-sm">Single Line Only</span>
					</label>
					<label class="flex items-center gap-2">
						<input type="checkbox" bind:checked={showDebug} />
						<span class="text-sm">Show Debug Boxes</span>
					</label>
				</div>
				<div>
					<div class="rounded bg-slate-900 p-2 text-xs">
						<div class="text-slate-500">Effective inset:</div>
						<div class="text-slate-300">{effectiveInset}px (inset + border)</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Custom Text -->
		<div>
			<label class="mb-1 block text-xs text-slate-500">Custom Text</label>
			<input
				type="text"
				bind:value={customText}
				class="w-full rounded bg-slate-700 px-3 py-2"
				placeholder="Enter custom text..."
			/>
		</div>
	</div>

	<!-- FitText Direct Tests -->
	<section class="mb-12">
		<h2 class="mb-4 text-2xl font-semibold">FitText Component Tests</h2>
		<p class="mb-4 text-slate-400">Direct FitText component with various text lengths. Border is shown in green.</p>

		<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#each [
				{ label: 'Short Text', text: shortText },
				{ label: 'Medium Text', text: mediumText },
				{ label: 'Long Text', text: longText },
				{ label: 'Very Long Text', text: veryLongText },
				{ label: 'Custom Text', text: customText }
			] as test}
				<div class="rounded-lg border border-slate-700 bg-slate-800 p-4">
					<h3 class="mb-2 text-sm font-medium text-slate-400">{test.label}</h3>
					<div class="flex items-center justify-center rounded border border-slate-600 bg-slate-900 p-2">
						<svg
							width={containerWidth}
							height={containerHeight}
							viewBox="0 0 {containerWidth} {containerHeight}"
						>
							<!-- Container background -->
							<rect
								x="0"
								y="0"
								width={containerWidth}
								height={containerHeight}
								fill="#1e293b"
							/>
							<!-- Border visualization -->
							{#if borderWidth > 0}
								<rect
									x={borderWidth / 2}
									y={borderWidth / 2}
									width={containerWidth - borderWidth}
									height={containerHeight - borderWidth}
									fill="none"
									stroke="#22c55e"
									stroke-width={borderWidth}
								/>
							{/if}
							<FitText
								text={test.text}
								x={0}
								y={0}
								width={containerWidth}
								height={containerHeight}
								minSize={minFontSize}
								maxSize={maxFontSize}
								inset={effectiveInset}
								{singleLine}
								horizontalAlign="center"
								verticalAlign="center"
								fill="#ffffff"
								debug={showDebug}
							/>
						</svg>
					</div>
				</div>
			{/each}
		</div>
	</section>

	<!-- TextField Tests -->
	<section class="mb-12">
		<h2 class="mb-4 text-2xl font-semibold">TextField Component Tests</h2>
		<p class="mb-4 text-slate-400">TextField with data binding</p>

		<div class="grid grid-cols-1 gap-6 md:grid-cols-3">
			{#each [
				{ label: 'Small Container', container: smallContainer, field: 'shortTitle' },
				{ label: 'Medium Container', container: mediumContainer, field: 'title' },
				{ label: 'Large Container - Long Title', container: largeContainer, field: 'longTitle' }
			] as test}
				<div class="rounded-lg border border-slate-700 bg-slate-800 p-4">
					<h3 class="mb-2 text-sm font-medium text-slate-400">{test.label}</h3>
					<p class="mb-2 text-xs text-slate-500">{test.container.width}x{test.container.height}</p>
					<div class="flex items-center justify-center rounded border border-slate-600 bg-slate-900 p-2">
						<svg
							width={test.container.width}
							height={test.container.height}
							viewBox="0 0 {test.container.width} {test.container.height}"
						>
							<rect
								x="0"
								y="0"
								width={test.container.width}
								height={test.container.height}
								fill="#1e293b"
							/>
							<TextField
								dataField={test.field}
								maxFontSize={32}
								minFontSize={10}
								fontFamily="Arial, sans-serif"
								fontWeight="normal"
								color="#ffffff"
								alignment="center"
								verticalAlign="center"
								container={test.container}
								data={testData}
							/>
						</svg>
					</div>
				</div>
			{/each}
		</div>
	</section>

	<!-- StatPanel Tests -->
	<section class="mb-12">
		<h2 class="mb-4 text-2xl font-semibold">StatPanel Component Tests</h2>
		<p class="mb-4 text-slate-400">StatPanel with auto-fitting labels and values</p>

		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
			{#each [
				{ label: 'Narrow Container', width: 150 },
				{ label: 'Wide Container', width: 300 }
			] as test}
				<div class="rounded-lg border border-slate-700 bg-slate-800 p-4">
					<h3 class="mb-2 text-sm font-medium text-slate-400">{test.label}</h3>
					<div class="flex items-center justify-center rounded border border-slate-600 bg-slate-900 p-2">
						<svg
							width={test.width}
							height={120}
							viewBox="0 0 {test.width} 120"
						>
							<rect x="0" y="0" width={test.width} height={120} fill="#1e293b" />
							<StatPanel
								rows={[
									{ labelPreset: 'SCORE', dataField: 'value', showBar: true, barColor: '#3b82f6', barMax: 100 },
									{ labelPreset: 'TYPE', dataField: 'category', showBar: false, barColor: '#22c55e', barMax: 100 },
									{ labelPreset: 'STATUS', dataField: 'longValue', showBar: false, barColor: '#f59e0b', barMax: 100 }
								]}
								labelColor="#9ca3af"
								valueColor="#ffffff"
								divider={true}
								dividerColor="#374151"
								compact={false}
								fontFamily="Arial, sans-serif"
								labelFontSize={12}
								valueFontSize={14}
								barHeight={6}
								barBackgroundColor="#1f2937"
								barBorderRadius={3}
								opacity={1}
								container={{ width: test.width, height: 120, radius: 0 }}
								data={testData}
							/>
						</svg>
					</div>
				</div>
			{/each}
		</div>
	</section>

	<!-- List Tests -->
	<section class="mb-12">
		<h2 class="mb-4 text-2xl font-semibold">List Component Tests</h2>
		<p class="mb-4 text-slate-400">List with auto-fitting items</p>

		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
			{#each [
				{ label: 'Narrow List', width: 150 },
				{ label: 'Wide List', width: 300 }
			] as test}
				<div class="rounded-lg border border-slate-700 bg-slate-800 p-4">
					<h3 class="mb-2 text-sm font-medium text-slate-400">{test.label}</h3>
					<div class="flex items-center justify-center rounded border border-slate-600 bg-slate-900 p-2">
						<svg
							width={test.width}
							height={120}
							viewBox="0 0 {test.width} 120"
						>
							<rect x="0" y="0" width={test.width} height={120} fill="#1e293b" />
							<List
								dataField="items"
								delimiter=","
								style="bullet"
								fontSize={14}
								fontFamily="Arial, sans-serif"
								fontWeight="normal"
								color="#ffffff"
								lineHeight={1.6}
								numberPadding={2}
								alignment="left"
								verticalAlign="top"
								itemSpacing={4}
								indent={20}
								overflowText={"+{n} more"}
								opacity={1}
								container={{ width: test.width, height: 120, radius: 0 }}
								data={testData}
							/>
						</svg>
					</div>
				</div>
			{/each}
		</div>
	</section>

	<!-- Badge Tests -->
	<section class="mb-12">
		<h2 class="mb-4 text-2xl font-semibold">Badge Component Tests</h2>
		<p class="mb-4 text-slate-400">Badge with auto-fitting text</p>

		<div class="grid grid-cols-1 gap-6 md:grid-cols-3">
			{#each [
				{ label: 'Small Badge - Short', width: 80, height: 30, text: 'NEW' },
				{ label: 'Small Badge - Long', width: 80, height: 30, text: 'LEGENDARY' },
				{ label: 'Medium Badge - Long', width: 120, height: 36, text: 'ULTRA RARE EDITION' }
			] as test}
				<div class="rounded-lg border border-slate-700 bg-slate-800 p-4">
					<h3 class="mb-2 text-sm font-medium text-slate-400">{test.label}</h3>
					<p class="mb-2 text-xs text-slate-500">{test.width}x{test.height}</p>
					<div class="flex items-center justify-center rounded border border-slate-600 bg-slate-900 p-4">
						<svg
							width={test.width}
							height={test.height}
							viewBox="0 0 {test.width} {test.height}"
						>
							<Badge
								shapeSource={{ type: 'builtin', shape: 'ellipse' }}
								backgroundColor="#f59e0b"
								borderWidth={0}
								opacity={1}
								container={{ width: test.width, height: test.height, radius: 0 }}
								data={{ badgeText: test.text }}
							/>
							<TextField
								dataField="badgeText"
								maxFontSize={18}
								minFontSize={6}
								fontFamily="Arial, sans-serif"
								fontWeight="bold"
								color="#000000"
								alignment="center"
								verticalAlign="center"
								container={{ width: test.width, height: test.height, radius: 0 }}
								data={{ badgeText: test.text }}
							/>
						</svg>
					</div>
				</div>
			{/each}
		</div>
	</section>

	<!-- Ribbon Tests -->
	<section class="mb-12">
		<h2 class="mb-4 text-2xl font-semibold">Ribbon Component Tests</h2>
		<p class="mb-4 text-slate-400">Ribbon with auto-fitting text</p>

		<div class="grid grid-cols-1 gap-6 md:grid-cols-3">
			{#each [
				{ label: 'Short Text', text: 'NEW', ribbonWidth: 100 },
				{ label: 'Medium Text', text: 'LIMITED EDITION', ribbonWidth: 120 },
				{ label: 'Long Text', text: 'ULTRA RARE COLLECTORS ITEM', ribbonWidth: 140 }
			] as test}
				<div class="rounded-lg border border-slate-700 bg-slate-800 p-4">
					<h3 class="mb-2 text-sm font-medium text-slate-400">{test.label}</h3>
					<div class="flex items-center justify-center rounded border border-slate-600 bg-slate-900 p-4">
						<svg width="200" height="200" viewBox="0 0 200 200">
							<rect x="0" y="0" width="200" height="200" fill="#1e293b" />
							<Ribbon
								textPreset="none"
								dataField="ribbonText"
								position="top-right"
								style="folded"
								color="#ef4444"
								textColor="#ffffff"
								shadowColor="#b91c1c"
								fontSize={12}
								fontFamily="Arial, sans-serif"
								fontWeight="bold"
								angle={45}
								ribbonWidth={test.ribbonWidth}
								opacity={1}
								container={{ width: 200, height: 200, radius: 0 }}
								data={{ ribbonText: test.text }}
							/>
						</svg>
					</div>
				</div>
			{/each}
		</div>
	</section>

	<!-- Edge Cases -->
	<section class="mb-12">
		<h2 class="mb-4 text-2xl font-semibold">Edge Cases</h2>
		<p class="mb-4 text-slate-400">Testing extreme scenarios</p>

		<div class="grid grid-cols-1 gap-6 md:grid-cols-3">
			<!-- Very narrow container -->
			<div class="rounded-lg border border-slate-700 bg-slate-800 p-4">
				<h3 class="mb-2 text-sm font-medium text-slate-400">Very Narrow (50px)</h3>
				<div class="flex items-center justify-center rounded border border-slate-600 bg-slate-900 p-2">
					<svg width="50" height="100" viewBox="0 0 50 100">
						<rect x="0" y="0" width="50" height="100" fill="#1e293b" />
						<FitText
							text="Very Long Text That Should Wrap"
							x={0}
							y={0}
							width={50}
							height={100}
							minSize={6}
							maxSize={24}
							horizontalAlign="center"
							verticalAlign="center"
							fill="#ffffff"
							debug={showDebug}
						/>
					</svg>
				</div>
			</div>

			<!-- Very short container -->
			<div class="rounded-lg border border-slate-700 bg-slate-800 p-4">
				<h3 class="mb-2 text-sm font-medium text-slate-400">Very Short (20px height)</h3>
				<div class="flex items-center justify-center rounded border border-slate-600 bg-slate-900 p-2">
					<svg width="200" height="20" viewBox="0 0 200 20">
						<rect x="0" y="0" width="200" height="20" fill="#1e293b" />
						<FitText
							text="Single line only at this height"
							x={0}
							y={0}
							width={200}
							height={20}
							minSize={8}
							maxSize={16}
							horizontalAlign="center"
							verticalAlign="center"
							fill="#ffffff"
							singleLine={true}
							debug={showDebug}
						/>
					</svg>
				</div>
			</div>

			<!-- With large inset -->
			<div class="rounded-lg border border-slate-700 bg-slate-800 p-4">
				<h3 class="mb-2 text-sm font-medium text-slate-400">Large Inset (20px)</h3>
				<div class="flex items-center justify-center rounded border border-slate-600 bg-slate-900 p-2">
					<svg width="200" height="80" viewBox="0 0 200 80">
						<rect x="0" y="0" width="200" height="80" fill="#1e293b" />
						<FitText
							text="Text with padding around it"
							x={0}
							y={0}
							width={200}
							height={80}
							minSize={8}
							maxSize={32}
							inset={20}
							horizontalAlign="center"
							verticalAlign="center"
							fill="#ffffff"
							debug={showDebug}
						/>
					</svg>
				</div>
			</div>
		</div>
	</section>
</div>
