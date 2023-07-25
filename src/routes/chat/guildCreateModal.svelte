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
  import {socket, selectedChannel} from "$lib/stores"
  import { sysmsg } from "$lib/constants";

  let isModalOpen = false;

  export let log: Function;

  let name = "";
  let description = "";
  let icon = "";
</script>

<!-- <Button on:click={() => (isModalOpen = true)}>Trigger Guild</Button> -->

<button on:click={() => (isModalOpen = true)} class={$$props.class}>
  <slot />
</button>

<Modal bind:isOpen={isModalOpen}>
  <ModalTitle>Create a server</ModalTitle>

  <ModalBody>
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
  </ModalBody>
  <ModalActions>
    <ModalActionButton on:click={() => (isModalOpen = false)} isDestructive
      >Close</ModalActionButton
    >
    <ModalActionButton
      on:click={() => {
        if (!$socket || !name) {
          isModalOpen = false;
          return;
        }

        log(sysmsg("Creating guild: " + name, $selectedChannel.id));
        $socket.send(
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
