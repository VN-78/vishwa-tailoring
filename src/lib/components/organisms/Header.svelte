<script lang="ts">
	import { HouseIcon, UserRoundPenIcon, ScissorsIcon, ImageIcon, MapPinIcon, LanguagesIcon, MenuIcon, MessageCircleIcon } from '@lucide/svelte';
	import ThemeToggle from '../atoms/ThemeToggle.svelte';
	import AnimatedText from '../atoms/AnimatedText.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import { getLocale, localizeHref } from '$lib/paraglide/runtime.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import { page } from '$app/stores';

	let scrollY = $state(0);
	let scrollProgress = $derived(Math.min(scrollY / 150, 1));
	let navWidth = $derived(100 - 45 * scrollProgress);
	let navTop = $derived(16 * scrollProgress);
	let navRadius = $derived(9999 * scrollProgress);
	let isScrolled = $derived(scrollY > 50);

	let activeSection = $state('home');

	$effect(() => {
		const sections = document.querySelectorAll('section[id]');
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						activeSection = entry.target.id;
					}
				});
			},
			{ threshold: 0.5, rootMargin: '-100px 0px 0px 0px' }
		);
		sections.forEach((section) => observer.observe(section));
		return () => {
			sections.forEach((section) => observer.unobserve(section));
			observer.disconnect();
		};
	});

	let currentLocale = $derived(getLocale());
	let nextLocale = $derived(currentLocale === 'en' ? 'ta' : 'en' as "en" | "ta");
	let nextLocaleUrl = $derived($page?.url?.pathname ? localizeHref($page.url.pathname, { locale: nextLocale }) : '/');

	const navLinks = $derived([
		{ id: 'home', icon: HouseIcon, label: m.nav_home() },
		{ id: 'about', icon: UserRoundPenIcon, label: m.nav_about() },
		{ id: 'services', icon: ScissorsIcon, label: m.nav_services() },
		{ id: 'gallery', icon: ImageIcon, label: m.nav_gallery() },
		{ id: 'location', icon: MapPinIcon, label: m.nav_location() }
	]);
</script>

<svelte:window bind:scrollY />

<header class="pointer-events-none fixed top-0 left-0 z-50 w-full md:px-8">
	<div class="max-w-8xl mx-auto flex w-full items-center justify-between px-4 md:px-24 lg:px-32">
		<nav
			class="pointer-events-auto mx-auto flex h-14 max-w-full min-w-max items-center overflow-hidden px-6 transition-all duration-75 ease-linear lg:px-8 {isScrolled ? 'border-border bg-background/80 shadow-lg backdrop-blur-md' : 'bg-background border-transparent shadow-none'}"
			style="width: {navWidth}%; margin-top: {navTop}px; border-radius: {navRadius}px; border-width: 1px;"
		>
			<div class="flex flex-1 basis-0 items-center justify-start pr-4">
				<a href="#home" class="text-foreground font-heading text-xl font-bold tracking-tight">
					<AnimatedText text={m.brand_name()} />
				</a>
			</div>

			<!-- Desktop Nav -->
			<div class="hidden shrink-0 items-center justify-center gap-4 md:flex lg:gap-6">
				{#each navLinks as link (link.id)}
					<a
						href="#{link.id}"
						class="group hover:text-primary flex items-center gap-2 font-mono text-sm transition-colors {activeSection === link.id ? 'text-foreground' : 'text-muted-foreground'}"
					>
						<span class="bg-primary h-2 w-2 rounded-full transition-transform duration-300 {activeSection === link.id ? 'w-2 scale-100' : 'w-0 scale-0'}"></span>
						<AnimatedText text={link.label} />
					</a>
				{/each}
			</div>

			<div class="flex flex-1 basis-0 items-center justify-end gap-2 pl-4">
				<div class="hidden md:flex gap-2">
					<Button variant="ghost" size="sm" href={nextLocaleUrl} data-sveltekit-reload class="flex items-center gap-2 font-mono text-xs">
						<LanguagesIcon size={16} />
						<AnimatedText text={m.switch_language()} />
					</Button>
					<Button variant="default" size="sm" href="https://wa.me/" class="flex items-center gap-2">
						<MessageCircleIcon size={16} />
						<span class="hidden lg:inline"><AnimatedText text={m.whatsapp_chat()} /></span>
					</Button>
					<ThemeToggle />
				</div>

				<!-- Mobile Menu Trigger -->
				<div class="flex md:hidden items-center gap-2">
					<ThemeToggle />
					<Sheet.Root>
						<Sheet.Trigger>
							<Button variant="ghost" size="icon">
								<MenuIcon size={24} />
							</Button>
						</Sheet.Trigger>
						<Sheet.Content side="right" class="w-75 sm:w-100">
							<Sheet.Header>
								<Sheet.Title>
									<AnimatedText text={m.brand_name()} />
								</Sheet.Title>
							</Sheet.Header>
							<div class="flex flex-col gap-6 py-8">
								{#each navLinks as link (link.id)}
									<a
										href="#{link.id}"
										class="flex items-center gap-4 text-lg font-medium transition-colors hover:text-primary {activeSection === link.id ? 'text-foreground' : 'text-muted-foreground'}"
									>
										<link.icon size={24} />
										<AnimatedText text={link.label} />
									</a>
								{/each}
								<div class="mt-4 flex flex-col gap-4 border-t pt-6">
									<Button variant="outline" href={nextLocaleUrl} data-sveltekit-reload class="w-full justify-start gap-4">
										<LanguagesIcon size={20} />
										<AnimatedText text={m.switch_language()} />
									</Button>
									<Button variant="default" href="https://wa.me/" class="w-full justify-start gap-4">
										<MessageCircleIcon size={20} />
										<AnimatedText text={m.whatsapp_chat()} />
									</Button>
								</div>
							</div>
						</Sheet.Content>
					</Sheet.Root>
				</div>
			</div>
		</nav>
	</div>
</header>
