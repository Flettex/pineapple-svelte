<script lang="ts">
    import {Tab} from "@rgossiaux/svelte-headlessui";
</script>

<Tab on:click {...$$restProps}>
    <slot />
</Tab>