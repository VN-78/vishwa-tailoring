<script lang="ts">
	import './layout.css';
	import icon from '../lib/assets/favicon.svg';
	import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';
	import { dev } from '$app/environment';
	import { injectAnalytics } from '@vercel/analytics/sveltekit';
	import { ModeWatcher } from 'mode-watcher';
	import BackgroundPattern from '$lib/components/molecules/BackgroundPattern.svelte';
	import FloatingWhatsApp from '$lib/components/molecules/FloatingWhatsApp.svelte';
	import { onNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import { overwriteGetLocale } from '$lib/paraglide/runtime.js';

	injectAnalytics({ mode: dev ? 'development' : 'production' });
	injectSpeedInsights();

	// Configure lenis
	import { onMount, type Snippet } from 'svelte';
	import Lenis from 'lenis';

	// import the scroll state store
	import { scrollState } from '$lib/stores/scroll.svelte';

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});

	onMount(() => {
		// Bulletproof Svelte 5 integration:
		// Link Paraglide's internal language detection directly to SvelteKit's URL state.
		// We do this in onMount to prevent hydration mismatches, ensuring the initial
		// client-side render matches the SSR output perfectly.
		overwriteGetLocale(() => (page.url.pathname.startsWith('/ta') ? 'ta' : 'en'));

		// Initialize Lenis
		const lenis = new Lenis({
			duration: 1.2,
			easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // standard smooth ease
			orientation: 'vertical',
			gestureOrientation: 'vertical',
			smoothWheel: true,
			wheelMultiplier: 1,
			touchMultiplier: 2,
			// IMPORTANT: Let the OS handle mobile touch.
			// This brings back the native Android/iOS edge stretch.
			syncTouch: false,

			// IMPORTANT: Allows Mac trackpads to trigger the native rubber-band
			overscroll: true
		});

		// Assignt the active instance to the global store
		scrollState.lenis = lenis;

		// Set up the Animation Frame Loop to keep Lenis ticking
		function raf(time: number) {
			lenis.raf(time);
			requestAnimationFrame(raf);
		}

		requestAnimationFrame(raf);

		// Crucial: Clean up the instance when the component is destroyed
		// to prevent memory leaks if navigating between SPA routes.
		return () => {
			lenis.destroy();
			// clean up the scroll state store when the app unmounts
			scrollState.lenis = null;
		};
	});

	let { children }: { children: Snippet } = $props();
</script>

<svelte:head>
	<link rel="icon" href={icon} />
</svelte:head>

<ModeWatcher />

<div class="relative min-h-screen overflow-hidden z-0">
	<BackgroundPattern />
	{@render children()}
	<FloatingWhatsApp />
</div>