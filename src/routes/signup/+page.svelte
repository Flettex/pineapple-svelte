<script lang="ts">
  import { goto } from "$app/navigation";
  import Button from "$lib/components/button.svelte";
  import { onMount } from "svelte";

  let username = "";
  let email = "";
  let password = "";
  let captchaCode = "";
  let capthaImageData: string | null = null;

  onMount(() => {
    fetch("api/signup", { credentials: "include" }).then(async (response) => {
      capthaImageData = await response.text();
    });
  });
</script>

<form
  id="frm"
  on:submit|preventDefault={() => {
    fetch("/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        email,
        password,
        code: captchaCode,
      }),
      credentials: "include",
    }).then((res) => {
      if (res.ok) {
        goto("/verify");
      }
    });
  }}
>
  <input
    type="username"
    placeholder="Type a username"
    bind:value={username}
    required
  />
  <input type="email" placeholder="Type an email" bind:value={email} required />
  <input
    type="password"
    placeholder="Type a password"
    bind:value={password}
    required
  />
  <input type="text" placeholder="captcha" bind:value={captchaCode} required />
  {#if capthaImageData}
    <img src={capthaImageData} alt="captcha" width="130" height="50" />
  {/if}
  <Button type="submit">Submit</Button>
</form>
