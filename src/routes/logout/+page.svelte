<script lang="ts">
    import { goto } from "$app/navigation";
	import { onMount } from "svelte";
    // import Button from "$lib/components/button.svelte";
    onMount(() => {
        fetch("/api/logout", {
            method: "DELETE",
            credentials: "include",
            }).then((res) => {
            if (res.ok) {
                goto("/chat");
            }
        });
    });
</script>
  
  <!-- <form
    id="frm"
    on:submit|preventDefault={() => {
      fetch("/api/logout", {
        method: "DELETE",
        credentials: "include",
      }).then((res) => {
        if (res.ok) {
          goto("/chat");
        }
      });
    }}
  >
    <Button type="submit">Logout</Button>
  </form> -->
  