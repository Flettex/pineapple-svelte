<script lang="ts">
  export const enabled: boolean = true;
</script>

<div class="flex justify-center items-center content-center">
<button
  on:click
  on:focus
  on:mouseover
  on:mouseenter
  on:mouseleave
  {...$$restProps}
  class="{$$restProps.class ?? ""} {enabled ? "enabled" : "disabled"}"
>
  <slot />
</button>
</div>

<style>
  button {
    padding-top: 0.1em;
    padding-bottom: 0.2em;
    padding-left: 0.9em;
    padding-right: 0.9em;
    font-size: 12px;
    cursor: pointer;
    border-radius: 5px;
  }

  .enabled {
    background-color: white;
    border: 1px solid lightgray;
    box-shadow: 0 0 0.5px lightgray;
  }
  .enabled:active {
    background-color: rgb(246, 246, 246);
    border: 1px solid gray;
  }

  .disabled {
    background-color: transparent;
    border: 1px solid transparent;
    box-shadow: 0 0 1px #ffffff;
  }
  .disabled:active {
    background-color: rgb(246, 246, 246);
    border: 1px solid lightgray;
  }
</style>
