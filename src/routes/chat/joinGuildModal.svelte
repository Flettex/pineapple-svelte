<script lang="ts">
  import Button from "$lib/components/button.svelte";
  import {
    Modal,
    ModalActionButton,
    ModalActions,
    ModalTitle,
    ModalBody
  } from "$lib/components/modal";
  import { encode } from "cbor-x";
  import { socket, selectedChannel, userData } from "$lib/stores"
  import { sysmsg } from "$lib/constants";
  import * as uuid from "uuid";

  let isModalOpen = false;

  export let log: Function;

  let guild_id = "";
</script>
  
<Button class={$$props.class} on:click={() => (isModalOpen = true)} >
  <slot />
</Button>

<Modal bind:isOpen={isModalOpen}>
  <ModalTitle>Join a server</ModalTitle>
  <ModalBody>
    <form>
      <div class="p-1">
        Guild id <input type="text" bind:value={guild_id} />
      </div>
    </form>
  </ModalBody>
  <ModalActions>
    <ModalActionButton on:click={() => (isModalOpen = false)} isDestructive
      >Close</ModalActionButton
    >
    <ModalActionButton
      on:click={() => {
          if (!$socket || !guild_id) {
              isModalOpen = false;
              return;
          }

          if ($userData?.guilds.find((g) => g.id === guild_id)) {
              alert("You dumb bruh you already joined in");
              return;
          }

          log(sysmsg("Joining guild: " + guild_id, $selectedChannel.id));
          $socket.send(
              encode({
                  type: "MemberCreate",
                  data: {
                      guild_id: uuid.parse(guild_id)
                  },
              })
          );
          isModalOpen = false;
      }}>Create</ModalActionButton
    >
  </ModalActions>
</Modal>
  