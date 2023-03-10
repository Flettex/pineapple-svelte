<script lang="ts">
  import type { IToast } from "$lib/stores";
  import { toastStore } from "$lib/stores";
  import { onMount } from "svelte";
  import { slide } from "svelte/transition";

  export let currentToast: IToast;
  // export let index: number;

  let activate = false;

  let defaultIcons: any = {
    success: "✔",
    error: "💀",
    info: "💡",
  };

  onMount(() => {
    setTimeout(() => {
      toastStore.update((state) => state.filter((toast) => toast.id !== currentToast.id));
    }, currentToast?.delay || 5000);

    activate = false;
    setTimeout(() => {
      activate = true;
    }, 200);
  });
</script>

<div
  class={`toast ${currentToast?.type || "info"}`}
  out:slide={{  }}
  on:click={() =>
    toastStore.update((state) => {
      return state.filter((toast) => {
        return toast.id !== currentToast.id;
      });
    })}
  class:active={activate}
>
  <!-- Use the built in slide transition for now -->
  <!-- We can use active to apply custom transitions-->
  <!-- {index} -->
  <!-- {currentToast.id} -->

  <div class="icon">
    {#if currentToast.icon}
      {currentToast.icon}
    {:else}
      {defaultIcons[currentToast.type ?? "info"]}
    {/if}
  </div>

  <p class="message">
    {currentToast.message}
  </p>
</div>

<style lang="postcss">
  .toast {
    border: none;
    @apply flex cursor-pointer opacity-0 invisible
           translate-x-80 transition-all ease-in-out z-[999];
  }

  .toast.active {
    @apply translate-x-0 visible opacity-100;
  }

  .toast.success {
    @apply bg-green-400;
  }

  .toast.error {
    @apply bg-red-500;
  }

  .toast.info {
    @apply bg-blue-400;
  }

  .icon {
    @apply text-white shadow-xl text-lg w-10 px-2 py-1 grid place-items-center bg-black bg-opacity-80;
  }

  .message {
    @apply bg-black bg-opacity-50 text-white shadow-xl p-4 hover:line-through;
  }
</style>
