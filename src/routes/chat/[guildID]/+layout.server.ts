import { MAIN_GUILD } from "$lib/constants";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async (req) => {
  if (req.params.guildId === MAIN_GUILD.id) {
    return { guild: MAIN_GUILD };
  }
  const resp = await fetch(`${req.url.protocol}//${req.url.host}/api/guilds/${req.params.guildId}`);
  return {
    guild: await resp.json()
  };
}