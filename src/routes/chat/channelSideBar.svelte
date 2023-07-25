<script lang="ts">
  import { MAIN_CHANNEL } from "$lib/constants";
  import { selectedChannel, selectedGuild, userData } from "$lib/stores";
	import ChannelCreateModal from "./channelCreateModal.svelte";
  // let channels = $selectedGuild.channels;
  // userData.subscribe((userd) => {
  //   if (!userd) return;
  //   channels = userd.guilds.find(({id}) => id === $selectedGuild.id)?.channels!
  // });
  // $: channels = $selectedGuild.channels;
  let toolTipState = "invisible";
</script>

<div class="w-60 h-full m-0 ml-16 bg-[#F2F3F5] dark:bg-gray-800">
  <div
    class="w-full relative flex h-12 m-0 p-0 border box-shadow-property justify-center items-center"
    on:focus={() => toolTipState = "visible"}
    on:blur={() => toolTipState = "invisible"}
    on:mouseover={() => toolTipState = "visible"}
    on:mouseout={() => toolTipState = "invisible"}
  >
    <h4 class="text-lg tracking-wider font-bold text-gray-600 dark:text-gray-400 mr-auto ml-4 align-middle">{$selectedGuild.name}</h4>
    <ChannelCreateModal log={() => {}}>
      <img class="h-8 w-8 mr-2 mt-[-3%]" src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Plus_symbol.svg/500px-Plus_symbol.svg.png" alt="plus">
    </ChannelCreateModal>
    <span class={`${toolTipState} w-full bg-black text-white text-center rounded-md px-1 absolute z-10 top-[90%] left-[35%] -ml-[60px] tooltip-text`}>Tooltip</span>
  </div>
  <div class="flex flex-col items-center justify-start p-1 m-0 h-[90%] overflow-y-auto">
    {#each $selectedGuild.channels || [] as c (c.id)}
      <button
        class="{$selectedChannel.id === c.id ? "channel-tab-selected" : "channel-tab"}"
        on:click={() => {
          selectedChannel.set(
            c ||
              MAIN_CHANNEL
          );
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" class="text-gray-500" aria-hidden="true" role="img"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M5.88657 21C5.57547 21 5.3399 20.7189 5.39427 20.4126L6.00001 17H2.59511C2.28449 17 2.04905 16.7198 2.10259 16.4138L2.27759 15.4138C2.31946 15.1746 2.52722 15 2.77011 15H6.35001L7.41001 9H4.00511C3.69449 9 3.45905 8.71977 3.51259 8.41381L3.68759 7.41381C3.72946 7.17456 3.93722 7 4.18011 7H7.76001L8.39677 3.41262C8.43914 3.17391 8.64664 3 8.88907 3H9.87344C10.1845 3 10.4201 3.28107 10.3657 3.58738L9.76001 7H15.76L16.3968 3.41262C16.4391 3.17391 16.6466 3 16.8891 3H17.8734C18.1845 3 18.4201 3.28107 18.3657 3.58738L17.76 7H21.1649C21.4755 7 21.711 7.28023 21.6574 7.58619L21.4824 8.58619C21.4406 8.82544 21.2328 9 20.9899 9H17.41L16.35 15H19.7549C20.0655 15 20.301 15.2802 20.2474 15.5862L20.0724 16.5862C20.0306 16.8254 19.8228 17 19.5799 17H16L15.3632 20.5874C15.3209 20.8261 15.1134 21 14.8709 21H13.8866C13.5755 21 13.3399 20.7189 13.3943 20.4126L14 17H8.00001L7.36325 20.5874C7.32088 20.8261 7.11337 21 6.87094 21H5.88657ZM9.41045 9L8.35045 15H14.3504L15.4104 9H9.41045Z"></path></svg>
        <p class="ml-1">{c.name}</p>
      </button>
    {/each}
  </div>
  <div class="flex flex-row justify-start items-center h-[5%] bg-[#EBEDEF]">
    <!-- Put user profile stuff here -->
    <img class="w-[32px] h-[32px] inline-block ml-3 mr-2 rounded-full" src={$userData?.user.profile || "https://external-preview.redd.it/ZuElAifUXkduBrTSwRcwzZaLWRTTyd_EVma3pCKf8WI.jpg?auto=webp&s=ecc5612ca31cec7311eb12158622950fa6f44a9a"} alt="pfp">
    <p>{$userData?.user.username}</p>
    <img class="w-[48px] h-[48px] ml-auto rounded-full" src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Settings_%28iOS%29.png/800px-Settings_%28iOS%29.png" alt="settings">
  </div>
</div>

<style lang="postcss">
  .channel-tab {
      /* @apply flex flex-row items-center justify-evenly
      mt-1 mr-auto ml-2
      transition duration-300 ease-in-out
      cursor-pointer; */
      @apply m-0 w-[98%] py-1 pl-3 text-left rounded-md
      transition duration-100 ease-in-out text-gray-900 hover:bg-gray-200 flex flex-row;
  }

  .channel-tab-selected {
    @apply m-0 w-[98%] py-1 pl-3 text-left rounded-md
      transition duration-300 ease-in-out text-gray-900 bg-gray-300 flex flex-row;
  }

  .box-shadow-property {
    box-shadow: 0 2px 0 0 rgb(34 36 38 / 15%);
  }

  .tooltip-text::after {
    content: " ";
    position: absolute;
    bottom: 100%;  /* At the top of the tooltip */
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: transparent transparent black transparent;
  }
</style>
