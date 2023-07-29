<script lang="ts">
	import { DM_GUILD, MAIN_GUILD } from "$lib/constants";
	import { selectedGuild, userData } from "$lib/stores";
    import type { LayoutData } from "./$types"

    export let data: LayoutData;
    // guild returned from backend is the DB model, no channels/members will be returned.
    // giving it empty values because it'll be given in ready event
    selectedGuild.set({
        ...data.guild,
        members: [],
        channels: []
    });
    // userData.subscribe((userd) => {
    //     if (!userd) return;
    //     selectedGuild.set($selectedGuild.id === MAIN_GUILD.id ? MAIN_GUILD : ($selectedGuild.id === DM_GUILD.id ? DM_GUILD : userd.guilds.find(({id}) => id === $selectedGuild.id)!))
    // });
</script>

<slot />
