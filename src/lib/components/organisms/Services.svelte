<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import AnimatedText from '../atoms/AnimatedText.svelte';
	import { fly, fade, scale } from 'svelte/transition';
	import { quartOut } from 'svelte/easing';
	import { onMount } from 'svelte';
	import designerImg from '../../assets/samples/designer blouse/designer.jpeg';
	import designerImg2 from '../../assets/samples/designer blouse/design2.jpeg';
	import patternImg from '../../assets/samples/pattern blouse/front.webp';
	import frockImg from '../../assets/samples/frocks/WhatsApp Image 2026-05-28 at 10.21.10 PM.jpeg';
	import embroidryImg from '../../assets/samples/embroidy/lightgreen.jpeg';
	import embroidryImg2 from '../../assets/samples/embroidy/lightgreen2.jpeg';
	import embroidryImg3 from '../../assets/samples/embroidy/WhatsApp Image 2026-05-28 at 10.17.01 PM.jpeg';
	import pavadaiImg from '../../assets/samples/pavadai/WhatsApp Image 2026-06-01 at 11.47.54 PM.jpeg';
	import type { LocalizedString } from '@inlang/paraglide-js';

	let isVisible = $state(false);
	let sectionRef: HTMLElement;

	type ServiceItem = {
		title: LocalizedString;
		desc: LocalizedString;
		images: string[];
	};

	const services = $derived([
		{ title: m.service_1_title(), desc: m.service_1_desc(), images: [designerImg, designerImg2] },
		{ title: m.service_2_title(), desc: m.service_2_desc(), images: [patternImg] },
		{ title: m.service_3_title(), desc: m.service_3_desc(), images: [pavadaiImg] },
		{ title: m.service_4_title(), desc: m.service_4_desc(), images: [frockImg] },
		{
			title: m.service_5_title(),
			desc: m.service_5_desc(),
			images: [embroidryImg, embroidryImg2, embroidryImg3]
		},
		{ title: m.service_6_title(), desc: m.service_6_desc(), images: [] }
	]);

	// NEW: State to track which service is currently expanded. Null means closed.
	let selectedService = $state<ServiceItem | null>(null);

	// NEW: Track the index of the currently viewed image
	let currentImageIndex = $state(0);

	// NEW: Wrapper function to open the modal and reset the index to 0
	function openModal(service: ServiceItem) {
		selectedService = service;
		currentImageIndex = 0;
	}

	// NEW: Navigation logic using the Modulo (%) operator for infinite looping
	function nextImage(e?: Event) {
		e?.stopPropagation(); // Prevent modal from closing
		if (selectedService) {
			currentImageIndex = (currentImageIndex + 1) % selectedService.images.length;
		}
	}

	function prevImage(e?: Event) {
		e?.stopPropagation();
		if (selectedService) {
			// Add the length before modulo to prevent negative numbers in JavaScript
			currentImageIndex =
				(currentImageIndex - 1 + selectedService.images.length) % selectedService.images.length;
		}
	}

	// NEW: Spatial math for the Coverflow effect
	function getPositionClass(index: number, total: number) {
		// Guard clause: If there is only 1 image, just center it.
		if (total === 1) return 'z-30 translate-x-0 scale-100 opacity-100';

		const diff = (index - currentImageIndex + total) % total;

		if (diff === 0) {
			// Center
			return 'z-30 translate-x-0 scale-100 opacity-100';
		} else if (diff === 1) {
			// Right side
			return 'z-20 translate-x-[90%] md:translate-x-[110%] scale-75 opacity-50 cursor-pointer hover:opacity-75';
		} else if (diff === total - 1) {
			// Left side
			return 'z-20 -translate-x-[90%] md:-translate-x-[110%] scale-75 opacity-50 cursor-pointer hover:opacity-75';
		} else if (diff === 2) {
			// Hidden in the right queue
			return 'z-10 translate-x-[180%] scale-50 opacity-0 pointer-events-none';
		} else {
			// Hidden in the left queue
			return 'z-10 -translate-x-[180%] scale-50 opacity-0 pointer-events-none';
		}
	}

	// NEW: Allow clicking the side images to rotate the carousel
	function handleCardClick(index: number, total: number) {
		const diff = (index - currentImageIndex + total) % total;
		if (diff === 1) nextImage();
		if (diff === total - 1) prevImage();
	}

	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					isVisible = true;
					observer.disconnect();
				}
			},
			{ threshold: 0.1 }
		);
		observer.observe(sectionRef);
		return () => observer.disconnect();
	});

	// UPDATE: Add ArrowLeft and ArrowRight keyboard controls
	function handleKeydown(event: KeyboardEvent) {
		if (!selectedService) return;

		if (event.key === 'Escape') selectedService = null;
		if (event.key === 'ArrowRight') nextImage();
		if (event.key === 'ArrowLeft') prevImage();
	}
</script>

<svelte:window onkeydown={handleKeydown} />
<section
	id="services"
	bind:this={sectionRef}
	class="relative my-8 rounded-3xl border border-border/10 bg-muted/30 px-4 py-16 shadow-sm md:px-12 md:py-24"
>
	{#if isVisible}
		<div class="mx-auto mb-16 max-w-2xl text-center">
			<h2
				in:fly={{ y: 20, duration: 800 }}
				class="mb-4 font-heading text-3xl text-foreground md:text-5xl"
			>
				<AnimatedText text={m.services_title()} />
			</h2>
			<p in:fly={{ y: 20, duration: 800, delay: 100 }} class="text-lg text-muted-foreground">
				<AnimatedText text={m.services_subtitle()} />
			</p>
		</div>

		<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#each services as service, i (service.title)}
				<div
					in:fly={{ y: 30, duration: 800, delay: 200 + i * 100, easing: quartOut }}
					onclick={() => openModal(service)}
					onkeydown={(e) => e.key === 'Enter' && openModal(service)}
					role="button"
					tabindex="0"
					class="group relative h-72 cursor-pointer overflow-hidden rounded-2xl border border-border/20 bg-background/50 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:bg-background hover:shadow-md"
				>
					<div
						class="absolute inset-0 flex items-center justify-center md:opacity-40 md:transition-opacity md:group-hover:opacity-80"
					>
						<div class="absolute inset-0 overflow-hidden">
							{#if service.images.length > 0}
								<img
									src={service.images[0]}
									alt={service.title as string}
									class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
								/>
							{/if}
						</div>
					</div>
					<div
						class="absolute inset-0 z-10 flex flex-col justify-end bg-linear-to-t from-background via-background/20 to-transparent p-8"
					>
						<h3
							class="mb-2 text-2xl font-bold text-foreground transition-colors group-hover:text-primary"
						>
							<AnimatedText text={service.title} />
						</h3>
						<p class="text-sm tracking-wider text-muted-foreground uppercase">
							<AnimatedText text={service.desc} />
						</p>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</section>

{#if selectedService}
	<div
		role="button"
		tabindex="0"
		transition:fade={{ duration: 200 }}
		onclick={() => (selectedService = null)}
		onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && (selectedService = null)}
		class="fixed inset-0 z-50 flex items-center justify-center bg-background/50 p-4 backdrop-blur-md sm:p-8"
	>
		<div
			role="dialog"
			tabindex="-1"
			aria-modal="true"
			transition:scale={{ duration: 300, start: 0.95, easing: quartOut }}
			onclick={(e) => e.stopPropagation()}
			onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && (selectedService = null)}
			class="relative flex w-full max-w-6xl flex-col items-center justify-center overflow-hidden rounded-3xl bg-transparent py-12 "
		>
			<button
				onclick={() => (selectedService = null)}
				aria-label="Close image"
				class="absolute top-4 right-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-colors hover:bg-black"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg
				>
			</button>

			<div class="mb-8 px-4 text-center">
				<h3 class="text-3xl font-bold text-foreground">
					<AnimatedText text={selectedService.title} />
				</h3>
				<p class="mt-2 text-muted-foreground">
					<AnimatedText text={selectedService.desc} />
				</p>
			</div>

			<div class="relative flex h-[50vh] w-full items-center justify-center">
				{#if selectedService.images.length > 1}
					<button
						onclick={prevImage}
						aria-label="Previous Image"
						class="absolute left-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-black/60 text-white shadow-lg backdrop-blur-sm transition-transform hover:scale-110 md:left-12"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"><path d="m15 18-6-6 6-6" /></svg
						>
					</button>
				{/if}

				{#each selectedService.images as imgUrl, i (imgUrl)}
                    <button 
                        onclick={() => handleCardClick(i, selectedService!.images.length)}
                        aria-label={`View image ${i + 1}`}
                        class="absolute h-[40vh] md:h-[55vh] aspect-video max-w-[85vw] cursor-pointer appearance-none border-none bg-transparent p-0 text-left transition-all duration-500 ease-in-out outline-none {getPositionClass(i, selectedService.images.length)}"
                    >
                        <img 
                            src={imgUrl} 
                            alt={`Gallery image ${i + 1}`} 
                            class="h-full w-full rounded-2xl border border-border/10 object-contain "
                        />
                    </button>
                {/each}

				{#if selectedService.images.length > 1}
					<button
						onclick={nextImage}
						aria-label="Next Image"
						class="absolute right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-black/60 text-white shadow-lg backdrop-blur-sm transition-transform hover:scale-110 md:right-12"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"><path d="m9 18 6-6-6-6" /></svg
						>
					</button>
				{/if}
			</div>

			{#if selectedService.images.length > 1}
				<div class="z-40 mt-8 flex gap-3">
					{#each selectedService.images as imgItem, i (i)}
						<button
							data-image={imgItem}
							onclick={() => (currentImageIndex = i)}
							aria-label={`Go to slide ${i + 1}`}
							class="h-2 rounded-full transition-all duration-300 {currentImageIndex === i
								? 'w-8 bg-primary'
								: 'w-2 bg-primary/30 hover:bg-primary/50'}"
						></button>
					{/each}
				</div>
			{/if}
		</div>
	</div>
{/if}
