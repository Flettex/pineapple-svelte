<script lang="ts">
  import { MAIN_CHANNEL } from "$lib/constants";
  import { selectedChannel, selectedGuild } from "$lib/stores";
</script>

<div class="flex flex-col">
  {#each $selectedGuild.channels || [] as c (c.id)}
    <button
      class="channel-tab"
      on:click={() => {
        selectedChannel.set(
          c ||
            MAIN_CHANNEL
        );
      }}
    >
      {c.name}
    </button>
  {/each}
</div>

<style lang="postcss">
    .channel-tab {
        @apply border border-black rounded-md m-1;
    }
</style>
