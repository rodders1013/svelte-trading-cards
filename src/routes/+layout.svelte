<script lang="ts">
	import './layout.css';
	import { page } from '$app/state';
	import { Button } from '$lib/creator/ui/button';
	import { Separator } from '$lib/creator/ui/separator';

	let { children } = $props();

	const navItems = [
		{ href: '/', label: 'Home' },
		{ href: '/creator', label: 'Creator' },
		{ href: '/gallery', label: 'Gallery' }
	];
</script>

{#if page.url.pathname === '/creator'}
	<!-- Creator page: fixed viewport height with internal scrolling panels -->
	<div class="flex h-screen flex-col overflow-hidden bg-background">
		<header class="shrink-0 border-b border-border">
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

		<main class="min-h-0 flex-1 overflow-hidden px-4 py-4">
			{@render children()}
		</main>
	</div>
{:else}
	<!-- Other pages: normal scrolling behavior -->
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

		<main class="mx-auto max-w-7xl px-6 py-8">
			{@render children()}
		</main>
	</div>
{/if}
