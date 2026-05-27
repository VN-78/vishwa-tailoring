<script lang="ts">
	import Pin from '../atoms/icons/Pin.svelte';
	import TapeMeasure from '../atoms/icons/TapeMeasure.svelte';
	import { SparklesIcon } from '@lucide/svelte';
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
		}, { threshold: 0.2 });
		observer.observe(sectionRef);
		return () => observer.disconnect();
	});
</script>

<section id="about" bind:this={sectionRef} class="py-16 md:py-24">
	{#if isVisible}
		<div class="grid grid-cols-1 items-center gap-12 md:grid-cols-12">
			<div in:fly={{ y: 50, duration: 1000, easing: quartOut }} class="relative md:col-span-5">
				<div class="bg-muted border-border/20 relative aspect-square overflow-hidden rounded-2xl border shadow-md">
					<!-- Image Placeholder -->
					<div class="flex h-full w-full items-center justify-center bg-linear-to-br from-primary/5 to-secondary/5">
						<Pin size={120} class="text-primary/20" />
					</div>
				</div>
				<!-- Experience Chip -->
				<div class="bg-secondary text-secondary-foreground absolute -bottom-4 -right-4 rounded-full border border-white px-6 py-3 shadow-lg md:px-8">
					<AnimatedText text={m.about_chip()} />
				</div>
			</div>

			<div in:fly={{ y: 50, duration: 1000, delay: 200, easing: quartOut }} class="flex flex-col gap-6 md:col-span-7 md:pl-8">
				<h2 class="font-heading text-3xl text-foreground md:text-5xl flex items-center gap-3">
					<SparklesIcon class="text-muted-foreground" size={32} />
					<AnimatedText text={m.about_title()} />
				</h2>
				
				<div class="text-muted-foreground flex flex-col gap-6 text-lg leading-relaxed">
					<p><AnimatedText text={m.about_desc_1()} /></p>
					<p class="border-l-4 border-primary/30 pl-4 italic">
						<AnimatedText text={m.about_desc_2()} />
					</p>
				</div>

				<div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
					<div class="bg-muted/50 border-border/30 rounded-xl border p-6 transition-colors hover:bg-muted">
						<TapeMeasure class="text-primary mb-3" size={48} />
						<h3 class="text-foreground mb-1 font-bold"><AnimatedText text={m.about_stat_1_title()} /></h3>
						<p class="text-muted-foreground text-sm"><AnimatedText text={m.about_stat_1_desc()} /></p>
					</div>
					<div class="bg-muted/50 border-border/30 rounded-xl border p-6 transition-colors hover:bg-muted">
						<Pin class="text-primary mb-3" size={48} />
						<h3 class="text-foreground mb-1 font-bold"><AnimatedText text={m.about_stat_2_title()} /></h3>
						<p class="text-muted-foreground text-sm"><AnimatedText text={m.about_stat_2_desc()} /></p>
					</div>
				</div>
			</div>
		</div>
	{/if}
</section>
