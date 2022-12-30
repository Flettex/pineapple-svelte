<script lang="ts">
  import { MAIN_CHANNEL, MAIN_GUILD } from "$lib/constants";
  import { socket, logs, userCache, userData, selectedChannel } from "$lib/stores";
  import { encode } from "cbor-x";
  import * as uuid from "uuid";
  import type { PageData } from "./$types"

  export let data: PageData;
  $: selectedChannel.update(_ => data.channel);
  $: msgs = $logs[$selectedChannel.id] || [];
  $: console.log("messages", msgs, $logs)
</script>

{#if $selectedChannel.id === MAIN_CHANNEL.id}
  {#each $logs[MAIN_CHANNEL.id] ?? [] as i}
    <!-- {console.log("TEST123", i.author.id, $userData?.user.id)} -->
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
      <!-- style={{color: i.author.id === userData?.user.id ? (i.id !== "NOT_RECEIVED" ? undefined : "gray") : undefined}} -->
      <!-- svelte-ignore missing-declaration -->
      <!-- {console.log("TEST123", i.author.id, $userData?.user.id)} -->
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
