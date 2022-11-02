<script lang="ts">
  import RouteLoading from "$lib/components/routeLoading.svelte";
  import ToastGroup from "$lib/components/toast/toastGroup.svelte";
  import "../app.css";
</script>

<RouteLoading />
<main class="min-h-screen">
  <slot />
</main>

<ToastGroup />
