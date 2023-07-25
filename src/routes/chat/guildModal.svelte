<script lang="ts">
    // import Button from "$lib/components/button.svelte";
    import {
      Modal,
      ModalTitle,
      ModalBody
    } from "$lib/components/modal";
    import GuildCreateModal from "./guildCreateModal.svelte";
	import JoinGuildModal from "./joinGuildModal.svelte";

    let isModalOpen = false;
</script>
    
<button on:click={() => (isModalOpen = true)} >
    <slot />
</button>

<Modal bind:isOpen={isModalOpen}>
    <ModalTitle>Create a server</ModalTitle>
    <ModalBody class="flex flex-col mx-2">
        <GuildCreateModal class="whitespace-nowrap mt-8 mb-2 border-solid border-gray-300 border-[1px] pl-4 pr-52 py-4 rounded-md hover:bg-slate-100" log={() => {}}>
            Create My Own
        </GuildCreateModal>
    </ModalBody>
    <ModalBody class="bg-gray-200 w-full text-center py-4">
        <p class="mb-2">Have an invite already?</p>
        <JoinGuildModal class="!bg-gray-500 text-white w-full" log={() => {}}>
            Join a guild
        </JoinGuildModal>
    </ModalBody>
</Modal>

<style lang="scss">
</style>