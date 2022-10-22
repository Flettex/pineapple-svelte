<script lang="ts">
    import { TabPanel } from "@rgossiaux/svelte-headlessui";
</script>

<TabPanel {...$$restProps}>
    <slot />
</TabPanel>
