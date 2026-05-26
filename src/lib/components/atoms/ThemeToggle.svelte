<script lang="ts">
	// 1. Import the Bits UI component
	import { Switch } from 'bits-ui';
	import { MoonIcon, SunIcon } from 'lucide-svelte';
	import { toggleThemeWithTransition } from '$lib/utils/theme-view-transition';
	import { mode } from 'mode-watcher';

	// we need to capture the click event to know where the ripple starts
	let lastClickEvent: MouseEvent | null = null;

	function handleCheckedChange(checked: boolean) {
		// isDark = checked;
		const targetTheme = checked ? 'dark' : 'light';
		// Trigger our external transition function
		toggleThemeWithTransition(lastClickEvent, targetTheme);

		// Reset the event so keyboard toggles don't use old coordinates
		lastClickEvent = null;
	}
</script>

<div
	onpointerdown={(e) => (lastClickEvent = e)}
	onkeydown={() => (lastClickEvent = null)}
	role="presentation"
	style="display: contents;"
>
	<Switch.Root
		name="theme-toggle"
		value="theme-toggle"
		aria-label="Toggle theme"
		checked={mode.current === 'dark'}
		onCheckedChange={handleCheckedChange}
		class="
            peer inline-flex h-8 w-16 shrink-0 cursor-pointer items-center rounded-full
            border-2 border-transparent transition-colors duration-200 ease-in-out
            focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none
            data-[state=checked]:bg-primary
            data-[state=unchecked]:bg-input
        "
	>
		<Switch.Thumb
			class="
               group bg-background pointer-events-none relative flex h-7
               w-7 items-center justify-center rounded-full shadow-lg
			ring-0 transition-transform duration-200 ease-in-out

               data-[state=checked]:translate-x-8
               data-[state=unchecked]:translate-x-px"
		>
			<SunIcon
				class="
				text-foreground absolute flex scale-100 rotate-0
				items-center justify-center opacity-100 transition-all duration-300

				group-data-[state=checked]:scale-50
				group-data-[state=checked]:-rotate-90
				group-data-[state=checked]:opacity-0
				"
			/>

			<MoonIcon
				class="
				text-foreground absolute flex scale-50 rotate-90
				items-center justify-center opacity-0 transition-all duration-300

				group-data-[state=checked]:scale-100
				group-data-[state=checked]:rotate-0
				group-data-[state=checked]:opacity-100
				"
			/>
		</Switch.Thumb>
	</Switch.Root>
</div>
