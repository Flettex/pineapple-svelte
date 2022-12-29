<script>
    import { onMount, onDestroy } from 'svelte'
    import { tweened } from 'svelte/motion'
    import { linear } from 'svelte/easing'
    import { toast } from '../../stores'
    export let item
    const progress = tweened(item.initial, { duration: item.duration, easing: linear })
    const close = () => toast.pop(item.id)
    const autoclose = () => {
      if ($progress === 1 || $progress === 0) {
        close()
      }
    }
    let next = item.initial
    let prev = next
    let paused = false
    $: if (next !== item.next) {
      next = item.next
      prev = $progress
      paused = false
      progress.set(next).then(autoclose)
    }
    const pause = () => {
      if (!paused && $progress !== next) {
        progress.set($progress, { duration: 0 })
        paused = true
      }
    }
    const resume = () => {
      if (paused) {
        const d = item.duration
        const duration = d - d * (($progress - prev) / (next - prev))
        progress.set(next, { duration }).then(autoclose)
        paused = false
      }
    }
    let componentProps = {}
    $: if (item.component) {
      const { props = {}, sendIdTo } = item.component
      componentProps = { ...props, ...(sendIdTo && { [sendIdTo]: item.id }) }
    }
    const check = (prop, kind = 'undefined') => typeof prop === kind
    // `progress` has been renamed to `next`; shim included for backward compatibility, to remove in next major
    $: if (!check(item.progress)) {
      item.next = item.progress
    }
    let unlisten
    const listen = (d = document) => {
      if (check(d.hidden)) return
      const handler = () => (d.hidden ? pause() : resume())
      const name = 'visibilitychange'
      d.addEventListener(name, handler)
      unlisten = () => d.removeEventListener(name, handler)
      handler()
    }
    onMount(listen)
    onDestroy(() => {
      if (check(item.onpop, 'function')) {
        item.onpop(item.id)
      }
      unlisten && unlisten()
    })
    </script>
    
    <div
      class="_toastItem"
      class:pe={item.pausable}
      on:mouseenter={() => {
        if (item.pausable) pause()
      }}
      on:mouseleave={resume}
    >
      <div role="status" class="_toastMsg" class:pe={item.component}>
        {#if item.component}
          <svelte:component this={item.component.src} {...componentProps} />
        {:else}
          {@html item.msg}
        {/if}
      </div>
      {#if item.dismissable}
        <div
          class="_toastBtn pe"
          role="button"
          tabindex="0"
          on:click={close}
          on:keydown={(e) => {
            if (e instanceof KeyboardEvent && ['Enter', ' '].includes(e.key)) close()
          }}
        />
      {/if}
      <progress class="_toastBar" value={$progress} />
    </div>
    <script>
    import { onMount, onDestroy } from 'svelte'
    import { tweened } from 'svelte/motion'
    import { linear } from 'svelte/easing'
    import { toast } from '../../stores'
    export let item
    const progress = tweened(item.initial, { duration: item.duration, easing: linear })
    const close = () => toast.pop(item.id)
    const autoclose = () => {
      if ($progress === 1 || $progress === 0) {
        close()
      }
    }
    let next = item.initial
    let prev = next
    let paused = false
    $: if (next !== item.next) {
      next = item.next
      prev = $progress
      paused = false
      progress.set(next).then(autoclose)
    }
    const pause = () => {
      if (!paused && $progress !== next) {
        progress.set($progress, { duration: 0 })
        paused = true
      }
    }
    const resume = () => {
      if (paused) {
        const d = item.duration
        const duration = d - d * (($progress - prev) / (next - prev))
        progress.set(next, { duration }).then(autoclose)
        paused = false
      }
    }
    let componentProps = {}
    $: if (item.component) {
      const { props = {}, sendIdTo } = item.component
      componentProps = { ...props, ...(sendIdTo && { [sendIdTo]: item.id }) }
    }
    const check = (prop, kind = 'undefined') => typeof prop === kind
    // `progress` has been renamed to `next`; shim included for backward compatibility, to remove in next major
    $: if (!check(item.progress)) {
      item.next = item.progress
    }
    let unlisten
    const listen = (d = document) => {
      if (check(d.hidden)) return
      const handler = () => (d.hidden ? pause() : resume())
      const name = 'visibilitychange'
      d.addEventListener(name, handler)
      unlisten = () => d.removeEventListener(name, handler)
      handler()
    }
    onMount(listen)
    onDestroy(() => {
      if (check(item.onpop, 'function')) {
        item.onpop(item.id)
      }
      unlisten && unlisten()
    })
    </script>
    
    <div
      class="_toastItem"
      class:pe={item.pausable}
      on:mouseenter={() => {
        if (item.pausable) pause()
      }}
      on:mouseleave={resume}
    >
      <div role="status" class="_toastMsg" class:pe={item.component}>
        {#if item.component}
          <svelte:component this={item.component.src} {...componentProps} />
        {:else}
          {@html item.msg}
        {/if}
      </div>
      {#if item.dismissable}
        <div
          class="_toastBtn pe"
          role="button"
          tabindex="0"
          on:click={close}
          on:keydown={(e) => {
            if (e instanceof KeyboardEvent && ['Enter', ' '].includes(e.key)) close()
          }}
        />
      {/if}
      <progress class="_toastBar" value={$progress} />
    </div><script lang="ts">
  import type { IToast } from "$lib/stores";
  import { toastStore } from "$lib/stores";
  import { onMount } from "svelte";
  import { slide } from "svelte/transition";

  export let currentToast: IToast;
  export let index: number;

  let activate = false;

  let defaultIcons: any = {
    success: "✔",
    error: "💀",
    info: "💡",
  };

  onMount(() => {
    setTimeout(() => {
      toastStore.update((state) => {
        return state.filter((toast) => {
          console.log(toast.id, currentToast.id)
          console.log(toast.id !== currentToast.id)
          return toast.id !== currentToast.id;
        });
      });
    }, currentToast?.delay || 5000);

    // delay hack for better animations
    activate = false;
    setTimeout(() => {
      activate = true;
    }, 200);
  });

  // setTimeout(() => {
  //   activate = true;
  // }, 200);
</script>

<div
  class={`toast ${currentToast?.type || "info"}`}
  out:slide={{  }}
  on:click={() =>
    toastStore.update((state) => {
      return state.filter((toast) => {
        return toast.id !== currentToast.id;
      });
    })}
  class:active={activate}
>
  <!-- Use the built in slide transition for now -->
  <!-- We can use active to apply custom transitions-->
  {index}

  <div class="icon">
    {#if currentToast.icon}
      {currentToast.icon}
    {:else}
      {defaultIcons[currentToast.type ?? "info"]}
    {/if}
  </div>

  <p class="message">
    {currentToast.message}
  </p>
</div>

<style lang="postcss">
  .toast {
    border: none;
    @apply flex cursor-pointer opacity-0 invisible
           translate-x-80 transition-all ease-in-out z-[999];
  }

  .toast.active {
    @apply translate-x-0 visible opacity-100;
  }

  .toast.success {
    @apply bg-green-400;
  }

  .toast.error {
    @apply bg-red-500;
  }

  .toast.info {
    @apply bg-blue-400;
  }

  .icon {
    @apply text-white shadow-xl text-lg w-10 px-2 py-1 grid place-items-center bg-black bg-opacity-80;
  }

  .message {
    @apply bg-black bg-opacity-50 text-white shadow-xl p-4 hover:line-through;
  }
</style>
