To recreate this project with the same configuration:

```sh
# recreate this project
bun x sv@0.15.3 create --template minimal --types ts --add tailwindcss="plugins:typography,forms" prettier eslint --install bun svelte-template
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
# svelte-templete

this command is used to add the fonts 
```sh
bun add @fontsource/space-grotesk @fontsource/inter @fontsource/jetbrains-mono
```

# 🛠️ Core Tech Stack

  Framework: SvelteKit (Svelte 5 Snippets enabled)

  Styling: Tailwind CSS v4

  Typography: @fontsource (Inter, Space Grotesk, JetBrains Mono) natively mapped.

  Icons: Lucide Svelte (Shadcn native)

  Components: Shadcn-Svelte / Bits UI

  Theme Switching: mode-watcher with custom CSS View Transitions (Ripple effect).

  Scrolling: Lenis (Opt-in smooth scrolling via wrapper).

# 🎨 Theming & Customization

The entire design system is driven by src/app.css. You do not need to touch a single Shadcn component to change the look of the site.
Changing the Brand Color

Open src/app.css and locate the :root and .dark layers. Change the OKLCH values for --primary and --ring.

```css
/* Example: Changing from Purple to a vibrant Blue */
:root {
  --primary: oklch(0.6 0.15 250); 
  --ring: oklch(0.6 0.15 250); 
}
```

```bash
bun x shadcn-svelte@latest add switch
```

```bash
bun i @vercel/speed-insights
```
```
src/
└── lib/
    ├── utils.ts                 <-- Shadcn's utility functions (cn, etc.)
    └── components/
        │
        ├── ui/                  <-- [ THE VENDOR FOLDER ]
        │   ├── button/          <-- Shadcn CLI owns everything in here
        │   ├── switch/          <-- (Except the hacks we intentionally make)
        │   └── card/            
        │
        ├── atoms/               <-- [ YOUR CUSTOM ATOMS ]
        │   ├── ThemeToggle.svelte <-- Wrap Shadcn primitives here
        │   └── BiSyncLogo.svelte  <-- Custom SVGs or purely custom UI bits
        │
        ├── molecules/           <-- [ YOUR CUSTOM MOLECULES ]
        │   ├── SearchInput.svelte <-- (Combines Shadcn Input + Lucide Search Icon)
        │   └── UserAvatar.svelte  <-- (Combines Shadcn Avatar + Auth logic)
        │
        ├── organisms/           <-- [ YOUR CUSTOM ORGANISMS ]
        │   ├── GlobalHeader.svelte<-- (Combines Logo + SearchInput + ThemeToggle)
        │   └── DataChart.svelte   <-- (Combines Shadcn Chart + your API fetching logic)
        │
        └── templates/           <-- [ YOUR CUSTOM TEMPLATES ]
            ├── AuthLayout.svelte  <-- Reusable skeleton for login/signup pages
            └── DashboardLayout.svelte
```
### The Rules of Engagement

To keep this template clean and prevent dependency hell, follow these three strict rules:

Rule 1: Shadcn components only talk to other Shadcn components.
A Shadcn <Card> can import a Shadcn <Button>. But a Shadcn component should never import one of your custom components from the organisms folder. The dependency arrow only points one way: outward.

Rule 2: Wrap, don't pollute.
Let's take the ThemeToggle.svelte we just built. It uses the Shadcn Switch. You should save ThemeToggle.svelte inside src/lib/components/atoms/. You do not save it inside src/lib/components/ui/switch/.

Rule 3: Modifying Shadcn is allowed, renaming is not.
As we did with the switch.svelte file, you are allowed to open Shadcn files and hack them (adding Snippets, changing default Tailwind behavior). However, do not rename the files or move them out of the ui folder. If you rename button.svelte to MyButton.svelte, the next time you use the CLI to install a component that depends on a button (like a Dialog), the CLI will assume the button is missing and just download a fresh, un-hacked button.svelte right next to yours, creating a mess.
