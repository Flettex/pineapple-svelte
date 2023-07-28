<script lang="ts">
  import Button from "$lib/components/button.svelte";
  import ButtonGroup from "$lib/components/buttonGroup.svelte";

  import * as Modals from "$lib/components/modal";
  import { createToast } from "$lib/utils";

  let isOpen = false;

  import { darkMode } from "$lib/stores";

  function handleSwitchDarkMode() {
    if ($darkMode === null) return;
    // console.log("Setting darkmode to", !$darkMode)
    darkMode.set(!$darkMode);
  }

  darkMode.subscribe((d) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('theme', d ? 'dark' : 'light');

    d
        ? document.documentElement.classList.add('dark')
        : document.documentElement.classList.remove('dark');
  })
</script>

<h1 class="text-2xl">
  Welcome to extremely low budget chat app. We are open source and non-profit
</h1>
<a href="/chat" class="link">
  Me when I want to try this trash chat app I'm probably never using ever again</a
><br />
<a href="/login" class="link">Me when login</a>
<br />
<a href="/signup" class="link">Me when signup</a>
<br />
<a href="/logout" class="link">Don't logout bro alts aren't allowed</a>

<div>
  <Button on:click={() => (isOpen = true)}>Open Dialog</Button>
  <Button
    on:click={() =>
      createToast({ message: "Test toast 1234", delay: 5000, type: "error" })}
    >Open Toast</Button
  >
</div>

<ButtonGroup>
  <Button>1</Button>
  <Button>2</Button>
  <Button>3</Button>
</ButtonGroup>

<Button on:click={handleSwitchDarkMode}>Toggle light/dark mode</Button>

<Modals.Modal bind:isOpen>
  <Modals.ModalTitle>Title</Modals.ModalTitle>

  <Modals.ModalBody>
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi, magni
    alias ab neque ut illo tempore ratione vel animi enim labore obcaecati
    quidem, accusamus voluptate, distinctio magnam quam nulla! Labore.
  </Modals.ModalBody>

  <Modals.ModalActions>
    <Modals.ModalActionButton on:click={() => (isOpen = false)} isDestructive
      >Close</Modals.ModalActionButton>
    <Modals.ModalActionButton on:click={() => console.log("Clicked 1")}
      >Action 1</Modals.ModalActionButton
    >
  </Modals.ModalActions>
</Modals.Modal>

<style lang="postcss">
  .link {
    @apply underline text-blue-600 hover:text-blue-800 visited:text-purple-600;
  }
</style>
