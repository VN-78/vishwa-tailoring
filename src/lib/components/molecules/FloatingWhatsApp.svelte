<script lang="ts">
	import { MessageCircleIcon } from '@lucide/svelte';
	import * as m from '$lib/paraglide/messages.js';
	import AnimatedText from '../atoms/AnimatedText.svelte';
</script>

<div class="fixed bottom-6 right-6 z-50 md:bottom-10 md:right-10 flex items-center justify-center">
	<!-- Strobing / Ping Animation Ring -->
	<div class="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75"></div>

	<!-- Actual Button -->
	<a 
		href="https://wa.me/" 
		target="_blank" 
		rel="noopener noreferrer"
		class="relative inline-flex h-14 w-14 md:w-auto md:px-6 items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition-transform duration-300 hover:scale-110 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
		aria-label={m.whatsapp_chat()}
	>
		<MessageCircleIcon size={28} />
		<span class="hidden md:inline font-bold ml-2 text-lg"><AnimatedText text={m.chat_with_us()} /></span>
	</a>
</div>