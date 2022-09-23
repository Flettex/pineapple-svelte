<script lang="ts">
  import Button from "$lib/components/button.svelte";
  import ButtonGroup from "$lib/components/buttonGroup.svelte";
</script>

<h1 class="text-2xl">
  Welcome to extremely low budget chat app. We are open source and non-profit
</h1>
<a href="/chat" class="link"
  >Me when I want to try this trash chat app I'm probably never using ever again</a
><br />
<a href="/login" class="link">Me when login</a>
<br />
<a href="/signup" class="link">Me when signup</a>
<br />
<a href="/logout" class="link">Don't logout bro alts aren't allowed</a>

<div>
  <ButtonGroup>
    <Button
      on:click={() => {
        console.log("clicked 1");
      }}>test 1</Button
    >
    <Button
      on:click={() => {
        console.log("clicked 2");
      }}>test 2</Button
    >
    <Button
      on:click={() => {
        console.log("clicked 3");
      }}>test 3</Button
    >
    <Button
      on:click={() => {
        console.log("clicked 4");
      }}>test 4</Button
    >
  </ButtonGroup>
</div>
