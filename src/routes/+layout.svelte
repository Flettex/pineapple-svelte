<script lang="ts">
    import RouteLoading from "$lib/components/routeLoading.svelte";
    import SnackBarGroup from "$lib/components/snackbar/snackbarGroup.svelte";
    import "../styles/app.scss";

    import { browser } from '$app/environment';

    import { darkMode } from "$lib/stores";

    if (browser) {
        if (
            localStorage.theme === 'dark' ||
            (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
        ) {
            document.documentElement.classList.add('dark');
            darkMode.set(true)
        } else {
            document.documentElement.classList.remove('dark');
            darkMode.set(false);
        }
    }
</script>

<RouteLoading />
<main class="min-h-screen h-full">
  <slot />
</main>

<SnackBarGroup />
