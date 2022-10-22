<script lang="ts">
    import { TabGroup } from "@rgossiaux/svelte-headlessui";
</script>

<TabGroup class="{($$restProps.class ?? '')}" on:change {...$$restProps} >
    <slot />
</TabGroup>
