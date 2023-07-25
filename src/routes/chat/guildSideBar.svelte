<script lang="ts">
  import { MAIN_CHANNEL, MAIN_GUILD } from "$lib/constants";
  import { selectedChannel, selectedGuild, userData } from "$lib/stores";
	import { createToast } from "$lib/utils";
	import GuildModal from "./guildModal.svelte";
</script>

<div class="fixed top-0 left-0 h-full w-16 flex flex-col bg-[#E3E5E8] dark:bg-gray-900 shadow-lg">
  <button
    class="guild-tab"
    on:click={() => createToast({ message: "Dms are not available yet", type: "info" })}
  >Dms</button>

  <hr class="guild-tab-hr">

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
        {g.name[0]}
      {/if}
    </button>
  {/each}
  <GuildModal>
    <img class="guild-tab" src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Plus_symbol.svg/500px-Plus_symbol.svg.png" alt="plus">
  </GuildModal>
</div>

<style lang="postcss">
    .guild-tab {
      @apply relative flex items-center justify-center 
      h-12 w-12 mt-2 mb-2 mx-auto  
    bg-white hover:bg-blue-600 dark:bg-gray-800 
    text-black hover:text-white
      hover:rounded-xl rounded-3xl
      transition-all duration-300 ease-linear
      cursor-pointer shadow-sm;
    }

    .guild-tab-hr {
      @apply bg-gray-500 dark:bg-gray-800 
      border border-gray-500 dark:border-gray-800 rounded-full
      mx-4;
    }
</style>
