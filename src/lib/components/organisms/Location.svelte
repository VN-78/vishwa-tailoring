<script lang="ts">
	import { MapPinIcon, PhoneIcon, ClockIcon, } from '@lucide/svelte';
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
</script>

<section id="location" bind:this={sectionRef} class="py-16 md:py-24">
	{#if isVisible}
		<div class="mx-auto mb-16 max-w-2xl text-center">
			<h2 in:fly={{ y: 20, duration: 800 }} class="font-heading mb-4 text-3xl text-foreground md:text-5xl">
				<AnimatedText text={m.nav_location()} />
			</h2>
		</div>

		<div class="grid grid-cols-1 gap-12 lg:grid-cols-2">
			<div in:fly={{ x: -30, duration: 1000, easing: quartOut }} class="flex flex-col gap-8">
				<div class="bg-muted/50 rounded-2xl p-8 border border-border/10">
					<h3 class="text-2xl font-bold mb-6 flex items-center gap-2">
						<MapPinIcon class="text-primary" />
						Visit Our Boutique
					</h3>
					<div class="space-y-6">
						<div class="flex gap-4">
							<div class="bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
								<MapPinIcon size={20} />
							</div>
							<div>
								<p class="font-bold">Address</p>
								<p class="text-muted-foreground">[Insert Your Actual Address Here]</p>
							</div>
						</div>
						<div class="flex gap-4">
							<div class="bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
								<PhoneIcon size={20} />
							</div>
							<div>
								<p class="font-bold">Phone</p>
								<p class="text-muted-foreground">+91 [Insert Phone Number]</p>
							</div>
						</div>
						<div class="flex gap-4">
							<div class="bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
								<ClockIcon size={20} />
							</div>
							<div>
								<p class="font-bold">Hours</p>
								<p class="text-muted-foreground">Mon - Sat: 10:00 AM - 8:00 PM</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div in:fly={{ x: 30, duration: 1000, easing: quartOut }} class="bg-muted border-border/20 relative aspect-video overflow-hidden rounded-2xl border shadow-md lg:aspect-auto">
				<!-- Map Placeholder -->
				<div class="flex h-full w-full items-center justify-center bg-linear-to-br from-primary/5 to-secondary/5">
					<div class="text-center">
						<MapPinIcon size={48} class="text-primary/20 mx-auto mb-4" />
						<p class="text-muted-foreground">Interactive Map Integration</p>
					</div>
				</div>
			</div>
		</div>
	{/if}
</section>
