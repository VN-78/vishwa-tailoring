<script lang="ts">
	import { onMount, type Component } from 'svelte';
	import { Scissors, Spool, Rose } from 'lucide-svelte';
	import Needle from '../atoms/icons/Needle.svelte';
	import ButtonIcon from '../atoms/icons/Button.svelte';
	import Pin from '../atoms/icons/Pin.svelte';
	import TapeMeasure from '../atoms/icons/TapeMeasure.svelte';

	interface IconInstance {
		id: number;
		component: Component<{ size?: number; class?: string }>;
		style: string;
		size: number;
	}

	let icons: IconInstance[] = $state([]);

	const iconPool = [
		Scissors,
		Spool,
		Rose,
		Needle,
		ButtonIcon,
		Pin,
		TapeMeasure
	];

	onMount(() => {
		const newIcons: IconInstance[] = [];
		const rows = 6;
		const cols = 6;
		let idCounter = 0;

		// Using a grid-based approach with jitter to prevent overcrowding/overlaps
		for (let r = 0; r < rows; r++) {
			for (let c = 0; c < cols; c++) {
				// Base position on grid
				const baseTop = (r / rows) * 100;
				const baseLeft = (c / cols) * 100;

				// Add significant jitter within the grid cell
				const jitterTop = (Math.random() * (100 / rows)) * 0.8;
				const jitterLeft = (Math.random() * (100 / cols)) * 0.8;

				const top = baseTop + jitterTop;
				const left = baseLeft + jitterLeft;

				const rotation = Math.random() * 360;
				const scale = 0.6 + Math.random() * 1.2;
				const size = 24 * scale;
				const opacity = 0.03 + Math.random() * 0.05;

				newIcons.push({
					id: idCounter++,
					component: iconPool[Math.floor(Math.random() * iconPool.length)] as Component<{ size?: number; class?: string }>,
					style: `top: ${top}%; left: ${left}%; transform: rotate(${rotation}deg); opacity: ${opacity};`,
					size
				});
			}
		}

		// Shuffle to break any perceived grid patterns
		icons = newIcons.sort(() => Math.random() - 0.5);
	});
</script>

<div class="absolute inset-0 -z-10 pointer-events-none overflow-hidden select-none" aria-hidden="true">
	{#each icons as icon (icon.id)}
		<div class="absolute text-foreground transition-colors duration-500" style={icon.style}>
			<icon.component size={icon.size} />
		</div>
	{/each}
</div>

