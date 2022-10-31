<script lang="ts">
  export let disabled: boolean = false;
</script>

<!-- <div class="flex justify-center items-center content-center"> -->
<button
  on:click
  on:focus
  on:mouseover
  on:mouseenter
  on:mouseleave
  {...$$restProps}
  disabled={disabled}
  class:enabled={!disabled}
  class:disabled={disabled}
>
  <slot />
</button>

<!-- </div> -->
<style lang="postcss">
  button {
    padding-top: 0.1em;
    padding-bottom: 0.2em;
    padding-left: 0.9em;
    padding-right: 0.9em;
    font-size: 12px;
    cursor: pointer;
    border-radius: 5px;
  }

  button.enabled {
    background-color: white;
    border: 1px solid lightgray;
    box-shadow: 0 0 0.5px lightgray;
  }
  button.enabled:active {
    background-color: rgb(246, 246, 246);
    border: 1px solid gray;
  }

  button.disabled {
    background-color: transparent;
    border: 1px solid transparent;
    box-shadow: 0 0 1px #ffffff;
  }
  button.disabled:active {
    background-color: rgb(246, 246, 246);
    border: 1px solid lightgray;
  }
</style>
