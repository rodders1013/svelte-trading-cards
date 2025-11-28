<script lang="ts">
	import './layout.css';
	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';

	let { children } = $props();

	const navItems = [
		{ href: '/', label: 'Home' },
		{ href: '/creator', label: 'Creator' },
		{ href: '/gallery', label: 'Gallery' }
	];
</script>

<div class="min-h-screen bg-background">
	<header class="border-b border-border">
		<div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
			<div class="flex items-center gap-6">
				<h1 class="text-xl font-bold text-foreground">Trading Cards</h1>
				<Separator orientation="vertical" class="h-6" />
				<nav class="flex gap-2">
					{#each navItems as item}
						<Button
							variant={page.url.pathname === item.href ? 'secondary' : 'ghost'}
							href={item.href}
							size="sm"
						>
							{item.label}
						</Button>
					{/each}
				</nav>
			</div>
		</div>
	</header>

	<main class="{page.url.pathname === '/creator' ? 'px-4 py-4' : 'mx-auto max-w-7xl px-6 py-8'}">
		{@render children()}
	</main>
</div>
