<script lang="ts">
  import { toastStore } from "$lib/stores";
  import Toast from "./snackbar.svelte";
</script>

<div class="flex flex-col gap-1 fixed bottom-0 right-0 m-6 ">
  {#each $toastStore as toast (toast.id)}
    <Toast currentToast={toast} />
  {/each}
</div>
