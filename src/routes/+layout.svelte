<script lang="ts">
  import RouteLoading from "$lib/components/routeLoading.svelte";
  import SnackBarGroup from "$lib/components/snackbar/snackbarGroup.svelte";
  import "../styles/app.scss";

  import { browser } from '$app/environment';

  let darkMode = true;

  function handleSwitchDarkMode() {
      darkMode = !darkMode;

      localStorage.setItem('theme', darkMode ? 'dark' : 'light');

      darkMode
          ? document.documentElement.classList.add('dark')
          : document.documentElement.classList.remove('dark');
  }

  if (browser) {
      if (
          localStorage.theme === 'dark' ||
          (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
      ) {
          document.documentElement.classList.add('dark');
          darkMode = true;
      } else {
          document.documentElement.classList.remove('dark');
          darkMode = false;
      }
  }
</script>

<RouteLoading />
<main class="min-h-screen h-full">
  <slot />
</main>

<SnackBarGroup />
