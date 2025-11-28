<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import type { IconData } from './Icon.svelte';

	interface Props {
		value?: { iconData?: IconData; iconName?: string };
		onSelect: (icon: { iconData: IconData; iconName: string }) => void;
	}

	let { value, onSelect }: Props = $props();

	// Search state
	let searchQuery = $state('');
	let searchResults = $state<string[]>([]);
	let isLoading = $state(false);
	let errorMessage = $state('');

	// Icon set filter - Only permissive licenses (MIT, Apache 2.0, ISC, CC0 1.0)
	// All sets below are free for commercial use with NO attribution required
	let selectedIconSet = $state('');
	const safeIconSets = [
		// All safe sets option
		{ value: '', label: 'All Sets (~95k)' },
		// General UI - Large sets
		{ value: 'fluent', label: 'Fluent UI (18.7k)' },
		{ value: 'material-symbols', label: 'Material Symbols (15k)' },
		{ value: 'ph', label: 'Phosphor (9k)' },
		{ value: 'mdi', label: 'Material Design (7.4k)' },
		{ value: 'tabler', label: 'Tabler (6k)' },
		{ value: 'hugeicons', label: 'Huge Icons (4.5k)' },
		{ value: 'mingcute', label: 'MingCute (3k)' },
		{ value: 'ri', label: 'Remix Icon (3k)' },
		{ value: 'iconpark-outline', label: 'IconPark Outline (2.6k)' },
		{ value: 'carbon', label: 'Carbon (2.4k)' },
		{ value: 'bi', label: 'Bootstrap Icons (2k)' },
		{ value: 'iconoir', label: 'Iconoir (1.7k)' },
		{ value: 'lucide', label: 'Lucide (1.6k)' },
		{ value: 'heroicons', label: 'Heroicons (1.3k)' },
		{ value: 'ion', label: 'IonIcons (1.3k)' },
		// Brands & Logos (CC0)
		{ value: 'simple-icons', label: 'Simple Icons - Brands (3.4k)' },
		{ value: 'logos', label: 'SVG Logos (1.8k)' },
		{ value: 'cib', label: 'CoreUI Brands (830)' },
		{ value: 'devicon', label: 'Devicon - Dev Logos (1k)' },
		{ value: 'skill-icons', label: 'Skill Icons (400)' },
		// Crypto (CC0)
		{ value: 'cryptocurrency', label: 'Crypto Icons (480)' },
		{ value: 'cryptocurrency-color', label: 'Crypto Color (480)' },
		// Emoji
		{ value: 'noto', label: 'Noto Emoji (3.7k)' },
		{ value: 'fluent-emoji-flat', label: 'Fluent Emoji (3k)' },
		// Flags
		{ value: 'circle-flags', label: 'Circle Flags (634)' },
		{ value: 'flag', label: 'Flag Icons (542)' },
		{ value: 'cif', label: 'CoreUI Flags (199)' },
		// Thematic
		{ value: 'healthicons', label: 'Health Icons (2k)' },
		{ value: 'meteocons', label: 'Weather (447)' },
		// Maps
		{ value: 'maki', label: 'Maki - Maps (215)' },
		{ value: 'temaki', label: 'Temaki - Maps (543)' }
	];

	// Debounce timer
	let debounceTimer: ReturnType<typeof setTimeout> | null = null;

	// Search icons via Iconify API
	async function searchIcons() {
		if (!searchQuery.trim()) {
			searchResults = [];
			return;
		}

		isLoading = true;
		errorMessage = '';

		try {
			// Build URL - use prefixes for "All" or prefix for specific set
			const safePrefixes = safeIconSets.filter(s => s.value).map(s => s.value).join(',');
			const url = selectedIconSet
				? `https://api.iconify.design/search?query=${encodeURIComponent(searchQuery)}&limit=48&prefix=${selectedIconSet}`
				: `https://api.iconify.design/search?query=${encodeURIComponent(searchQuery)}&limit=48&prefixes=${safePrefixes}`;

			const response = await fetch(url);
			if (!response.ok) throw new Error('Search failed');

			const data = await response.json();
			searchResults = data.icons || [];
		} catch (e) {
			errorMessage = 'Failed to search icons. Please try again.';
			searchResults = [];
		} finally {
			isLoading = false;
		}
	}

	// Debounced search
	function handleSearchInput() {
		if (debounceTimer) clearTimeout(debounceTimer);
		debounceTimer = setTimeout(searchIcons, 300);
	}

	// Fetch icon data and select
	async function selectIcon(iconName: string) {
		isLoading = true;
		errorMessage = '';

		try {
			// Parse icon name (prefix:name)
			const [prefix, name] = iconName.includes(':')
				? iconName.split(':')
				: ['mdi', iconName];

			const response = await fetch(
				`https://api.iconify.design/${prefix}.json?icons=${name}`
			);
			if (!response.ok) throw new Error('Failed to fetch icon');

			const data = await response.json();
			const iconData = data.icons?.[name];

			if (!iconData) throw new Error('Icon not found');

			onSelect({
				iconData: {
					body: iconData.body,
					width: iconData.width ?? data.width ?? 24,
					height: iconData.height ?? data.height ?? 24,
					left: iconData.left ?? data.left,
					top: iconData.top ?? data.top
				},
				iconName
			});
		} catch (e) {
			errorMessage = 'Failed to load icon. Please try again.';
		} finally {
			isLoading = false;
		}
	}

	// Generate preview URL for icon
	function getIconPreviewUrl(iconName: string): string {
		return `https://api.iconify.design/${iconName.replace(':', '/')}.svg?color=%23888888`;
	}
</script>

<div class="space-y-3">
	<!-- Current Selection -->
	{#if value?.iconName && value?.iconData?.body}
		<div class="flex items-center gap-2 rounded border border-input bg-muted/30 p-2">
			<img
				src={getIconPreviewUrl(value.iconName)}
				alt={value.iconName}
				class="h-8 w-8"
			/>
			<span class="flex-1 truncate text-sm">{value.iconName}</span>
			<Button
				variant="outline"
				size="sm"
				class="h-6 px-2 text-xs"
				onclick={() => {
					onSelect({ iconData: { body: '', width: 24, height: 24 }, iconName: '' });
				}}
			>
				Change
			</Button>
		</div>
	{:else}
		<!-- Icon Set Filter -->
		<div>
			<label class="text-sm text-muted-foreground">Icon Set</label>
			<select
				bind:value={selectedIconSet}
				onchange={searchIcons}
				class="w-full rounded border border-input bg-background px-2 py-1 text-sm"
			>
				{#each safeIconSets as iconSet}
					<option value={iconSet.value}>{iconSet.label}</option>
				{/each}
			</select>
		</div>

		<!-- Search Input -->
		<div>
			<label class="text-sm text-muted-foreground">Search Icons</label>
			<input
				type="text"
				bind:value={searchQuery}
				oninput={handleSearchInput}
				placeholder="star, heart, user..."
				class="w-full rounded border border-input bg-background px-2 py-1 text-sm"
			/>
		</div>

		<!-- Loading / Error -->
		{#if isLoading}
			<div class="py-4 text-center text-sm text-muted-foreground">
				Searching...
			</div>
		{:else if errorMessage}
			<div class="py-2 text-center text-sm text-destructive">
				{errorMessage}
			</div>
		{:else if searchQuery && searchResults.length === 0}
			<div class="py-4 text-center text-sm text-muted-foreground">
				No icons found. Try a different search term.
			</div>
		{/if}

		<!-- Results Grid -->
		{#if searchResults.length > 0}
			<div class="max-h-[140px] overflow-y-auto rounded border border-input">
				<div class="flex flex-wrap gap-1 p-1.5">
					{#each searchResults as iconName}
						<button
							type="button"
							onclick={() => selectIcon(iconName)}
							class="flex h-11 w-11 items-center justify-center rounded hover:bg-muted"
							title={iconName}
						>
							<img
								src={getIconPreviewUrl(iconName)}
								alt={iconName}
								class="h-8 w-8"
								loading="lazy"
							/>
						</button>
					{/each}
				</div>
			</div>
			<p class="text-xs text-muted-foreground">
				{searchResults.length} results. Click to select.
			</p>
		{/if}
	{/if}
</div>
