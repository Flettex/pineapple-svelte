<script lang="ts">
  import { DM_GUILD, MAIN_CHANNEL, MAIN_GUILD } from "$lib/constants";
  import { selectedChannel, selectedGuild, userData } from "$lib/stores";
  // import { createToast } from "$lib/utils";
  import GuildModal from "./guildModal.svelte";
</script>

<div
  class="fixed top-0 left-0 h-full w-16 flex flex-col bg-[#E3E5E8] dark:bg-[#0c0c0d] shadow-lg"
>
  <button class="guild-tab" on:click={() => selectedGuild.set(DM_GUILD)}
    ><svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512"
      ><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path
        d="M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V472c0 22.1-17.9 40-40 40H456c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1H416 392c-22.1 0-40-17.9-40-40V448 384c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v64 24c0 22.1-17.9 40-40 40H160 128.1c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2H104c-22.1 0-40-17.9-40-40V360c0-.9 0-1.9 .1-2.8V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z"
      /></svg
    ></button
  >

  <hr class="guild-tab-hr" />

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
    <button class="guild-tab"
      ><svg
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        width="24px"
        viewBox="0 0 448 512"
        ><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path
          d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"
        /></svg
      ></button
    >
  </GuildModal>
</div>

<style lang="postcss">
  .guild-tab {
    @apply relative flex items-center justify-center 
      h-12 w-12 mt-2 mb-2 mx-auto  
    bg-white hover:bg-[#5865F2] dark:bg-gray-800 dark:hover:bg-[#5865F2]
    text-black hover:text-white dark:text-white dark:hover:text-black
      hover:rounded-xl rounded-3xl
      hover:fill-white
      transition-all duration-300 ease-linear
      cursor-pointer shadow-sm;
  }

  .guild-tab-hr {
    @apply bg-gray-500 dark:bg-gray-800 
      border border-gray-500 dark:border-gray-800 rounded-full
      mx-4;
  }
</style>
