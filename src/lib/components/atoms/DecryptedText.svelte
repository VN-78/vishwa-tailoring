<script lang="ts">
	import { onMount,} from 'svelte';
	import { SvelteSet } from 'svelte/reactivity';

	interface Props {
		text: string;
		speed?: number;
		maxIterations?: number;
		sequential?: boolean;
		revealDirection?: 'start' | 'end' | 'center';
		useOriginalCharsOnly?: boolean;
		characters?: string;
		class?: string;
		encryptedClass?: string;
		parentClass?: string;
		animateOn?: 'view' | 'hover' | 'inViewHover' | 'click' | 'direct';
		clickMode?: 'once' | 'toggle';
		triggerAnimation?: boolean; // New prop to manually trigger
	}

	let {
		text,
		speed = 50,
		maxIterations = 10,
		sequential = false,
		revealDirection = 'start',
		useOriginalCharsOnly = false,
		characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+',
		class: className = '',
		parentClass = '',
		encryptedClass = '',
		animateOn = 'hover',
		clickMode = 'once',
		triggerAnimation = false,
		...props
	}: Props = $props();

	let displayText = $state('');
	let isAnimating = $state(false);
	let revealedIndices = new SvelteSet<number>();
	let hasAnimated = $state(false);
	let isDecrypted = $state(true);
	let direction = $state<'forward' | 'reverse'>('forward');

	let containerRef = $state<HTMLElement | null>(null);
	let orderRef: number[] = [];
	let pointerRef = 0;
	let intervalId: ReturnType<typeof setInterval> | null = null;

	const availableChars = $derived.by(() => {
		return useOriginalCharsOnly
			? Array.from(new Set(text.split(''))).filter((char) => char !== ' ')
			: characters.split('');
	});

	function shuffleText(originalText: string, currentRevealed: Set<number> | SvelteSet<number>) {
		return originalText
			.split('')
			.map((char, i) => {
				if (char === ' ') return ' ';
				if (currentRevealed.has(i)) return originalText[i];
				return availableChars[Math.floor(Math.random() * availableChars.length)];
			})
			.join('');
	}

	function computeOrder(len: number): number[] {
		const order: number[] = [];
		if (len <= 0) return order;
		if (revealDirection === 'start') {
			for (let i = 0; i < len; i++) order.push(i);
			return order;
		}
		if (revealDirection === 'end') {
			for (let i = len - 1; i >= 0; i--) order.push(i);
			return order;
		}
		// center
		const middle = Math.floor(len / 2);
		let offset = 0;
		while (order.length < len) {
			if (offset % 2 === 0) {
				const idx = middle + offset / 2;
				if (idx >= 0 && idx < len) order.push(idx);
			} else {
				const idx = middle - Math.ceil(offset / 2);
				if (idx >= 0 && idx < len) order.push(idx);
			}
			offset++;
		}
		return order.slice(0, len);
	}

	function encryptInstantly() {
		revealedIndices.clear();
		displayText = shuffleText(text, revealedIndices);
		isDecrypted = false;
	}

	function triggerDecrypt() {
		if (sequential) {
			orderRef = computeOrder(text.length);
			pointerRef = 0;
		}
		revealedIndices.clear();
		direction = 'forward';
		isAnimating = true;
	}

	function triggerReverse() {
		if (sequential) {
			orderRef = computeOrder(text.length).slice().reverse();
			pointerRef = 0;
			revealedIndices.clear();
			for (let i = 0; i < text.length; i++) revealedIndices.add(i);
			displayText = shuffleText(text, revealedIndices);
		} else {
			revealedIndices.clear();
			for (let i = 0; i < text.length; i++) revealedIndices.add(i);
			displayText = shuffleText(text, revealedIndices);
		}
		direction = 'reverse';
		isAnimating = true;
	}

	function getNextIndex(revealedSet: SvelteSet<number>): number {
		const textLength = text.length;
		switch (revealDirection) {
			case 'start':
				return revealedSet.size;
			case 'end':
				return textLength - 1 - revealedSet.size;
			case 'center': {
				const middle = Math.floor(textLength / 2);
				const offset = Math.floor(revealedSet.size / 2);
				const nextIndex = revealedSet.size % 2 === 0 ? middle + offset : middle - offset - 1;

				if (nextIndex >= 0 && nextIndex < textLength && !revealedSet.has(nextIndex)) {
					return nextIndex;
				}
				for (let i = 0; i < textLength; i++) {
					if (!revealedSet.has(i)) return i;
				}
				return 0;
			}
			default:
				return revealedSet.size;
		}
	}

	$effect(() => {
		if (!isAnimating) return;

		let currentIteration = 0;

		intervalId = setInterval(() => {
			if (sequential) {
				if (direction === 'forward') {
					if (revealedIndices.size < text.length) {
						const nextIndex = getNextIndex(revealedIndices);
						revealedIndices.add(nextIndex);
						displayText = shuffleText(text, revealedIndices);
					} else {
						clearInterval(intervalId!);
						isAnimating = false;
						isDecrypted = true;
					}
				} else if (direction === 'reverse') {
					if (pointerRef < orderRef.length) {
						const idxToRemove = orderRef[pointerRef++];
						revealedIndices.delete(idxToRemove);
						displayText = shuffleText(text, revealedIndices);
						if (revealedIndices.size === 0) {
							clearInterval(intervalId!);
							isAnimating = false;
							isDecrypted = false;
						}
					} else {
						clearInterval(intervalId!);
						isAnimating = false;
						isDecrypted = false;
					}
				}
			} else {
				if (direction === 'forward') {
					displayText = shuffleText(text, revealedIndices);
					currentIteration++;
					if (currentIteration >= maxIterations) {
						clearInterval(intervalId!);
						isAnimating = false;
						displayText = text;
						isDecrypted = true;
					}
				} else if (direction === 'reverse') {
					if (revealedIndices.size === 0) {
						for (let i = 0; i < text.length; i++) revealedIndices.add(i);
					}
					const removeCount = Math.max(1, Math.ceil(text.length / Math.max(1, maxIterations)));
					const arr = Array.from(revealedIndices);
					for (let i = 0; i < removeCount && arr.length > 0; i++) {
						const idx = Math.floor(Math.random() * arr.length);
						const [removed] = arr.splice(idx, 1);
						revealedIndices.delete(removed);
					}
					
					displayText = shuffleText(text, revealedIndices);
					currentIteration++;
					if (revealedIndices.size === 0 || currentIteration >= maxIterations) {
						clearInterval(intervalId!);
						isAnimating = false;
						isDecrypted = false;
						revealedIndices.clear();
						displayText = shuffleText(text, revealedIndices);
					}
				}
			}
		}, speed);

		return () => clearInterval(intervalId!);
	});

	function handleClick() {
		if (animateOn !== 'click') return;
		if (clickMode === 'once') {
			if (isDecrypted) return;
			triggerDecrypt();
		} else if (clickMode === 'toggle') {
			if (isDecrypted) triggerReverse();
			else triggerDecrypt();
		}
	}

	function handleMouseEnter() {
		if (animateOn === 'hover' || animateOn === 'inViewHover') {
			triggerDecrypt();
		}
	}

	function handleMouseLeave() {
		if (animateOn === 'hover' || animateOn === 'inViewHover') {
			clearInterval(intervalId!);
			isAnimating = false;
			revealedIndices.clear();
			displayText = text;
			isDecrypted = true;
			direction = 'forward';
		}
	}

	$effect(() => {
		if (animateOn !== 'view' && animateOn !== 'inViewHover') return;
		if (!containerRef) return;

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting && !hasAnimated) {
						triggerDecrypt();
						hasAnimated = true;
					}
				});
			},
			{ threshold: 0.1 }
		);

		observer.observe(containerRef);
		return () => observer.disconnect();
	});

	// Sync local state when props change
	$effect(() => {
		const currentText = text;
		const currentAnimateOn = animateOn;

		if (currentAnimateOn === 'click') {
			encryptInstantly();
		} else if (currentAnimateOn === 'direct') {
			triggerDecrypt();
		} else {
			displayText = currentText;
			isDecrypted = true;
		}
		revealedIndices.clear();
		direction = 'forward';
	});

	// Handle external trigger prop
	$effect(() => {
		if (triggerAnimation) {
			triggerDecrypt();
		}
	});

	onMount(() => {
		if (animateOn === 'click') {
			encryptInstantly();
		}
	});
</script>

<span
	bind:this={containerRef}
	class="inline-block whitespace-pre-wrap {parentClass}"
	onmouseenter={handleMouseEnter}
	onmouseleave={handleMouseLeave}
	onclick={handleClick}
	role="presentation"
	{...props}
>
	<span class="sr-only">{text}</span>

	<span aria-hidden="true">
		{#each displayText.split('') as char, index (index + '-' + char)}
			{@const isRevealedOrDone = revealedIndices.has(index) || (!isAnimating && isDecrypted)}
			<span class={isRevealedOrDone ? className : encryptedClass}>
				{char}
			</span>
		{/each}
	</span>
</span>
