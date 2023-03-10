<script lang="ts">
  import { onMount } from "svelte";

  export let focusIndex: number = 0;
  let parent: HTMLDivElement;

  onMount(() => {
    Array.from(parent.children).forEach((child, index) => {
      child.addEventListener("click", () => {
        focusIndex = index;
      });
    });
  });

  $: {
    Array.from(parent?.children ?? []).forEach((child, index) => {
      if (index === focusIndex) {
        child.classList.remove("button-group-not-focused");
        child.classList.remove("not-after-focus");
      } else if (index === focusIndex + 1) {
        child.classList.add("button-group-not-focused")
        child.classList.remove("not-after-focus");
      } else {
        child.classList.add("button-group-not-focused");
        child.classList.add("not-after-focus");
      }
    });
  }
</script>

<div class="button-group" bind:this={parent}>
  <slot />
</div>

<style global>
  .button-group {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    background-color: rgb(230, 230, 230);
    border-radius: 5px;
    width: fit-content;
    height: fit-content;
    margin-top: 0.2rem;
    margin-bottom: 0.2rem;
  }

  .button-group-not-focused {
    background-color: transparent !important;
    border: 1px solid transparent !important;
    border-radius: 0 !important;
    box-shadow: 0 0 1px #ffffff !important;
  }

  /* don't need this, the buttons has default fallback to the button styles... */
  /* .button-group-not-focused:active {
    background-color: rgb(246, 246, 246);
    border: 1px solid lightgray;
    border-radius: 5px;
  } */

  .button-group > button:not(:first-child).not-after-focus {
    border-inline-start: 1px solid lightgray !important;
  }
  
  .button-group:first-child {
    border-inline-start: 1px solid transparent !important;
  }
</style>
