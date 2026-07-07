<script lang="ts">
	import {
		HouseIcon,
		UserRoundPenIcon,
		ScissorsIcon,
		MapPinIcon,
		LanguagesIcon,
		MenuIcon
	} from '@lucide/svelte';
	import ThemeToggle from '../atoms/ThemeToggle.svelte';
	import AnimatedText from '../atoms/AnimatedText.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import { getLocale, localizeHref } from '$lib/paraglide/runtime.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { page } from '$app/state';
	import { crossfade } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

	let scrollY = $state(0);
	let isScrolled = $derived(scrollY > 50);
	let activeSection = $state('home');
	let isMobileMenuOpen = $state(false);

	// Set up the crossfade animation
	const [send, receive] = crossfade({
		duration: 300,
		easing: cubicOut
	});

	$effect(() => {
		// If at the very top, always show home as active
		if (scrollY < 100) {
			activeSection = 'home';
			return;
		}

		const sections = document.querySelectorAll('section[id]');
		const observer = new IntersectionObserver(
			(entries) => {
				// Find the section with the most intersection
				const intersecting = entries
					.filter((e) => e.isIntersecting)
					.sort((a, b) => b.intersectionRatio - a.intersectionRatio);

				if (intersecting.length > 0) {
					activeSection = intersecting[0].target.id;
				}
			},
			{
				threshold: [0.1, 0.5, 0.8],
				rootMargin: '-20% 0px -60% 0px' // Focus on the upper-middle part of the viewport
			}
		);
		sections.forEach((section) => observer.observe(section));
		return () => {
			sections.forEach((section) => observer.unobserve(section));
			observer.disconnect();
		};
	});

	// These are now reactive because getLocale() is linked to page.url
	let currentLocale = $derived(getLocale());
	let nextLocale = $derived(currentLocale === 'en' ? 'ta' : ('en' as 'en' | 'ta'));
	let nextLocaleUrl = $derived(localizeHref(page.url.pathname, { locale: nextLocale }));

	// Force re-deriving links when locale changes
	const navLinks = $derived.by(() => {
		void currentLocale;
		return [
			{ id: 'home', icon: HouseIcon, label: m.nav_home() },
			{ id: 'about', icon: UserRoundPenIcon, label: m.nav_about() },
			{ id: 'services', icon: ScissorsIcon, label: m.nav_services() },
			{ id: 'location', icon: MapPinIcon, label: m.nav_location() }
		];
	});
</script>

<svelte:window bind:scrollY />

<!-- Desktop Header -->
<header class="pointer-events-none fixed top-0 left-0 z-50 hidden w-full pt-4 md:block md:px-8">
	<div class="max-w-8xl mx-auto flex w-full items-center justify-between px-4 md:px-24 lg:px-32">
		<nav
			class="pointer-events-auto mx-auto flex h-14 w-full items-center justify-between overflow-hidden rounded-full px-6 transition-all duration-300 ease-in-out lg:px-8 {isScrolled
				? 'border border-border bg-background/80 shadow-lg backdrop-blur-md'
				: 'border-transparent bg-background shadow-none'}"
		>
			<div class="flex items-center justify-start pr-4">
				<a href="#home" class="font-heading text-xl font-bold tracking-tight text-foreground">
					<AnimatedText text={m.brand_name()} />
				</a>
			</div>

			<div class="flex shrink-0 items-center justify-center gap-2 lg:gap-4">
				{#each navLinks as link (link.id)}
					<a
						href="#{link.id}"
						class="group relative flex items-center justify-center rounded-md px-3 py-2 font-mono text-sm transition-colors {activeSection ===
						link.id
							? ' font-medium text-foreground'
							: 'text-muted-foreground hover:bg-foreground/5 hover:text-foreground'}"
					>
						<AnimatedText text={link.label} />

						{#if activeSection === link.id}
							<span
								in:receive={{ key: 'nav-underline' }}
								out:send={{ key: 'nav-underline' }}
								class="absolute -bottom-1 left-0 h-0.5 w-full rounded-full bg-primary"
							></span>
						{/if}
					</a>
				{/each}
			</div>

			<div class="flex items-center justify-end gap-2 pl-4">
				<!-- Using data-sveltekit-reload to ensure clean state and animation trigger -->
				<Button
					variant="ghost"
					size="sm"
					href={nextLocaleUrl}
					data-sveltekit-reload
					class="flex items-center gap-2 font-mono text-xs"
				>
					<LanguagesIcon size={16} />
					<AnimatedText text={m.switch_language()} />
				</Button>
				<ThemeToggle />
			</div>
		</nav>
	</div>
</header>

<!-- Mobile Header -->
<header class="pointer-events-none fixed top-0 left-0 z-50 w-full px-2 pt-2 md:hidden">
	<nav
		class="pointer-events-auto mx-auto flex h-14 items-center justify-between overflow-hidden rounded-full border border-border/20 bg-background/70 px-4 shadow-lg backdrop-blur-md transition-all duration-300 {isMobileMenuOpen
			? 'rounded-b-none border-b-0'
			: ''}"
	>
		<div class="flex items-center justify-start">
			<a
				href="#home"
				class="font-heading text-xl font-bold tracking-tight text-foreground"
				onclick={() => (isMobileMenuOpen = false)}
			>
				<AnimatedText text={m.brand_name()} />
			</a>
		</div>

		<div class="flex items-center justify-end gap-2">
			<Button variant="ghost" size="icon" href={nextLocaleUrl} data-sveltekit-reload>
				<LanguagesIcon size={18} />
			</Button>
			<ThemeToggle />
			<Button variant="ghost" size="icon" onclick={() => (isMobileMenuOpen = !isMobileMenuOpen)}>
				<MenuIcon size={24} />
			</Button>
		</div>
	</nav>

	{#if isMobileMenuOpen}
		<div
			class="pointer-events-auto mx-auto rounded-b-2xl border border-t-0 border-border/20 bg-background/95 px-4 py-4 shadow-xl backdrop-blur-md transition-all"
		>
			<div class="flex flex-col gap-4">
				{#each navLinks as link (link.id)}
					<a
						href="#{link.id}"
						onclick={() => (isMobileMenuOpen = false)}
						class="flex items-center gap-4 text-base font-medium transition-colors hover:text-primary {activeSection ===
						link.id
							? 'text-foreground'
							: 'text-muted-foreground'}"
					>
						<link.icon size={20} />
						<AnimatedText text={link.label} />
					</a>
				{/each}
			</div>
		</div>
	{/if}
</header>
