<script lang="ts">
    import Button from "$lib/components/button.svelte";
    import {
      Modal,
      ModalActionButton,
      ModalActions,
      ModalTitle,
    } from "$lib/components/modal";
    import { encode } from "cbor-x";
    import { socket, selectedChannel } from "$lib/stores"
    import { sysmsg } from "$lib/constants";
    import * as uuid from "uuid";
  
    let isModalOpen = false;
  
    export let log: Function;
  
    let name = "";
    let description = "";
    let position = 0;
    let guild_id = "";
  </script>
  
  <Button on:click={() => (isModalOpen = true)}>Trigger Channel</Button>
  
  <Modal bind:isOpen={isModalOpen}>
    <ModalTitle>Create a channel</ModalTitle>
  
    <form>
      <div class="p-1">
        Name <input type="text" bind:value={name} />
      </div>
  
      <div class="p-1">
        Description? <input type="text" bind:value={description} />
      </div>
  
      <div class="p-1">
        Position <input type="number" bind:value={position} />
      </div>

      <div class="p-1">
        Guild Id <input type="text" bind:value={guild_id} />
      </div>
    </form>
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
    
            log(sysmsg("Creating channel: " + name, $selectedChannel.id));
            $socket.send(
                encode({
                    type: "ChannelCreate",
                    data: {
                        name,
                        description,
                        position,
                        guild_id: uuid.parse(guild_id)
                    },
                })
            );
            isModalOpen = false;
        }}>Create</ModalActionButton
      >
    </ModalActions>
  </Modal>
  