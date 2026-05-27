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

	const galleryItems = $derived([
		{ title: m.gallery_item_1_title(), desc: m.gallery_item_1_desc(), height: 'h-64', color: 'bg-primary/10' },
		{ title: m.gallery_item_2_title(), desc: m.gallery_item_2_desc(), height: 'h-96', color: 'bg-secondary/10' },
		{ title: m.gallery_item_3_title(), desc: m.gallery_item_3_desc(), height: 'h-80', color: 'bg-accent/10' },
		{ title: m.gallery_item_4_title(), desc: m.gallery_item_4_desc(), height: 'h-56', color: 'bg-destructive/10' },
		{ title: m.gallery_item_5_title(), desc: m.gallery_item_5_desc(), height: 'h-72', color: 'bg-muted/50' },
		{ title: m.gallery_item_6_title(), desc: m.gallery_item_6_desc(), height: 'h-80', color: 'bg-primary/5' },
		{ title: m.gallery_item_7_title(), desc: m.gallery_item_7_desc(), height: 'h-96', color: 'bg-secondary/5' },
		{ title: m.gallery_item_8_title(), desc: m.gallery_item_8_desc(), height: 'h-64', color: 'bg-accent/5' },
		{ title: m.gallery_item_9_title(), desc: m.gallery_item_9_desc(), height: 'h-72', color: 'bg-primary/10' },
		{ title: m.gallery_item_10_title(), desc: m.gallery_item_10_desc(), height: 'h-80', color: 'bg-secondary/10' }
	]);
</script>

<section id="gallery" bind:this={sectionRef} class="py-16 md:py-24 border-t border-border/10">
	{#if isVisible}
		<div class="mx-auto mb-16 max-w-2xl text-center">
			<h2 in:fly={{ y: 20, duration: 800 }} class="font-heading mb-4 text-3xl text-foreground md:text-5xl">
				<AnimatedText text={m.gallery_title()} />
			</h2>
			<p in:fly={{ y: 20, duration: 800, delay: 100 }} class="text-muted-foreground text-lg">
				<AnimatedText text={m.gallery_subtitle()} />
			</p>
		</div>

		<div class="masonry-grid">
			{#each galleryItems as item, i (item.title)}
				<div 
					in:fly={{ y: 40, duration: 1000, delay: i * 100, easing: quartOut }}
					class="masonry-item border-border/20 relative flex flex-col justify-end overflow-hidden rounded-2xl border transition-all duration-500 hover:scale-[1.02] hover:shadow-xl {item.height} {item.color}"
				>
					<div class="absolute inset-0 bg-linear-to-t from-foreground/80 via-foreground/20 to-transparent"></div>
					
					<!-- Decorative pattern for placeholder -->
					<div class="absolute inset-0 opacity-10" style="background-image: radial-gradient(currentColor 1px, transparent 1px); background-size: 20px 20px;"></div>

					<div class="relative z-10 p-8">
						<h3 class="text-background mb-1 text-2xl font-bold">
							<AnimatedText text={item.title} />
						</h3>
						<p class="text-background/70 text-sm">
							<AnimatedText text={item.desc} />
						</p>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</section>

<style>
	.masonry-grid {
		column-count: 1;
		column-gap: 1.5rem;
	}
	@media (min-width: 768px) {
		.masonry-grid {
			column-count: 2;
		}
	}
	@media (min-width: 1024px) {
		.masonry-grid {
			column-count: 3;
		}
	}
	.masonry-item {
		break-inside: avoid;
		margin-bottom: 1.5rem;
	}
</style>
