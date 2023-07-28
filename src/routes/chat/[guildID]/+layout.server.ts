import { MAIN_GUILD } from "$lib/constants";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async (req) => {
  // console.log(req.params);
  if (req.params.guildID === MAIN_GUILD.id) {
    return { guild: MAIN_GUILD };
  }
  const resp = await fetch(`${req.url.protocol}//${req.url.host}/api/guilds/${req.params.guildID}`);
  // console.log("\n\nResponse: \n\n", JSON.parse(await resp.text()));
  // console.log(resp);
  return {
    guild: await resp.json()
  };
}