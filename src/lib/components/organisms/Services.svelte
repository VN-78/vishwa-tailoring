<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import AnimatedText from '../atoms/AnimatedText.svelte';
	import { fly } from 'svelte/transition';
	import { quartOut } from 'svelte/easing';
	import { onMount } from 'svelte';

	let isVisible = $state(false);
	let sectionRef: HTMLElement;

	onMount(() => {
		const observer = new IntersectionObserver((entries) => {
			if (entries[0].isIntersecting) {
				isVisible = true;
				observer.disconnect();
			}
		}, { threshold: 0.1 });
		observer.observe(sectionRef);
		return () => observer.disconnect();
	});

	const services = $derived([
		{ title: m.service_1_title(), desc: m.service_1_desc() },
		{ title: m.service_2_title(), desc: m.service_2_desc() },
		{ title: m.service_3_title(), desc: m.service_3_desc() },
		{ title: m.service_4_title(), desc: m.service_4_desc() },
		{ title: m.service_5_title(), desc: m.service_5_desc() },
		{ title: m.service_6_title(), desc: m.service_6_desc() }
	]);
</script>

<section id="services" bind:this={sectionRef} class="bg-muted/30 my-8 rounded-3xl border border-border/10 px-4 py-16 shadow-sm md:px-12 md:py-24">
	{#if isVisible}
		<div class="mx-auto mb-16 max-w-2xl text-center">
			<h2 in:fly={{ y: 20, duration: 800 }} class="font-heading mb-4 text-3xl text-foreground md:text-5xl">
				<AnimatedText text={m.services_title()} />
			</h2>
			<p in:fly={{ y: 20, duration: 800, delay: 100 }} class="text-muted-foreground text-lg">
				<AnimatedText text={m.services_subtitle()} />
			</p>
		</div>

		<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#each services as service, i (service.title)}
				<div 
					in:fly={{ y: 30, duration: 800, delay: 200 + i * 100, easing: quartOut }}
					class="group border-border/20 bg-background/50 hover:bg-background relative h-72 cursor-pointer overflow-hidden rounded-2xl border shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
				>
					<div class="absolute inset-0 flex items-center justify-center opacity-10 transition-opacity group-hover:opacity-20">
						<!-- Pattern or Icon Placeholder -->
						<div class="h-32 w-32 rounded-full border-4 border-dashed border-primary"></div>
					</div>
					
					<div class="absolute inset-0 z-10 flex flex-col justify-end bg-linear-to-t from-background via-background/20 to-transparent p-8">
						<h3 class="text-foreground mb-2 text-2xl font-bold group-hover:text-primary transition-colors">
							<AnimatedText text={service.title} />
						</h3>
						<p class="text-muted-foreground text-sm uppercase tracking-wider">
							<AnimatedText text={service.desc} />
						</p>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</section>
