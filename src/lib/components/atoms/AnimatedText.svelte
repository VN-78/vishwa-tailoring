<script lang="ts">
	import DecryptedText from './DecryptedText.svelte';

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
	let currentText = $derived(typeof text === 'function' ? text() : text);
</script>

<DecryptedText
	text={currentText}
	{animateOn}
	class={className}
	encryptedClass={encryptedClass}
	{...rest}
/>
