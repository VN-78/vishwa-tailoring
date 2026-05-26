<script lang="ts">
	import DecryptedText from './DecryptedText.svelte';
	import { i18nState } from '$lib/i18n-state.svelte.js';

	interface Props {
		text: string | (() => string);
		animateOn?: 'view' | 'hover' | 'inViewHover' | 'click' | 'direct';
		class?: string;
		encryptedClass?: string;
		[key: string]: unknown;
	}

	let {
		text,
		animateOn = 'direct',
		class: className = '',
		encryptedClass = 'opacity-50',
		...rest
	}: Props = $props();

	// If text is a function (like a paraglide message), call it
	// We wrap it in a derived to ensure it re-evaluates when i18nState.current changes
	let currentText = $derived.by(() => {
		// Accessing i18nState.current here makes this derived reactive to language changes
		const _ = i18nState.current;
		return typeof text === 'function' ? text() : text;
	});
	
	// Track language changes reactively to re-trigger the "direct" animation
	let currentLang = $derived(i18nState.current);
</script>

{#key currentLang}
	<DecryptedText
		text={currentText}
		{animateOn}
		class={className}
		encryptedClass={encryptedClass}
		{...rest}
	/>
{/key}
