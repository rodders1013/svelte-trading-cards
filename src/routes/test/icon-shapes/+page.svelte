<script lang="ts">
	import IconPicker from '$lib/card/icons/IconPicker.svelte';
	import type { IconData } from '$lib/card/icons/Icon.svelte';
	import { sanitizeSvgBody } from '$lib/card/icons/Icon.svelte';

	// Selected icon state
	let selectedIcon = $state<{ iconData?: IconData; iconName?: string }>({});

	// Test container sizes
	const testSizes = [
		{ width: 80, height: 80, label: '80x80' },
		{ width: 120, height: 80, label: '120x80' },
		{ width: 80, height: 120, label: '80x120' },
		{ width: 150, height: 150, label: '150x150' }
	];

	// Generate unique ID
	const uid = Math.random().toString(36).substring(2, 9);

	// Sanitized icon body
	const sanitizedBody = $derived(
		selectedIcon.iconData?.body ? sanitizeSvgBody(selectedIcon.iconData.body) : ''
	);

	// Icon body with ALL fill attributes stripped (for gradient/pattern/clip fills)
	// This allows parent <g> fill to be inherited
	const strippedBody = $derived(
		sanitizedBody
			.replace(/fill="[^"]*"/gi, '')  // Remove fill="..."
			.replace(/fill='[^']*'/gi, '')  // Remove fill='...'
	);

	// Icon dimensions
	const iconWidth = $derived(selectedIcon.iconData?.width ?? 24);
	const iconHeight = $derived(selectedIcon.iconData?.height ?? 24);

	// Scale mode for how icon fits in container
	type ScaleMode = 'contain' | 'cover' | 'stretch';
	let scaleMode = $state<ScaleMode>('contain');

	// Calculate transform to scale icon to container
	function getTransform(containerW: number, containerH: number): string {
		let scaleX: number, scaleY: number, offsetX = 0, offsetY = 0;

		switch (scaleMode) {
			case 'contain': {
				const scale = Math.min(containerW / iconWidth, containerH / iconHeight);
				scaleX = scaleY = scale;
				offsetX = (containerW - iconWidth * scale) / 2;
				offsetY = (containerH - iconHeight * scale) / 2;
				break;
			}
			case 'cover': {
				const scale = Math.max(containerW / iconWidth, containerH / iconHeight);
				scaleX = scaleY = scale;
				offsetX = (containerW - iconWidth * scale) / 2;
				offsetY = (containerH - iconHeight * scale) / 2;
				break;
			}
			case 'stretch':
				scaleX = containerW / iconWidth;
				scaleY = containerH / iconHeight;
				break;
		}

		return `translate(${offsetX}, ${offsetY}) scale(${scaleX}, ${scaleY})`;
	}

	// Handle icon selection
	function handleIconSelect(icon: { iconData: IconData; iconName: string }) {
		selectedIcon = icon;
	}
</script>

<div class="min-h-screen bg-slate-900 p-8 text-white">
	<div class="mx-auto max-w-6xl">
		<h1 class="mb-2 text-2xl font-bold">Icon Shape Testing</h1>
		<p class="mb-6 text-slate-400">
			Test using Iconify icons as shapes for fills, strokes, and clip paths.
		</p>

		<div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
			<!-- Left: Icon Picker -->
			<div class="rounded-lg bg-slate-800 p-4">
				<h2 class="mb-4 text-lg font-semibold">1. Select Icon</h2>
				<IconPicker value={selectedIcon} onSelect={handleIconSelect} />

				{#if selectedIcon.iconData?.body}
					<div class="mt-4 rounded bg-slate-700 p-3">
						<h3 class="mb-2 text-sm font-medium text-slate-300">Icon Info</h3>
						<div class="space-y-1 text-xs text-slate-400">
							<p>Name: <span class="text-white">{selectedIcon.iconName}</span></p>
							<p>ViewBox: <span class="text-white">{iconWidth} x {iconHeight}</span></p>
							<p>Paths: <span class="text-white">{(sanitizedBody.match(/<path/g) || []).length}</span></p>
							<p>Has circles: <span class="text-white">{sanitizedBody.includes('<circle') ? 'Yes' : 'No'}</span></p>
						</div>
					</div>
				{/if}
			</div>

			<!-- Middle: Scale Mode -->
			<div class="rounded-lg bg-slate-800 p-4">
				<h2 class="mb-4 text-lg font-semibold">2. Scale Mode</h2>
				<div class="flex gap-2">
					{#each ['contain', 'cover', 'stretch'] as mode}
						<button
							class="flex-1 rounded px-3 py-2 text-sm {scaleMode === mode
								? 'bg-blue-600 text-white'
								: 'bg-slate-700 text-slate-300 hover:bg-slate-600'}"
							onclick={() => (scaleMode = mode as ScaleMode)}
						>
							{mode}
						</button>
					{/each}
				</div>
				<p class="mt-2 text-xs text-slate-500">
					{#if scaleMode === 'contain'}
						Fit entire icon (may have gaps)
					{:else if scaleMode === 'cover'}
						Cover container (may crop)
					{:else}
						Stretch to fill (may distort)
					{/if}
				</p>
			</div>

			<!-- Right: Original Icon -->
			<div class="rounded-lg bg-slate-800 p-4">
				<h2 class="mb-4 text-lg font-semibold">Original Icon</h2>
				{#if selectedIcon.iconData?.body}
					<div class="flex items-center justify-center rounded bg-slate-700 p-4">
						<svg
							width="80"
							height="80"
							viewBox="0 0 {iconWidth} {iconHeight}"
							fill="currentColor"
							class="text-white"
						>
							{@html sanitizedBody}
						</svg>
					</div>
				{:else}
					<div class="flex h-24 items-center justify-center rounded bg-slate-700 text-slate-500">
						Select an icon
					</div>
				{/if}
			</div>
		</div>

		{#if selectedIcon.iconData?.body}
			<!-- Test 1: Direct Fill (Most Important for Badges) -->
			<div class="mt-8 rounded-lg bg-slate-800 p-4">
				<h2 class="mb-4 text-lg font-semibold">Test 1: Direct Fill (Badge Use Case)</h2>
				<p class="mb-4 text-sm text-slate-400">
					Fill the icon path directly with colors. Using style="color:..." because icons use fill="currentColor".
				</p>
				<div class="flex flex-wrap gap-4">
					{#each testSizes as size}
						<div class="text-center">
							<div class="mb-1 text-xs text-slate-500">{size.label}</div>
							<svg
								width={size.width}
								height={size.height}
								class="rounded bg-slate-700"
							>
								<g transform={getTransform(size.width, size.height)} style="color: #3b82f6">
									{@html sanitizedBody}
								</g>
							</svg>
						</div>
					{/each}
				</div>
			</div>

			<!-- Test 2: Multiple Colors -->
			<div class="mt-6 rounded-lg bg-slate-800 p-4">
				<h2 class="mb-4 text-lg font-semibold">Test 2: Different Fill Colors</h2>
				<div class="flex flex-wrap gap-4">
					{#each ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'] as color}
						<svg width="80" height="80" class="rounded bg-slate-700">
							<g transform={getTransform(80, 80)} style="color: {color}">
								{@html sanitizedBody}
							</g>
						</svg>
					{/each}
				</div>
			</div>

			<!-- Test 3: Fill + Stroke Border -->
			<div class="mt-6 rounded-lg bg-slate-800 p-4">
				<h2 class="mb-4 text-lg font-semibold">Test 3: Fill + Border Stroke</h2>
				<p class="mb-4 text-sm text-slate-400">
					Fill with color, then add a stroke for border effect.
				</p>
				<div class="flex flex-wrap gap-4">
					{#each [0, 1, 2, 3, 4] as strokeWidth}
						<div class="text-center">
							<div class="mb-1 text-xs text-slate-500">stroke: {strokeWidth}</div>
							<svg width="100" height="100" class="rounded bg-slate-700">
								<!-- Fill first -->
								<g transform={getTransform(100, 100)} style="color: #3b82f6">
									{@html sanitizedBody}
								</g>
								<!-- Then stroke on top (using stripped body so stroke works) -->
								{#if strokeWidth > 0}
									<g
										transform={getTransform(100, 100)}
										fill="none"
										stroke="#ffffff"
										stroke-width={strokeWidth}
										stroke-linejoin="round"
									>
										{@html strippedBody}
									</g>
								{/if}
							</svg>
						</div>
					{/each}
				</div>
			</div>

			<!-- Test 4: Gradient Fill -->
			<div class="mt-6 rounded-lg bg-slate-800 p-4">
				<h2 class="mb-4 text-lg font-semibold">Test 4: Gradient Fill</h2>
				<p class="mb-4 text-sm text-slate-400">
					Using strippedBody (no fill="currentColor") so gradient can apply.
				</p>
				<div class="flex flex-wrap gap-4">
					<!-- Vertical gradient -->
					<div class="text-center">
						<div class="mb-1 text-xs text-slate-500">Vertical</div>
						<svg width="100" height="100" class="rounded bg-slate-700">
							<defs>
								<linearGradient id="grad-v-{uid}" x1="0%" y1="0%" x2="0%" y2="100%">
									<stop offset="0%" stop-color="#3b82f6" />
									<stop offset="100%" stop-color="#1e40af" />
								</linearGradient>
							</defs>
							<g transform={getTransform(100, 100)} fill="url(#grad-v-{uid})">
								{@html strippedBody}
							</g>
						</svg>
					</div>
					<!-- Horizontal gradient -->
					<div class="text-center">
						<div class="mb-1 text-xs text-slate-500">Horizontal</div>
						<svg width="100" height="100" class="rounded bg-slate-700">
							<defs>
								<linearGradient id="grad-h-{uid}" x1="0%" y1="0%" x2="100%" y2="0%">
									<stop offset="0%" stop-color="#22c55e" />
									<stop offset="100%" stop-color="#15803d" />
								</linearGradient>
							</defs>
							<g transform={getTransform(100, 100)} fill="url(#grad-h-{uid})">
								{@html strippedBody}
							</g>
						</svg>
					</div>
					<!-- Diagonal gradient -->
					<div class="text-center">
						<div class="mb-1 text-xs text-slate-500">Diagonal</div>
						<svg width="100" height="100" class="rounded bg-slate-700">
							<defs>
								<linearGradient id="grad-d-{uid}" x1="0%" y1="0%" x2="100%" y2="100%">
									<stop offset="0%" stop-color="#f59e0b" />
									<stop offset="100%" stop-color="#b45309" />
								</linearGradient>
							</defs>
							<g transform={getTransform(100, 100)} fill="url(#grad-d-{uid})">
								{@html strippedBody}
							</g>
						</svg>
					</div>
					<!-- Multi-color -->
					<div class="text-center">
						<div class="mb-1 text-xs text-slate-500">Multi-color</div>
						<svg width="100" height="100" class="rounded bg-slate-700">
							<defs>
								<linearGradient id="grad-m-{uid}" x1="0%" y1="0%" x2="100%" y2="100%">
									<stop offset="0%" stop-color="#3b82f6" />
									<stop offset="50%" stop-color="#8b5cf6" />
									<stop offset="100%" stop-color="#ec4899" />
								</linearGradient>
							</defs>
							<g transform={getTransform(100, 100)} fill="url(#grad-m-{uid})">
								{@html strippedBody}
							</g>
						</svg>
					</div>
				</div>
			</div>

			<!-- Test 5: Clip Path for Patterns -->
			<div class="mt-6 rounded-lg bg-slate-800 p-4">
				<h2 class="mb-4 text-lg font-semibold">Test 5: Clip Path (for Pattern Overlays)</h2>
				<p class="mb-4 text-sm text-slate-400">
					Use strippedBody in clipPath to mask patterns onto the shape.
				</p>

				<!-- Debug: Pattern test (no clipping) -->
				<div class="mb-4 rounded bg-slate-900 p-2">
					<div class="text-xs text-slate-500 mb-1">Debug: Do patterns render at all?</div>
					<div class="flex gap-4">
						<!-- Dots pattern on plain rect -->
						<div class="text-center">
							<div class="text-xs text-slate-500">Dots (no clip)</div>
							<svg width="60" height="60" class="bg-slate-700 rounded">
								<defs>
									<pattern id={`debug-dots-${uid}`} width="12" height="12" patternUnits="userSpaceOnUse">
										<circle cx="6" cy="6" r="4" fill="#22c55e" />
									</pattern>
								</defs>
								<rect width="60" height="60" fill={`url(#debug-dots-${uid})`} />
							</svg>
						</div>
						<!-- Stripes pattern on plain rect -->
						<div class="text-center">
							<div class="text-xs text-slate-500">Stripes (no clip)</div>
							<svg width="60" height="60" class="bg-slate-700 rounded">
								<defs>
									<pattern id={`debug-stripes-${uid}`} width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
										<rect width="5" height="10" fill="#8b5cf6" />
									</pattern>
								</defs>
								<rect width="60" height="60" fill={`url(#debug-stripes-${uid})`} />
							</svg>
						</div>
						<!-- strippedBody preview -->
						<div class="text-center">
							<div class="text-xs text-slate-500">Shape</div>
							<svg width="60" height="60" class="bg-slate-700 rounded">
								<g transform={getTransform(60, 60)} fill="#ff0000">
									{@html strippedBody}
								</g>
							</svg>
						</div>
					</div>
				</div>

				<div class="flex flex-wrap gap-4">
					<!-- Test A: ClipPath with hardcoded shape (control) -->
					<div class="text-center">
						<div class="mb-1 text-xs text-slate-500">A: Hardcoded Clip</div>
						<svg width="100" height="100" class="rounded bg-slate-700">
							<defs>
								<clipPath id="hardcoded-clip">
									<circle cx="50" cy="50" r="40" />
								</clipPath>
							</defs>
							<rect width="100" height="100" fill="#3b82f6" clip-path="url(#hardcoded-clip)" />
						</svg>
					</div>

					<!-- Test B: ClipPath with dynamic icon (attribute) -->
					<div class="text-center">
						<div class="mb-1 text-xs text-slate-500">B: Clip (attr)</div>
						<svg width="100" height="100" class="rounded bg-slate-700">
							<defs>
								<clipPath id={`test-b-${uid}`}>
									<g transform={getTransform(100, 100)} fill="black">
										{@html strippedBody}
									</g>
								</clipPath>
							</defs>
							<rect width="100" height="100" fill="#3b82f6" clip-path={`url(#test-b-${uid})`} />
						</svg>
					</div>

					<!-- Test C: ClipPath with dynamic icon (style) -->
					<div class="text-center">
						<div class="mb-1 text-xs text-slate-500">C: Clip (style)</div>
						<svg width="100" height="100" class="rounded bg-slate-700">
							<defs>
								<clipPath id={`test-c-${uid}`}>
									<g transform={getTransform(100, 100)} fill="black">
										{@html strippedBody}
									</g>
								</clipPath>
							</defs>
							<rect width="100" height="100" fill="#22c55e" style={`clip-path: url(#test-c-${uid})`} />
						</svg>
					</div>

					<!-- Test D: Mask with solid fill -->
					<div class="text-center">
						<div class="mb-1 text-xs text-slate-500">D: Mask Solid</div>
						<svg width="100" height="100" class="rounded bg-slate-700">
							<defs>
								<mask id={`test-d-${uid}`}>
									<g transform={getTransform(100, 100)} fill="white">
										{@html strippedBody}
									</g>
								</mask>
							</defs>
							<rect width="100" height="100" fill="#f59e0b" mask={`url(#test-d-${uid})`} />
						</svg>
					</div>

					<!-- Test E: Mask with gradient -->
					<div class="text-center">
						<div class="mb-1 text-xs text-slate-500">E: Mask Gradient</div>
						<svg width="100" height="100" class="rounded bg-slate-700">
							<defs>
								<mask id={`test-e-${uid}`}>
									<g transform={getTransform(100, 100)} fill="white">
										{@html strippedBody}
									</g>
								</mask>
								<linearGradient id={`grad-e-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
									<stop offset="0%" stop-color="#3b82f6" />
									<stop offset="100%" stop-color="#8b5cf6" />
								</linearGradient>
							</defs>
							<rect width="100" height="100" fill={`url(#grad-e-${uid})`} mask={`url(#test-e-${uid})`} />
						</svg>
					</div>

					<!-- Test F: Mask with pattern -->
					<div class="text-center">
						<div class="mb-1 text-xs text-slate-500">F: Mask Pattern</div>
						<svg width="100" height="100" class="rounded bg-slate-700">
							<defs>
								<mask id={`test-f-${uid}`}>
									<g transform={getTransform(100, 100)} fill="white">
										{@html strippedBody}
									</g>
								</mask>
								<pattern id={`pat-f-${uid}`} width="12" height="12" patternUnits="userSpaceOnUse">
									<circle cx="6" cy="6" r="4" fill="#22c55e" />
								</pattern>
							</defs>
							<rect width="100" height="100" fill={`url(#pat-f-${uid})`} mask={`url(#test-f-${uid})`} />
						</svg>
					</div>

					<!-- Test G: Mask with stripes -->
					<div class="text-center">
						<div class="mb-1 text-xs text-slate-500">G: Mask Stripes</div>
						<svg width="100" height="100" class="rounded bg-slate-700">
							<defs>
								<mask id={`test-g-${uid}`}>
									<g transform={getTransform(100, 100)} fill="white">
										{@html strippedBody}
									</g>
								</mask>
								<pattern id={`pat-g-${uid}`} width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
									<rect width="5" height="10" fill="#8b5cf6" />
								</pattern>
							</defs>
							<rect width="100" height="100" fill={`url(#pat-g-${uid})`} mask={`url(#test-g-${uid})`} />
						</svg>
					</div>

					<!-- Test H: Fill + Pattern overlay using mask -->
					<div class="text-center">
						<div class="mb-1 text-xs text-slate-500">H: Fill+Pattern</div>
						<svg width="100" height="100" class="rounded bg-slate-700">
							<defs>
								<mask id={`test-h-${uid}`}>
									<g transform={getTransform(100, 100)} fill="white">
										{@html strippedBody}
									</g>
								</mask>
								<pattern id={`pat-h-${uid}`} width="8" height="8" patternUnits="userSpaceOnUse">
									<circle cx="4" cy="4" r="2" fill="rgba(255,255,255,0.3)" />
								</pattern>
							</defs>
							<!-- Solid fill masked -->
							<rect width="100" height="100" fill="#1e3a5f" mask={`url(#test-h-${uid})`} />
							<!-- Pattern overlay masked -->
							<rect width="100" height="100" fill={`url(#pat-h-${uid})`} mask={`url(#test-h-${uid})`} />
						</svg>
					</div>
				</div>
			</div>

			<!-- Test 6: Full Badge Simulation -->
			<div class="mt-6 rounded-lg bg-slate-800 p-4">
				<h2 class="mb-4 text-lg font-semibold">Test 6: Full Badge Simulation</h2>
				<p class="mb-4 text-sm text-slate-400">
					Combining fill + pattern overlay + border + glow.
				</p>
				<div class="flex flex-wrap gap-8">
					<!-- Simple badge -->
					<div class="text-center">
						<div class="mb-1 text-xs text-slate-500">Simple</div>
						<svg width="120" height="120" class="rounded bg-slate-700">
							<g transform={getTransform(120, 120)} style="color: #3b82f6">
								{@html sanitizedBody}
							</g>
							<g transform={getTransform(120, 120)} fill="none" stroke="#60a5fa" stroke-width="2">
								{@html strippedBody}
							</g>
						</svg>
					</div>
					<!-- With glow effect -->
					<div class="text-center">
						<div class="mb-1 text-xs text-slate-500">With Glow</div>
						<svg width="120" height="120" class="rounded bg-slate-700">
							<defs>
								<filter id={`glow-${uid}`} x="-50%" y="-50%" width="200%" height="200%">
									<feGaussianBlur stdDeviation="4" result="blur" />
									<feMerge>
										<feMergeNode in="blur" />
										<feMergeNode in="SourceGraphic" />
									</feMerge>
								</filter>
							</defs>
							<!-- Glow layer (use strippedBody so we can set fill) -->
							<g transform={getTransform(120, 120)} fill="#f59e0b" filter={`url(#glow-${uid})`} opacity="0.7">
								{@html strippedBody}
							</g>
							<!-- Main fill -->
							<g transform={getTransform(120, 120)} style="color: #f59e0b">
								{@html sanitizedBody}
							</g>
							<g transform={getTransform(120, 120)} fill="none" stroke="#fbbf24" stroke-width="2">
								{@html strippedBody}
							</g>
						</svg>
					</div>
					<!-- Gradient + pattern (using mask for pattern overlay) -->
					<div class="text-center">
						<div class="mb-1 text-xs text-slate-500">Gradient + Dots</div>
						<svg width="120" height="120" class="rounded bg-slate-700">
							<defs>
								<mask id={`badge-mask-${uid}`}>
									<g transform={getTransform(120, 120)} fill="white">
										{@html strippedBody}
									</g>
								</mask>
								<linearGradient id={`badge-grad-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
									<stop offset="0%" stop-color="#8b5cf6" />
									<stop offset="100%" stop-color="#6d28d9" />
								</linearGradient>
								<pattern id={`badge-dots-${uid}`} width="6" height="6" patternUnits="userSpaceOnUse">
									<circle cx="3" cy="3" r="1" fill="white" opacity="0.3" />
								</pattern>
							</defs>
							<!-- Gradient fill via mask -->
							<rect width="120" height="120" fill={`url(#badge-grad-${uid})`} mask={`url(#badge-mask-${uid})`} />
							<!-- Pattern overlay via mask -->
							<rect width="120" height="120" fill={`url(#badge-dots-${uid})`} mask={`url(#badge-mask-${uid})`} />
							<!-- Border stroke -->
							<g transform={getTransform(120, 120)} fill="none" stroke="#a78bfa" stroke-width="2">
								{@html strippedBody}
							</g>
						</svg>
					</div>
				</div>
			</div>

			<!-- Results -->
			<div class="mt-8 rounded-lg bg-green-900/30 border border-green-700 p-4">
				<h2 class="mb-2 text-lg font-semibold text-green-400">Key Findings</h2>
				<ul class="space-y-1 text-sm text-green-300">
					<li>✓ Direct fill works - no clip-path needed for solid fills</li>
					<li>✓ Gradient fills work with linearGradient</li>
					<li>✓ Stroke borders work on icon paths</li>
					<li>✓ Clip paths work for pattern overlays</li>
					<li>✓ Filter effects (glow) work on icon groups</li>
				</ul>
			</div>
		{/if}

		<!-- Suggested Icons -->
		<div class="mt-8 rounded-lg bg-slate-800 p-4">
			<h2 class="mb-4 text-lg font-semibold">Suggested Icons to Test</h2>
			<div class="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
				<div>
					<h3 class="font-medium text-slate-300">Simple Filled</h3>
					<ul class="mt-1 space-y-1 text-slate-500">
						<li>mdi:heart</li>
						<li>mdi:star</li>
						<li>mdi:hexagon</li>
						<li>mdi:shield</li>
					</ul>
				</div>
				<div>
					<h3 class="font-medium text-slate-300">Complex</h3>
					<ul class="mt-1 space-y-1 text-slate-500">
						<li>mdi:crown</li>
						<li>mdi:trophy</li>
						<li>mdi:medal</li>
						<li>mdi:certificate</li>
					</ul>
				</div>
				<div>
					<h3 class="font-medium text-slate-300">Outlines (may not fill)</h3>
					<ul class="mt-1 space-y-1 text-slate-500">
						<li>mdi:heart-outline</li>
						<li>mdi:star-outline</li>
						<li>mdi:hexagon-outline</li>
					</ul>
				</div>
				<div>
					<h3 class="font-medium text-slate-300">Game/Badge Style</h3>
					<ul class="mt-1 space-y-1 text-slate-500">
						<li>mdi:seal</li>
						<li>mdi:bookmark</li>
						<li>mdi:label</li>
						<li>game-icons:*</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</div>
