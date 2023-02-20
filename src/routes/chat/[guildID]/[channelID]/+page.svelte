<script lang="ts">
  import { MAIN_CHANNEL, MAIN_GUILD } from "$lib/constants";
  import { socket, logs, userCache, userData, selectedChannel } from "$lib/stores";
  import { encode } from "cbor-x";
  import * as uuid from "uuid";
  import type { PageData } from "./$types"

  export let data: PageData;
  // console.log(data.channel);
  selectedChannel.set(data.channel);
  // $: selectedChannel.update(_ => data.channel);
  $: msgs = $logs[$selectedChannel.id] || [];
  $: console.log("messages", msgs, $logs)
</script>

{#if $userData && $userData.user.id}
  {#if $selectedChannel.id === MAIN_CHANNEL.id}
    {#each $logs[MAIN_CHANNEL.id] ?? [] as i}
      <div
        class={i.author.id == $userData?.user.id ? (i.id !== "NOT_RECEIVED" ? "" : "text-gray-500") : ""}
      >
        {$userCache[i.author.id + ""]?.username}: {i.content}
        {i.created_at !== i.edited_at ? "(edited)" : ""}
      </div>
    {/each}
  {:else}
    <div>
      {#each msgs as i}
        <!-- svelte-ignore missing-declaration -->
        <div
          class={i.author.id == $userData?.user.id ? (i.id !== "NOT_RECEIVED" ? "" : "text-gray-500") : ""}
          on:dblclick={() => {
            if (
              i.author.id != BigInt($userData?.user.id || 0) ||
              i.channel_id == MAIN_CHANNEL.id
            )
              return;
            const inp = prompt("New content");
            if (!inp) return;
            $socket?.send(
              encode({
                type: "MessageUpdate",
                data: {
                  id: uuid.parse(i.id),
                  content: inp,
                  nonce: uuid.parse(i.nonce || MAIN_GUILD.id),
                },
              })
            );
          }}
        >
          {$userCache[i.author.id + ""]?.username}: {i.content}
          {i.created_at !== i.edited_at ? "(edited)" : ""}
        </div>
      {/each}
    </div>
  {/if}
{:else}
    <div class="fixed z-90 w-screen h-screen flex justify-center items-center bg-gray-900 top-0 left-0">
      <div class="flex flex-col text-white text-center text-xl font-light space-y-3">
        LOADING
      </div>
    </div>
{/if}