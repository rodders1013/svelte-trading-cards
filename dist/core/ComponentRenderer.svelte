<script lang="ts">
	import type { ComponentDefinition, ContainerContext, CardData } from '../types';
	import { getComponentByName } from './ComponentRegistry.js';

	let {
		definition,
		data,
		container
	}: {
		definition: ComponentDefinition;
		data: CardData;
		container: ContainerContext;
	} = $props();

	const Component = $derived(getComponentByName(definition.type));
</script>

{#if Component}
	<Component {...definition.props} {data} {container} children={definition.children} />
{:else}
	<text x="20" y="20" fill="red" font-size="12">
		Unknown: {definition.type}
	</text>
{/if}
