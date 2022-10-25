<script lang="ts">
  import Button from "$lib/components/button.svelte";
  import {
    Modal,
    ModalActionButton,
    ModalActions,
    ModalTitle,
  } from "$lib/components/modal";
  import type { IChannel } from "$lib/types";
  import { encode } from "cbor-x";

  let isModalOpen = false;

  export let channel: IChannel;
  export let socket: WebSocket | null;
  export let sysmsg: Function;
  export let log: Function;

  let name = "";
  let description = "";
  let icon = "";
</script>

<Button on:click={() => (isModalOpen = true)}>Trigger Guild</Button>

<Modal bind:isOpen={isModalOpen}>
  <ModalTitle>Create a server</ModalTitle>

  <form>
    <div class="p-1">
      Name <input type="text" bind:value={name} />
    </div>

    <div class="p-1">
      Description? <input type="text" bind:value={description} />
    </div>

    <div class="p-1">
      Icon? <input type="text" bind:value={icon} />
    </div>
  </form>
  <ModalActions>
    <ModalActionButton on:click={() => (isModalOpen = false)} isDestructive
      >Close</ModalActionButton
    >
    <ModalActionButton
      on:click={() => {
        if (!socket || !name) {
          isModalOpen = false;
          return;
        }

        log(sysmsg("Creating guild: " + name, channel.id));
        socket.send(
          encode({
            type: "GuildCreate",
            data: {
              name,
              description: description,
              icon: icon,
            },
          })
        );
        isModalOpen = false;
      }}>Create</ModalActionButton
    >
  </ModalActions>
</Modal>
