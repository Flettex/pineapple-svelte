// import { MAIN_CHANNEL } from "$lib/constants";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (req) => {
  // console.log(req.params.channelID, MAIN_CHANNEL.id);
  // if (req.params.channelID === MAIN_CHANNEL.id) {
  //   return { channel: MAIN_CHANNEL };
  // }
  const resp = await fetch(`${req.url.protocol}//${req.url.host}/api/channels/${req.params.channelID}`);
  return {
    channel: await resp.json()
  };
}