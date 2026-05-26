<script lang="ts">
	import Header from '$lib/components/organisms/Header.svelte';
	import { fly } from 'svelte/transition';
	import { quartOut } from 'svelte/easing';
	import { onMount } from 'svelte';

	let isMounted = $state(false);

	onMount(() => {
		isMounted = true;
	});
</script>

<!-- Change header accordingly to project  -->
<svelte:head>
	<title>Svelte Template</title>

	<meta
		name="description"
		content="SvelteKit template used for quick Scafolding of new projects."
	/>

	<meta property="og:title" content="svelte-template" />
	<meta
		property="og:description"
		content="svelte-template is a SvelteKit template used for quick Scafolding of new projects."
	/>
	<meta property="og:type" content="website" />
</svelte:head>

{#if isMounted}
	<div in:fly={{ y: -40, duration: 600, easing: quartOut }}>
		<Header />
	</div>
{/if}
