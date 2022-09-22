<script lang="ts">
  export let checked: boolean;
</script>

<label>
  <input type="checkbox" bind:checked {...$$restProps} />
  <slot />
</label>

<style>
  input[type="checkbox"] {
    border-radius: 4px;
    border: 10px solid white;
  }
</style>
