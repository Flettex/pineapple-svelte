<script lang="ts">
  import ToastGroup from "$lib/components/toast/toastGroup.svelte";
  import "../app.css";
</script>

<main class="min-h-screen">
  <slot />
</main>

<ToastGroup />
