<script lang="ts">
  import { goto } from "$app/navigation";
  import Button from "$lib/components/button.svelte";

  let code = "";
</script>

<input id="i" bind:value={code} type="number" />
<Button
  on:click={() =>
    fetch("/api/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code: parseInt(code),
      }),
      credentials: "include",
    }).then((res) => {
      if (res.ok) goto("/chat");
    })}>Verify</Button
>
