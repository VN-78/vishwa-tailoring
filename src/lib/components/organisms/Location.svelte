<script lang="ts">
	import { MapPinIcon, PhoneIcon, ClockIcon, HouseIcon } from '@lucide/svelte';
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

<!-- testing dev branch -->

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
					<h3 class="text-4xl font-bold mb-12 flex items-center gap-2">
						<HouseIcon class="text-primary" />
						Visit Us
					</h3>
					<div class="space-y-6">
						<div class="flex gap-4 text-2xl">
							<div class="bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
								<MapPinIcon size={20} />
							</div>
							<div>
								<p class="font-bold">Address</p>
								<p class="text-muted-foreground">6, Rangaswamy St, Golden George Nagar, Mogappair East, Chennai, Tamil Nadu 600107</p>
							</div>
						</div>
						<div class="flex gap-4 text-2xl">
							<div class="bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
								<PhoneIcon size={20} />
							</div>
							<div>
								<p class="font-bold">Phone</p>
								<p class="text-muted-foreground">+91 8838510906</p>
							</div>
						</div>
						<div class="flex gap-4 text-2xl">
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
				<!-- Google Maps Embed -->
				<iframe
					title="Vishwa Tailoring Location on Google Maps"
					src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.4883134260387!2d80.17953257507577!3d13.080913987244588!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5266ab0e5e0cf7%3A0xe5a36378e99908cf!2s6%2C%20Rangaswamy%20St%2C%20Golden%20George%20Nagar%2C%20Mogappair%20East%2C%20Mogappair%2C%20Chennai%2C%20Tamil%20Nadu%20600107!5e0!3m2!1sen!2sin!4v1720347600000!5m2!1sen!2sin"
					class="absolute inset-0 h-full w-full border-0"
					allowfullscreen
					loading="lazy"
					referrerpolicy="no-referrer-when-downgrade"
				></iframe>
			</div>
		</div>
	{/if}
</section>
