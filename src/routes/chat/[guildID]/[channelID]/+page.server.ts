import { MAIN_CHANNEL } from "$lib/constants";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, fetch }) => {
  return {
    channel: (params.channelID === MAIN_CHANNEL.id ? MAIN_CHANNEL : await (await fetch(`/api/channels/${params.channelID}`)).json())
  };
}