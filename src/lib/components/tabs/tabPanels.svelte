<script lang="ts">
    import { TabPanels } from "@rgossiaux/svelte-headlessui";
</script>

<TabPanels {...$$restProps}>
    <slot />
</TabPanels>
