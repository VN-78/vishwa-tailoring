<script lang="ts">
	import Needle from '../atoms/icons/Needle.svelte';
	import { ArrowRightIcon,} from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as m from '$lib/paraglide/messages.js';
	import AnimatedText from '../atoms/AnimatedText.svelte';
	import { fly } from 'svelte/transition';
	import { quartOut } from 'svelte/easing';

	let isMounted = $state(false);
	import { onMount } from 'svelte';
	onMount(() => {
		isMounted = true;
	});
</script>

<section id="home" class="flex min-h-[80vh] flex-col-reverse items-center gap-12 py-12 md:flex-row md:gap-24 md:py-24">
	{#if isMounted}
		<div in:fly={{ x: -50, duration: 1000, easing: quartOut }} class="flex w-full flex-col items-start gap-6 md:w-1/2">
			<div class="bg-primary/10 text-primary font-label-sm inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium">
				<span class="bg-primary h-2 w-2 animate-pulse rounded-full"></span>
				<AnimatedText text={m.hero_badge()} />
			</div>

			<h1 class="font-heading text-4xl leading-tight text-foreground md:text-6xl" style="text-shadow: rgba(var(--primary), 0.1) 2px 2px 4px;">
				<AnimatedText text={m.hero_title()} />
			</h1>

			<p class="text-muted-foreground max-w-md text-lg leading-relaxed">
				<AnimatedText text={m.hero_description()} />
			</p>

			<div class="mt-4 flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
				<Button href="https://wa.me/" size="lg" class="group shadow-primary/20 hover:shadow-primary/40 flex items-center gap-2 shadow-lg transition-all hover:scale-105">
					<AnimatedText text={m.hero_cta_whatsapp()} />
					<ArrowRightIcon size={18} class="transition-transform group-hover:translate-x-1" />
				</Button>
				<Button href="#gallery" variant="outline" size="lg">
					<AnimatedText text={m.hero_cta_portfolio()} />
				</Button>
			</div>
		</div>

		<div in:fly={{ x: 50, duration: 1000, easing: quartOut }} class="relative w-full md:w-1/2">
			<div class="bg-muted relative mx-auto aspect-4/5 w-full max-w-md overflow-hidden rounded-b-lg rounded-t-full border border-border/30 shadow-2xl">
				<!-- Empty image placeholder as requested -->
				<div class="flex h-full w-full items-center justify-center bg-linear-to-br from-primary/5 to-secondary/5">
					<Needle size={120} class="text-primary/20" />
				</div>
			</div>

			<!-- Floating Badge -->
			<!-- <div class="bg-background/95 border-border/20 absolute bottom-10 -left-6 flex items-center gap-4 rounded-xl border p-4 shadow-lg backdrop-blur-md md:-left-12">
				<div class="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-full">
					<CheckCircleIcon size={24} />
				</div>
				<div>
					<p class="text-foreground font-semibold"><AnimatedText text={m.hero_perfect_fit()} /></p>
					<p class="text-muted-foreground text-sm"><AnimatedText text={m.hero_guaranteed()} /></p>
				</div>
			</div> -->
		</div>
	{/if}
</section>

<style>
	/* Custom styles if needed */
</style>
