<script lang="ts">
  import { MAIN_CHANNEL, MAIN_GUILD } from "$lib/constants";
  import { selectedChannel, selectedGuild, userData } from "$lib/stores";
</script>

<div>
  <button
  class="guild-tab"
    on:click={() => [
      selectedGuild.set(MAIN_GUILD),
      selectedChannel.set(MAIN_CHANNEL),
    ]}>Main</button
  >

  {#each $userData?.guilds || [] as g (g.id)}
    <button
      class="guild-tab"
      on:click={() => {
        selectedGuild.set(g);
        selectedChannel.set(
          $userData?.guilds?.find((gd) => gd.id == g.id)?.channels?.[0] ||
            MAIN_CHANNEL
        );
      }}
    >
      {#if g.icon}
        <img src={g.icon} alt={g.name} width={50} height={50} />
      {:else}
        {g.name}
      {/if}
    </button>
  {/each}
</div>

<style lang="postcss">
    .guild-tab {
        @apply border border-black rounded-sm m-1;
    }
</style>
