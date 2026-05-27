<script lang="ts">
	import Header from '$lib/components/organisms/Header.svelte';
	import Hero from '$lib/components/organisms/Hero.svelte';
	import About from '$lib/components/organisms/About.svelte';
	import Services from '$lib/components/organisms/Services.svelte';
	import Gallery from '$lib/components/organisms/Gallery.svelte';
	import Location from '$lib/components/organisms/Location.svelte';
	import { fly } from 'svelte/transition';
	import { quartOut } from 'svelte/easing';
	import { onMount } from 'svelte';

	let isMounted = $state(false);

	onMount(() => {
		isMounted = true;
	});
</script>

{#if isMounted}
	<div in:fly={{ y: -40, duration: 600, easing: quartOut }}>
		<Header />
	</div>
	<main class="min-h-screen px-4 pt-14 pb-2 text-foreground md:px-8 md:pt-24 md:pb-6">
		<div
			class="max-w-8xl mx-auto w-full md:px-24 lg:px-32"
		>
			<Hero />
			<About />
			<Services />
			<Gallery />
			<Location />

			<footer class="border-t border-border/10 py-12 text-center text-muted-foreground">
				<p>© {new Date().getFullYear()} Vishwa Tailoring. All rights reserved.</p>
			</footer>
		</div>
	</main>
{/if}
