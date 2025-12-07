<script lang="ts">
	import * as Card from '$lib/creator/ui/card';
	import { Button } from '$lib/creator/ui/button';
</script>

<div class="space-y-8">
	<div class="space-y-4">
		<h1 class="text-3xl font-bold">Svelte Trading Cards Demo</h1>
		<p class="text-muted-foreground">
			Test the card creation and download system with different data sets.
		</p>
	</div>

	<div class="grid gap-6 md:grid-cols-2">
		<Card.Root>
			<Card.Header>
				<Card.Title>Creator</Card.Title>
				<Card.Description>Design card templates with live preview</Card.Description>
			</Card.Header>
			<Card.Content>
				<ul class="list-inside list-disc space-y-1 text-sm text-muted-foreground">
					<li>Load sample data from JSON</li>
					<li>Customize card layout and styling</li>
					<li>Save templates to JSON for inspection</li>
				</ul>
			</Card.Content>
			<Card.Footer>
				<Button href="/creator">Open Creator</Button>
			</Card.Footer>
		</Card.Root>

		<Card.Root>
			<Card.Header>
				<Card.Title>Gallery</Card.Title>
				<Card.Description>View and download generated cards</Card.Description>
			</Card.Header>
			<Card.Content>
				<ul class="list-inside list-disc space-y-1 text-sm text-muted-foreground">
					<li>Switch between different data sets</li>
					<li>Apply saved templates to any data</li>
					<li>Test client and server downloads</li>
				</ul>
			</Card.Content>
			<Card.Footer>
				<Button href="/gallery">Open Gallery</Button>
			</Card.Footer>
		</Card.Root>
	</div>

	<Card.Root class="bg-muted/50">
		<Card.Header>
			<Card.Title>Testing Strategy</Card.Title>
		</Card.Header>
		<Card.Content class="space-y-4">
			<p class="text-sm text-muted-foreground">
				This demo uses <strong>different data files with identical shapes</strong> to prove the
				system is truly data-agnostic:
			</p>
			<div class="grid gap-4 md:grid-cols-3">
				<div class="rounded border border-border bg-card p-4">
					<h4 class="font-semibold">Fantasy Heroes</h4>
					<p class="text-xs text-muted-foreground">Creator sample data</p>
				</div>
				<div class="rounded border border-border bg-card p-4">
					<h4 class="font-semibold">Cosmic Voyagers</h4>
					<p class="text-xs text-muted-foreground">Gallery test data</p>
				</div>
				<div class="rounded border border-border bg-card p-4">
					<h4 class="font-semibold">Sports Legends</h4>
					<p class="text-xs text-muted-foreground">Alternative data set</p>
				</div>
			</div>
		</Card.Content>
	</Card.Root>
</div>
