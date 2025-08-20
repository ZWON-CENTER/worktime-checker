<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import * as NavigationMenu from '$lib/components/ui/navigation-menu';
	import { page } from '$app/stores';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div
	class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900"
>
	<!-- Navigation Header -->
	<header class="border-b bg-white/80 backdrop-blur-sm dark:bg-slate-950/80">
		<div class="container mx-auto px-4 py-4">
			<NavigationMenu.Root class="relative z-10 flex max-w-max flex-1 items-center justify-center">
				<NavigationMenu.List
					class="group flex flex-1 list-none items-center justify-center space-x-1"
				>
					<NavigationMenu.Item>
						<NavigationMenu.Link
							href="/"
							class="group inline-flex h-10 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-slate-100 hover:text-slate-900 focus:bg-slate-100 focus:text-slate-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 dark:bg-slate-950 dark:hover:bg-slate-800 dark:hover:text-slate-50 dark:focus:bg-slate-800 dark:focus:text-slate-50 {$page
								.url.pathname === '/'
								? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-50'
								: 'text-slate-600 dark:text-slate-400'}"
						>
							근로시간 체크
						</NavigationMenu.Link>
					</NavigationMenu.Item>
					<NavigationMenu.Item>
						<NavigationMenu.Link
							href="/work-schedule"
							class="group inline-flex h-10 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-slate-100 hover:text-slate-900 focus:bg-slate-100 focus:text-slate-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 dark:bg-slate-950 dark:hover:bg-slate-800 dark:hover:text-slate-50 dark:focus:bg-slate-800 dark:focus:text-slate-50 {$page
								.url.pathname === '/work-schedule'
								? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-50'
								: 'text-slate-600 dark:text-slate-400'}"
						>
							퇴근 시간 계산
						</NavigationMenu.Link>
					</NavigationMenu.Item>
				</NavigationMenu.List>
			</NavigationMenu.Root>
		</div>
	</header>

	<!-- Main Content -->
	<main>
		{@render children?.()}
	</main>
</div>
