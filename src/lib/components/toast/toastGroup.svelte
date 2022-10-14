<script lang="ts">
  import { toastStore } from "$lib/stores";
  import Toast from "./toast.svelte";
</script>

<div class="flex flex-col gap-1 fixed bottom-0 right-0 m-6 ">
  {#each $toastStore as toast, index}
    <Toast currentToast={toast} {index} />
  {/each}
</div>
