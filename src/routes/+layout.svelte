<script lang="ts">
  import RouteLoading from "$lib/components/routeLoading.svelte";
  import SnackBarGroup from "$lib/components/snackbar/snackbarGroup.svelte";
  import "../styles/app.scss";
</script>

<RouteLoading />
<main class="min-h-screen">
  <slot />
</main>

<SnackBarGroup />
